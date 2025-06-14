
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';
import { Transaction, TransactionDTO } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useSpringFinances = (userId?: number) => {
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получение баланса
  const { data: balanceData } = useQuery({
    queryKey: ['balance', userId],
    queryFn: () => apiService.getBalance(userId!),
    enabled: !!userId,
    retry: (failureCount, error: any) => {
      // Не повторяем запрос если пользователь не найден
      if (error?.message?.includes('USER_NOT_FOUND')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Получение транзакций
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => apiService.getUserTransactions(userId!),
    enabled: !!userId,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('USER_NOT_FOUND')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Мутация для добавления транзакции
  const addTransactionMutation = useMutation({
    mutationFn: (transaction: TransactionDTO) => apiService.createTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['balance', userId] });
      toast({
        title: "Транзакция добавлена",
        description: "Транзакция успешно добавлена",
      });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error.message);
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (balanceData) {
      setBalance(balanceData.amount);
    }
  }, [balanceData]);

  const addTransaction = (amount: number, type: 'income' | 'expense') => {
    const transaction: TransactionDTO = {
      type: type === 'income' ? 'INCOME' : 'EXPENSE',
      amount: amount,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    addTransactionMutation.mutate(transaction);
  };

  const getErrorMessage = (errorMessage: string): string => {
    const errorMap: { [key: string]: string } = {
      'USER_NOT_FOUND': 'Пользователь не найден',
      'TRANSACTION_NOT_FOUND': 'Транзакция не найдена',
    };

    return errorMap[errorMessage] || errorMessage;
  };

  return {
    balance,
    transactions,
    addTransaction,
    isLoading: addTransactionMutation.isPending,
  };
};
