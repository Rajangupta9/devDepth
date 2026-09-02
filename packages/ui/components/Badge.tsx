import React from 'react';
import { radius } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'easy' | 'medium' | 'hard' | 'info' | 'purple' | 'muted' | 'primary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'muted',
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'easy':
        return {
          backgroundColor: colors.successGlow,
          color: colors.success,
          border: `1px solid ${colors.success}`,
        };
      case 'medium':
        return {
          backgroundColor: colors.warningGlow,
          color: colors.warning,
          border: `1px solid ${colors.warning}`,
        };
      case 'hard':
        return {
          backgroundColor: colors.errorGlow,
          color: colors.error,
          border: `1px solid ${colors.error}`,
        };
      case 'info':
        return {
          backgroundColor: colors.infoGlow,
          color: colors.primaryLight,
          border: `1px solid ${colors.primary}`,
        };
      case 'purple':
        return {
          backgroundColor: colors.purpleGlow,
          color: colors.purple,
          border: `1px solid ${colors.purple}`,
        };
      case 'primary':
        return {
          backgroundColor: colors.primaryGlow,
          color: colors.primaryLight,
          border: `1px solid ${colors.primary}`,
        };
      case 'muted':
      default:
        return {
          backgroundColor: colors.surfaceHover,
          color: colors.muted,
          border: `1px solid ${colors.borderSubtle}`,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 700,
    borderRadius: radius.full,
    padding: size === 'sm' ? '3px 10px' : '5px 14px',
    fontSize: size === 'sm' ? '0.68rem' : '0.75rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <span style={baseStyle} className={`devdepth-badge ${className}`} {...props}>
      {children}
    </span>
  );
};
