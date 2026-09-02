import React, { useEffect, useState } from 'react';
import { DevDepthAPI } from '../api/client';
import { Cpu, CheckCircle2, XCircle, RefreshCw, Shield } from 'lucide-react';
import { useTheme } from '@devdepth/ui';

export const APIMonitor: React.FC = () => {
  const { colors } = useTheme();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [latency, setLatency] = useState<number | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    const start = performance.now();
    const res = await DevDepthAPI.getHealth();
    const duration = Math.round(performance.now() - start);
    setLatency(duration);
    if (res.success && res.data) {
      setHealth(res.data);
    } else {
      setHealth(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const packagesUsed = [
    { name: 'github.com/Rajangupta9/gopkg/pkg/http', desc: 'Chi Mux Router Specs & Standardized JSON Responses' },
    { name: 'github.com/Rajangupta9/gopkg/pkg/middleware', desc: 'Logging, Panic Recovery & CORS Middleware' },
    { name: 'github.com/Rajangupta9/gopkg/pkg/utils/logger', desc: 'Context-Aware Structured Zap Logger' },
    { name: 'github.com/Rajangupta9/gopkg/pkg/utils/validation', desc: 'Struct & Email Payload Field Validation' },
    { name: 'github.com/Rajangupta9/gopkg/pkg/utils/errors', desc: 'Typed AppError Domain Exceptions' },
    { name: 'github.com/Rajangupta9/gopkg/pkg/database', desc: 'PostgreSQL & pgkit Database Connection Manager' },
  ];

  return (
    <div style={{ padding: '8px 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: colors.primaryGlow, color: colors.primaryLight, fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
            <Cpu size={14} /> Backend Integration Monitor
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: colors.text }}>Go API & `gopkg` Health Console</h1>
        </div>

        <button className="btn btn-primary" onClick={checkHealth} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Health
        </button>
      </div>

      {/* Live Health Status Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {health ? (
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: colors.successGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={28} color={colors.success} />
              </div>
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: colors.errorGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={28} color={colors.error} />
              </div>
            )}

            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: colors.text }}>
                {health ? 'Go API Backend Online & Healthy' : 'API Connection Offline'}
              </div>
              <div style={{ fontSize: '14px', color: colors.muted }}>
                Target: <code>http://localhost:8080/health</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: colors.subtle, fontWeight: 600 }}>API Latency</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: colors.success }}>{latency !== null ? `${latency} ms` : '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: colors.subtle, fontWeight: 600 }}>Active Port</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: colors.primaryLight }}>8080</div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated gopkg Packages Overview */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: colors.text }}>
          <Shield size={20} color={colors.primaryLight} /> Integrated `github.com/Rajangupta9/gopkg` Library Modules
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {packagesUsed.map((pkg, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: colors.primaryLight, fontWeight: 700, marginBottom: '6px' }}>
                {pkg.name}
              </div>
              <div style={{ fontSize: '13px', color: colors.muted }}>
                {pkg.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
