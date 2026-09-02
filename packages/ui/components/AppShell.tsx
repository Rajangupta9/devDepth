import React, { useState } from 'react';
import { radius, zIndex, shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { AuthModal } from './AuthModal';
import { Button } from './Button';
import { Icon } from '../icons';

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
  user?: { email: string; name?: string } | null;
  onAuthSuccess?: (user: { email: string; name?: string }) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  navItems,
  activeNav,
  onNavSelect,
  anonymousId,
  apiStatus,
  user,
  onAuthSuccess,
  children,
}) => {
  const { mode, colors, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isDark = mode === 'dark';

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
        position: 'relative',
        transition: 'background-color 250ms ease, color 250ms ease',
      }}
    >
      {/* Outer Blueprint Layout Container */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '16px',
          gap: '16px',
        }}
      >
        {/* Floating Sidebar Navigation Sheet */}
        <aside
          style={{
            width: '260px',
            backgroundColor: colors.surfaceGlass,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius['2xl'],
            boxShadow: shadows.xl,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'all 250ms ease',
          }}
        >
          {/* Brand Header */}
          <div
            style={{
              padding: '24px 20px',
              borderBottom: `1px solid ${colors.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: radius.md,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.indigo})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                boxShadow: shadows.glowPrimary,
              }}
            >
              <Icon name="sparkles" size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
                DevDepth
              </div>
              <div style={{ fontSize: '0.72rem', color: colors.muted, fontWeight: 500 }}>
                Learn • Visualize • Practice
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    padding: '11px 16px',
                    borderRadius: radius.full,
                    backgroundColor: isActive ? colors.primaryGlow : 'transparent',
                    color: isActive ? colors.text : colors.muted,
                    fontWeight: isActive ? 600 : 500,
                    border: isActive ? `1px solid ${colors.primary}` : '1px solid transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive ? `0 4px 14px ${colors.primaryGlow}` : 'none',
                  }}
                >
                  <span style={{ display: 'inline-flex', color: isActive ? colors.primaryLight : colors.muted }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Infrastructure Health Card */}
          <div
            style={{
              padding: '16px',
              margin: '12px',
              backgroundColor: colors.background,
              borderRadius: radius.lg,
              border: `1px solid ${colors.borderSubtle}`,
              fontSize: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: colors.muted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="server" size={14} color={colors.muted} /> Go API
              </span>
              <span style={{ color: colors.success, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.success }} />
                :8080 Active
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: colors.muted, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="database" size={14} color={colors.muted} /> PostgreSQL DB
              </span>
              <span style={{ color: colors.purple, fontWeight: 700 }}>pgkit Engine</span>
            </div>
          </div>
        </aside>

        {/* Floating Main Workspace Sheet Container */}
        <div
          style={{
            flex: 1,
            backgroundColor: colors.surfaceGlass,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius['2xl'],
            boxShadow: shadows.xl,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 250ms ease',
          }}
        >
          {/* Topbar Header Bar */}
          <header
            style={{
              height: '64px',
              borderBottom: `1px solid ${colors.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 24px',
              zIndex: zIndex.sticky,
            }}
          >
            {/* Search Pill Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: radius.full,
                padding: '8px 18px',
                width: '360px',
              }}
            >
              <Icon name="search" size={16} color={colors.muted} />
              <input
                type="text"
                placeholder="Search CS concepts, algorithms, labs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: colors.text,
                  fontSize: '0.85rem',
                  width: '100%',
                }}
              />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: colors.surfaceHover,
                  color: colors.muted,
                  padding: '2px 6px',
                  borderRadius: radius.xs,
                  fontFamily: 'monospace',
                }}
              >
                ⌘K
              </span>
            </div>

            {/* Right Status, Theme Toggle & User Auth Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Theme Toggle Button (Light/Dark Switch) */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  borderRadius: radius.full,
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderSubtle}`,
                  color: colors.text,
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  transition: 'all 200ms ease',
                }}
              >
                <Icon name={isDark ? 'sun' : 'moon'} size={15} color={isDark ? '#F59E0B' : colors.primaryLight} />
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>

              {/* API Online Status Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: radius.full,
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderSubtle}`,
                  fontSize: '0.78rem',
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
                <span style={{ color: colors.muted, fontWeight: 500 }}>
                  {apiStatus === 'connected' ? 'API Online' : 'Connecting...'}
                </span>
              </div>

              {/* Account / Auth Button or User Badge */}
              {user ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 16px',
                    borderRadius: radius.full,
                    background: `linear-gradient(135deg, ${colors.primaryGlow}, ${colors.indigoGlow})`,
                    border: `1px solid ${colors.primary}`,
                    fontSize: '0.8rem',
                    color: colors.text,
                    fontWeight: 700,
                  }}
                >
                  <Icon name="user" size={15} color={colors.primaryLight} />
                  <span>{user.name || user.email.split('@')[0]}</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{ fontWeight: 700, padding: '7px 18px' }}
                >
                  Sign In / Register
                </Button>
              )}
            </div>
          </header>

          {/* Main Dynamic Content Workspace */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '28px', backgroundColor: colors.canvas }}>
            {children}
          </main>
        </div>
      </div>

      {/* Auth Modal (Split-Card VOICE AURA Style) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          if (onAuthSuccess) onAuthSuccess(loggedUser);
        }}
      />
    </div>
  );
};
