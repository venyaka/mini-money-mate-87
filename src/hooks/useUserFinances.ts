import { useState, useEffect } from 'react';
import { fetchTransactionsForUser, saveTransaction } from '@/api/api';
import {Transaction} from "@/types/dto.ts";

// export interface Transaction {
//     id: number;
//     userId: string;
//     amount: number;
//     type: 'income' | 'expense';
//     date: string;
// }

export const useUserFinances = (userId: number) => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (!userId) return;

        const loadTransactions = async () => {
            const data = await fetchTransactionsForUser(userId);
            setTransactions(data);

            const total = data.reduce((sum, tx) =>
                    tx.type === 'income' ? sum + tx.amount : sum - tx.amount,
                0
            );
            setBalance(total);
        };

        loadTransactions();
    }, [userId]);

    const addTransaction = async (amount: number, type: 'income' | 'expense') => {
        if (!userId) return;

        const newTransaction = {
            userId,
            amount,
            type,
            date: new Date().toISOString(),
        };

        const saved = await saveTransaction(newTransaction);

        setTransactions(prev => [saved, ...prev]);
        setBalance(prev =>
            type === 'income' ? prev + amount : prev - amount
        );
    };

    return {
        balance,
        transactions,
        addTransaction, // ← обязательно вернуть её!
    };
};
