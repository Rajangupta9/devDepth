import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Eye, Code, Sliders } from 'lucide-react';

export const ArrayVisualizer: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
  const [target, setTarget] = useState<number>(23);
  const [array, setArray] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);

  // Visualizer Timeline State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(800);

  // Binary Search State Machine Timeline Steps
  const steps = [
    { left: 0, right: 9, mid: 4, val: 16, msg: 'Initial pointers: left = 0, right = 9. Calculate mid = 4 (value: 16).', highlightLine: 3 },
    { left: 0, right: 9, mid: 4, val: 16, msg: 'Compare: 16 < 23 (target). Target is in the right half. Update left = mid + 1 (5).', highlightLine: 5 },
    { left: 5, right: 9, mid: 7, val: 56, msg: 'Recalculate mid = (5 + 9) / 2 = 7 (value: 56).', highlightLine: 3 },
    { left: 5, right: 9, mid: 7, val: 56, msg: 'Compare: 56 > 23 (target). Target is in the left half. Update right = mid - 1 (6).', highlightLine: 7 },
    { left: 5, right: 6, mid: 5, val: 23, msg: 'Recalculate mid = (5 + 6) / 2 = 5 (value: 23).', highlightLine: 3 },
    { left: 5, right: 6, mid: 5, val: 23, msg: 'MATCH FOUND! Element 23 found at index 5.', highlightLine: 9, found: true },
  ];

  const stepData = steps[currentStep];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const handleUpdateArray = () => {
    const nums = arrayInput.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    if (nums.length > 0) {
      setArray(nums);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'var(--primary-glow)', color: 'var(--primary-light)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
            <Eye size={14} /> DevDepth Visual Engine
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Binary Search Algorithm Visualizer</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Inspect pointer arithmetic, array elements, and code highlights in step-by-step timeline mode.
          </p>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => { setCurrentStep(0); setIsPlaying(false); }}>
            <RotateCcw size={16} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))} disabled={currentStep === 0}>
            <SkipBack size={16} />
          </button>
          <button className="btn btn-primary" style={{ padding: '6px 16px' }} onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))} disabled={currentStep === steps.length - 1}>
            <SkipForward size={16} />
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '28px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Array:</span>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            style={{ flex: 1, padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Target:</span>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value, 10))}
            style={{ width: '80px', padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '14px' }}
          />
        </div>
        <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={handleUpdateArray}>
          Update Array
        </button>
      </div>

      {/* Visual Array Render Grid */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '36px 20px', border: '1px solid var(--border-color)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {array.map((val, idx) => {
            const isLeft = idx === stepData.left;
            const isRight = idx === stepData.right;
            const isMid = idx === stepData.mid;
            const isFound = isMid && stepData.found;

            let bgColor = 'rgba(255, 255, 255, 0.04)';
            let borderColor = 'rgba(255, 255, 255, 0.1)';
            let textColor = 'var(--text-muted)';

            if (idx >= stepData.left && idx <= stepData.right) {
              bgColor = 'rgba(99, 102, 241, 0.1)';
              borderColor = 'rgba(99, 102, 241, 0.3)';
              textColor = 'var(--text-main)';
            }

            if (isMid) {
              bgColor = isFound ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)';
              borderColor = isFound ? 'var(--accent-emerald)' : 'var(--accent-amber)';
              textColor = isFound ? 'var(--accent-emerald)' : 'var(--accent-amber)';
            }

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {/* Pointer Tag */}
                <div style={{ height: '24px', display: 'flex', gap: '4px', fontSize: '11px', fontWeight: 700 }}>
                  {isLeft && <span style={{ color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>L</span>}
                  {isMid && <span style={{ color: isFound ? 'var(--accent-emerald)' : 'var(--accent-amber)', background: isFound ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>M</span>}
                  {isRight && <span style={{ color: 'var(--primary-light)', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>R</span>}
                </div>

                {/* Array Cell */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: textColor,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isMid ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isMid ? `0 0 16px ${borderColor}` : 'none',
                  }}
                >
                  {val}
                </div>

                {/* Index Label */}
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* State Log & Code Sync Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Step Inspector Log */}
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            Step Inspector ({currentStep + 1} / {steps.length})
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.6, color: stepData.found ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
            {stepData.msg}
          </div>
        </div>

        {/* Code Highlights Sync */}
        <div style={{ background: '#0b0d18', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginBottom: '8px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            Source Code Execution Sync
          </div>
          <div style={{ background: stepData.highlightLine === 3 ? 'rgba(99, 102, 241, 0.2)' : 'transparent', padding: '2px 8px', borderRadius: '4px' }}>
            1: int mid = left + (right - left) / 2;
          </div>
          <div style={{ background: stepData.highlightLine === 5 ? 'rgba(99, 102, 241, 0.2)' : 'transparent', padding: '2px 8px', borderRadius: '4px' }}>
            2: if (arr[mid] &lt; target) left = mid + 1;
          </div>
          <div style={{ background: stepData.highlightLine === 7 ? 'rgba(99, 102, 241, 0.2)' : 'transparent', padding: '2px 8px', borderRadius: '4px' }}>
            3: else if (arr[mid] &gt; target) right = mid - 1;
          </div>
          <div style={{ background: stepData.highlightLine === 9 ? 'rgba(16, 185, 129, 0.2)' : 'transparent', padding: '2px 8px', borderRadius: '4px' }}>
            4: else return mid; // Found!
          </div>
        </div>
      </div>
    </div>
  );
};
