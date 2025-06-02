
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  dayName: string;
  month: string;
  income: number;
  expense: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          className="bg-gray-800/50 border-gray-700 p-4 transition-all hover:bg-gray-800/70"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{transaction.date}</div>
                <div className="text-xs text-gray-400">{transaction.month}</div>
              </div>
              
              <div>
                <div className="text-green-400 font-medium">{transaction.dayName}</div>
                <div className="flex items-center space-x-4 mt-1">
                  {transaction.income > 0 && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">доход</span>
                    </div>
                  )}
                  {transaction.expense > 0 && (
                    <div className="flex items-center space-x-1 text-red-400">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">расход</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              {transaction.income > 0 && (
                <div className="text-green-400 font-semibold">
                  +{transaction.income.toLocaleString()} ТНГ
                </div>
              )}
              {transaction.expense > 0 && (
                <div className="text-red-400 font-semibold">
                  -{transaction.expense.toLocaleString()} ТНГ
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionHistory;
