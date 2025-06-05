
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  user: any;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
    onLogout();
  };

  const displayName = user?.user_metadata?.name || user?.email || 'Пользователь';

  return (
    <div className="flex items-center justify-between p-6 pt-12">
      <div className="flex items-center space-x-3">
        <div className="bg-green-500 rounded-full p-2">
          <User className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">{displayName}</h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
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
