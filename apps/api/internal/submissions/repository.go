package submissions

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/rajangupta9/pgkit/db"
	"github.com/rajangupta9/pgkit/qb"
)

var ErrSubmissionNotFound = errors.New("submission not found")

type Repository interface {
	Save(ctx context.Context, sub *Submission) error
	GetByID(ctx context.Context, id string) (*Submission, error)
	ListByUser(ctx context.Context, userID string) ([]*Submission, error)
}

type postgresRepository struct {
	client      *db.Client
	tableName   string
	mu          sync.RWMutex
	submissions map[string]*Submission
}

func NewRepository(client *db.Client) Repository {
	return &postgresRepository{
		client:      client,
		tableName:   "submissions",
		submissions: make(map[string]*Submission),
	}
}

func (r *postgresRepository) Save(ctx context.Context, sub *Submission) error {
	sub.CreatedAt = time.Now()
	if sub.ID == "" {
		sub.ID = "sub_" + time.Now().Format("20060102150405")
	}

	if r.client != nil {
		query := r.client.QB(r.tableName)
		_, err := r.client.Insert(ctx, query, map[string]any{
			"id":            sub.ID,
			"user_id":       sub.UserID,
			"problem_slug":  sub.ProblemSlug,
			"language":      sub.Language,
			"code":          sub.Code,
			"status":        sub.Status,
			"passed_tests":  sub.PassedTests,
			"total_tests":   sub.TotalTests,
			"runtime_ms":    sub.RuntimeMs,
			"memory_kb":     sub.MemoryKB,
			"error_message": sub.ErrorMessage,
			"created_at":    sub.CreatedAt,
		})
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.submissions[sub.ID] = sub
	return nil
}

func (r *postgresRepository) GetByID(ctx context.Context, id string) (*Submission, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("id", qb.OpEq, id))
		items, err := db.QueryInto[Submission](ctx, r.client, query)
		if err != nil || len(items) == 0 {
			return nil, ErrSubmissionNotFound
		}
		return &items[0], nil
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	if sub, exists := r.submissions[id]; exists {
		return sub, nil
	}
	return nil, ErrSubmissionNotFound
}

func (r *postgresRepository) ListByUser(ctx context.Context, userID string) ([]*Submission, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("user_id", qb.OpEq, userID))
		items, err := db.QueryInto[Submission](ctx, r.client, query)
		if err == nil {
			var result []*Submission
			for i := range items {
				result = append(result, &items[i])
			}
			return result, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*Submission
	for _, sub := range r.submissions {
		if sub.UserID == userID {
			result = append(result, sub)
		}
	}
	return result, nil
}
