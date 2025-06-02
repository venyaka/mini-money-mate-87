
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (amount: number, type: 'income' | 'expense') => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount, type);
    }
  };

  return (
    <Card className="w-full bg-gray-800 border-gray-700 rounded-t-3xl animate-slide-in-right">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Добавить транзакцию</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-700 rounded-xl">
            <Button
              type="button"
              onClick={() => setType('income')}
              className={`py-3 rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-green-500 text-black hover:bg-green-600'
                  : 'bg-transparent text-white hover:bg-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Доход
            </Button>
            <Button
              type="button"
              onClick={() => setType('expense')}
              className={`py-3 rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-transparent text-white hover:bg-gray-600'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Расход
            </Button>
          </div>

          <div>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl text-center bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 py-6"
              required
            />
            <p className="text-center text-gray-400 mt-2">ТНГ</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-4 rounded-xl transition-colors"
          >
            Добавить
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default TransactionForm;
