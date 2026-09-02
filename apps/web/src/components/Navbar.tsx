import React from 'react';
import { Layers, Eye, Code2, LayoutDashboard, Radio, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiStatus: 'checking' | 'connected' | 'disconnected';
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, apiStatus }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Content Engine', icon: Layers },
    { id: 'visualizer', label: 'Visual Studio', icon: Eye },
    { id: 'practice', label: 'Practice IDE', icon: Code2 },
    { id: 'api', label: 'Go API Monitor', icon: Cpu },
  ];

  return (
    <header style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(9, 11, 20, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #4338ca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Code2 size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DevDepth
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500, marginTop: '-2px' }}>
              Learn • Visualize • Practice
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary-light)' : 'var(--text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Backend API Connection Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Radio size={14} className={apiStatus === 'connected' ? 'animate-pulse-glow' : ''} color={apiStatus === 'connected' ? 'var(--accent-emerald)' : apiStatus === 'checking' ? 'var(--accent-amber)' : 'var(--accent-rose)'} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: apiStatus === 'connected' ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            Go API: {apiStatus === 'connected' ? 'Port 8080 Active' : apiStatus === 'checking' ? 'Connecting...' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
};
