package problems

import (
	"context"

	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
)

type Service interface {
	CreateProblem(ctx context.Context, req CreateProblemRequest) (*Problem, error)
	GetProblem(ctx context.Context, slug string) (*Problem, error)
	ListProblems(ctx context.Context, filter FilterProblemsRequest) ([]*Problem, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateProblem(ctx context.Context, req CreateProblemRequest) (*Problem, error) {
	if req.Title == "" || req.Slug == "" {
		return nil, appErrors.ValidationError("Title and Slug are required")
	}

	p := &Problem{
		Slug:        req.Slug,
		Title:       req.Title,
		Statement:   req.Statement,
		Difficulty:  req.Difficulty,
		Topic:       req.Topic,
		Pattern:     req.Pattern,
		Constraints: req.Constraints,
		TestCases:   req.TestCases,
		Hints:       req.Hints,
	}

	if err := s.repo.Create(ctx, p); err != nil {
		return nil, appErrors.DatabaseError(err)
	}

	return p, nil
}

func (s *service) GetProblem(ctx context.Context, slug string) (*Problem, error) {
	p, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, appErrors.NotFoundError("Problem not found")
	}
	return p, nil
}

func (s *service) ListProblems(ctx context.Context, filter FilterProblemsRequest) ([]*Problem, error) {
	return s.repo.List(ctx, filter)
}
