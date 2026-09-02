import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';
import { motion } from './motion';
import { breakpoints } from './breakpoints';
import { zIndex } from './zIndex';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  breakpoints,
  zIndex,
} as const;

export type Theme = typeof theme;
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadows';
export * from './motion';
export * from './breakpoints';
export * from './zIndex';
export * from './ThemeContext';
