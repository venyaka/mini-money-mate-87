
import {
  UserRespDTO,
  BalanceDTO,
  TransactionDTO,
  TelegramAuthorizeReqDTO,
  Transaction,
} from '@/types/api';
import { API_ROUTES } from '@/constants/apiRoutes';
import {fetchNgrokUrl} from "@/api/api.ts";


class ApiService {
  private ngrokUrl: string | null = null;

  private async getApiBaseUrl(): Promise<string> {
    if (!this.ngrokUrl) {
      this.ngrokUrl = await fetchNgrokUrl();
    }
    return this.ngrokUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = await this.getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include',
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
    return this.request(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User
  async getCurrentUser(): Promise<UserRespDTO> {
    return this.request(API_ROUTES.USER.ME);
  }

  // Balance
  async getBalance(userId: number): Promise<BalanceDTO> {
    return this.request(API_ROUTES.BALANCE.BY_USER_ID(userId));
  }

  async updateBalance(balance: BalanceDTO): Promise<BalanceDTO> {
    return this.request(API_ROUTES.BALANCE.ROOT, {
      method: 'PUT',
      body: JSON.stringify(balance),
    });
  }

  // Transactions
  async getAllTransactions(): Promise<TransactionDTO[]> {
    return this.request(API_ROUTES.TRANSACTIONS.ROOT);
  }

  async createTransaction(transaction: TransactionDTO): Promise<TransactionDTO> {
    return this.request(API_ROUTES.TRANSACTIONS.ROOT, {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    return this.request(API_ROUTES.TRANSACTIONS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.request(API_ROUTES.TRANSACTIONS.BY_USER_ID(userId));
  }

  async getUserTransactionTotal(userId: number, type: 'INCOME' | 'EXPENSE'): Promise<number> {
    return this.request(API_ROUTES.TRANSACTIONS.USER_TOTAL(userId), {
      method: 'GET',
      body: JSON.stringify(type),
    });
  }
}

export const apiService = new ApiService();
