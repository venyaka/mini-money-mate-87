
import React from 'react';
import TelegramAuth from './TelegramAuth';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  return (
    <TelegramAuth 
      onAuthSuccess={onAuthSuccess} 
      onSwitchToLogin={() => {}} 
    />
  );
};

export default AuthForm;
