
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <div className="px-6 mb-8">
      <div className="text-center">
        <p className="text-green-400 text-lg font-medium mb-2">Баланс</p>
        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
          {balance.toLocaleString()} <span className="text-3xl text-gray-400">ТНГ</span>
        </h2>
      </div>
      
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Изменение за месяц</span>
            </div>
            <span className="text-green-400 font-semibold">+12.5%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BalanceCard;
