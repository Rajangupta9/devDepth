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
  onLogout?: () => void;
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
  onLogout,
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
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: colors.background,
        color: colors.text,
        overflowX: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'background-color 250ms ease, color 250ms ease',
      }}
    >
      {/* Top Navbar Navigation Bar (AlgoMaster Style) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: zIndex.sticky,
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${colors.borderSubtle}`,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
        }}
      >
        {/* Left: Brand Logo & Tagline */}
        <div
          onClick={() => onNavSelect('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: radius.sm,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.indigo})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: shadows.glowPrimary,
            }}
          >
            <Icon name="sparkles" size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em', color: colors.text, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              DevDepth <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: radius.xs, background: colors.primaryGlow, color: colors.primaryLight, fontWeight: 700 }}>PRO</span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Pills */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', background: colors.surface, padding: '4px', borderRadius: radius.md, border: `1px solid ${colors.borderSubtle}` }}>
          {navItems.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                onClick={() => onNavSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  borderRadius: radius.sm,
                  backgroundColor: isActive ? colors.primaryGlow : 'transparent',
                  color: isActive ? colors.primaryLight : colors.muted,
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? `1px solid ${colors.primary}` : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 200ms ease',
                }}
              >
                <span style={{ display: 'inline-flex', color: isActive ? colors.primaryLight : colors.muted }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Theme Toggle, User Profile / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Bar Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: radius.sm,
              padding: '6px 14px',
              width: '220px',
            }}
          >
            <Icon name="search" size={14} color={colors.muted} />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: colors.text,
                fontSize: '0.8rem',
                width: '100%',
              }}
            />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: colors.muted, fontFamily: 'monospace' }}>⌘K</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: radius.sm,
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.text,
              cursor: 'pointer',
            }}
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={16} color={isDark ? '#F59E0B' : colors.primaryLight} />
          </button>

          {/* User Auth Controls */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                onClick={() => onNavSelect('notes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: radius.sm,
                  background: `linear-gradient(135deg, ${colors.primaryGlow}, ${colors.indigoGlow})`,
                  border: `1px solid ${colors.primary}`,
                  fontSize: '0.8rem',
                  color: colors.text,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Icon name="user" size={15} color={colors.primaryLight} />
                <span>{user.name || user.email.split('@')[0]}</span>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={onLogout}
                style={{ fontWeight: 700, padding: '6px 12px', borderRadius: radius.sm }}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAuthModalOpen(true)}
              style={{ fontWeight: 700, padding: '7px 18px', borderRadius: radius.sm }}
            >
              Sign In / Register
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Workspace Container (AlgoMaster Max Width) */}
      <main style={{ flex: 1, padding: '32px 28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>

      {/* Footer Bar */}
      <footer
        style={{
          borderTop: `1px solid ${colors.borderSubtle}`,
          backgroundColor: colors.surface,
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: colors.muted,
        }}
      >
        <div>
          © 2026 DevDepth. Built with Go (<code>pgkit</code> + <code>gopkg</code>) & React.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>API Status: <strong style={{ color: apiStatus === 'connected' ? colors.success : colors.warning }}>{apiStatus}</strong></span>
          <span>PostgreSQL: <strong style={{ color: colors.purple }}>pgkit/db</strong></span>
        </div>
      </footer>

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
