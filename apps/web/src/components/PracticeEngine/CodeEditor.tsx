import React, { useState, useEffect } from 'react';
import { Problem, RunResult, Submission } from '../../types';
import { DevDepthAPI } from '../../api/client';
import { Code2, Play, Send, CheckCircle2, XCircle, Lightbulb, Clock, Cpu, FileCode } from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('[2, 7, 11, 15], target = 9');
  
  // Results
  const [running, setRunning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);

  useEffect(() => {
    async function loadProblems() {
      const res = await DevDepthAPI.getProblems();
      if (res.success && res.data && res.data.length > 0) {
        setProblems(res.data);
        setSelectedProblem(res.data[0]);
      }
    }
    loadProblems();
  }, []);

  useEffect(() => {
    if (selectedProblem) {
      if (language === 'javascript') {
        setCode(`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`);
      } else if (language === 'python') {
        setCode(`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))`);
      }
    }
  }, [selectedProblem, language]);

  const handleRunCode = async () => {
    setRunning(true);
    setRunResult(null);
    setSubmission(null);
    const res = await DevDepthAPI.runCode(language, code, customInput);
    if (res.success && res.data) {
      setRunResult(res.data);
    } else {
      setRunResult({
        stdout: '',
        stderr: res.error || 'Failed to execute code',
        runtime_ms: 0,
        memory_kb: 0,
        exit_code: 1,
      });
    }
    setRunning(false);
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    setSubmitting(true);
    setRunResult(null);
    setSubmission(null);
    const res = await DevDepthAPI.submitCode(selectedProblem.slug, language, code);
    if (res.success && res.data) {
      setSubmission(res.data);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'var(--primary-glow)', color: 'var(--primary-light)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
            <Code2 size={14} /> DevDepth Practice Engine
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>In-Browser Coding Workspace</h1>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '14px', fontWeight: 600 }}
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="go">Go 1.25</option>
            <option value="cpp">C++ 20</option>
          </select>

          <button className="btn btn-secondary" onClick={handleRunCode} disabled={running}>
            <Play size={16} /> {running ? 'Running...' : 'Run Test Cases'}
          </button>

          <button className="btn btn-accent" onClick={handleSubmitCode} disabled={submitting}>
            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Code'}
          </button>
        </div>
      </div>

      {/* Editor Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        {/* Left Column: Problem Specification */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {selectedProblem ? (
            <>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-easy">{selectedProblem.difficulty}</span>
                  <span className="badge badge-primary">{selectedProblem.topic}</span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>{selectedProblem.title}</h2>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {selectedProblem.statement}
                </div>
              </div>

              {/* Sample Test Cases */}
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: 'var(--accent-cyan)' }}>
                  Visible Test Cases
                </div>
                {selectedProblem.test_cases.filter((tc) => !tc.is_hidden).map((tc, idx) => (
                  <div key={idx} style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', marginBottom: '8px' }}>
                    <div>Input: <span style={{ color: 'var(--primary-light)' }}>{tc.input}</span></div>
                    <div>Expected: <span style={{ color: 'var(--accent-emerald)' }}>{tc.expected}</span></div>
                  </div>
                ))}
              </div>

              {/* Progressive Hints */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={16} color="var(--accent-amber)" /> Progressive Hints
                  </span>
                  {activeHintIndex < selectedProblem.hints.length - 1 && (
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setActiveHintIndex((prev) => prev + 1)}>
                      Reveal Hint {activeHintIndex + 2}
                    </button>
                  )}
                </div>

                {activeHintIndex >= 0 ? (
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--accent-amber)' }}>
                    {selectedProblem.hints[activeHintIndex]}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                    Need a hint? Click above to reveal progressive intuition steps.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>Loading problem specification...</div>
          )}
        </div>

        {/* Right Column: Code Editor & Execution Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Code Textarea / Editor */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode size={14} /> main.{language === 'python' ? 'py' : language === 'go' ? 'go' : 'js'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                DevDepth Go Sandbox Connected
              </span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              style={{
                width: '100%',
                background: '#090b14',
                color: '#f8fafc',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Test Execution Output Box */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--primary-light)" /> Execution Output & Test Results
            </div>

            {runResult && (
              <div style={{ background: '#090b14', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '12px' }}>
                  <span>Runtime: <strong style={{ color: '#fff' }}>{runResult.runtime_ms} ms</strong></span>
                  <span>Memory: <strong style={{ color: '#fff' }}>{runResult.memory_kb} KB</strong></span>
                  <span>Status: <strong style={{ color: runResult.exit_code === 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{runResult.exit_code === 0 ? 'SUCCESS' : 'ERROR'}</strong></span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: runResult.exit_code === 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {runResult.stdout || runResult.stderr || 'Execution completed cleanly.'}
                </div>
              </div>
            )}

            {submission && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--accent-emerald)' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={22} /> {submission.status}
                </div>
                <div style={{ fontSize: '13px' }}>
                  Passed {submission.passed_tests} / {submission.total_tests} test cases in {submission.runtime_ms} ms!
                </div>
              </div>
            )}

            {!runResult && !submission && (
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px 0' }}>
                Click "Run Test Cases" to test your solution against visible tests, or "Submit Code" to grade against hidden test suite.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
