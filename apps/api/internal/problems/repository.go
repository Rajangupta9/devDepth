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
	p1 := &Problem{
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

	p2 := &Problem{
		ID:          "prob_valid_parentheses",
		Slug:        "valid-parentheses",
		Title:       "Valid Parentheses",
		Statement:   "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
		Difficulty:  "easy",
		Topic:       "stacks",
		Pattern:     "stack-matching",
		Constraints: "1 <= s.length <= 10^4",
		TestCases: []TestCase{
			{Input: "\"()[]{}\"", Expected: "true", IsHidden: false},
			{Input: "\"(]\"", Expected: "false", IsHidden: false},
			{Input: "\"{[]}\"", Expected: "true", IsHidden: true},
		},
		Hints: []string{
			"Push opening brackets onto a stack.",
			"When encountering a closing bracket, pop from the stack and verify matching type.",
		},
	}

	p3 := &Problem{
		ID:          "prob_reverse_linked_list",
		Slug:        "reverse-linked-list",
		Title:       "Reverse Linked List",
		Statement:   "Given the head of a singly linked list, reverse the list, and return the reversed list.",
		Difficulty:  "easy",
		Topic:       "linked-lists",
		Pattern:     "pointer-manipulation",
		Constraints: "0 <= number of nodes <= 5000",
		TestCases: []TestCase{
			{Input: "[1, 2, 3, 4, 5]", Expected: "[5, 4, 3, 2, 1]", IsHidden: false},
			{Input: "[1, 2]", Expected: "[2, 1]", IsHidden: false},
		},
		Hints: []string{
			"Maintain three pointers: prev, curr, and next.",
			"Invert the curr.next pointer to point to prev at each step.",
		},
	}

	p4 := &Problem{
		ID:          "prob_container_most_water",
		Slug:        "container-with-most-water",
		Title:       "Container With Most Water",
		Statement:   "Given an integer array `height` of length n, find two lines that together with the x-axis form a container that contains the most water.",
		Difficulty:  "medium",
		Topic:       "arrays",
		Pattern:     "two-pointers",
		Constraints: "n == height.length, 2 <= n <= 10^5",
		TestCases: []TestCase{
			{Input: "[1,8,6,2,5,4,8,3,7]", Expected: "49", IsHidden: false},
			{Input: "[1,1]", Expected: "1", IsHidden: false},
		},
		Hints: []string{
			"Initialize two pointers at both ends of the array.",
			"Move the pointer pointing to the shorter line inward to attempt finding a taller boundary.",
		},
	}

	p5 := &Problem{
		ID:          "prob_binary_search_rotated",
		Slug:        "search-in-rotated-sorted-array",
		Title:       "Search in Rotated Sorted Array",
		Statement:   "Given a rotated sorted array `nums` and a `target`, return the index of target if it is in nums, or -1 if it is not in nums.",
		Difficulty:  "medium",
		Topic:       "arrays",
		Pattern:     "binary-search",
		Constraints: "1 <= nums.length <= 5000",
		TestCases: []TestCase{
			{Input: "[4,5,6,7,0,1,2], 0", Expected: "4", IsHidden: false},
			{Input: "[4,5,6,7,0,1,2], 3", Expected: "-1", IsHidden: false},
		},
		Hints: []string{
			"Notice that at least one half of the array (left or right) is always sorted.",
			"Determine which side is sorted and check if target lies within its bounds.",
		},
	}

	r.problems[p1.Slug] = p1
	r.problems[p2.Slug] = p2
	r.problems[p3.Slug] = p3
	r.problems[p4.Slug] = p4
	r.problems[p5.Slug] = p5
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
