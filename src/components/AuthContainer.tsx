import React, { useState } from 'react';
import TelegramAuth from './TelegramAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import GoogleAuth from './GoogleAuth';

interface AuthContainerProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'telegram' | 'login' | 'register' | 'google';

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('telegram');

  const handleRegistrationSuccess = () => {
    setAuthMode('login');
  };

  if (authMode === 'google') {
    return <GoogleAuth onAuthSuccess={onAuthSuccess} />;
  }

  // ����� ������ ������� �����
  if (authMode === 'telegram') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <TelegramAuth
          onAuthSuccess={onAuthSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow"
          onClick={() => setAuthMode('google')}
        >
          ����� ����� Google
        </button>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 shadow"
          onClick={() => setAuthMode('login')}
        >
          ����� �� email
        </button>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 shadow"
          onClick={() => setAuthMode('register')}
        >
          ������������������
        </button>
      </div>
    );
  }

  switch (authMode) {
    case 'login':
      return (
        <LoginForm
          onAuthSuccess={onAuthSuccess}
          onSwitchToTelegram={() => setAuthMode('telegram')}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    case 'register':
      return (
        <RegisterForm
          onRegistrationSuccess={handleRegistrationSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    default:
      return null;
  }
};

export default AuthContainer;
