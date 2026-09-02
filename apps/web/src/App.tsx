import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LearnerDashboard } from './components/Dashboard/LearnerDashboard';
import { CourseHub } from './components/ContentEngine/CourseHub';
import { ArrayVisualizer } from './components/VisualEngine/ArrayVisualizer';
import { TCPVisualizer } from './components/VisualEngine/TCPVisualizer';
import { CodeEditor } from './components/PracticeEngine/CodeEditor';
import { APIMonitor } from './components/APIMonitor';
import { DevDepthAPI } from './api/client';
import { Eye, Network } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [visualMode, setVisualMode] = useState<'array' | 'tcp'>('array');

  useEffect(() => {
    async function checkBackend() {
      setApiStatus('checking');
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} apiStatus={apiStatus} />

      {/* Main View Renderer */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <LearnerDashboard onNavigate={setActiveTab} />}
        {activeTab === 'courses' && <CourseHub onSelectLesson={() => setActiveTab('visualizer')} />}

        {activeTab === 'visualizer' && (
          <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Visualizer Mode Switcher */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                className={`btn ${visualMode === 'array' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setVisualMode('array')}
              >
                <Eye size={16} /> Binary Search Array Visualizer (DSA)
              </button>
              <button
                className={`btn ${visualMode === 'tcp' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setVisualMode('tcp')}
              >
                <Network size={16} /> TCP 3-Way Handshake (Networking Lab)
              </button>
            </div>

            {visualMode === 'array' ? <ArrayVisualizer /> : <TCPVisualizer />}
          </div>
        )}

        {activeTab === 'practice' && <CodeEditor />}
        {activeTab === 'api' && <APIMonitor />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px', background: 'rgba(9, 11, 20, 0.9)' }}>
        DevDepth Platform • Learn, Visualize & Practice CS Fundamentals • Powered by Go Backend & <code>github.com/Rajangupta9/gopkg</code>
      </footer>
    </div>
  );
}

export default App;
