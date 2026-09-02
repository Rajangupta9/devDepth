import React from 'react';
import { colors, radius, motion } from '../theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
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
          backgroundColor: colors.primary,
          color: colors.text,
          border: '1px solid transparent',
          boxShadow: `0 0 12px ${colors.primaryGlow}`,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surfaceHover,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.textSecondary,
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          color: colors.text,
          border: '1px solid transparent',
          boxShadow: `0 0 12px ${colors.errorGlow}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.75rem' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '1rem' };
      case 'md':
      default:
        return { padding: '9px 18px', fontSize: '0.875rem' };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: radius.md,
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
