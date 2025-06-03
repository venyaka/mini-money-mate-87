import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Регистрация успешна",
          description: "Проверьте email для подтверждения аккаунта",
        });
      }
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-700 rounded-xl mb-6">
            <Button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-3 rounded-lg transition-all ${
                isLogin
                  ? 'bg-green-500 text-black hover:bg-green-600'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              Вход
            </Button>
            <Button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-3 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-green-500 text-black hover:bg-green-600'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              Регистрация
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-400"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-400"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-400 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition-colors border border-green-400"
            >
              {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
