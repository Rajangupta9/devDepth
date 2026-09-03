package courses

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/rajangupta9/pgkit/db"
	"github.com/rajangupta9/pgkit/qb"
)

var ErrCourseNotFound = errors.New("course not found")

type Repository interface {
	Create(ctx context.Context, course *Course) error
	GetBySlug(ctx context.Context, slug string) (*Course, error)
	List(ctx context.Context, category string) ([]*Course, error)
}

type postgresRepository struct {
	client    *db.Client
	tableName string
	mu        sync.RWMutex
	courses   map[string]*Course
}

func NewRepository(client *db.Client) Repository {
	repo := &postgresRepository{
		client:    client,
		tableName: "courses",
		courses:   make(map[string]*Course),
	}
	repo.seedInitialCourses()
	return repo
}

func (r *postgresRepository) seedInitialCourses() {
	dsaCourse := &Course{
		ID:          "course_dsa_foundations",
		Slug:        "dsa-foundations",
		Title:       "DSA Foundations & Interactive Visualizers",
		Category:    "dsa",
		Description: "Master Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming with step-by-step state visualizer reduction.",
		Level:       "Beginner to Intermediate",
		Modules: []Module{
			{
				ID:          "mod_arrays_pointers",
				Title:       "Arrays, Memory Layout & Pointers",
				Description: "Contiguous allocation, index arithmetic, two pointers, sliding window.",
				Lessons: []Lesson{
					{
						ID:            "les_array_basics",
						Title:         "Understanding Array Memory & Indexing",
						Slug:          "array-memory-indexing",
						Type:          "visualization",
						Content:       "Arrays store elements in contiguous memory slots. Access is O(1) via base + i * size.",
						VisualizerID:  "binary_search",
						EstimatedMins: 15,
					},
					{
						ID:            "les_two_pointers",
						Title:         "Two-Pointer Technique & Convergence",
						Slug:          "two-pointer-technique",
						Type:          "visualization",
						Content:       "Use left and right indices converging from array boundaries to find pair conditions in O(N) time.",
						VisualizerID:  "two_pointers",
						EstimatedMins: 20,
					},
				},
			},
			{
				ID:          "mod_trees_graphs",
				Title:       "Trees, Binary Search Trees & Traversal",
				Description: "Hierarchical node pointers, Preorder, Inorder, Postorder, and Level Order BFS.",
				Lessons: []Lesson{
					{
						ID:            "les_bst_properties",
						Title:         "BST Invariants & Search Operations",
						Slug:          "bst-invariants-search",
						Type:          "conceptual",
						Content:       "Every left node is smaller than root; right node is greater. Guarantees O(log N) search on balanced trees.",
						VisualizerID:  "binary_search",
						EstimatedMins: 25,
					},
				},
			},
		},
	}

	netCourse := &Course{
		ID:          "course_networking_lab",
		Slug:        "computer-networks-lab",
		Title:       "Computer Networks Visual Lab",
		Category:    "networking",
		Description: "Interactive step-by-step visualization of TCP 3-Way Handshake, HTTP Lifecycle, DNS, and TLS handshakes.",
		Level:       "Intermediate",
		Modules: []Module{
			{
				ID:          "mod_tcp_transport",
				Title:       "TCP Transport Layer & Reliable Socket Connection",
				Description: "SYN, SYN-ACK, ACK packet exchange and socket sequence state machine.",
				Lessons: []Lesson{
					{
						ID:            "les_tcp_handshake",
						Title:         "TCP 3-Way Handshake Interactive Lab",
						Slug:          "tcp-3-way-handshake",
						Type:          "visualization",
						Content:       "Step through SYN, SYN+ACK, and ACK flags to visualize client-server socket initialization.",
						VisualizerID:  "tcp_handshake",
						EstimatedMins: 20,
					},
				},
			},
			{
				ID:          "mod_application_layer",
				Title:       "HTTP/1.1 vs HTTP/2 Multiplexing & TLS 1.3",
				Description: "Understand connection keep-alive, header compression, and cryptographic handshake.",
				Lessons: []Lesson{
					{
						ID:            "les_http_lifecycle",
						Title:         "HTTP Request/Response Wire Inspection",
						Slug:          "http-wire-inspection",
						Type:          "conceptual",
						Content:       "Headers, status codes, chunked transfer encoding, and REST payload structure.",
						VisualizerID:  "tcp_handshake",
						EstimatedMins: 18,
					},
				},
			},
		},
	}

	osCourse := &Course{
		ID:          "course_os_internals",
		Slug:        "operating-systems-internals",
		Title:       "Operating Systems Kernel Internals",
		Category:    "operating-systems",
		Description: "Explore Process Scheduling, Virtual Memory Paging, Mutex Locks, and Deadlock Prevention.",
		Level:       "Intermediate to Advanced",
		Modules: []Module{
			{
				ID:          "mod_cpu_scheduling",
				Title:       "CPU Process Scheduling Algorithms",
				Description: "First-Come First-Served, Shortest Job First, Round Robin, and Multi-Level Queue.",
				Lessons: []Lesson{
					{
						ID:            "les_round_robin",
						Title:         "Round Robin CPU Scheduler Visual Lab",
						Slug:          "round-robin-scheduler",
						Type:          "visualization",
						Content:       "Preemptive time-slice scheduling ensuring fair CPU time distribution across process queues.",
						VisualizerID:  "os_scheduler",
						EstimatedMins: 22,
					},
				},
			},
		},
	}

	dbCourse := &Course{
		ID:          "course_database_systems",
		Slug:        "database-systems-optimization",
		Title:       "Database Systems & Query Engine Internals",
		Category:    "databases",
		Description: "B+ Tree Indexing, Write-Ahead Logging (WAL), Transaction ACID Guarantees, and Query Plan Optimization.",
		Level:       "Intermediate",
		Modules: []Module{
			{
				ID:          "mod_indexing_btree",
				Title:       "B+ Tree Indexing & Page Storage",
				Description: "Balanced node splitting, leaf pointers, composite indexes, and index scans.",
				Lessons: []Lesson{
					{
						ID:            "les_btree_indexing",
						Title:         "B+ Tree Index Lookup & Range Queries",
						Slug:          "btree-index-lookup",
						Type:          "conceptual",
						Content:       "Node fanout minimizes disk I/O requests for logarithmic search depth.",
						VisualizerID:  "binary_search",
						EstimatedMins: 25,
					},
				},
			},
		},
	}

	sysDesignCourse := &Course{
		ID:          "course_system_design",
		Slug:        "system-design-distributed-systems",
		Title:       "System Design & Distributed Architecture",
		Category:    "system-design",
		Description: "Design Scalable Web Applications, Microservices, Caching Layer, Load Balancers, and Kafka Queues.",
		Level:       "Advanced",
		Modules: []Module{
			{
				ID:          "mod_scalability_caching",
				Title:       "Scalability Patterns & Distributed Caching",
				Description: "Horizontal scaling, CDN, Redis cache-aside, write-through, and rate limiting.",
				Lessons: []Lesson{
					{
						ID:            "les_rate_limiting",
						Title:         "Token Bucket & Leaky Bucket Rate Limiter",
						Slug:          "token-bucket-rate-limiter",
						Type:          "visualization",
						Content:       "Prevent API abuse using token refill algorithms and Redis distributed atomicity.",
						VisualizerID:  "tcp_handshake",
						EstimatedMins: 30,
					},
				},
			},
		},
	}

	r.courses[dsaCourse.Slug] = dsaCourse
	r.courses[netCourse.Slug] = netCourse
	r.courses[osCourse.Slug] = osCourse
	r.courses[dbCourse.Slug] = dbCourse
	r.courses[sysDesignCourse.Slug] = sysDesignCourse
}

func (r *postgresRepository) Create(ctx context.Context, course *Course) error {
	if course.ID == "" {
		course.ID = "crs_" + time.Now().Format("20060102150405")
	}

	if r.client != nil {
		query := r.client.QB(r.tableName)
		_, err := r.client.Insert(ctx, query, map[string]any{
			"id":          course.ID,
			"slug":        course.Slug,
			"title":       course.Title,
			"category":    course.Category,
			"description": course.Description,
			"level":       course.Level,
		})
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.courses[course.Slug] = course
	return nil
}

func (r *postgresRepository) GetBySlug(ctx context.Context, slug string) (*Course, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("slug", qb.OpEq, slug))
		items, err := db.QueryInto[Course](ctx, r.client, query)
		if err != nil || len(items) == 0 {
			return nil, ErrCourseNotFound
		}
		return &items[0], nil
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	if c, exists := r.courses[slug]; exists {
		return c, nil
	}
	return nil, ErrCourseNotFound
}

func (r *postgresRepository) List(ctx context.Context, category string) ([]*Course, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName)
		if category != "" {
			query = query.Where(qb.Where("category", qb.OpEq, category))
		}
		items, err := db.QueryInto[Course](ctx, r.client, query)
		if err == nil {
			var result []*Course
			for i := range items {
				result = append(result, &items[i])
			}
			return result, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*Course
	for _, c := range r.courses {
		if category != "" && c.Category != category {
			continue
		}
		result = append(result, c)
	}
	return result, nil
}
