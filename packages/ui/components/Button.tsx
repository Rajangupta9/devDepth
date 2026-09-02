import React from 'react';
import { colors, radius, motion, shadows } from '../theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: shadows.glowPrimary,
        };
      case 'accent':
        return {
          background: `linear-gradient(135deg, ${colors.indigo}, #4F46E5)`,
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: shadows.glowPurple,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surfaceHover,
          color: colors.text,
          border: `1px solid ${colors.borderSubtle}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.textSecondary,
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          background: `linear-gradient(135deg, ${colors.error}, #DC2626)`,
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: `0 0 16px ${colors.errorGlow}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primaryLight,
          border: `1px solid ${colors.primary}`,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 14px', fontSize: '0.78rem' };
      case 'lg':
        return { padding: '12px 28px', fontSize: '1rem' };
      case 'md':
      default:
        return { padding: '9px 20px', fontSize: '0.875rem' };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: radius.full,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: `all ${motion.duration.fast}ms ${motion.easing.standard}`,
    outline: 'none',
    userSelect: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={baseStyle}
      className={`devdepth-button ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : leftIcon ? (
        <span>{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading ? <span>{rightIcon}</span> : null}
    </button>
  );
};
