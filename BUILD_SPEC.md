# DevDepth — Master Build Specification & Architecture Standards

---

## Executive Summary & Core Principles

**DevDepth** is a unified developer-learning platform designed to make computer science concepts, data structures, algorithms, system design, operating systems, and computer networks interactive, visual, measurable, and practice-driven.

### Core Architectural Mandate: "Never Implement the Same Design or Logic Twice"
To ensure DevDepth remains scalable from 10 features to 500 features without codebase bloat or visual drift, all code must adhere to strict centralization:
- **One Theme & Design Token System**: No ad-hoc Tailwind/inline utility colors or fonts. All UI consumes `packages/ui` design tokens.
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
     Theme       Components                         │                       │
       │                                            │                       │
       └──── ONE SOURCE OF TRUTH ───────────────────┴───────────────────────┘
```

---

## 1. Design System & Token Architecture (`packages/ui`)

### Directory Structure
```text
packages/ui/
├── theme/
│   ├── colors.ts       # Central color palette (background, surface, primary, secondary, text, muted, border, states)
│   ├── typography.ts   # Font families, sizes, weights, line heights
│   ├── spacing.ts      # Spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px...)
│   ├── radius.ts       # Border radius scale (xs, sm, md, lg, xl, full)
│   ├── shadows.ts      # Elevation and glow effects
│   ├── motion.ts       # Timings (fast: 150ms, normal: 250ms, slow: 450ms) & bezier easing functions
│   ├── breakpoints.ts  # Responsive viewports (sm, md, lg, xl, 2xl)
│   └── index.ts
│
├── components/
│   ├── AppShell.tsx    # Standard sidebar + topbar + page container
│   ├── Button.tsx     # Variant-driven buttons (primary, secondary, ghost, danger)
│   ├── Card.tsx       # Glassmorphism & surface card containers
│   ├── Badge.tsx      # Difficulty, status, and tag indicators
│   ├── Modal.tsx      # Reusable dialog overlays
│   ├── Tabs.tsx       # Section switcher tabs
│   ├── Progress.tsx   # Progress bars & circular indicators
│   ├── CodeBlock.tsx  # Syntax-highlighted code container
│   └── index.ts
│
└── index.ts
```

### Motion Design System Specification
```ts
export const motion = {
  duration: {
    fast: 150,    // Micro-interactions (hover, active states)
    normal: 250,  // Component state transitions, tabs, modals
    slow: 450,    // Algorithm visualizer step animations & node movements
  },
  easing: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0.0, 1, 1)",
  }
};
```

---

## 2. Reusable Page Structure (`AppShell`)

Every page in DevDepth inherits from `AppShell`:

```text
AppShell
│
├── Sidebar           # Collapsible navigation (Dashboard, Learn, Problems, Visual Lab, Courses, Interview, Analytics)
├── Topbar            # Search bar, active module indicator, anonymous user profile badge & metrics
└── Page
     ├── PageHeader   # Breadcrumbs, title, quick actions, filter bars
     ├── Content      # Viewport-fitted workspace layout
     └── PageFooter   # Status bar (Go API connection, database pool state, runner health)
```

---

## 3. V1 Anonymous User Identity System

To maximize conversion and zero-friction onboarding in V1:
1. **Client Generation**: On initial load, frontend generates or reads a UUID (`devdepth_anon_id`) in secure cookies / `localStorage`.
2. **Auto Registration**: Sent via header `X-Anonymous-ID` or cookie on every request to Go API.
3. **Database Mapping**: Go API auto-upserts `users` record:
   ```sql
   CREATE TABLE users (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       anonymous_id VARCHAR(64) UNIQUE NOT NULL,
       email VARCHAR(255) NULL,
       name VARCHAR(255) NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```
4. **Auth Upgrade Path**: When user eventually registers with email/auth, `users.email` is filled and `user_id` links seamlessly to all existing progress. No table rebuilds required.

---

## 4. PostgreSQL Source of Truth Schema

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

## 5. Standardized Go Backend Architecture (`apps/api`)

Every feature module inside `apps/api/internal/<feature>/` enforces clean 4-layer isolation:

```text
HTTP Request → Handler → Service → Repository → PostgreSQL
```

### Directory Structure
```text
apps/api/
├── main.go
├── go.mod
└── internal/
    ├── user/            # Anonymous identity & user state
    ├── course/          # Course & lesson management
    ├── lesson/          # Concept lessons & articles
    ├── problem/         # Coding problem catalog
    ├── submission/      # Code execution & submission management
    ├── progress/        # User progress tracking
    ├── analytics/       # Learner metrics & heatmaps
    ├── visualizer/      # Visual lab state definitions
    ├── recommendation/  # AI / rule-based next step engines
    └── interview/       # Mock interview session handlers
```

### Standardized API Response Envelopes

#### Success Envelope (`200 / 201`)
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "page": 1,
    "total": 42
  }
}
```

#### Error Envelope (`4xx / 5xx`)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PROBLEM_NOT_FOUND",
    "message": "Problem with slug 'two-sum' was not found"
  },
  "meta": {}
}
```

---

## 6. Standardized Frontend Feature Architecture (`apps/web`)

```text
src/
├── features/
│   ├── dashboard/       # Dashboard components, analytics hooks, stats widgets
│   ├── courses/         # Course catalog, lesson viewer, curriculum tree
│   ├── problems/        # Problem list, IDE layout, test runner, submission history
│   ├── visualizer/      # Data-driven algorithm & protocol visual engine
│   └── analytics/       # Weak topic radar, study heatmap, mastery cards
│
├── components/          # Global shared components wrapping packages/ui
├── hooks/               # Global hooks (useUser, useApi, useLocalStorage)
├── lib/                 # Standard API client & fetchers
└── types/               # Shared TypeScript definitions
```

---

## 7. Data-Driven Visualization Engine Protocol

Visualizations do **not** hardcode custom animation components per algorithm. Instead, algorithm execution produces a standardized event stream:

### Event Stream Protocol
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

export interface VisualStepEvent {
  step: number;
  type: VisualEventType;
  targets: (string | number)[];
  stateSnapshot: Record<string, any>;
  variables: Record<string, string | number>;
  codeLine: number;
  description: string;
}
```

### Core Engine Architecture
```text
Algorithm / Lab Payload
       │
       ↓
Visual Event Stream Generator
       │
       ↓
Event Reducer & Timeline Store (Step N <-> Step N+1)
       │
       ├───────────────────────┼───────────────────────┐
       ↓                       ↓                       ↓
Array/Tree Canvas       Variables Inspector    Code Highlighting
```

---

## 8. Signature DevDepth Workspace Screen

The core learning interface is the **Split-View Signature Workspace**:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ DEVDEPTH  /  Binary Search                                       User: #anon84 │
├─────────────────┬──────────────────────────────────────────┬───────────────┤
│ Concept & Notes │ Visualizer Engine Canvas                 │ Practice IDE  │
│                 │                                          │               │
│ • Explanation   │    [1]   [3]   [5]   [7]   [9]           │ def binary_.. │
│ • Intuition     │               ↑                          │   left, right │
│ O(log n)        │             mid=2                        │   while left..│
│                 │                                          │     mid = ... │
│                 ├──────────────────────────────────────────┤               │
│                 │ ▶  ⏸️  ⏮️  ⏭️  ───●── Speed  [Step 3/8]   │               │
│                 ├──────────────────────────────────────────┴───────────────┤
│                 │ Variables: left=0  right=4  mid=2  target=7  found=false │
└─────────────────┴──────────────────────────────────────────────────────────┘
```

---

## Summary of Core Development Rules

1. **Theme Source**: `packages/ui/theme` is the single source of truth for colors, typography, radius, spacing, shadows, and motion.
2. **Page Shell**: All pages use `AppShell`. No custom one-off full-page wrappers.
3. **User Identity**: All backend endpoints pass and recognize `user_id` derived from `X-Anonymous-ID` cookie/header.
4. **Backend Pattern**: Every Go feature uses `Handler → Service → Repository → PostgreSQL` with standardized `{ success, data, error, meta }` response JSON.
5. **Visual Engine**: New algorithm visualizations are added by registering step generators (`VisualStepEvent[]`), avoiding bespoke custom canvas code per feature.
