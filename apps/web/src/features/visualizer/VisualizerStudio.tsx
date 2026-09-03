import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, CodeBlock, Icon, useTheme } from '@devdepth/ui';

export const VisualizerStudio: React.FC = () => {
  const { mode, colors } = useTheme();
  const [activeLab, setActiveLab] = useState<'binary_search' | 'two_pointers' | 'tcp_handshake' | 'os_scheduler'>('binary_search');
  
  // Binary Search State
  const [array] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [target, setTarget] = useState<number>(13);
  
  // Common Timeline Playback State
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const isDark = mode === 'dark';

  // Binary Search Events
  const binarySearchEvents = [
    { step: 1, type: 'READ', mid: 4, left: 0, right: 9, val: 9, description: 'Initialize bounds: left = 0 (1), right = 9 (19). Calculate mid = 4 (value 9).' },
    { step: 2, type: 'COMPARE', mid: 4, left: 0, right: 9, val: 9, description: 'Compare array[mid] (9) with target (13). Since 9 < 13, shift left = mid + 1 (5).' },
    { step: 3, type: 'READ', mid: 7, left: 5, right: 9, val: 15, description: 'Recalculate mid = (5 + 9) // 2 = 7 (value 15).' },
    { step: 4, type: 'COMPARE', mid: 7, left: 5, right: 9, val: 15, description: 'Compare array[mid] (15) with target (13). Since 15 > 13, shift right = mid - 1 (6).' },
    { step: 5, type: 'READ', mid: 6, left: 5, right: 6, val: 13, description: 'Recalculate mid = (5 + 6) // 2 = 6 (value 13).' },
    { step: 6, type: 'VISIT', mid: 6, left: 5, right: 6, val: 13, found: true, description: 'Target 13 matched at index 6! Binary search completed successfully in O(log N).' },
  ];

  // Two Pointers Events
  const twoPointerEvents = [
    { step: 1, type: 'READ', left: 0, right: 9, sum: 20, description: 'Initialize left pointer at index 0 (val 1) and right pointer at index 9 (val 19). Sum = 20.' },
    { step: 2, type: 'COMPARE', left: 0, right: 9, sum: 20, description: 'Sum (20) > Target (14). Decrement right pointer right-- (index 8, val 17).' },
    { step: 3, type: 'READ', left: 0, right: 8, sum: 18, description: 'New pointers: left=0 (1), right=8 (17). Sum = 18.' },
    { step: 4, type: 'COMPARE', left: 0, right: 8, sum: 18, description: 'Sum (18) > Target (14). Decrement right pointer right-- (index 6, val 13).' },
    { step: 5, type: 'READ', left: 0, right: 6, sum: 14, found: true, description: 'Pointers left=0 (1) and right=6 (13) add up to target 14! O(N) Two-pointer search completed.' },
  ];

  // TCP Handshake Events
  const tcpEvents = [
    { step: 1, type: 'PACKET_TRANSMIT', packet: 'SYN (Seq=100)', clientState: 'SYN_SENT', serverState: 'LISTEN', description: 'Client sends SYN packet (seq=100) to Server socket to initiate connection.' },
    { step: 2, type: 'PACKET_TRANSMIT', packet: 'SYN-ACK (Seq=300, Ack=101)', clientState: 'SYN_SENT', serverState: 'SYN_RCVD', description: 'Server receives SYN, transitions to SYN_RCVD, and replies with SYN-ACK packet.' },
    { step: 3, type: 'VISIT', packet: 'ACK (Ack=301)', clientState: 'ESTABLISHED', serverState: 'ESTABLISHED', description: 'Client receives SYN-ACK, sends final ACK packet. Both sockets transition to ESTABLISHED state!' },
  ];

  // OS Scheduler Events
  const osEvents = [
    { step: 1, type: 'MOVE_POINTER', process: 'P1 (PID 101)', readyQueue: ['P2', 'P3'], cpuState: 'EXECUTING P1', quantum: '2 ms', description: 'CPU Scheduler picks Process P1 from Ready Queue with Time Quantum Q = 2 ms.' },
    { step: 2, type: 'SWAP', process: 'P2 (PID 102)', readyQueue: ['P3', 'P1'], cpuState: 'PREEMPTING P1 -> EXECUTING P2', quantum: '2 ms', description: 'Time slice expired! P1 is preempted back to Ready Queue; P2 enters CPU execution.' },
    { step: 3, type: 'VISIT', process: 'P3 (PID 103)', readyQueue: ['P1', 'P2'], cpuState: 'EXECUTING P3', quantum: '1 ms', description: 'P3 completes execution in 1 ms and terminates cleanly!' },
  ];

  const currentEvents = 
    activeLab === 'binary_search' ? binarySearchEvents :
    activeLab === 'two_pointers' ? twoPointerEvents :
    activeLab === 'tcp_handshake' ? tcpEvents : osEvents;

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [activeLab, target]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= currentEvents.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentEvents.length]);

  const currentStep = currentEvents[stepIndex] || currentEvents[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Preset Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
              Visual Lab Studio
            </h2>
            <Badge variant="purple">Multi-Engine</Badge>
            <Badge variant="info">Interactive Reduction</Badge>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.muted }}>
            Step through data structure algorithms, networking handshakes, and operating system schedulers.
          </p>
        </div>

        {/* Preset Lab Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: colors.surface, padding: '4px', borderRadius: '9999px', border: `1px solid ${colors.borderSubtle}` }}>
          <button
            onClick={() => setActiveLab('binary_search')}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeLab === 'binary_search' ? colors.primaryGlow : 'transparent',
              color: activeLab === 'binary_search' ? colors.primaryLight : colors.muted,
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            🔍 Binary Search
          </button>
          <button
            onClick={() => setActiveLab('two_pointers')}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeLab === 'two_pointers' ? colors.primaryGlow : 'transparent',
              color: activeLab === 'two_pointers' ? colors.primaryLight : colors.muted,
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            ↔️ Two Pointers
          </button>
          <button
            onClick={() => setActiveLab('tcp_handshake')}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeLab === 'tcp_handshake' ? colors.primaryGlow : 'transparent',
              color: activeLab === 'tcp_handshake' ? colors.primaryLight : colors.muted,
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            🌐 TCP 3-Way Handshake
          </button>
          <button
            onClick={() => setActiveLab('os_scheduler')}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeLab === 'os_scheduler' ? colors.primaryGlow : 'transparent',
              color: activeLab === 'os_scheduler' ? colors.primaryLight : colors.muted,
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            ⚡ OS CPU Scheduler
          </button>
        </div>
      </div>

      {/* Main Split Visual Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        {/* Left Column: Interactive Canvas & Timeline Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Visual Canvas Card */}
          <Card variant="glass" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: colors.muted, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="layers" size={14} /> Live State Visualizer Canvas
              </span>
              <Badge variant={(currentStep as any).found ? 'easy' : 'primary'}>
                Event: {currentStep.type}
              </Badge>
            </div>

            {/* Render Canvas per Active Lab */}
            {activeLab === 'binary_search' || activeLab === 'two_pointers' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '28px 0' }}>
                {array.map((val, idx) => {
                  const isMid = activeLab === 'binary_search' && idx === (currentStep as any).mid;
                  const isLeft = idx === (currentStep as any).left;
                  const isRight = idx === (currentStep as any).right;
                  const isFound = (currentStep as any).found && (isMid || idx === (currentStep as any).right);

                  let borderCol = colors.borderSubtle;
                  let bgCol = colors.surface;
                  let textCol = colors.text;

                  if (isFound) {
                    borderCol = colors.success;
                    bgCol = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)';
                    textCol = colors.success;
                  } else if (isMid) {
                    borderCol = colors.primary;
                    bgCol = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.12)';
                    textCol = colors.primaryLight;
                  } else if (isLeft || isRight) {
                    borderCol = isLeft ? '#F59E0B' : '#06B6D4';
                    bgCol = isLeft ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)';
                  }

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
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
                          boxShadow: isMid ? `0 0 20px ${colors.primaryGlow}` : isFound ? `0 0 20px ${colors.successGlow}` : 'none',
                          transition: 'all 250ms ease',
                        }}
                      >
                        {val}
                      </div>

                      <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: colors.muted, height: '18px' }}>
                        {isMid && <span style={{ color: colors.primaryLight, fontWeight: 800 }}>mid</span>}
                        {isLeft && !isMid && <span style={{ color: '#F59E0B', fontWeight: 700 }}>L</span>}
                        {isRight && !isMid && <span style={{ color: '#06B6D4', fontWeight: 700 }}>R</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : activeLab === 'tcp_handshake' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '40px 20px' }}>
                {/* Client Node */}
                <div style={{ padding: '20px 28px', backgroundColor: colors.surface, borderRadius: '16px', border: `2px solid ${colors.primary}`, textAlign: 'center' }}>
                  <Icon name="server" size={28} color={colors.primaryLight} />
                  <div style={{ fontWeight: 800, marginTop: '8px', color: colors.text }}>TCP Client Socket</div>
                  <Badge variant="info" style={{ marginTop: '6px' }}>{(currentStep as any).clientState}</Badge>
                </div>

                {/* Transmit Wire */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: colors.cyan, padding: '6px 14px', background: colors.primaryGlow, borderRadius: '4px', border: `1px solid ${colors.cyan}` }}>
                    ⚡ {(currentStep as any).packet}
                  </div>
                  <div style={{ width: '200px', height: '2px', background: colors.primary, animation: 'pulseGlow 2s infinite' }} />
                </div>

                {/* Server Node */}
                <div style={{ padding: '20px 28px', backgroundColor: colors.surface, borderRadius: '16px', border: `2px solid ${colors.purple}`, textAlign: 'center' }}>
                  <Icon name="database" size={28} color={colors.purple} />
                  <div style={{ fontWeight: 800, marginTop: '8px', color: colors.text }}>TCP Server Socket</div>
                  <Badge variant="purple" style={{ marginTop: '6px' }}>{(currentStep as any).serverState}</Badge>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: colors.surface, padding: '16px 20px', borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: colors.muted, fontWeight: 600 }}>Active CPU Core Slot:</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: colors.primaryLight, marginTop: '2px' }}>
                      {(currentStep as any).cpuState}
                    </div>
                  </div>
                  <Badge variant="medium">Quantum: {(currentStep as any).quantum}</Badge>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: colors.muted, fontWeight: 600, marginBottom: '8px', display: 'block' }}>Ready Queue Pipeline:</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {((currentStep as any).readyQueue || []).map((proc: string, i: number) => (
                      <div key={i} style={{ padding: '10px 18px', borderRadius: '8px', background: colors.primaryGlow, color: colors.primaryLight, fontWeight: 700, fontSize: '0.9rem', border: `1px solid ${colors.primary}` }}>
                        {proc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Description Bar */}
            <div
              style={{
                backgroundColor: colors.background,
                padding: '14px 18px',
                borderRadius: '12px',
                border: `1px solid ${colors.borderSubtle}`,
                fontSize: '0.875rem',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icon name="sparkles" size={16} color={colors.primary} />
              <span><strong style={{ color: colors.primaryLight }}>Step {stepIndex + 1}:</strong> {currentStep.description}</span>
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
                  onClick={() => setStepIndex((prev) => Math.min(currentEvents.length - 1, prev + 1))}
                  disabled={stepIndex >= currentEvents.length - 1}
                >
                  Step Next
                </Button>
              </div>

              <span style={{ fontSize: '0.85rem', color: colors.muted, fontWeight: 700 }}>
                Step {stepIndex + 1} of {currentEvents.length}
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Code & State Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CodeBlock
            code={
              activeLab === 'binary_search' ? `def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid` :
              activeLab === 'two_pointers' ? `def two_sum(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        curr = nums[left] + nums[right]\n        if curr == target: return [left, right]` :
              activeLab === 'tcp_handshake' ? `// TCP 3-Way Handshake Socket Spec\n1. CLIENT -> SYN (seq=x) -> SERVER\n2. SERVER -> SYN+ACK (seq=y, ack=x+1) -> CLIENT\n3. CLIENT -> ACK (ack=y+1) -> SERVER` :
              `// Round Robin Scheduling Logic\nwhile (!readyQueue.empty()) {\n    Process p = readyQueue.pop();\n    executeForTimeQuantum(p, 2ms);\n}`
            }
            language={activeLab === 'tcp_handshake' || activeLab === 'os_scheduler' ? 'go' : 'python'}
          />

          <Card variant="surface">
            <h4 style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="terminal" size={14} /> State Inspector
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {Object.entries(currentStep).filter(([k]) => k !== 'description').map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: colors.background,
                    borderRadius: '8px',
                    border: `1px solid ${colors.borderSubtle}`,
                  }}
                >
                  <span style={{ color: colors.muted }}>{key}</span>
                  <span style={{ color: typeof val === 'boolean' ? (val ? colors.success : colors.error) : colors.primaryLight, fontWeight: 700 }}>
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
