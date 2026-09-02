package problems

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/rajangupta9/pgkit/db"
	"github.com/rajangupta9/pgkit/qb"
)

var ErrProblemNotFound = errors.New("problem not found")

type Repository interface {
	Create(ctx context.Context, problem *Problem) error
	GetBySlug(ctx context.Context, slug string) (*Problem, error)
	List(ctx context.Context, filter FilterProblemsRequest) ([]*Problem, error)
}

type postgresRepository struct {
	client    *db.Client
	tableName string
	mu        sync.RWMutex
	problems  map[string]*Problem
}

func NewRepository(client *db.Client) Repository {
	repo := &postgresRepository{
		client:    client,
		tableName: "problems",
		problems:  make(map[string]*Problem),
	}
	repo.seedInitialProblems()
	return repo
}

func (r *postgresRepository) seedInitialProblems() {
	p := &Problem{
		ID:          "prob_two_sum",
		Slug:        "two-sum",
		Title:       "Two Sum",
		Statement:   "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
		Difficulty:  "easy",
		Topic:       "arrays",
		Pattern:     "hash-table",
		Constraints: "2 <= nums.length <= 10^4",
		TestCases: []TestCase{
			{Input: "[2, 7, 11, 15], 9", Expected: "[0, 1]", IsHidden: false},
			{Input: "[3, 2, 4], 6", Expected: "[1, 2]", IsHidden: false},
			{Input: "[3, 3], 6", Expected: "[0, 1]", IsHidden: true},
		},
		Hints: []string{
			"Try using a Hash Map to store complement values.",
			"For each element, check if target - num exists in your map.",
		},
	}
	r.problems[p.Slug] = p
}

func (r *postgresRepository) Create(ctx context.Context, problem *Problem) error {
	if problem.ID == "" {
		problem.ID = "prob_" + time.Now().Format("20060102150405")
	}

	if r.client != nil {
		query := r.client.QB(r.tableName)
		_, err := r.client.Insert(ctx, query, map[string]any{
			"id":          problem.ID,
			"slug":        problem.Slug,
			"title":       problem.Title,
			"statement":   problem.Statement,
			"difficulty":  problem.Difficulty,
			"topic":       problem.Topic,
			"pattern":     problem.Pattern,
			"constraints": problem.Constraints,
		})
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.problems[problem.Slug] = problem
	return nil
}

func (r *postgresRepository) GetBySlug(ctx context.Context, slug string) (*Problem, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("slug", qb.OpEq, slug))
		items, err := db.QueryInto[Problem](ctx, r.client, query)
		if err != nil || len(items) == 0 {
			return nil, ErrProblemNotFound
		}
		return &items[0], nil
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	if p, exists := r.problems[slug]; exists {
		return p, nil
	}
	return nil, ErrProblemNotFound
}

func (r *postgresRepository) List(ctx context.Context, filter FilterProblemsRequest) ([]*Problem, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName)
		if filter.Topic != "" {
			query = query.Where(qb.Where("topic", qb.OpEq, filter.Topic))
		}
		if filter.Difficulty != "" {
			query = query.Where(qb.Where("difficulty", qb.OpEq, filter.Difficulty))
		}
		if filter.Pattern != "" {
			query = query.Where(qb.Where("pattern", qb.OpEq, filter.Pattern))
		}
		items, err := db.QueryInto[Problem](ctx, r.client, query)
		if err == nil {
			var result []*Problem
			for i := range items {
				result = append(result, &items[i])
			}
			return result, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*Problem
	for _, p := range r.problems {
		if filter.Topic != "" && p.Topic != filter.Topic {
			continue
		}
		if filter.Difficulty != "" && p.Difficulty != filter.Difficulty {
			continue
		}
		if filter.Pattern != "" && p.Pattern != filter.Pattern {
			continue
		}
		result = append(result, p)
	}
	return result, nil
}
