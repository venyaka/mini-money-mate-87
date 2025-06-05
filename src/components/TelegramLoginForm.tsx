import React, { useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TelegramAuthorizeReqDTO, UserRespDTO } from '@/types/dto';
import { loginTelegram } from '@/api/api.ts';
import { useNavigate } from 'react-router-dom';

const TelegramLoginForm: React.FC = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    // Эта функция вызывается Telegram после авторизации
    const handleTelegramAuth = async (user: TelegramAuthorizeReqDTO) => {
        try {
            const response: UserRespDTO = await loginTelegram(user);
            toast({
                title: 'Успешная авторизация',
                description: `Добро пожаловать, ${response.firstName || 'пользователь'}!`,
            });
            navigate('/dashboard');
        } catch (error: any) {
            toast({
                title: 'Ошибка',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    // ⬇️ Вот сюда добавляешь useEffect:
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'test_project_spring_telegram_bot'); // ЗАМЕНИ на имя своего бота
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-userpic', 'false');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        document.getElementById('telegram-login-widget')?.appendChild(script);

        // глобальная функция для Telegram-авторизации
        (window as any).onTelegramAuth = (user: TelegramAuthorizeReqDTO) => {
            handleTelegramAuth(user);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Wallet className="w-8 h-8 text-green-400" />
                        <h1 className="text-3xl font-bold">Финансы</h1>
                    </div>
                    <p className="text-gray-400">Авторизация через Telegram</p>
                </div>

                {/* ⬇️ В эту div добавляется кнопка Telegram */}
                <div className="flex justify-center">
                    <div id="telegram-login-widget" className="mt-4" />
                </div>
            </div>
        </div>
    );
};

export default TelegramLoginForm;
