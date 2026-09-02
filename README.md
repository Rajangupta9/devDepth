# DevDepth 🚀
> **Interactive Developer-Learning Platform for CS Fundamentals, Networking Labs, OS State Machines & Data Structures**

DevDepth is a modern, practice-driven learning platform designed to make computer science concepts interactive, visual, measurable, and code-centered. Instead of static text or video tutorials, DevDepth anchors learning around a deterministic **Visual Engine**, an in-browser **Practice IDE**, and schema-driven **Content Engine**.

---

## 🏗️ The Three Core Engines Architecture

DevDepth is architected around **three decoupled, reusable engines** rather than hardcoded pages:

```text
                                DEVDEPTH PLATFORM
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ↓                               ↓                               ↓
   CONTENT ENGINE                  VISUAL ENGINE                 PRACTICE ENGINE
   (Schema-driven)             (Timeline State Machine)         (In-Browser IDE)
        │                               │                               │
  • Courses & Lessons            • Event-Stream Reducer          • Monaco Code Editor
  • Concepts & Articles          • Step Forward / Back           • Multi-Language Sandbox
  • Course Catalog API           • Code Sync Highlighting        • Progressive Hints
  • Topic Taxonomies             • Interactive Input             • Test Case Grader
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        ↓
                              USER PROGRESS & MASTERY
                                        ↓
                                  AI & ANALYTICS
```

1. **Content Engine**: Schema-driven course modules, lessons, and interactive concept articles across DSA, Computer Networks, Operating Systems, Databases, and System Design.
2. **Visual Engine**: Deterministic event-stream timeline and state-machine animation renderer:
   - **DSA**: Binary Search pointer arithmetic, Sorting, Trees, Graphs, Dynamic Programming.
   - **Networking Lab**: TCP 3-Way Handshake (SYN → SYN-ACK → ACK), HTTP Lifecycle, DNS Resolution, TLS Handshake.
   - **Operating Systems**: Process Scheduling, Virtual Memory, Page Faults, Thread Synchronization.
3. **Practice Engine**: In-browser Monaco-style coding workspace supporting JavaScript, Python, Go, and C++, connected to isolated Go execution sandbox microservices.

---

## 📂 Repository Structure

```text
devdepth/
│
├── apps/
│   ├── web/                  # React + TypeScript + Vite Frontend Application
│   │   ├── src/
│   │   │   ├── api/          # DevDepth API Client (Port 8080)
│   │   │   ├── components/   # Dashboard, Content, Visual, Practice UIs
│   │   │   ├── types/        # TypeScript Entities & Interfaces
│   │   │   └── index.css     # Dark Mode & Glassmorphism Design System
│   │   └── package.json
│   │
│   ├── api/                  # Go REST API Microservice
│   │   ├── main.go           # Server entry point using gopkg & pgkit
│   │   ├── go.mod
│   │   └── internal/         # Layered Feature Architecture
│   │       ├── auth/         # Handler -> Service -> Repository -> PostgreSQL
│   │       ├── courses/      # Content Engine API
│   │       ├── problems/     # Practice Problem Library API
│   │       └── submissions/  # Code Submission & Grading API
│   │
│   └── runner/               # Isolated Go Execution Sandbox Service
│       ├── main.go
│       └── internal/sandbox/ # Process isolation with memory & execution timeouts
│
├── infra/
│   ├── gopkg/                # Custom Go Library (Router, Middleware, Logger, Storage)
│   ├── pgkit/                # Production PostgreSQL Toolkit (Generics db.QueryInto & qb)
│   ├── docker/               # Dockerfiles & Compose setups
│   └── k8s/                  # Kubernetes deployment manifests
│
├── BUILD_SPEC.md             # Complete Technical Build Specification
└── README.md
```

---

## ⚙️ Backend Architecture & Layered Pattern

The backend API (`apps/api`) is written in **Go** and uses clean 4-tier layer separation:

$$\text{HTTP Request} \longrightarrow \text{Handler} \longrightarrow \text{Service} \longrightarrow \text{Repository} \longrightarrow \text{PostgreSQL}$$

### Infrastructure Libraries Used
- **`github.com/rajangupta9/pgkit`**: Production PostgreSQL connection pooling (`db.New`), typed generics scanning (`db.QueryInto[T]`), transaction management (`client.WithTx`), and safe SQL query builder (`qb.New`, `qb.Where`).
- **`github.com/Rajangupta9/gopkg`**:
  - `pkg/http`: Chi Mux OpenAPI route specs & standardized JSON HTTP responses (`Success`, `Created`, `BadRequest`, `Unauthorized`, `NotFound`).
  - `pkg/middleware`: Logging, panic recovery, and CORS handling.
  - `pkg/utils/logger`: Context-aware structured Zap logging.
  - `pkg/utils/validation`: Struct & field validation (`validation.Email`).
  - `pkg/utils/errors`: Standardized domain exceptions (`AppError`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Go**: Version `1.23+` (1.25+ recommended)
- **Node.js**: Version `18+` & `npm`
- **Python 3** & **Node.js** on system PATH for running practice code submissions

---

### Step 1: Start the Backend API Server (`apps/api`)

```bash
cd apps/api
go run main.go
```
> Listening on `http://localhost:8080` (Runs with in-memory fallback if `DATABASE_URL` is not set).

---

### Step 2: Start the Execution Sandbox Runner (`apps/runner`)

```bash
cd apps/runner
go run main.go
```
> Listening on `http://localhost:8081`.

---

### Step 3: Start the React Frontend Application (`apps/web`)

```bash
cd apps/web
npm install
npm run dev
```
> Opens DevDepth UI at `http://localhost:3000`.

---

## 🛠️ Environment Configuration

### `apps/api/.env`
```env
PORT=8080
ENV=development
JWT_SECRET=devdepth_super_secret_jwt_key_2026

# PostgreSQL (via github.com/rajangupta9/pgkit)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/devdepth?sslmode=disable
PGHOST=localhost
PGPORT=5432
PGDATABASE=devdepth
PGUSER=postgres
PGPASSWORD=postgres

RUNNER_SERVICE_URL=http://localhost:8081
```

### `apps/runner/.env`
```env
RUNNER_PORT=8081
MAX_EXECUTION_TIMEOUT_MS=5000
```

### `apps/web/.env`
```env
VITE_API_URL=http://localhost:8080
PORT=3000
```

---

## 🧪 Verification & Building for Production

### Verify Go Microservices
```bash
# Build API Service
cd apps/api
go build -o devdepth_api.exe .

# Build Sandbox Runner
cd apps/runner
go build -o devdepth_runner.exe .
```

### Verify React TypeScript Frontend
```bash
cd apps/web
npm run build
```

---

## 📄 Documentation
- For detailed product specs, screen breakdowns, and database models, see [BUILD_SPEC.md](file:///d:/DevDepth/BUILD_SPEC.md).
