import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, CodeBlock } from '@devdepth/ui';
import { generateBinarySearchEvents } from './algorithms';
import { VisualStepEvent } from './engine';

const BINARY_SEARCH_CODE = `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`;

export const VisualizerStudio: React.FC = () => {
  const [array] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [target, setTarget] = useState<number>(13);
  const [events, setEvents] = useState<VisualStepEvent[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const evs = generateBinarySearchEvents(array, target);
    setEvents(evs);
    setStepIndex(0);
  }, [array, target]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying, events.length]);

  const currentEvent = events[stepIndex] || {
    step: 1,
    type: 'READ',
    targets: [],
    stateSnapshot: { array, left: 0, right: array.length - 1, mid: -1 },
    variables: { left: 0, right: array.length - 1, target },
    codeLine: 1,
    description: 'Initializing Visualizer...',
  };

  const midPointer = currentEvent.stateSnapshot?.mid;
  const leftPointer = currentEvent.stateSnapshot?.left;
  const rightPointer = currentEvent.stateSnapshot?.right;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Controls & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#F9FAFB' }}>
              Data-Driven Visualizer Engine
            </h2>
            <Badge variant="purple">Binary Search</Badge>
            <Badge variant="info">O(log n)</Badge>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#9CA3AF' }}>
            Event-driven algorithm timeline reducer emitting state snapshots & dynamic step inspection.
          </p>
        </div>

        {/* Input Target Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Search Target:</span>
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              backgroundColor: '#111827',
              color: '#F9FAFB',
              border: '1px solid #1F2937',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            {array.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Signature Split View Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Left Column: Visual Canvas & Step Controller */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Interactive Visual Canvas */}
          <Card variant="glass" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF' }}>
                Array State Inspector
              </span>
              <Badge variant={currentEvent.type === 'VISIT' ? 'easy' : 'info'}>
                Event: {currentEvent.type}
              </Badge>
            </div>

            {/* Render Array Elements */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px 0' }}>
              {array.map((value, idx) => {
                const isMid = idx === midPointer;
                const isLeft = idx === leftPointer;
                const isRight = idx === rightPointer;
                const isFound = currentEvent.stateSnapshot?.foundIndex === idx;

                let borderCol = '#1F2937';
                let bgCol = '#111827';
                let textCol = '#F9FAFB';

                if (isFound) {
                  borderCol = '#10B981';
                  bgCol = 'rgba(16, 185, 129, 0.2)';
                  textCol = '#10B981';
                } else if (isMid) {
                  borderCol = '#6366F1';
                  bgCol = 'rgba(99, 102, 241, 0.2)';
                  textCol = '#6366F1';
                }

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    {/* Value Card */}
                    <div
                      style={{
                        width: '48px',
                        height: '56px',
                        borderRadius: '8px',
                        backgroundColor: bgCol,
                        border: `2px solid ${borderCol}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: textCol,
                        boxShadow: isMid ? '0 0 16px rgba(99, 102, 241, 0.3)' : 'none',
                        transition: 'all 250ms ease',
                      }}
                    >
                      {value}
                    </div>

                    {/* Pointer Labels */}
                    <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#9CA3AF', height: '16px' }}>
                      {isMid && <span style={{ color: '#6366F1', fontWeight: 700 }}>mid</span>}
                      {isLeft && !isMid && <span style={{ color: '#F59E0B' }}>L</span>}
                      {isRight && !isMid && <span style={{ color: '#06B6D4' }}>R</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Description Bar */}
            <div style={{ backgroundColor: '#0B0F19', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1F2937', fontSize: '0.875rem', color: '#D1D5DB' }}>
              💡 <span style={{ fontWeight: 600, color: '#F9FAFB' }}>Step {stepIndex + 1}:</span> {currentEvent.description}
            </div>
          </Card>

          {/* Timeline Playback Controls */}
          <Card variant="surface">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                >
                  ⏮️ Reset
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={stepIndex === 0}
                >
                  ◀️ Step Back
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStepIndex((prev) => Math.min(events.length - 1, prev + 1))}
                  disabled={stepIndex >= events.length - 1}
                >
                  Step Next ▶️
                </Button>
              </div>

              <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>
                Step {stepIndex + 1} of {events.length}
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Code & Variable Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Synchronized Code Highlight */}
          <CodeBlock code={BINARY_SEARCH_CODE} language="python" activeLine={currentEvent.codeLine} />

          {/* Real-time State & Variable Table */}
          <Card variant="surface">
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Variable State Inspector
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {Object.entries(currentEvent.variables).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#0B0F19', borderRadius: '6px', border: '1px solid #1F2937' }}>
                  <span style={{ color: '#9CA3AF' }}>{key}</span>
                  <span style={{ color: typeof val === 'boolean' ? (val ? '#10B981' : '#EF4444') : '#06B6D4', fontWeight: 700 }}>
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
