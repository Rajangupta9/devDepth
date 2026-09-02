import React from 'react';
import { colors, radius, motion } from '../theme';

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
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: '4px',
        backgroundColor: colors.background,
        padding: '4px',
        borderRadius: radius.lg,
        border: `1px solid ${colors.border}`,
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
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              borderRadius: radius.md,
              color: isActive ? colors.text : colors.muted,
              backgroundColor: isActive ? colors.surfaceHover : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: `all ${motion.duration.fast}ms ${motion.easing.standard}`,
              boxShadow: isActive ? `0 1px 3px rgba(0,0,0,0.3)` : 'none',
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
