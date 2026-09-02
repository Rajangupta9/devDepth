import React from 'react';
import { radius, typography } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export interface CodeBlockProps {
  code: string;
  language?: string;
  activeLine?: number;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  activeLine,
}) => {
  const { colors } = useTheme();
  const lines = code.trim().split('\n');

  return (
    <div
      style={{
        backgroundColor: colors.codeBg,
        borderRadius: radius.md,
        border: `1px solid ${colors.borderSubtle}`,
        fontFamily: typography.fontFamily.mono,
        fontSize: '0.85rem',
        lineHeight: 1.6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          fontSize: '0.75rem',
          color: colors.muted,
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        <span>{language.toUpperCase()}</span>
      </div>
      <div style={{ padding: '12px 0', overflowX: 'auto' }}>
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLine;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                padding: '0 16px',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent',
              }}
            >
              <span
                style={{
                  width: '32px',
                  color: isActive ? colors.primaryLight : colors.subtle,
                  userSelect: 'none',
                  flexShrink: 0,
                  fontSize: '0.75rem',
                }}
              >
                {lineNum}
              </span>
              <span style={{ color: colors.textSecondary, whiteSpace: 'pre' }}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
