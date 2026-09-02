import React from 'react';
import { colors, radius, shadows, motion } from '../theme';

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
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: colors.surfaceGlass,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${colors.border}`,
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
          border: `1px solid ${colors.border}`,
        };
      case 'surface':
      default:
        return {
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: radius.lg,
    padding: '20px',
    color: colors.text,
    transition: interactive ? `transform ${motion.duration.fast}ms ${motion.easing.standard}, border-color ${motion.duration.fast}ms ${motion.easing.standard}` : 'none',
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
