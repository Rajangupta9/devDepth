import React from 'react';
import { colors, radius } from '../theme';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'easy' | 'medium' | 'hard' | 'info' | 'purple' | 'muted';
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
          color: colors.info,
          border: `1px solid ${colors.info}`,
        };
      case 'purple':
        return {
          backgroundColor: colors.purpleGlow,
          color: colors.purple,
          border: `1px solid ${colors.purple}`,
        };
      case 'muted':
      default:
        return {
          backgroundColor: colors.surfaceHover,
          color: colors.muted,
          border: `1px solid ${colors.border}`,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 600,
    borderRadius: radius.full,
    padding: size === 'sm' ? '2px 8px' : '4px 12px',
    fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
    letterSpacing: '0.025em',
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
