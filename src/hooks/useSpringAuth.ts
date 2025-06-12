
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
      toast({
        title: "Ошибка входа",
        description: error.message,
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
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
  };

  return {
    user,
    loading,
    login,
    loginByTelegram,
    logout,
    refreshUser: checkCurrentUser
  };
};
