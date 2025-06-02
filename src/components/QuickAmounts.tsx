
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickAmountsProps {
  onAmountSelect: () => void;
}

const QuickAmounts: React.FC<QuickAmountsProps> = ({ onAmountSelect }) => {
  const amounts = [1000, 1500, 2000, 2500, 5000, 10000];

  return (
    <div className="px-6 mb-8">
      <div className="bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
        <div
          onClick={onAmountSelect}
          className="w-full bg-transparent text-gray-400 text-lg p-4 rounded-xl border border-gray-600 focus:border-green-400 focus:outline-none mb-4 transition-colors cursor-pointer hover:border-green-400"
        >
          Введите сумму
        </div>
        
        <div className="flex flex-wrap gap-2">
          {amounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={onAmountSelect}
              className="bg-transparent border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-200 rounded-xl px-4 py-2"
            >
              {amount.toLocaleString()} ТНГ
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAmounts;
