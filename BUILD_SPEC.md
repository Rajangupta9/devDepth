# DevDepth — Build Specification
## Product Requirements + Technical Build Plan

---

### Executive Summary & Product Vision

**DevDepth** is a unified developer-learning platform designed to make computer science concepts, data structures, algorithms, system design, operating systems, and computer networks interactive, visual, measurable, and practice-driven.

Unlike traditional text- or video-based course websites, DevDepth anchors learning around an interactive state model, live execution visualization, an in-browser coding IDE, and evidence-based progress intelligence.

**Primary User Promise:** Learn → Visualize → Run → Debug → Practice → Review → Interview.  
**Target Audience:** Computer Science students, self-taught developers, software engineering interview candidates, and experienced engineers deepening CS fundamentals.

---

### Core Architectural Philosophy: The Three Engines

DevDepth is architected around **three core, decoupled engines** rather than page-by-page hardcoding:

```text
                    DEVDEPTH PLATFORM
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   CONTENT ENGINE      VISUAL ENGINE     PRACTICE ENGINE
        │                   │                   │
     Courses            Event Stream        Problems
     Lessons            Timeline            Monaco IDE
     Concepts           State Machine       Test Suite
     Articles           Animation Engine    Go Execution Runner
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ↓
                     USER PROGRESS
                            ↓
                     AI + ANALYTICS
```

1. **Content Engine**: Schema-driven course modules, lessons, concepts, and markdown articles stored in database and filesystem configurations.
2. **Visual Engine**: Deterministic event-stream state machine and timeline rendering engine. Supports:
   - **Data Structures & Algorithms**: Arrays, Linked Lists, Trees, Graphs, Heaps, Sorting, Dynamic Programming.
   - **Computer Networking**: TCP 3-Way Handshake, HTTP Lifecycle, DNS Resolution, TLS Handshake.
   - **Operating Systems**: Process Scheduling, Virtual Memory, Page Faults, Thread Synchronization.
   - **Databases & Distributed Systems**: B-Tree Indexes, Load Balancer Routing, Cache Hit/Miss.
3. **Practice Engine**: Embedded Monaco IDE with multi-language execution, progressive hint engine, test case runner, and isolated Go code execution service (`apps/runner`).

---

### Target Monorepo Structure

```text
devdepth/
│
├── apps/
│   ├── web/                  # Next.js + TypeScript frontend application
│   │
│   ├── api/                  # Go REST API service
│   │   ├── main.go
│   │   ├── go.mod
│   │   └── internal/
│   │       ├── auth/         # Auth feature module (handler, service, repo, model, dto)
│   │       ├── users/        # User management module
│   │       ├── courses/      # Course & lesson module
│   │       ├── lessons/      # Lesson content module
│   │       ├── problems/     # Coding problems module
│   │       ├── submissions/  # Code submissions module
│   │       ├── progress/     # Progress tracking module
│   │       ├── analytics/    # Analytics & metrics module
│   │       ├── recommendations/ # Recommendation engine
│   │       └── interview/    # Interview simulation module
│   │
│   └── runner/               # Isolated Go code execution service
│       ├── main.go
│       ├── go.mod
│       └── internal/
│           └── sandbox/      # Process isolation & container execution
│
├── packages/
│   ├── ui/                   # Shared UI component library
│   ├── visualizer/           # Visual engine timeline & animation core
│   ├── algorithms/           # Algorithm event-emitters & state reducers
│   └── schemas/              # Shared Zod validation schemas & TS types
│
├── content/
│   ├── dsa/                  # DSA concepts & problem definitions
│   ├── networking/           # Networking labs & interactive diagrams
│   ├── operating-systems/    # OS labs & scheduling models
│   ├── databases/            # Database indexing & query labs
│   └── system-design/        # Architecture & component labs
│
├── infra/
│   ├── docker/               # Dockerfiles & docker-compose configurations
│   ├── k8s/                  # Kubernetes deployment manifests
│   └── gopkg/                # Inbuilt Go library package repository
│
└── BUILD_SPEC.md
```

---

### Go Backend Architecture & Layered Pattern

The backend API (`apps/api`) is written in Go and utilizes the [`github.com/Rajangupta9/gopkg`](https://github.com/Rajangupta9/gopkg) ecosystem for core infrastructure components:

- **`github.com/rajangupta9/pgkit/db` & `qb`**: Production-grade PostgreSQL toolkit for connection pooling, typed generics scanning (`db.QueryInto`), transaction management (`client.WithTx`), and safe SQL query building (`qb.New`, `qb.Where`).
- **`pkg/http` & `pkg/middleware`**: Chi-based HTTP router (`RouteSpec`), JWT authentication, CORS, rate limiting, request timeout, and recovery.
- **`pkg/objectstore`**: S3/GCS asset and submission storage management.
- **`pkg/utils/logger`**: Context-aware structured logging.
- **`pkg/utils/validation`**: Struct and payload validation.
- **`pkg/utils/errors`**: Standardized application error handling (`AppError`).

#### Layered Feature Architecture
Every feature inside `apps/api/internal/<feature>/` follows a clean 4-tier layer pattern:

```text
HTTP Request → Handler → Service → Repository → Database
```

Example feature package (`problems/`):
```text
internal/problems/
├── handler.go      # HTTP request decoding, route registration, HTTP responses via gopkg/pkg/http
├── service.go      # Business logic, domain rules, and workflow orchestration
├── repository.go   # Data persistence and query execution via gopkg/pkg/database
├── model.go        # GORM / SQL domain struct entities
└── dto.go          # Request & Response Data Transfer Objects
```

---

### Core Functional Areas

#### 1. Landing Page & Product Showcase
- Interactive hero live demonstration featuring real algorithm visualizer (Array / Tree / Graph).
- Highlights 3 core pillars: Visual Engine, Practice IDE, Progress Analytics.

#### 2. Learner Dashboard
- Key metrics: Problems Solved, Accuracy Rate, Study Streak, Mastery Score.
- Interactive heatmap, "Continue Learning" module, daily challenge, weak topics alert.

#### 3. Visualizer Studio & Event Timeline
- Deterministic event stream: algorithms emit events (`compare`, `swap`, `visit`, `enqueue`, `relax`).
- Event reducer transforms events into visual state snapshots.
- Controls: Play, Pause, Step Forward, Step Back, Replay, Speed slider, Custom Input.
- Code highlight synchronization with step inspector.

#### 4. Practice Engine & Code Execution
- Monaco code editor supporting JavaScript, Python, Java, C++, and Go.
- Sample test execution against visible cases.
- Full submission execution against hidden test suite in isolated runner (`apps/runner`).
- Progressive hint system (hints revealed step-by-step).

#### 5. Progress Analytics & Recommendation Engine
- Recency and accuracy-weighted mastery calculation per topic.
- Identifies weak topics and recommends next best concept + problem pair.

#### 6. Interview Simulation Mode
- Timed mock interview environment.
- Hidden test cases, disabled solution tab, communicative checklist, final performance report.

---

### Technical Build Roadmap — Phase 1 Objectives

1. **Repository Setup**: Create clean monorepo structure with `apps/web`, `apps/api`, `apps/runner`, `packages/*`, `content/*`, `infra/*`.
2. **Go API Service Foundation (`apps/api`)**:
   - `go.mod` with `github.com/Rajangupta9/gopkg` dependency.
   - Entry point `main.go` setting up router, logger, middleware, and database connections.
   - Modular feature directories (`internal/auth`, `internal/problems`, `internal/courses`, `internal/submissions`) with `handler.go`, `service.go`, `repository.go`, `model.go`, `dto.go`.
3. **Go Execution Runner Service (`apps/runner`)**:
   - `go.mod` with `github.com/Rajangupta9/gopkg` dependency.
   - Isolated execution sandbox module handling timeout, memory limits, and output formatting.
