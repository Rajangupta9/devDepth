export const motion = {
  duration: {
    fast: 150,     // 150ms micro-interactions (hover, click, active state)
    normal: 250,   // 250ms component transitions (modals, tabs, drawer)
    slow: 450,     // 450ms visualizer steps & node animations
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type Motion = typeof motion;
