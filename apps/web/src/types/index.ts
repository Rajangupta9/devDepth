export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  goal: string;
  created_at?: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  type: 'concept' | 'lab' | 'visualization' | 'practice';
  content: string;
  visualizer_id?: string;
  estimated_mins: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: 'dsa' | 'networking' | 'operating-systems' | 'databases' | 'system-design';
  description: string;
  level: string;
  modules: Module[];
}

export interface TestCase {
  input: string;
  expected: string;
  is_hidden: boolean;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  pattern: string;
  constraints: string;
  test_cases: TestCase[];
  hints: string[];
}

export interface Submission {
  id: string;
  user_id: string;
  problem_slug: string;
  language: string;
  code: string;
  status: string;
  passed_tests: number;
  total_tests: number;
  runtime_ms: number;
  memory_kb: number;
  error_message?: string;
  created_at?: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  runtime_ms: number;
  memory_kb: number;
  exit_code: number;
  error_message?: string;
}

export interface VisualizerEvent {
  step: number;
  type: 'compare' | 'swap' | 'highlight' | 'write' | 'packet_send' | 'packet_receive' | 'state_change';
  indices?: number[];
  values?: any;
  message: string;
  codeLine?: number;
}
