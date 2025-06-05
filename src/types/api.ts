
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

export interface Transaction extends TransactionDTO {
  id?: number;
  userId?: number;
  created_at?: string;
}
