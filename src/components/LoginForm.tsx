
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { useSpringAuth } from '@/hooks/useSpringAuth';

interface LoginFormProps {
  onAuthSuccess: () => void;
  onSwitchToTelegram: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAuthSuccess, onSwitchToTelegram, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useSpringAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      await login({ email, password });
      // После успешного логина вызываем callback для перехода на главную страницу
      onAuthSuccess();
    } catch (error) {
      // Ошибка уже обработана в хуке
    }
  };

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
          <CardHeader className="text-center p-0 mb-6">
            <h2 className="text-xl font-semibold text-white">Вход в аккаунт</h2>
            <p className="text-gray-400">Введите ваши данные для входа</p>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
            
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">или</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={onSwitchToTelegram}
              >
                Войти через Telegram
              </Button>
              
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                onClick={onSwitchToRegister}
              >
                Нет аккаунта? Зарегистрироваться
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
