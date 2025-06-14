
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { UserRespDTO, TelegramAuthorizeReqDTO, UserAuthorizeReqDTO } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const useSpringAuth = () => {
  const [user, setUser] = useState<UserRespDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('No active session');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginByTelegram = async (credentials: TelegramAuthorizeReqDTO) => {
    try {
      setLoading(true);
      const response = await apiService.loginByTelegram(credentials);
      
      // После успешного логина проверяем текущего пользователя
      await checkCurrentUser();
      
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать!",
      });

      return response;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.message);
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: UserAuthorizeReqDTO) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      // После успешного логина проверяем текущего пользователя
      await checkCurrentUser();
      
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать!",
      });

      return response;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.message);
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setLoading(true);
      await apiService.register(data);
      
      toast({
        title: "Регистрация успешна",
        description: "Проверьте почту и подтвердите аккаунт по ссылке в письме",
      });

      return true;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.message);
      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
  };

  const getErrorMessage = (errorMessage: string): string => {
    const errorMap: { [key: string]: string } = {
      'USER_NOT_FOUND': 'Пользователь не найден',
      'USER_NOT_VERIFICATED': 'Пользователь не верифицирован',
      'NOT_CORRECT_VERIFICATION_CODE': 'Код верификации не корректен или не был запрошен',
      'NOT_CORRECT_PASSWORD': 'Неверный пароль',
      'NOT_CORRECT_REFRESH_TOKEN': 'Неверный рефреш токен',
      'USER_ALREADY_EXISTS': 'Пользователь с такой почтой уже существует',
      'USER_ALREADY_VERIFICATED': 'Пользователь уже был верифицирован',
      'TRANSACTION_NOT_FOUND': 'Транзакция не найдена',
    };

    return errorMap[errorMessage] || errorMessage;
  };

  return {
    user,
    loading,
    login,
    loginByTelegram,
    register,
    logout,
    refreshUser: checkCurrentUser
  };
};
