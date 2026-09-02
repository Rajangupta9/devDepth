# DevDepth — Master Build Specification & Architecture Standards

---

## Executive Summary & Core Principles

**DevDepth** is a unified developer-learning platform designed to make computer science concepts, data structures, algorithms, system design, operating systems, and computer networks interactive, visual, measurable, and practice-driven.

### Core Architectural Mandate: "Never Implement the Same Design or Logic Twice"
To ensure DevDepth remains scalable from 10 features to 500 features without codebase bloat or visual drift, all code must adhere to strict centralization:
- **One Theme & Design Token System**: `packages/ui/theme` is the single source of truth for colors (supporting both dark and light modes), typography, spacing, radius, shadows, and motion.
- **One Central Icon Abstraction (`packages/ui/icons`)**: Single application-wide icon system wrapping Lucide icons. No random emojis or manually installed ad-hoc icon libraries across features.
- **One Reusable Page Shell (`AppShell`)**: All views render inside a standard shell with consistent topbar, sidebar, page header, and content areas.
- **Anonymous Identity in V1 (Zero Friction)**: No login/signup wall for V1. Browser auto-generates a persistent anonymous identifier mapped to PostgreSQL `users`. All user state (`progress`, `submissions`, `bookmarks`, `notes`, `mastery`) attaches to `user_id` so auth can be enabled later with zero database refactoring.
- **Strict Go Backend Architecture**: Handler → Service → Repository → PostgreSQL using standardized API response envelopes.
- **Data-Driven Visualization Engine**: Standardized event protocol (`READ`, `COMPARE`, `MOVE_POINTER`, `SWAP`, `VISIT`, `WRITE`) decoupled from UI rendering.

---

## Platform Architecture Overview

```text
                                  DEVDEPTH
                                     │
              ┌──────────────────────┴──────────────────────┐
              │                                             │
          WEB APP                                        GO API
  (Next.js / Vite + React + TS)                             │
              │                             ┌───────────────┼───────────────┐
              │                             │               │               │
        Design System                   Services        Repos         Middleware
       (packages/ui)                        │               │               │
              │                             └───────┬───────┘               │
       ┌──────┴──────┐                              │                       │
       │             │                          PostgreSQL                  │
 Theme/Icons     Components                         │                       │
       │                                            │                       │
       └──── ONE SOURCE OF TRUTH ───────────────────┴───────────────────────┘
```

---

## 1. Design System, Icons & Token Architecture (`packages/ui`)

### Directory Structure
```text
packages/ui/
├── theme/
│   ├── colors.ts       # Dark & Light mode color palettes
│   ├── typography.ts   # Font families, sizes, weights, line heights
│   ├── spacing.ts      # Spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px...)
│   ├── radius.ts       # Border radius scale (xs, sm, md, lg, xl, full)
│   ├── shadows.ts      # Elevation and glow effects
│   ├── motion.ts       # Timings (fast: 150ms, normal: 250ms, slow: 450ms) & bezier easing functions
│   ├── ThemeContext.tsx# Dynamic Dark / Light mode provider & toggle hook
│   └── index.ts
│
├── icons/
│   ├── icon-map.ts     # Lucide icon mapping & semantic feature map
│   ├── Icon.tsx        # Central Icon wrapper component <Icon name="..." />
│   ├── FeatureIcon.tsx # Semantic feature component <FeatureIcon feature="networking" />
│   └── index.ts
│
├── components/
│   ├── AppShell.tsx    # Standard sidebar + topbar + page container + theme toggle
│   ├── Button.tsx     # Variant-driven buttons (primary, secondary, ghost, danger, accent)
│   ├── Card.tsx       # Glassmorphic & surface card containers
│   ├── Badge.tsx      # Difficulty, status, and tag indicators
│   ├── Modal.tsx      # Reusable dialog overlays
│   ├── AuthModal.tsx  # Split-card login/signup modal (VOICE AURA style)
│   ├── Tabs.tsx       # Section switcher tabs
│   ├── Progress.tsx   # Progress bars & circular indicators
│   ├── CodeBlock.tsx  # Syntax-highlighted code container
│   └── index.ts
│
└── index.ts
```

---

## 2. Icon Standardization Protocol (`packages/ui/icons`)

All icons across DevDepth must be rendered using the central `<Icon>` or `<FeatureIcon>` wrappers:

```tsx
import { Icon, FeatureIcon } from "@devdepth/ui";

// Rendering standard Lucide icon
<Icon name="database" size={18} color="var(--primary)" />

// Rendering semantic CS domain feature icon
<FeatureIcon feature="networking" size={18} />
```

### Semantic CS Domain Mapping
```ts
export const featureIconMap = {
  dsa: 'binary',
  algorithms: 'gitBranch',
  networking: 'network',
  operatingSystems: 'cpu',
  databases: 'database',
  systemDesign: 'layers',
  debugging: 'bug',
  coding: 'terminal',
  analytics: 'barChart',
  interview: 'messageSquare',
  visualizer: 'zap',
  courses: 'bookOpen',
  practice: 'code',
  api: 'server',
};
```

---

## 3. Reusable Page Structure (`AppShell`)

Every page in DevDepth inherits from `AppShell`:

```text
AppShell
│
├── Sidebar           # Navigation (Dashboard, Learn, Visual Lab, Practice, API Monitor)
├── Topbar            # Search bar, ☀️ Light / 🌙 Dark theme toggle, API status, Anonymous/User ID badge
└── Page
     ├── PageHeader   # Title, quick actions, filter bars
     ├── Content      # Viewport-fitted workspace layout
     └── PageFooter   # Infrastructure status bar
```

---

## 4. V1 Anonymous User Identity & Auth System

1. **Client Generation**: On initial load, frontend generates `anon_...` identifier saved in `localStorage`.
2. **Auto Registration**: Sent via header `X-Anonymous-ID` on request to Go API.
3. **Auth Upgrade**: Users can click "Sign In / Register" in `AppShell` header to open the split-card `AuthModal` (VOICE AURA style) and log in. Anonymous user progress links directly to the user's permanent account.

---

## 5. PostgreSQL Source of Truth Schema

```text
PostgreSQL
│
├── users                 # Core user entity (anonymous + authenticated)
├── courses               # Track/Subject categories (DSA, OS, Networking, Databases, System Design)
├── modules               # Course subdivisions
├── lessons               # Concept lessons containing explanations & visual models
├── concepts              # Atomic CS concepts with visual IDs
├── visualizations        # Algorithm & protocol step sequences
│
├── problems              # Coding challenges
├── test_cases            # Visible & hidden test cases for practice runner
├── submissions           # User code submissions
├── hints                 # Progressive hints per problem
├── editorials             # Official problem solutions & time/space analysis
│
├── user_progress         # Lesson completion, step progress
├── topic_mastery         # Topic accuracy, recency, and score
├── bookmarks             # User bookmarked lessons and problems
├── notes                 # User notes per concept
│
├── activity_events       # Granular heatmap logs (run, submit, complete, visualize)
├── interviews            # Mock interview session state
└── recommendations       # Next best learning action per user
```

---

## 6. Standardized Go Backend Architecture (`apps/api`)

Every feature module inside `apps/api/internal/<feature>/` enforces clean 4-layer isolation:

```text
HTTP Request → Handler → Service → Repository → PostgreSQL
```

---

## 7. Data-Driven Visualization Engine Protocol

Visualizations produce a standardized event stream rather than custom canvas components per feature:

```typescript
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
```

---

## Summary of Core Development Rules

1. **One Icon Library**: All icons consume `@devdepth/ui` (`<Icon>` or `<FeatureIcon>`). No random emojis or third-party icon imports inside feature code.
2. **One Theme System**: `packages/ui/theme` is the single source of truth for dark and light modes.
3. **One Component System**: `packages/ui/components` contains all standard UI components.
4. **One Motion System**: `packages/ui/theme/motion.ts` defines duration and easing curves.
5. **One Set of Page Shell Patterns**: `AppShell` handles navigation, headers, theme toggles, and user badges.
