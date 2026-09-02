export type VisualEventType =
  | 'READ'
  | 'COMPARE'
  | 'MOVE_POINTER'
  | 'SWAP'
  | 'VISIT'
  | 'WRITE'
  | 'PUSH'
  | 'POP'
  | 'PACKET_TRANSMIT';

export interface VisualStepEvent {
  step: number;
  type: VisualEventType;
  targets: (string | number)[];
  stateSnapshot: Record<string, any>;
  variables: Record<string, string | number | boolean>;
  codeLine: number;
  description: string;
}

export interface VisualTimeline {
  events: VisualStepEvent[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMs: number;
}

export function createVisualTimeline(events: VisualStepEvent[]): VisualTimeline {
  return {
    events,
    currentStepIndex: 0,
    isPlaying: false,
    speedMs: 450,
  };
}

export function nextStep(timeline: VisualTimeline): VisualTimeline {
  if (timeline.currentStepIndex >= timeline.events.length - 1) {
    return { ...timeline, isPlaying: false };
  }
  return { ...timeline, currentStepIndex: timeline.currentStepIndex + 1 };
}

export function prevStep(timeline: VisualTimeline): VisualTimeline {
  if (timeline.currentStepIndex <= 0) {
    return timeline;
  }
  return { ...timeline, currentStepIndex: timeline.currentStepIndex - 1 };
}

export function jumpToStep(timeline: VisualTimeline, stepIndex: number): VisualTimeline {
  const targetIndex = Math.max(0, Math.min(stepIndex, timeline.events.length - 1));
  return { ...timeline, currentStepIndex: targetIndex };
}
