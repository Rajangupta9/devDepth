import React from 'react';
import { Target, Flame, Award, ArrowRight, Play, CheckCircle, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface LearnerDashboardProps {
  onNavigate: (tab: string) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate }) => {
  const metrics = [
    { title: 'Problems Solved', value: '42', subtitle: '+4 this week', icon: CheckCircle, color: '#10b981' },
    { title: 'Accuracy Rate', value: '88%', subtitle: 'High precision', icon: Target, color: '#6366f1' },
    { title: 'Study Streak', value: '7 Days', subtitle: 'Personal best!', icon: Flame, color: '#f59e0b' },
    { title: 'Mastery Score', value: '785 XP', subtitle: 'Level 8 Engineer', icon: Award, color: '#06b6d4' },
  ];

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'var(--primary-glow)', color: 'var(--primary-light)', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
              <Sparkles size={14} /> DevDepth Learning Intelligence
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Welcome back, Developer!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px' }}>
              Your current learning path is focused on <strong>Arrays, Pointers & Networking State Handshakes</strong>. Step through state transitions visually to strengthen intuition.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('visualizer')}>
              <Play size={16} /> Open Visual Studio
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('practice')}>
              <BookOpen size={16} /> Start Practice IDE
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{m.title}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={m.color} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>{m.value}</div>
              <div style={{ fontSize: '12px', color: m.color, fontWeight: 600 }}>{m.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Active Learning Modules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Continue Learning Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Continue Learning</h3>
              <span className="badge badge-primary">Active Module</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Computer Networking Visual Lab
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 6px 0' }}>TCP 3-Way Handshake Interactive Lab</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Step through SYN, SYN+ACK, and ACK flags to visualize client-server socket initialization.
                </p>
              </div>

              <button className="btn btn-accent" onClick={() => onNavigate('visualizer')}>
                Resume <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Practice Challenge Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Daily Coding Challenge</h3>
              <span className="badge badge-easy">Easy</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Two Sum (Hash Map Pattern)</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Find two numbers in an array that add up to a specific target value in O(N) time.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => onNavigate('practice')}>
                Solve in IDE <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Weak Topics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} color="var(--accent-amber)" /> Weak Topics Alert
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-amber)', marginBottom: '4px' }}>
                  Two-Pointer Techniques
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Accuracy is 62%. We recommend stepping through Two-Pointer animations in Visual Studio.
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--primary-light)', marginBottom: '4px' }}>
                  TCP Socket State Machine
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Practice step-by-step state transitions to master network protocol handshakes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
