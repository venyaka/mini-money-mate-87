
import { UserRespDTO, BalanceDTO, TransactionDTO, TelegramAuthorizeReqDTO, Transaction, UserAuthorizeReqDTO, RegisterReqDTO, TokenRespDTO, ApiError } from '@/types/api';

const API_BASE_URL = 'https://sergofinance.com';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': token }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include',
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Используем сообщение от сервера или код ошибки
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }

    // Проверяем, есть ли контент для парсинга
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    // Возвращаем пустой объект для методов, которые ничего не возвращают
    return {} as T;
  }

  // Auth
  async loginByTelegram(credentials: TelegramAuthorizeReqDTO): Promise<{ redirectUrl: string }> {
    return this.request('/api/authorize/login-by-telegram', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async login(credentials: UserAuthorizeReqDTO): Promise<TokenRespDTO> {
    const response = await this.request<TokenRespDTO>('/api/authorize/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Сохраняем токены в localStorage
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  }

  async register(data: RegisterReqDTO): Promise<void> {
    return this.request('/api/authorize/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verificateCode(email: string): Promise<void> {
    return this.request(`/api/authorize/verificateCode?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });
  }

  // User
  async getCurrentUser(): Promise<UserRespDTO> {
    return this.request('/api/users/me');
  }

  // Balance
  async getBalance(userId: number): Promise<BalanceDTO> {
    return this.request(`/api/balance/${userId}`);
  }

  async updateBalance(balance: BalanceDTO): Promise<BalanceDTO> {
    return this.request('/api/balance', {
      method: 'PUT',
      body: JSON.stringify(balance),
    });
  }

  // Transactions
  async getAllTransactions(): Promise<TransactionDTO[]> {
    return this.request('/api/transactions');
  }

  async createTransaction(transaction: TransactionDTO): Promise<TransactionDTO> {
    return this.request('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.request(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.request(`/api/transactions/user/${userId}`);
  }

  async getUserTransactionTotal(userId: number, type: 'INCOME' | 'EXPENSE'): Promise<number> {
    return this.request(`/api/transactions/user/${userId}/total`, {
      method: 'GET',
      body: JSON.stringify(type),
    });
  }

  // Utility
  async getNgrokUrl(): Promise<string> {
    return this.request('/api/ngrok');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export const apiService = new ApiService();
