export const colors = {
  // Backgrounds & Blueprint Palette
  background: '#070913',
  canvas: '#0B0F1D',
  surface: '#111728',
  surfaceHover: '#172036',
  surfaceActive: '#222C47',
  surfaceGlass: 'rgba(17, 23, 40, 0.85)',

  // Brand Primaries (Vibrant Electric Blue & Indigo)
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primaryLight: '#60A5FA',
  primaryGlow: 'rgba(59, 130, 246, 0.35)',

  indigo: '#6366F1',
  indigoGlow: 'rgba(99, 102, 241, 0.35)',

  // Brand Accents
  secondary: '#10B981',
  secondaryHover: '#059669',
  secondaryGlow: 'rgba(16, 185, 129, 0.3)',

  purple: '#8B5CF6',
  purpleGlow: 'rgba(139, 92, 246, 0.3)',

  cyan: '#06B6D4',
  cyanGlow: 'rgba(6, 182, 212, 0.3)',

  // Typography Palette
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  muted: '#9CA3AF',
  subtle: '#6B7280',

  // Borders & Dividers
  border: 'rgba(99, 102, 241, 0.16)',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(99, 102, 241, 0.4)',
  borderFocus: '#3B82F6',

  // Status & Feedback Tokens
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.25)',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.25)',
  error: '#EF4444',
  errorGlow: 'rgba(239, 68, 68, 0.25)',
  info: '#3B82F6',
  infoGlow: 'rgba(59, 130, 246, 0.25)',

  // Code & Syntax Highlighting Tokens
  codeBg: '#090D18',
  codeKeyword: '#FF7B72',
  codeFunction: '#D2A8FF',
  codeString: '#A5D6FF',
  codeComment: '#8B949E',
  codeNumber: '#79C0FF',
} as const;

export type Colors = typeof colors;
