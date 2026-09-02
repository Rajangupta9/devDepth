import React, { useState } from 'react';
import { Network, Play, RotateCcw, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TCPVisualizer: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  const handshakeSteps = [
    {
      step: 0,
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      activePacket: null,
      description: 'Client is in CLOSED state. Server is bound and in LISTEN state waiting for connection requests.',
    },
    {
      step: 1,
      clientState: 'SYN_SENT',
      serverState: 'LISTEN',
      activePacket: { type: 'SYN', seq: 100, ack: 0, dir: 'right' },
      description: 'Client sends SYN packet (Seq=100) to request connection. Client transitions to SYN_SENT.',
    },
    {
      step: 2,
      clientState: 'SYN_SENT',
      serverState: 'SYN_RCVD',
      activePacket: { type: 'SYN-ACK', seq: 300, ack: 101, dir: 'left' },
      description: 'Server receives SYN, transitions to SYN_RCVD, and replies with SYN-ACK (Seq=300, Ack=101).',
    },
    {
      step: 3,
      clientState: 'ESTABLISHED',
      serverState: 'SYN_RCVD',
      activePacket: { type: 'ACK', seq: 101, ack: 301, dir: 'right' },
      description: 'Client receives SYN-ACK, transitions to ESTABLISHED, and sends final ACK (Seq=101, Ack=301).',
    },
    {
      step: 4,
      clientState: 'ESTABLISHED',
      serverState: 'ESTABLISHED',
      activePacket: null,
      description: 'Server receives ACK. Both Client and Server are now in ESTABLISHED state. Full-duplex connection established!',
      complete: true,
    },
  ];

  const current = handshakeSteps[step];

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
            <Network size={14} /> Computer Networking Visual Lab
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>TCP 3-Way Handshake State Machine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Visualize socket state transitions and packet sequence numbers during connection setup.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => setStep(0)}>
            <RotateCcw size={16} /> Reset
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setStep((prev) => Math.min(handshakeSteps.length - 1, prev + 1))}
            disabled={step === handshakeSteps.length - 1}
          >
            Advance Packet Exchange <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Network Nodes Diagram */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', border: '1px solid var(--border-color)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Client Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '180px', zIndex: 2 }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.2)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Network size={32} color="var(--primary-light)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>CLIENT (Browser)</div>
            <div className="badge badge-primary" style={{ textTransform: 'uppercase' }}>
              State: {current.clientState}
            </div>
          </div>

          {/* Packet Exchange Channel */}
          <div style={{ flex: 1, margin: '0 32px', position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'dashed 2px rgba(255, 255, 255, 0.15)', top: '50%' }} />

            {/* Active Flying Packet */}
            {current.activePacket && (
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)',
                  color: '#fff',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 5,
                  transform: current.activePacket.dir === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                  transition: 'all 0.4s ease',
                }}
              >
                <ArrowRight size={18} />
                <span style={{ transform: current.activePacket.dir === 'left' ? 'scaleX(-1)' : 'none' }}>
                  {current.activePacket.type} (Seq={current.activePacket.seq}, Ack={current.activePacket.ack})
                </span>
              </div>
            )}

            {current.complete && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', padding: '10px 20px', borderRadius: 'var(--radius-md)', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} /> Connection Established
              </div>
            )}
          </div>

          {/* Server Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '180px', zIndex: 2 }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(6, 182, 212, 0.2)', border: '2px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={32} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>SERVER (Go API)</div>
            <div className="badge badge-easy" style={{ textTransform: 'uppercase' }}>
              State: {current.serverState}
            </div>
          </div>
        </div>
      </div>

      {/* Description Box */}
      <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '12px', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
          Step {step + 1} of {handshakeSteps.length}
        </div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
          {current.description}
        </div>
      </div>
    </div>
  );
};
