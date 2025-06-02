import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
interface BalanceCardProps {
  balance: number;
}
const BalanceCard: React.FC<BalanceCardProps> = ({
  balance
}) => {
  return <div className="px-6 mb-8">
      <div className="text-center">
        <p className="text-green-400 text-lg font-medium mb-2">Баланс</p>
        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
          {balance.toLocaleString()} <span className="text-3xl text-gray-400">ТНГ</span>
        </h2>
      </div>
      
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        
      </Card>
    </div>;
};
export default BalanceCard;