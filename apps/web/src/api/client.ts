import { Course, Problem, Submission, RunResult } from '../types';

const BASE_URL = 'http://localhost:8080';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
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
};
