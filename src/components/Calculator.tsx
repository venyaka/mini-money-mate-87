
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Delete, TrendingUp, TrendingDown } from 'lucide-react';

interface CalculatorProps {
  onAmountSet: (amount: number) => void;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onAmountSet, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num === '0' ? '0' : num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDot = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setIsNewNumber(true);
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  const handleConfirm = () => {
    const amount = parseFloat(display);
    if (amount > 0) {
      onAmountSet(amount);
    }
  };

  const buttons = [
    ['C', '⌫', '', ''],
    ['7', '8', '9', ''],
    ['4', '5', '6', ''],
    ['1', '2', '3', ''],
    ['0', '.', '', 'OK']
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-fade-in">
      <Card className="w-full bg-gray-800 border-gray-700 rounded-t-3xl animate-slide-in-right">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Введите сумму</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Transaction Type Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-700 rounded-xl mb-6">
            <Button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`py-3 rounded-lg transition-all ${
                transactionType === 'income'
                  ? 'bg-green-500 text-black hover:bg-green-600'
                  : 'bg-transparent text-white hover:bg-gray-600'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Доход
            </Button>
            <Button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`py-3 rounded-lg transition-all ${
                transactionType === 'expense'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-transparent text-white hover:bg-gray-600'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Расход
            </Button>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 mb-6">
            <div className="text-right text-3xl font-bold text-white min-h-[50px] flex items-center justify-end">
              {display} <span className="text-lg text-gray-400 ml-2">ТНГ</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {buttons.map((row, rowIndex) => 
              row.map((btn, btnIndex) => {
                if (btn === '') return <div key={`${rowIndex}-${btnIndex}`} />;
                
                let buttonClass = "h-14 text-lg font-semibold rounded-xl transition-colors ";
                
                if (btn === 'C') {
                  buttonClass += "bg-red-500 hover:bg-red-600 text-white";
                } else if (btn === '⌫') {
                  buttonClass += "bg-orange-500 hover:bg-orange-600 text-white";
                } else if (btn === 'OK') {
                  buttonClass += "bg-green-500 hover:bg-green-600 text-black col-span-2";
                } else {
                  buttonClass += "bg-gray-600 hover:bg-gray-500 text-white";
                }

                return (
                  <Button
                    key={`${rowIndex}-${btnIndex}`}
                    className={buttonClass}
                    onClick={() => {
                      if (btn === 'C') handleClear();
                      else if (btn === '⌫') handleDelete();
                      else if (btn === '.') handleDot();
                      else if (btn === 'OK') handleConfirm();
                      else handleNumber(btn);
                    }}
                  >
                    {btn === '⌫' ? <Delete className="w-5 h-5" /> : btn}
                  </Button>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
