
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IncomeExpenseButtonsProps {
  onIncomeClick: () => void;
  onExpenseClick: () => void;
}

const IncomeExpenseButtons: React.FC<IncomeExpenseButtonsProps> = ({
  onIncomeClick,
  onExpenseClick
}) => {
  return (
    <div className="px-6 mb-8">
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onIncomeClick}
          className="h-16 bg-black border-2 border-green-500 text-green-400 hover:bg-gray-900 hover:text-green-300 transition-all duration-200 rounded-2xl flex flex-col items-center justify-center space-y-1"
        >
          <TrendingUp className="w-6 h-6" />
          <span className="font-semibold">Доход</span>
        </Button>
        
        <Button
          onClick={onExpenseClick}
          className="h-16 bg-black border-2 border-red-500 text-red-400 hover:bg-gray-900 hover:text-red-300 transition-all duration-200 rounded-2xl flex flex-col items-center justify-center space-y-1"
        >
          <TrendingDown className="w-6 h-6" />
          <span className="font-semibold">Расход</span>
        </Button>
      </div>
    </div>
  );
};

export default IncomeExpenseButtons;
