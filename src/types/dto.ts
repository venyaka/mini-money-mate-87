// src/types/dto.ts

export interface TelegramAuthorizeReqDTO {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export interface UserRespDTO {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    photoUrl?: string;
}

export interface BalanceDTO {
    userId: number;
    amount: number;
}

export type TransactionType = 'INCOME' | 'EXPENSE'; // или дополни по enum из бэка

export interface TransactionDTO {
    type: TransactionType;
    amount: number;
    date?: string; // ISO-строка, например: '2025-06-04'
}

export interface Transaction {
    id: number;
    userId: number;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}
