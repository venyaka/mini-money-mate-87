
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: number;
  date: string;
  dayName: string;
  month: string;
  income: number;
  expense: number;
  user_id: string;
  created_at: string;
}

export const useUserFinances = (userId: string | undefined) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      
      // Загружаем транзакции пользователя
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      const formattedTransactions = transactionsData?.map(t => ({
        id: t.id,
        date: new Date(t.created_at).getDate().toString(),
        dayName: formatDayName(new Date(t.created_at)),
        month: new Date(t.created_at).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric'
        }),
        income: t.amount_type === 'income' ? t.amount : 0,
        expense: t.amount_type === 'expense' ? t.amount : 0,
        user_id: t.user_id,
        created_at: t.created_at
      })) || [];

      setTransactions(formattedTransactions);

      // Вычисляем баланс
      const totalIncome = formattedTransactions.reduce((sum, t) => sum + t.income, 0);
      const totalExpense = formattedTransactions.reduce((sum, t) => sum + t.expense, 0);
      setBalance(totalIncome - totalExpense);

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
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId,
            amount: amount,
            amount_type: type,
          }
        ]);

      if (error) throw error;

      // Обновляем локальные данные
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
      setBalance(prev => type === 'income' ? prev + amount : prev - amount);

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
