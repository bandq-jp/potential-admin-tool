const isDev = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDev
  ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  : '/api/backend';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(response.status, error.detail || 'Request failed');
  }
  return response.json();
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    apiFetch<T>(endpoint, { method: 'GET' }, token),

  post: <T>(endpoint: string, data: unknown, token?: string) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }, token),

  patch: <T>(endpoint: string, data: unknown, token?: string) =>
    apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }, token),

  delete: <T>(endpoint: string, token?: string) =>
    apiFetch<T>(endpoint, { method: 'DELETE' }, token),
};
