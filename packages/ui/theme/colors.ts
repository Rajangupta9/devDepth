export const colors = {
  // Backgrounds & Surface Palette
  background: '#0B0F19',
  surface: '#111827',
  surfaceHover: '#1F2937',
  surfaceActive: '#374151',
  surfaceGlass: 'rgba(17, 24, 39, 0.75)',

  // Brand Primaries
  primary: '#6366F1',       // Indigo primary accent
  primaryHover: '#4F46E5',
  primaryGlow: 'rgba(99, 102, 241, 0.25)',
  
  // Brand Secondaries & Accents
  secondary: '#10B981',     // Emerald secondary accent
  secondaryHover: '#059669',
  secondaryGlow: 'rgba(16, 185, 129, 0.25)',

  purple: '#8B5CF6',
  purpleGlow: 'rgba(139, 92, 246, 0.25)',

  cyan: '#06B6D4',
  cyanGlow: 'rgba(6, 182, 212, 0.25)',

  // Typography Palette
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  muted: '#9CA3AF',
  subtle: '#6B7280',

  // Borders & Dividers
  border: '#1F2937',
  borderHover: '#374151',
  borderFocus: '#6366F1',

  // Status & Feedback Tokens
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.2)',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.2)',
  error: '#EF4444',
  errorGlow: 'rgba(239, 68, 68, 0.2)',
  info: '#3B82F6',
  infoGlow: 'rgba(59, 130, 246, 0.2)',

  // Code & Syntax Highlighting Tokens
  codeBg: '#0D1117',
  codeKeyword: '#FF7B72',
  codeFunction: '#D2A8FF',
  codeString: '#A5D6FF',
  codeComment: '#8B949E',
  codeNumber: '#79C0FF',
} as const;

export type Colors = typeof colors;
