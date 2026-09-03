import { Course, Problem, Submission, RunResult, UserNote } from '../types';

const BASE_URL = 'http://localhost:8080';

export function getAuthToken(): string | null {
  return localStorage.getItem('devdepth_auth_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('devdepth_auth_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('devdepth_auth_token');
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        ...headers,
        ...(options?.headers || {}),
      },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message || json.error || 'Server error' };
    }
    return { success: true, data: json.data !== undefined ? json.data : json };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

export const DevDepthAPI = {
  async getHealth() {
    return fetchJson<{ status: string; service: string; engine: string }>('/health');
  },

  async register(data: { email: string; password: string; full_name: string; goal?: string }) {
    const res = await fetchJson<{ token: string; token_type: string; expires_in: number; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetchJson<{ token: string; token_type: string; expires_in: number; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  async getCourses(category?: string) {
    const query = category ? `?category=${category}` : '';
    return fetchJson<Course[]>(`/courses${query}`);
  },

  async getCourseBySlug(slug: string) {
    return fetchJson<Course>(`/courses/detail?slug=${slug}`);
  },

  async getProblems(topic?: string, difficulty?: string) {
    const params = new URLSearchParams();
    if (topic) params.append('topic', topic);
    if (difficulty) params.append('difficulty', difficulty);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<Problem[]>(`/problems${query}`);
  },

  async getProblemBySlug(slug: string) {
    return fetchJson<Problem>(`/problems/detail?slug=${slug}`);
  },

  async runCode(language: string, code: string, input: string) {
    return fetchJson<RunResult>('/submissions/run', {
      method: 'POST',
      body: JSON.stringify({ language, code, input }),
    });
  },

  async submitCode(problemSlug: string, language: string, code: string, userId: string = 'demo_user_1') {
    return fetchJson<Submission>('/submissions/submit', {
      method: 'POST',
      body: JSON.stringify({ problem_slug: problemSlug, language, code, user_id: userId }),
    });
  },

  async getNotes(userId?: string) {
    const query = userId ? `?user_id=${userId}` : '';
    return fetchJson<UserNote[]>(`/notes${query}`);
  },

  async saveNote(data: { lesson_id?: string; title: string; content: string }) {
    return fetchJson<UserNote>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteNote(noteId: string) {
    return fetchJson<{ message: string }>(`/notes?id=${noteId}`, {
      method: 'DELETE',
    });
  },
};
