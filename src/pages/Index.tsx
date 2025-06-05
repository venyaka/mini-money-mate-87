import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Wallet } from 'lucide-react';

import UserProfile from '@/components/UserProfile';
import BalanceCard from '@/components/BalanceCard';
import TransactionHistory from '@/components/TransactionHistory';
import QuickAmounts from '@/components/QuickAmounts';
import Calculator from '@/components/Calculator';
import IncomeExpenseButtons from '@/components/IncomeExpenseButtons';

import { fetchCurrentUser } from '@/api/api';
import { useUserFinances } from '@/hooks/useUserFinances';
import {UserRespDTO} from "@/types/dto.ts";

const Index = () => {
    const [user, setUser] = useState<UserRespDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCalculator, setShowCalculator] = useState(false);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

    const { balance, transactions, addTransaction } = useUserFinances(user?.id || null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                const currentUser = await fetchCurrentUser();
                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleLogout = () => {
        // Можно сюда добавить вызов API logout, если есть
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
        // Если пользователь не залогинен — можно показать заглушку или редирект
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Пользователь не авторизован. Пожалуйста, выполните вход.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-md mx-auto relative">
                <UserProfile user={user} onLogout={handleLogout} />

                <BalanceCard balance={balance} />

                <QuickAmounts onAmountSelect={handleQuickAmountSelect} />

                <IncomeExpenseButtons onIncomeClick={handleIncomeClick} onExpenseClick={handleExpenseClick} />

                {showCalculator && <Calculator onAmountSet={handleAmountSet} onClose={() => setShowCalculator(false)} />}

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
