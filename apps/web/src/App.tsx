import React, { useState, useEffect } from 'react';
import { AppShell, NavItem } from '@devdepth/ui';
import { useAnonymousUser } from '@/features/user/useAnonymousUser';
import { VisualizerStudio } from '@/features/visualizer/VisualizerStudio';
import { LearnerDashboard } from './components/Dashboard/LearnerDashboard';
import { CourseHub } from './components/ContentEngine/CourseHub';
import { CodeEditor } from './components/PracticeEngine/CodeEditor';
import { APIMonitor } from './components/APIMonitor';
import { DevDepthAPI } from './api/client';

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'courses', label: 'Learn & Courses', icon: '📚' },
  { id: 'visualizer', label: 'Visual Lab Studio', icon: '⚡' },
  { id: 'practice', label: 'Practice IDE', icon: '💻' },
  { id: 'api', label: 'Go API Monitor', icon: '🔌' },
];

export function App() {
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
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
    >
      {activeNav === 'dashboard' && <LearnerDashboard onNavigate={setActiveNav} />}
      {activeNav === 'courses' && <CourseHub onSelectLesson={() => setActiveNav('visualizer')} />}
      {activeNav === 'visualizer' && <VisualizerStudio />}
      {activeNav === 'practice' && <CodeEditor />}
      {activeNav === 'api' && <APIMonitor />}
    </AppShell>
  );
}

export default App;
