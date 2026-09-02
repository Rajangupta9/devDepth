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
		Description: "Master Arrays, Linked Lists, Trees, Graphs, Dynamic Programming with step-by-step state visualizer.",
		Level:       "Beginner to Intermediate",
		Modules: []Module{
			{
				ID:          "mod_arrays",
				Title:       "Arrays & Memory Layout",
				Description: "Contiguous allocation, index arithmetic, two pointers, sliding window.",
				Lessons: []Lesson{
					{
						ID:            "les_array_basics",
						Title:         "Understanding Array Memory & Indexing",
						Slug:          "array-memory-indexing",
						Type:          "visualization",
						Content:       "Arrays store elements in contiguous memory slots. Access is O(1) via base + i * size.",
						VisualizerID:  "array_pointer_visualizer",
						EstimatedMins: 15,
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
		Description: "Interactive step-by-step visualization of TCP 3-Way Handshake, HTTP Lifecycle, DNS, and TLS.",
		Level:       "Intermediate",
		Modules: []Module{
			{
				ID:          "mod_tcp",
				Title:       "TCP Protocol & State Transitions",
				Description: "SYN, SYN-ACK, ACK packet exchange and socket sequence states.",
				Lessons: []Lesson{
					{
						ID:            "les_tcp_handshake",
						Title:         "TCP 3-Way Handshake Interactive Lab",
						Slug:          "tcp-3-way-handshake",
						Type:          "visualization",
						Content:       "Step through SYN, SYN+ACK, and ACK flags to understand reliable connection initialization.",
						VisualizerID:  "tcp_handshake_visualizer",
						EstimatedMins: 20,
					},
				},
			},
		},
	}

	r.courses[dsaCourse.Slug] = dsaCourse
	r.courses[netCourse.Slug] = netCourse
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
