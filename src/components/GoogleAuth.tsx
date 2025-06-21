import React, { useEffect } from 'react';
import { apiService } from '@/services/apiService';

interface GoogleAuthProps {
  onAuthSuccess: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onAuthSuccess }) => {
  // ���������, ���� �� code � URL (�������� �� Google)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      apiService.loginWithGoogle(code)
        .then(() => {
          onAuthSuccess();
        })
        .catch(() => {
          // ����� �������� ��������� ������
        });
    }
  }, [onAuthSuccess]);

  const handleGoogleLogin = async () => {
    const { url } = await apiService.getGoogleAuthUrl();
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow"
        onClick={handleGoogleLogin}
      >
        ����� ����� Google
      </button>
    </div>
  );
};

export default GoogleAuth;

