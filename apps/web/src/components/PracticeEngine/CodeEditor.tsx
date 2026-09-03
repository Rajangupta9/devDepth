import React, { useState, useEffect } from 'react';
import { Problem, RunResult, Submission } from '../../types';
import { DevDepthAPI } from '../../api/client';
import { Card, Button, Badge, Icon, radius, useTheme } from '@devdepth/ui';

export const CodeEditor: React.FC = () => {
  const { mode, colors } = useTheme();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [customInput] = useState<string>('[2, 7, 11, 15], target = 9');
  
  // Results
  const [running, setRunning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);

  const isDark = mode === 'dark';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Problem Selector & Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Badge variant="purple">Interactive Practice IDE</Badge>
              <Badge variant="easy">Go API Execution</Badge>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
              AlgoMaster Problem Suite
            </h2>
          </div>

          {/* Select Problem Dropdown */}
          <select
            value={selectedProblem?.slug || ''}
            onChange={(e) => {
              const p = problems.find((item) => item.slug === e.target.value);
              if (p) setSelectedProblem(p);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: radius.full,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.text,
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none',
            }}
          >
            {problems.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.title} ({p.difficulty.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Language Selector & Run/Submit Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: radius.full,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.text,
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
            }}
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="go">Go 1.25</option>
            <option value="cpp">C++ 20</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            isLoading={running}
            leftIcon={<Icon name="play" size={15} />}
            onClick={handleRunCode}
          >
            Run Test Cases
          </Button>

          <Button
            variant="primary"
            size="sm"
            isLoading={submitting}
            leftIcon={<Icon name="check" size={15} />}
            onClick={handleSubmitCode}
          >
            Submit Code
          </Button>
        </div>
      </div>

      {/* Editor Split Grid (Left Problem Spec, Right Editor & Console) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '24px' }}>
        {/* Left Column: Problem Specification */}
        <Card variant="glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {selectedProblem ? (
            <>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Badge variant={selectedProblem.difficulty === 'easy' ? 'easy' : 'medium'}>
                    {selectedProblem.difficulty.toUpperCase()}
                  </Badge>
                  <Badge variant="primary">{selectedProblem.topic.toUpperCase()}</Badge>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
                  {selectedProblem.title}
                </h3>

                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: colors.text, lineHeight: 1.6 }}>
                  {selectedProblem.statement}
                </p>
              </div>

              {/* Sample Test Cases */}
              <div style={{ backgroundColor: colors.background, padding: '16px', borderRadius: radius.md, border: `1px solid ${colors.borderSubtle}` }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px', color: colors.cyan, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="checkCircle" size={14} /> Visible Test Cases
                </div>
                {selectedProblem.test_cases.filter((tc) => !tc.is_hidden).map((tc, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', fontFamily: 'monospace', backgroundColor: colors.surface, padding: '8px 12px', borderRadius: radius.sm, marginBottom: '8px', border: `1px solid ${colors.borderSubtle}` }}>
                    <div>Input: <span style={{ color: colors.primaryLight }}>{tc.input}</span></div>
                    <div>Expected: <span style={{ color: colors.success }}>{tc.expected}</span></div>
                  </div>
                ))}
              </div>

              {/* Progressive Hints */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: colors.text }}>
                    <Icon name="sparkles" size={16} color="#F59E0B" /> Progressive Hints
                  </span>
                  {activeHintIndex < selectedProblem.hints.length - 1 && (
                    <Button variant="secondary" size="sm" onClick={() => setActiveHintIndex((prev) => prev + 1)}>
                      Reveal Hint {activeHintIndex + 2}
                    </Button>
                  )}
                </div>

                {activeHintIndex >= 0 ? (
                  <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', padding: '12px 16px', borderRadius: radius.md, fontSize: '0.85rem', color: colors.text }}>
                    {selectedProblem.hints[activeHintIndex]}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: colors.subtle }}>
                    Need intuition? Click above to reveal progressive hints.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ color: colors.muted }}>Loading problem specification...</div>
          )}
        </Card>

        {/* Right Column: Code Editor & Execution Output Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Code Textarea / Editor Card */}
          <Card variant="surface" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: colors.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="fileCode" size={14} /> main.{language === 'python' ? 'py' : language === 'go' ? 'go' : 'js'}
              </span>
              <span style={{ fontSize: '0.72rem', color: colors.success, fontWeight: 700 }}>
                DevDepth Go Sandbox Connected
              </span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              style={{
                width: '100%',
                backgroundColor: colors.background,
                color: colors.text,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                padding: '16px',
                borderRadius: radius.md,
                border: `1px solid ${colors.borderSubtle}`,
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </Card>

          {/* Test Execution Output Box */}
          <Card variant="surface" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: colors.text }}>
              <Icon name="terminal" size={16} color={colors.primaryLight} /> Execution Output & Test Results
            </div>

            {runResult && (
              <div style={{ backgroundColor: colors.background, padding: '14px', borderRadius: radius.md, border: `1px solid ${colors.borderSubtle}`, fontFamily: 'monospace', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', color: colors.muted, fontSize: '0.75rem' }}>
                  <span>Runtime: <strong style={{ color: colors.text }}>{runResult.runtime_ms} ms</strong></span>
                  <span>Memory: <strong style={{ color: colors.text }}>{runResult.memory_kb} KB</strong></span>
                  <span>Status: <strong style={{ color: runResult.exit_code === 0 ? colors.success : colors.error }}>{runResult.exit_code === 0 ? 'SUCCESS' : 'ERROR'}</strong></span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: runResult.exit_code === 0 ? colors.success : colors.error }}>
                  {runResult.stdout || runResult.stderr || 'Execution completed cleanly.'}
                </div>
              </div>
            )}

            {submission && (
              <div style={{ backgroundColor: colors.primaryGlow, border: `1px solid ${colors.success}`, padding: '16px', borderRadius: radius.md, color: colors.success }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="checkCircle" size={20} color={colors.success} /> {submission.status}
                </div>
                <div style={{ fontSize: '0.85rem' }}>
                  Passed {submission.passed_tests} / {submission.total_tests} test cases in {submission.runtime_ms} ms!
                </div>
              </div>
            )}

            {!runResult && !submission && (
              <div style={{ fontSize: '0.8rem', color: colors.subtle, textAlign: 'center', padding: '16px 0' }}>
                Click "Run Test Cases" to test your solution against visible tests, or "Submit Code" to grade against hidden test suite.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
