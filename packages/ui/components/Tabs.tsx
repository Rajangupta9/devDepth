import React from 'react';
import { radius, motion } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: '4px',
        backgroundColor: colors.background,
        padding: '4px',
        borderRadius: radius.full,
        border: `1px solid ${colors.borderSubtle}`,
      }}
      className={`devdepth-tabs ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 18px',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 500,
              borderRadius: radius.full,
              color: isActive ? colors.text : colors.muted,
              backgroundColor: isActive ? colors.primaryGlow : 'transparent',
              border: isActive ? `1px solid ${colors.primary}` : '1px solid transparent',
              cursor: 'pointer',
              transition: `all ${motion.duration.fast}ms ${motion.easing.standard}`,
              boxShadow: isActive ? `0 4px 12px ${colors.primaryGlow}` : 'none',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
