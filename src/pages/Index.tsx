
import React, {useEffect, useState} from 'react';
import { Calendar, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TelegramAuth from '@/components/TelegramAuth';
import UserProfile from '@/components/UserProfile';
import BalanceCard from '@/components/BalanceCard';
import TransactionHistory from '@/components/TransactionHistory';
import QuickAmounts from '@/components/QuickAmounts';
import Calculator from '@/components/Calculator';
import IncomeExpenseButtons from '@/components/IncomeExpenseButtons';
import { useSpringAuth } from '@/hooks/useSpringAuth';
import { useSpringFinances } from '@/hooks/useSpringFinances';
import {fetchNgrokUrl} from "@/api/api.ts";

const Index = () => {
  const { user, loading: authLoading, logout } = useSpringAuth();
  const [showCalculator, setShowCalculator] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const { balance, transactions, addTransaction } = useSpringFinances(user?.id);

  const handleAuthSuccess = () => {
    // Пользователь будет обновлен автоматически через хук
  };

  const handleLogout = () => {
    logout();
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

  if (authLoading) {
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
    return <TelegramAuth onAuthSuccess={handleAuthSuccess} />;
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username || 'Пользователь';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto relative">
        {/* User Profile Header */}
        <UserProfile
          user={{
            ...user,
            user_metadata: { name: displayName },
            email: user.username
          }}
          onLogout={handleLogout}
        />

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
              {/*<div className="max-h-96 overflow-y-auto">*/}
              {/*  <TransactionHistory transactions={transactions} />*/}
              {/*</div>*/}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
