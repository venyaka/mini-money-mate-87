import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, TrendingDown, Calendar, Wallet } from 'lucide-react';
import BalanceCard from '@/components/BalanceCard';
import TransactionForm from '@/components/TransactionForm';
import TransactionHistory from '@/components/TransactionHistory';
import QuickAmounts from '@/components/QuickAmounts';
import Calculator from '@/components/Calculator';
import IncomeExpenseButtons from '@/components/IncomeExpenseButtons';
const Index = () => {
  const [balance, setBalance] = useState(8300000);
  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [transactions, setTransactions] = useState([{
    id: 1,
    date: '21',
    dayName: 'Сегодня',
    month: 'Март 2025',
    income: 4000,
    expense: 23000
  }, {
    id: 2,
    date: '19',
    dayName: 'Вчера',
    month: 'Март 2025',
    income: 4000,
    expense: 23000
  }, {
    id: 3,
    date: '18',
    dayName: 'Пятница',
    month: 'Март 2025',
    income: 4000,
    expense: 23000
  }, {
    id: 4,
    date: '17',
    dayName: 'Четверг',
    month: 'Март 2025',
    income: 4000,
    expense: 23000
  }, {
    id: 5,
    date: '16',
    dayName: 'Среда',
    month: 'Март 2025',
    income: 4000,
    expense: 23000
  }]);
  const addTransaction = (amount: number, type: 'income' | 'expense') => {
    const today = new Date();
    const newTransaction = {
      id: transactions.length + 1,
      date: today.getDate().toString(),
      dayName: 'Сегодня',
      month: today.toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric'
      }),
      income: type === 'income' ? amount : 0,
      expense: type === 'expense' ? amount : 0
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => type === 'income' ? prev + amount : prev - amount);
    setShowForm(false);
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
    const today = new Date();
    const newTransaction = {
      id: transactions.length + 1,
      date: today.getDate().toString(),
      dayName: 'Сегодня',
      month: today.toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric'
      }),
      income: transactionType === 'income' ? amount : 0,
      expense: transactionType === 'expense' ? amount : 0
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(prev => transactionType === 'income' ? prev + amount : prev - amount);
    setShowCalculator(false);
  };
  const handleQuickAmountInput = () => {
    setShowCalculator(true);
  };
  return <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12">
          <div className="flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-semibold">Финансы</h1>
          </div>
          
        </div>

        {/* Balance Section */}
        <BalanceCard balance={balance} />

        {/* Income/Expense Buttons */}
        <IncomeExpenseButtons onIncomeClick={handleIncomeClick} onExpenseClick={handleExpenseClick} />

        {/* Quick Amount Selection */}
        <QuickAmounts onAmountSelect={handleQuickAmountInput} />

        {/* Calculator */}
        {showCalculator && <Calculator onAmountSet={handleAmountSet} onClose={() => setShowCalculator(false)} />}

        {/* Transaction Form */}
        {showForm && <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-fade-in">
            <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />
          </div>}

        {/* Income/Expense Toggle */}
        <div className="px-6 mb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              
              <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
                <Calendar className="w-4 h-4 mr-2" />
                История
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-green-500/10 border-green-500/20 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Доход</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    {transactions.reduce((sum, t) => sum + t.income, 0).toLocaleString()} ТНГ
                  </p>
                </Card>
                
                <Card className="bg-red-500/10 border-red-500/20 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Расход</span>
                  </div>
                  <p className="text-2xl font-bold text-red-400">
                    {transactions.reduce((sum, t) => sum + t.expense, 0).toLocaleString()} ТНГ
                  </p>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <TransactionHistory transactions={transactions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default Index;