
import React, { useState } from 'react';
import TelegramAuth from './TelegramAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthContainerProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'telegram' | 'login' | 'register';

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('telegram');

  const handleRegistrationSuccess = () => {
    setAuthMode('login');
  };

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
    case 'telegram':
    default:
      return (
        <TelegramAuth
          onAuthSuccess={onAuthSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
  }
};

export default AuthContainer;
