import React from 'react';
import { radius, shadows, motion } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'glass' | 'outline' | 'glow';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  interactive = false,
  className = '',
  style,
  ...props
}) => {
  const { mode, colors } = useTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: colors.surfaceGlass,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colors.borderSubtle}`,
          boxShadow: mode === 'light' ? '0 10px 30px -10px rgba(0, 0, 0, 0.05)' : shadows.lg,
        };
      case 'glow':
        return {
          backgroundColor: colors.surface,
          border: `1px solid ${colors.primary}`,
          boxShadow: shadows.glowPrimary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: `1px solid ${colors.borderSubtle}`,
        };
      case 'surface':
      default:
        return {
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderSubtle}`,
          boxShadow: mode === 'light' ? '0 4px 12px rgba(0, 0, 0, 0.03)' : 'none',
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: radius.lg,
    padding: '22px',
    color: colors.text,
    transition: `all ${motion.duration.fast}ms ${motion.easing.standard}`,
    cursor: interactive ? 'pointer' : 'default',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <div style={baseStyle} className={`devdepth-card ${className}`} {...props}>
      {children}
    </div>
  );
};
