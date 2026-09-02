import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, CodeBlock, Icon } from '@devdepth/ui';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Controls & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
              Visual Lab Studio
            </h2>
            <Badge variant="purple">Binary Search</Badge>
            <Badge variant="info">O(log n)</Badge>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Event-driven algorithm timeline reducer emitting state snapshots & dynamic step inspection.
          </p>
        </div>

        {/* Search Target Pill Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '6px 16px',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Target:</span>
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            style={{
              padding: '4px 10px',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: '9999px',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        {/* Left Column: Visual Canvas & Step Controller */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Interactive Visual Canvas Sheet */}
          <Card variant="glass" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="layers" size={14} /> Array State Inspector
              </span>
              <Badge variant={currentEvent.type === 'VISIT' ? 'easy' : 'primary'}>
                Event: {currentEvent.type}
              </Badge>
            </div>

            {/* Render Array Tiles */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '28px 0' }}>
              {array.map((value, idx) => {
                const isMid = idx === midPointer;
                const isLeft = idx === leftPointer;
                const isRight = idx === rightPointer;
                const isFound = currentEvent.stateSnapshot?.foundIndex === idx;

                let borderCol = 'var(--border-subtle)';
                let bgCol = 'var(--bg-card)';
                let textCol = 'var(--text-main)';

                if (isFound) {
                  borderCol = '#10B981';
                  bgCol = 'rgba(16, 185, 129, 0.2)';
                  textCol = '#10B981';
                } else if (isMid) {
                  borderCol = '#3B82F6';
                  bgCol = 'rgba(59, 130, 246, 0.25)';
                  textCol = '#60A5FA';
                }

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {/* Value Tile */}
                    <div
                      style={{
                        width: '52px',
                        height: '60px',
                        borderRadius: '12px',
                        backgroundColor: bgCol,
                        border: `2px solid ${borderCol}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        color: textCol,
                        boxShadow: isMid ? '0 0 20px rgba(59, 130, 246, 0.4)' : isFound ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                        transition: 'all 250ms ease',
                      }}
                    >
                      {value}
                    </div>

                    {/* Pointer Labels */}
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)', height: '18px' }}>
                      {isMid && <span style={{ color: '#60A5FA', fontWeight: 800 }}>mid</span>}
                      {isLeft && !isMid && <span style={{ color: '#F59E0B', fontWeight: 700 }}>L</span>}
                      {isRight && !isMid && <span style={{ color: '#06B6D4', fontWeight: 700 }}>R</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Description Bar */}
            <div
              style={{
                backgroundColor: 'var(--bg-dark)',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="sparkles" size={16} color="var(--primary)" />
              <span><strong style={{ color: 'var(--primary-light)' }}>Step {stepIndex + 1}:</strong> {currentEvent.description}</span>
            </div>
          </Card>

          {/* Timeline Playback Pill Controls */}
          <Card variant="surface">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Icon name="rotateCcw" size={15} />}
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                >
                  Reset
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Icon name="stepBack" size={15} />}
                  onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={stepIndex === 0}
                >
                  Step Back
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Icon name={isPlaying ? 'pause' : 'play'} size={15} />}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<Icon name="stepForward" size={15} />}
                  onClick={() => setStepIndex((prev) => Math.min(events.length - 1, prev + 1))}
                  disabled={stepIndex >= events.length - 1}
                >
                  Step Next
                </Button>
              </div>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Step {stepIndex + 1} of {events.length}
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Synchronized Code & Variable State Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Synchronized Code Highlight */}
          <CodeBlock code={BINARY_SEARCH_CODE} language="python" activeLine={currentEvent.codeLine} />

          {/* Real-time State & Variable Table */}
          <Card variant="surface">
            <h4 style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="terminal" size={14} /> Variable State Inspector
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {Object.entries(currentEvent.variables).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-dark)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{key}</span>
                  <span style={{ color: typeof val === 'boolean' ? (val ? '#10B981' : '#EF4444') : '#60A5FA', fontWeight: 700 }}>
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
