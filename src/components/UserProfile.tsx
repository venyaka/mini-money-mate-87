import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Добавь, если есть API logout, например:
import { logout } from '@/api/api';
import {UserRespDTO} from "@/types/dto.ts"; // если есть функция logout на бекенде

interface UserProfileProps {
    user: UserRespDTO;
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            // Если есть API logout, вызываем его
            if (logout) {
                await logout();
            }
            // Просто вызываем коллбек выхода
            toast({
                title: "Выход выполнен",
                description: "До свидания!",
            });
            onLogout();
        } catch (error: any) {
            toast({
                title: "Ошибка",
                description: error?.message || 'Не удалось выйти',
                variant: "destructive",
            });
        }
    };

    const displayName = user?.firstName || user?.username || 'Пользователь';

    return (
        <div className="flex items-center justify-between p-6 pt-12">
            <div className="flex items-center space-x-3">
                <div className="bg-green-500 rounded-full p-2">
                    <User className="w-5 h-5 text-black" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-white">{displayName}</h1>
                    <p className="text-sm text-gray-400">{user?.username}</p>
                </div>
            </div>

            <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
            >
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
    );
};

export default UserProfile;
