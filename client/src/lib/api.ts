const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('campusfind_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to fetch data`);
  }
  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (payload: any) =>
    request<{ token: string; user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  demoLogin: (role: 'student' | 'security' | 'admin') =>
    request<{ token: string; user: any; message: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
  getMe: () => request<{ user: any }>('/auth/me'),
  getDemoUsers: () => request<{ demoAccounts: any[] }>('/auth/demo-users'),

  // Items
  getCategories: () => request<{ categories: any[] }>('/items/categories'),
  getStats: () => request<any>('/items/stats'),
  getFoundItems: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ items: any[] }>(`/items/found?${qs}`);
  },
  getFoundItem: (id: number) => request<{ item: any }>(`/items/found/${id}`),
  getLostItems: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ items: any[] }>(`/items/lost?${qs}`);
  },
  reportLost: (data: any) =>
    request<{ message: string; id: number; potentialMatchesFound: number }>('/items/lost', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  reportFound: (data: any) =>
    request<{ message: string; id: number; matchesCount: number }>('/items/found', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Matching
  getMyMatches: () => request<{ matches: any[] }>('/matching/my'),
  getLostMatches: (lostId: number) => request<{ matches: any[] }>(`/matching/lost/${lostId}`),
  simulateMatch: (lost: any, found: any) =>
    request<{ simulation: any }>('/matching/simulate', {
      method: 'POST',
      body: JSON.stringify({ lost, found }),
    }),

  // Claims
  submitClaim: (data: any) =>
    request<{ message: string; claimId: number }>('/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyClaims: () => request<{ claims: any[] }>('/claims/my'),
  getClaim: (id: number) => request<{ claim: any }>(`/claims/${id}`),

  // Security
  getSecurityDashboard: () => request<any>('/security/dashboard'),
  reviewClaim: (claimId: number, status: string, remarks?: string) =>
    request<any>(`/security/claims/${claimId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, remarks }),
    }),
  updateCustody: (data: any) =>
    request<any>('/security/custody/update', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  executeHandover: (data: { claim_id: number; receiver_id_proof: string; remarks?: string }) =>
    request<any>('/security/handover', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getReturns: () => request<{ returns: any[] }>('/security/returns'),

  // Admin
  getAdminUsers: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ users: any[] }>(`/admin/users?${qs}`);
  },
  updateUserRole: (userId: number, role: string) =>
    request<any>(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
  getAuditLogs: () => request<{ logs: any[] }>('/admin/audit-logs'),
  getSystemReport: () => request<any>('/admin/system-report'),
  createCategory: (data: any) =>
    request<any>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Experiments
  getCatalog: () => request<any>('/experiments/catalog'),
  getExp9State: () => request<any>('/experiments/exp9/state'),
  resetExp9: () =>
    request<any>('/experiments/exp9/reset', {
      method: 'POST',
    }),
  executeExp9: (command: string, extra: any = {}) =>
    request<any>('/experiments/exp9/execute', {
      method: 'POST',
      body: JSON.stringify({ command, ...extra }),
    }),
  getExp10Docs: () => request<any>('/experiments/exp10/documents'),
  runExp10Crud: (operation: string, payload: any) =>
    request<any>('/experiments/exp10/run-crud', {
      method: 'POST',
      body: JSON.stringify({ operation, payload }),
    }),
};
