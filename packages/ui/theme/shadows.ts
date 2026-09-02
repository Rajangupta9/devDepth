export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
  glowPrimary: '0 0 20px rgba(99, 102, 241, 0.35)',
  glowSecondary: '0 0 20px rgba(16, 185, 129, 0.35)',
  glowPurple: '0 0 20px rgba(139, 92, 246, 0.35)',
} as const;

export type Shadows = typeof shadows;
