
import { UserRespDTO, BalanceDTO, TransactionDTO, TelegramAuthorizeReqDTO, Transaction } from '@/types/api';

const API_BASE_URL = 'http://localhost:8181';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include', // Для отправки cookies (JSESSIONID)
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(credentials: TelegramAuthorizeReqDTO): Promise<{ redirectUrl: string }> {
    return this.request('/api/authorize/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
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
}

export const apiService = new ApiService();
