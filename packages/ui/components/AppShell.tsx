import React from 'react';
import { colors, radius, zIndex } from '../theme';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface AppShellProps {
  navItems: NavItem[];
  activeNav: string;
  onNavSelect: (id: string) => void;
  anonymousId: string;
  apiStatus: 'connected' | 'disconnected' | 'connecting';
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  navItems,
  activeNav,
  onNavSelect,
  anonymousId,
  apiStatus,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: colors.background,
        color: colors.text,
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '240px',
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: radius.md,
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#FFF',
              boxShadow: `0 0 16px ${colors.primaryGlow}`,
            }}
          >
            D
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: colors.text }}>
              DevDepth
            </div>
            <div style={{ fontSize: '0.7rem', color: colors.muted }}>Learn CS Fundamentals</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                onClick={() => onNavSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: radius.md,
                  backgroundColor: isActive ? colors.surfaceHover : 'transparent',
                  color: isActive ? colors.text : colors.muted,
                  fontWeight: isActive ? 600 : 500,
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 150ms ease',
                  borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent',
                }}
              >
                <span style={{ color: isActive ? colors.primary : colors.muted }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System & Architecture Info Badge */}
        <div style={{ padding: '16px', borderTop: `1px solid ${colors.border}`, fontSize: '0.75rem', color: colors.subtle }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Backend Engine:</span>
            <span style={{ color: colors.success, fontWeight: 600 }}>Go API (:8080)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>DB Storage:</span>
            <span style={{ color: colors.purple, fontWeight: 600 }}>PostgreSQL</span>
          </div>
        </div>
      </aside>

      {/* Main Content & Topbar Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar Header */}
        <header
          style={{
            height: '60px',
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: zIndex.sticky,
          }}
        >
          {/* Search bar / active feature title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: colors.textSecondary, textTransform: 'capitalize' }}>
              {activeNav} Engine Workspace
            </span>
          </div>

          {/* Anonymous User Profile & API Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: radius.full,
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                fontSize: '0.75rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: apiStatus === 'connected' ? colors.success : colors.warning,
                }}
              />
              <span style={{ color: colors.muted }}>
                {apiStatus === 'connected' ? 'API Online' : 'Connecting...'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: radius.md,
                backgroundColor: colors.surfaceHover,
                border: `1px solid ${colors.border}`,
                fontSize: '0.8rem',
                color: colors.text,
              }}
            >
              <span style={{ color: colors.purple, fontWeight: 600 }}>Anonymous Identity:</span>
              <span style={{ fontFamily: 'monospace', color: colors.cyan }}>{anonymousId || 'anon_guest'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Workspace Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: colors.background }}>
          {children}
        </main>
      </div>
    </div>
  );
};
