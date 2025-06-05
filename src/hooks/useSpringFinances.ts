
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { BalanceDTO, Transaction } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface TransactionDisplay {
  id: number;
  date: string;
  dayName: string;
  month: string;
  income: number;
  expense: number;
  user_id: number;
  created_at: string;
}

export const useSpringFinances = (userId: number | undefined) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Загружаем баланс
      const balanceData = await apiService.getBalance(userId);
      setBalance(balanceData.amount);

      // Загружаем транзакции
      const transactionsData = await apiService.getUserTransactions(userId);
      
      const formattedTransactions = transactionsData.map((t, index) => ({
        id: t.id || index,
        date: new Date(t.date).getDate().toString(),
        dayName: formatDayName(new Date(t.date)),
        month: new Date(t.date).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric'
        }),
        income: t.type === 'INCOME' ? t.amount : 0,
        expense: t.type === 'EXPENSE' ? t.amount : 0,
        user_id: userId,
        created_at: t.date
      }));

      setTransactions(formattedTransactions);

    } catch (error: any) {
      toast({
        title: "Ошибка загрузки данных",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (amount: number, type: 'income' | 'expense') => {
    if (!userId) return;

    try {
      const transactionData = {
        amount: amount,
        type: type === 'income' ? 'INCOME' as const : 'EXPENSE' as const,
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };

      await apiService.createTransaction(transactionData);

      // Обновляем баланс
      const newBalance = type === 'income' ? balance + amount : balance - amount;
      await apiService.updateBalance({
        userId: userId,
        amount: newBalance
      });

      // Обновляем локальные данные
      setBalance(newBalance);
      
      const today = new Date();
      const newTransaction = {
        id: Date.now(),
        date: today.getDate().toString(),
        dayName: formatDayName(today),
        month: today.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric'
        }),
        income: type === 'income' ? amount : 0,
        expense: type === 'expense' ? amount : 0,
        user_id: userId,
        created_at: today.toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: type === 'income' ? "Доход добавлен" : "Расход добавлен",
        description: `${amount.toLocaleString()} ТНГ`,
      });

    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDayName = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { weekday: 'long' });
    }
  };

  return {
    balance,
    transactions,
    loading,
    addTransaction,
    refreshData: loadUserData
  };
};
