
import React from 'react';
import TelegramAuth from './TelegramAuth';

interface SpringAuthFormProps {
  onAuthSuccess: () => void;
}

const SpringAuthForm: React.FC<SpringAuthFormProps> = ({ onAuthSuccess }) => {
  return (
    <TelegramAuth 
      onAuthSuccess={onAuthSuccess} 
      onSwitchToLogin={() => {}} 
    />
  );
};

export default SpringAuthForm;
