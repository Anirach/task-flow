const BASE_URL = '/api';

let token: string | null = localStorage.getItem('taskflow_token');

export function setToken(t: string | null) {
  token = t;
  if (t) {
    localStorage.setItem('taskflow_token', t);
  } else {
    localStorage.removeItem('taskflow_token');
  }
}

export function getToken() {
  return token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: { name: string; email: string; password: string; avatar?: string; role?: string }) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => request<any>('/auth/me'),
  updateProfile: (data: { name?: string; role?: string }) =>
    request<any>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>('/auth/password', { method: 'PATCH', body: JSON.stringify(data) }),
};

// Users
export const users = {
  list: () => request<any[]>('/users'),
};

// Projects
export const projects = {
  list: () => request<any[]>('/projects'),
  get: (id: string) => request<any>(`/projects/${id}`),
  create: (data: { name: string; color: string; description: string; memberIds: string[] }) =>
    request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),
  addColumn: (id: string, name: string) =>
    request<any>(`/projects/${id}/columns`, { method: 'POST', body: JSON.stringify({ name }) }),
  reorderColumns: (id: string, columns: string[]) =>
    request<any>(`/projects/${id}/columns`, { method: 'PUT', body: JSON.stringify({ columns }) }),
};

// Tasks
export const tasks = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/tasks${query}`);
  },
  get: (id: string) => request<any>(`/tasks/${id}`),
  create: (data: any) =>
    request<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  move: (id: string, status: string) =>
    request<any>(`/tasks/${id}/move`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};

// Comments
export const comments = {
  list: (taskId: string) => request<any[]>(`/tasks/${taskId}/comments`),
  create: (taskId: string, text: string) =>
    request<any>(`/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
};

// Notifications
export const notifications = {
  list: () => request<any[]>('/notifications'),
  markRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
};
