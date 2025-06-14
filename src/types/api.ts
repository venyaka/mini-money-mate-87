
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
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface UserAuthorizeReqDTO {
  email: string;
  password: string;
}

export interface RegisterReqDTO {
  name: string;
  surname: string;
  password: string;
  email: string;
}

export interface TokenRespDTO {
  accessToken: string;
  refreshToken: string;
}

export interface Transaction extends TransactionDTO {
  id?: number;
  userId?: number;
  created_at?: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  debugInfo?: any;
}
