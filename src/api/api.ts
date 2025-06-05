const API = 'http://localhost:8181';

import {
    TelegramAuthorizeReqDTO,
    UserRespDTO,
    BalanceDTO,
    TransactionDTO
} from '@/types/dto';


export async function loginTelegram(data: TelegramAuthorizeReqDTO) {
    const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json() as Promise<UserRespDTO>;
}

// export const loginTelegram = async (
//     data: TelegramAuthorizeReqDTO
// ): Promise<UserRespDTO> => {
//     const response = await axios.post<UserRespDTO>(`${API_BASE_URL}/auth/telegram`, data, {
//         withCredentials: true, // если используешь cookie-based auth
//     });
//     return response.data;
// };

export async function fetchCurrentUser(): Promise<UserRespDTO> {
    const res = await fetch(`${API}/api/users/me`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
}

export async function fetchBalance(userId?: number): Promise<BalanceDTO> {
    const res = await fetch(`${API}/api/balance/${userId ?? ''}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Balance fetch failed');
    return res.json();
}

export async function updateBalance(dto: BalanceDTO): Promise<BalanceDTO> {
    const res = await fetch(`${API}/api/balance`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    if (!res.ok) throw new Error('Balance update failed');
    return res.json();
}

export async function fetchTransactions(): Promise<TransactionDTO[]> {
    const res = await fetch(`${API}/api/transactions`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Transactions fetch failed');
    return res.json();
}

export async function logout(): Promise<void> {
    const res = await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
}

export const fetchTransactionsForUser = async (userId: number) => {
    const res = await fetch(`/api/transactions?userId=${userId}`);
    return await res.json();
};

export const saveTransaction = async (transaction: {
    userId: number;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}) => {
    const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
    return await res.json();
};
