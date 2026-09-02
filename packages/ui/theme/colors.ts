export interface Colors {
  readonly background: string;
  readonly canvas: string;
  readonly surface: string;
  readonly surfaceHover: string;
  readonly surfaceActive: string;
  readonly surfaceGlass: string;

  readonly primary: string;
  readonly primaryHover: string;
  readonly primaryLight: string;
  readonly primaryGlow: string;

  readonly indigo: string;
  readonly indigoGlow: string;

  readonly secondary: string;
  readonly secondaryHover: string;
  readonly secondaryGlow: string;

  readonly purple: string;
  readonly purpleGlow: string;

  readonly cyan: string;
  readonly cyanGlow: string;

  readonly text: string;
  readonly textSecondary: string;
  readonly muted: string;
  readonly subtle: string;

  readonly border: string;
  readonly borderSubtle: string;
  readonly borderHover: string;
  readonly borderFocus: string;

  readonly success: string;
  readonly successGlow: string;
  readonly warning: string;
  readonly warningGlow: string;
  readonly error: string;
  readonly errorGlow: string;
  readonly info: string;
  readonly infoGlow: string;

  readonly codeBg: string;
  readonly codeKeyword: string;
  readonly codeFunction: string;
  readonly codeString: string;
  readonly codeComment: string;
  readonly codeNumber: string;
}

export const darkColors: Colors = {
  background: '#070913',
  canvas: '#0B0F1D',
  surface: '#111728',
  surfaceHover: '#172036',
  surfaceActive: '#222C47',
  surfaceGlass: 'rgba(17, 23, 40, 0.85)',

  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primaryLight: '#60A5FA',
  primaryGlow: 'rgba(59, 130, 246, 0.35)',

  indigo: '#6366F1',
  indigoGlow: 'rgba(99, 102, 241, 0.35)',

  secondary: '#10B981',
  secondaryHover: '#059669',
  secondaryGlow: 'rgba(16, 185, 129, 0.3)',

  purple: '#8B5CF6',
  purpleGlow: 'rgba(139, 92, 246, 0.3)',

  cyan: '#06B6D4',
  cyanGlow: 'rgba(6, 182, 212, 0.3)',

  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  muted: '#9CA3AF',
  subtle: '#6B7280',

  border: 'rgba(99, 102, 241, 0.16)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(99, 102, 241, 0.4)',
  borderFocus: '#3B82F6',

  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.25)',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.25)',
  error: '#EF4444',
  errorGlow: 'rgba(239, 68, 68, 0.25)',
  info: '#3B82F6',
  infoGlow: 'rgba(59, 130, 246, 0.25)',

  codeBg: '#090D18',
  codeKeyword: '#FF7B72',
  codeFunction: '#D2A8FF',
  codeString: '#A5D6FF',
  codeComment: '#8B949E',
  codeNumber: '#79C0FF',
};

export const lightColors: Colors = {
  background: '#F8FAFC',
  canvas: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  surfaceActive: '#E2E8F0',
  surfaceGlass: 'rgba(255, 255, 255, 0.9)',

  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryLight: '#3B82F6',
  primaryGlow: 'rgba(37, 99, 235, 0.18)',

  indigo: '#4F46E5',
  indigoGlow: 'rgba(79, 70, 229, 0.18)',

  secondary: '#059669',
  secondaryHover: '#047857',
  secondaryGlow: 'rgba(5, 150, 105, 0.15)',

  purple: '#7C3AED',
  purpleGlow: 'rgba(124, 58, 237, 0.15)',

  cyan: '#0891B2',
  cyanGlow: 'rgba(8, 145, 178, 0.15)',

  text: '#0F172A',
  textSecondary: '#334155',
  muted: '#64748B',
  subtle: '#94A3B8',

  border: 'rgba(37, 99, 235, 0.16)',
  borderSubtle: 'rgba(0, 0, 0, 0.08)',
  borderHover: 'rgba(37, 99, 235, 0.4)',
  borderFocus: '#2563EB',

  success: '#059669',
  successGlow: 'rgba(5, 150, 105, 0.15)',
  warning: '#D97706',
  warningGlow: 'rgba(217, 119, 6, 0.15)',
  error: '#DC2626',
  errorGlow: 'rgba(220, 38, 38, 0.15)',
  info: '#2563EB',
  infoGlow: 'rgba(37, 99, 235, 0.15)',

  codeBg: '#0F172A',
  codeKeyword: '#FF7B72',
  codeFunction: '#D2A8FF',
  codeString: '#A5D6FF',
  codeComment: '#8B949E',
  codeNumber: '#79C0FF',
};

export const colors = darkColors;

export function getThemeColors(mode: 'dark' | 'light'): Colors {
  return mode === 'light' ? lightColors : darkColors;
}
