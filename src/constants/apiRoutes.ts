const API_BASE = '/api';

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${API_BASE}/authorize/login`,
    },
    USER: {
        ME: `${API_BASE}/users/me`,
    },
    BALANCE: {
        ROOT: `${API_BASE}/balance`,
        BY_USER_ID: (userId: number) => `${API_BASE}/balance/${userId}`,
    },
    TRANSACTIONS: {
        ROOT: `${API_BASE}/transactions`,
        BY_USER_ID: (userId: number) => `${API_BASE}/transactions/user/${userId}`,
        USER_TOTAL: (userId: number) => `${API_BASE}/transactions/user/${userId}/total`,
        BY_ID: (id: number) => `${API_BASE}/transactions/${id}`,
    },
};
