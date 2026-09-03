import React, { useState, useEffect } from 'react';
import { AppShell, NavItem, ThemeProvider, Icon } from '@devdepth/ui';
import { useAnonymousUser } from '@/features/user/useAnonymousUser';
import { VisualizerStudio } from '@/features/visualizer/VisualizerStudio';
import { LearnerDashboard } from './components/Dashboard/LearnerDashboard';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { CourseHub } from './components/ContentEngine/CourseHub';
import { CodeEditor } from './components/PracticeEngine/CodeEditor';
import { APIMonitor } from './components/APIMonitor';
import { DevDepthAPI } from './api/client';

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Icon name="barChart" size={18} /> },
  { id: 'courses', label: 'Learn & Courses', icon: <Icon name="bookOpen" size={18} /> },
  { id: 'visualizer', label: 'Visual Lab Studio', icon: <Icon name="zap" size={18} /> },
  { id: 'practice', label: 'Practice IDE', icon: <Icon name="terminal" size={18} /> },
  { id: 'notes', label: 'User Notes & Profile', icon: <Icon name="user" size={18} /> },
  { id: 'api', label: 'Go API Monitor', icon: <Icon name="server" size={18} /> },
];

export function AppContent() {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const { anonymousId } = useAnonymousUser();

  useEffect(() => {
    async function checkBackend() {
      setApiStatus('connecting');
      const res = await DevDepthAPI.getHealth();
      if (res.success) {
        setApiStatus('connected');
      } else {
        setApiStatus('disconnected');
      }
    }
    checkBackend();
  }, []);

  return (
    <AppShell
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavSelect={setActiveNav}
      anonymousId={anonymousId}
      apiStatus={apiStatus}
      user={user}
      onAuthSuccess={(loggedUser) => setUser(loggedUser)}
    >
      {activeNav === 'dashboard' && <LearnerDashboard onNavigate={setActiveNav} />}
      {activeNav === 'courses' && <CourseHub onSelectLesson={() => setActiveNav('visualizer')} />}
      {activeNav === 'visualizer' && <VisualizerStudio />}
      {activeNav === 'practice' && <CodeEditor />}
      {activeNav === 'notes' && <UserDashboard />}
      {activeNav === 'api' && <APIMonitor />}
    </AppShell>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
