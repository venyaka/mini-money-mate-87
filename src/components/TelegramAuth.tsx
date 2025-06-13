import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { fetchNgrokUrl } from '@/api/api.ts';

interface TelegramAuthProps {
  onAuthSuccess: () => void;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuthSuccess }) => {
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const setupTelegramAuth = async () => {
      try {
        const API_BASE_URL = await fetchNgrokUrl();
        const authorizeProcessingUrl = "/api/authorize/login";

        // 1. Устанавливаем обработчик до загрузки скрипта
        window.onTelegramAuth = (user: any) => {
          fetch(API_BASE_URL + authorizeProcessingUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(user),
          })
              .then((res) => res.json())
              .then(() => onAuthSuccess())
              .catch((err) => {
                console.error('Ошибка авторизации:', err);
              });
        };

        // 2. Загружаем Telegram виджет скрипт
        script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'test_project_spring_telegram_bot'); // замените на своего бота
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        const container = document.getElementById('telegram-login-container');
        if (container) {
          container.appendChild(script);
        }
      } catch (err) {
        console.error('Ошибка при получении ngrok URL:', err);
      }
    };

    setupTelegramAuth();

    return () => {
      // Удаляем обработчик и скрипт при размонтировании
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
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
              <div id="telegram-login-container" className="flex justify-center">
                {/* Виджет будет вставлен сюда */}
              </div>
            </div>
          </Card>
        </div>
      </div>
  );
};

export default TelegramAuth;
