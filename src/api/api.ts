import {
    TelegramAuthorizeReqDTO,
    UserRespDTO,
    BalanceDTO,
    TransactionDTO
} from '@/types/dto';
import { API_ROUTES } from '@/constants/apiRoutes';

const API_BASE_URL = await fetchNgrokUrl();

export async function getData() {

    const response = await fetch(`${API_BASE_URL}/api/data`, {
        credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    return response.json();
}

export async function loginTelegram(data: TelegramAuthorizeReqDTO) {
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.AUTH.LOGIN}`, {
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
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.USER.ME}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
}

export async function fetchBalance(userId?: number): Promise<BalanceDTO> {
    const url = userId !== undefined
        ? `${API_BASE_URL}${API_ROUTES.BALANCE.BY_USER_ID(userId)}`
        : `${API_BASE_URL}${API_ROUTES.BALANCE.ROOT}`;
    const res = await fetch(url, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Balance fetch failed');
    return res.json();
}

export async function updateBalance(dto: BalanceDTO): Promise<BalanceDTO> {
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.BALANCE.ROOT}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
    if (!res.ok) throw new Error('Balance update failed');
    return res.json();
}

export async function fetchTransactions(): Promise<TransactionDTO[]> {
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.TRANSACTIONS.ROOT}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Transactions fetch failed');
    return res.json();
}

export async function logout(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
}

export const fetchTransactionsForUser = async (userId: number) => {
    const res = await fetch(`${API_ROUTES.TRANSACTIONS.BY_USER_ID(userId)}`);
    return await res.json();
};

export const saveTransaction = async (transaction: {
    userId: number;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}) => {
    const res = await fetch(API_ROUTES.TRANSACTIONS.ROOT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
    return await res.json();
};

export async function fetchNgrokUrl(): Promise<string> {
    const response = await fetch('/api/ngrok');
    if (!response.ok) {
        throw new Error('Не удалось получить ngrok URL');
    }
    return await response.text();
}