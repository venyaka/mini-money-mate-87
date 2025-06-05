
export interface UserRespDTO {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  photoUrl: string;
}

export interface BalanceDTO {
  userId: number;
  amount: number;
}

export interface TransactionDTO {
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  date: string;
}

export interface TelegramAuthorizeReqDTO {
  // Добавьте нужные поля для Telegram авторизации
  username?: string;
  password?: string;
}

export interface Transaction extends TransactionDTO {
  id?: number;
  userId?: number;
  created_at?: string;
}
