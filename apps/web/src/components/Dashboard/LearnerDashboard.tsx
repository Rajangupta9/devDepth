import React from 'react';
import { Card, Button, Badge, Icon, useTheme } from '@devdepth/ui';

interface LearnerDashboardProps {
  onNavigate: (tabId: string) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ onNavigate }) => {
  const { colors } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* AlgoMaster Style Hero Section */}
      <section style={{ textAlign: 'center', padding: '32px 0 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <Badge variant="purple" style={{ padding: '6px 16px', fontSize: '0.82rem', fontWeight: 700 }}>
          ⚡ 50+ INTERACTIVE LESSONS & REAL-TIME VISUAL LABS
        </Badge>

        <h1 style={{ margin: 0, fontSize: '3.2rem', fontWeight: 900, color: colors.text, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: '900px' }}>
          Master <span style={{ background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Computer Science</span> & Software Engineering Interactively
        </h1>

        <p style={{ margin: 0, fontSize: '1.15rem', color: colors.muted, maxWidth: '720px', lineHeight: 1.6 }}>
          The modern platform to learn Data Structures, Computer Networks, Operating Systems, Databases, and System Design with pattern-based visualizers and Go API code execution.
        </p>

        {/* Hero CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Icon name="bookOpen" size={18} />}
            onClick={() => onNavigate('courses')}
            style={{ fontWeight: 800, padding: '12px 28px' }}
          >
            Explore Courses & Roadmaps
          </Button>

          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Icon name="zap" size={18} />}
            onClick={() => onNavigate('visualizer')}
            style={{ fontWeight: 800, padding: '12px 28px' }}
          >
            Launch Visual Lab Studio
          </Button>
        </div>
      </section>

      {/* Platform Core Feature Cards Grid (AlgoMaster 3-Column Layout) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
              CS Learning Roadmaps & Interactive Domains
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: colors.muted }}>
              Structured step-by-step courses designed for interview preparation and deep fundamental mastery.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={() => onNavigate('courses')}>
            View All Roadmaps →
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* DSA Card */}
          <Card variant="glass" interactive onClick={() => onNavigate('courses')} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: colors.primaryGlow, border: `1px solid ${colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="code" size={22} color={colors.primaryLight} />
              </div>
              <Badge variant="easy">Beginner to Advanced</Badge>
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: colors.text }}>
                Data Structures & Algorithms
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: colors.muted, lineHeight: 1.6 }}>
                Master Arrays, Two Pointers, Sliding Window, Trees, Graphs, and Dynamic Programming with step-by-step visual state reduction.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${colors.borderSubtle}`, fontSize: '0.8rem', color: colors.subtle }}>
              <span>2 Modules • 12 Lessons</span>
              <span style={{ color: colors.primaryLight, fontWeight: 700 }}>Start Learning →</span>
            </div>
          </Card>

          {/* Computer Networks Card */}
          <Card variant="glass" interactive onClick={() => onNavigate('courses')} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: colors.primaryGlow, border: `1px solid ${colors.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="wifi" size={22} color={colors.cyan} />
              </div>
              <Badge variant="info">Interactive Wire Lab</Badge>
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: colors.text }}>
                Computer Networks Visual Lab
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: colors.muted, lineHeight: 1.6 }}>
                Interactive step-by-step packet inspection of TCP 3-Way Handshake, HTTP/1.1 vs HTTP/2 multiplexing, and TLS 1.3 encryption.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${colors.borderSubtle}`, fontSize: '0.8rem', color: colors.subtle }}>
              <span>2 Modules • 8 Lessons</span>
              <span style={{ color: colors.cyan, fontWeight: 700 }}>Start Learning →</span>
            </div>
          </Card>

          {/* Operating Systems Card */}
          <Card variant="glass" interactive onClick={() => onNavigate('courses')} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="cpu" size={22} color="#F59E0B" />
              </div>
              <Badge variant="medium">Kernel & System</Badge>
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: colors.text }}>
                Operating Systems Kernel Internals
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: colors.muted, lineHeight: 1.6 }}>
                Explore Process Scheduling (Round Robin, SJF), Virtual Memory Paging, Mutex Lock synchronization, and Deadlock detection.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${colors.borderSubtle}`, fontSize: '0.8rem', color: colors.subtle }}>
              <span>1 Module • 6 Lessons</span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>Start Learning →</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Practice & Visualizer Shortcuts Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card variant="surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="terminal" size={24} color={colors.primaryLight} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: colors.text }}>
                Interactive Practice IDE
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: colors.muted }}>
                Solve coding problems with instant Go API execution and progressive hints.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="primary" size="sm" onClick={() => onNavigate('practice')}>
              Open Practice IDE
            </Button>
          </div>
        </Card>

        <Card variant="surface" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="user" size={24} color={colors.purple} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: colors.text }}>
                Personal CS Notes & Profile
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: colors.muted }}>
                Write, organize, and sync your personal lesson notes with PostgreSQL via pgkit.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('notes')}>
              View My CS Notes
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};
