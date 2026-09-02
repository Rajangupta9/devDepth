import React from 'react';
import { colors, radius } from '../theme';

export interface ProgressProps {
  value: number; // 0 to 100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = colors.primary,
  height = 8,
  showLabel = false,
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', color: colors.muted }}>
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: colors.surfaceHover,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: radius.full,
            transition: 'width 300ms ease-in-out',
            boxShadow: `0 0 10px ${color}80`,
          }}
        />
      </div>
    </div>
  );
};
