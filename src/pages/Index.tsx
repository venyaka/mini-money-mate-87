import React, { useState } from 'react';
import { Calendar, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthContainer from '@/components/AuthContainer';
import UserProfile from '@/components/UserProfile';
import BalanceCard from '@/components/BalanceCard';
import TransactionHistory from '@/components/TransactionHistory';
import QuickAmounts from '@/components/QuickAmounts';
import Calculator from '@/components/Calculator';
import IncomeExpenseButtons from '@/components/IncomeExpenseButtons';
import { useSpringAuth } from '@/hooks/useSpringAuth';
import { useSpringFinances } from '@/hooks/useSpringFinances';
import { useNavigate } from 'react-router-dom';

const mode = "prod";

// Тестовые данные пользователя и транзакций для режима разработки
const devUser = {
  id: 1,
  firstName: 'Тест',
  lastName: 'Пользователь',
  username: 'testuser',
  photoUrl: '',
};

const devTransactions = [
  {
    id: 1,
    userId: 1,
    amount: 1500,
    type: 'income',
    date: '2025-06-01',
  },
  {
    id: 2,
    userId: 1,
    amount: 500,
    type: 'expense',
    date: '2025-06-02',
  },
  {
    id: 3,
    userId: 1,
    amount: 2000,
    type: 'income',
    date: '2025-06-03',
  },
  {
    id: 4,
    userId: 1,
    amount: 700,
    type: 'expense',
    date: '2025-06-04',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useSpringAuth();
  const [showCalculator, setShowCalculator] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [devMode, setDevMode] = useState(false);
  const [transactions, setTransactions] = useState(devTransactions);

  const { balance, transactions: userTransactions, addTransaction } = useSpringFinances(user?.id);

  const handleAuthSuccess = () => {
    // Пользователь будет обновлен автоматически через хук
    navigate('/');
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
    if (devMode) {
      const newTransaction = {
        id: transactions.length + 1,
        userId: devUser.id,
        amount,
        type: transactionType,
        date: new Date().toISOString().slice(0, 10),
      };
      setTransactions([newTransaction, ...transactions]);
      setShowCalculator(false);
      return;
    }
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

  if (!user && !devMode) {
    return (
      <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <AuthContainer onAuthSuccess={handleAuthSuccess} />
        <button
          className="fixed top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 shadow-lg z-50"
          onClick={() => setDevMode(true)}
        >
          Войти в тестовый режим
        </button>
      </div>
    );
  }

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || 'Пользователь';

  // если devMode, используем devUser и devTransactions
  const currentUser = devMode ? devUser : user;
  const currentTransactions = devMode ? transactions : userTransactions;

  // Приводим транзакции к нужному формату для TransactionHistory
  const formattedTransactions = currentTransactions.map(transaction => ({
    id: transaction.id!,
    type: transaction.type === 'INCOME' ? 'income' : 'expense',
    amount: transaction.amount,
    date: transaction.date,
    dayName: new Date(transaction.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
    month: new Date(transaction.date).toLocaleDateString('ru-RU', { month: 'short' }),
    income: transaction.type === 'INCOME' ? transaction.amount : 0,
    expense: transaction.type === 'EXPENSE' ? transaction.amount : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto relative">
        {/* User Profile Header */}
        <UserProfile 
          user={{
            ...currentUser,
            user_metadata: { name: displayName },
            email: currentUser.username
          }}
          onLogout={handleLogout}
        />

        {/* Balance Section */}
        <BalanceCard balance={devMode ? transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0) : balance} />

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
                <TransactionHistory transactions={formattedTransactions} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
