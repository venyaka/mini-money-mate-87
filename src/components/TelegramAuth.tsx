
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface TelegramAuthProps {
  onAuthSuccess: () => void;
  onSwitchToLogin: () => void;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuthSuccess, onSwitchToLogin }) => {
  useEffect(() => {
    // Глобальная функция для обработки Telegram авторизации
    window.onTelegramAuth = (user: any) => {
      const path = "https://sergofinance.com";
      const authorizeProcessingUrl = "/api/authorize/login-by-telegram";
      
      fetch((path + authorizeProcessingUrl), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include', // Для работы с cookies
        body: JSON.stringify(user)
      })
        .then(response => response.json())
        .then(data => {
          // Вместо редиректа вызываем callback для обновления состояния
          onAuthSuccess();
        })
        .catch(error => {
          console.error('Ошибка авторизации:', error);
        });
    };

    // Загружаем Telegram Widget скрипт
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'EthereumFinanceBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Очищаем при размонтировании
      if (container && script.parentNode) {
        container.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [onAuthSuccess]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wallet className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold">Финансы</h1>
          </div>
          <p className="text-gray-400">Управляйте своими финансами легко</p>
        </div>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Войти через Telegram
            </h2>
            <p className="text-gray-400 mb-6">
              Используйте свой Telegram аккаунт для входа в приложение
            </p>
            <div id="telegram-login-container" className="flex justify-center mb-6">
              {/* Сюда будет вставлен Telegram Widget */}
            </div>
            
            <div className="mt-6">
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                onClick={onSwitchToLogin}
              >
                Войти по логину и паролю
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TelegramAuth;
