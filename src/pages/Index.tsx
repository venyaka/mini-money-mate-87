
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/AuthForm';
import UserProfile from '@/components/UserProfile';
import BalanceCard from '@/components/BalanceCard';
import TransactionHistory from '@/components/TransactionHistory';
import QuickAmounts from '@/components/QuickAmounts';
import Calculator from '@/components/Calculator';
import IncomeExpenseButtons from '@/components/IncomeExpenseButtons';
import { useUserFinances } from '@/hooks/useUserFinances';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const { balance, transactions, addTransaction } = useUserFinances(user?.id);

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Подписываемся на изменения аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // Пользователь будет обновлен автоматически через onAuthStateChange
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleIncomeClick = () => {
    setTransactionType('income');
    setShowCalculator(true);
  };

  const handleExpenseClick = () => {
    setTransactionType('expense');
    setShowCalculator(true);
  };

  const handleAmountSet = (amount: number) => {
    addTransaction(amount, transactionType);
    setShowCalculator(false);
  };

  const handleQuickAmountSelect = (amount: number) => {
    setShowCalculator(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-green-400 animate-pulse" />
          <span>Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto relative">
        {/* User Profile Header */}
        <UserProfile user={user} onLogout={handleLogout} />

        {/* Balance Section */}
        <BalanceCard balance={balance} />

        {/* Quick Amount Selection */}
        <QuickAmounts onAmountSelect={handleQuickAmountSelect} />

        {/* Income/Expense Buttons */}
        <IncomeExpenseButtons onIncomeClick={handleIncomeClick} onExpenseClick={handleExpenseClick} />

        {/* Calculator */}
        {showCalculator && <Calculator onAmountSet={handleAmountSet} onClose={() => setShowCalculator(false)} />}

        {/* Transaction History */}
        <div className="px-6 mb-6">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-gray-800 border-gray-700">
              <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                История транзакций
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-6">
              <div className="max-h-96 overflow-y-auto">
                <TransactionHistory transactions={transactions} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
