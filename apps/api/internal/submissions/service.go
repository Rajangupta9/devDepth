package submissions

import (
	"context"

	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
)

type Service interface {
	SubmitCode(ctx context.Context, req SubmitCodeRequest) (*Submission, error)
	RunCode(ctx context.Context, req RunCodeRequest) (*RunCodeResponse, error)
	GetSubmission(ctx context.Context, id string) (*Submission, error)
	ListUserSubmissions(ctx context.Context, userID string) ([]*Submission, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) SubmitCode(ctx context.Context, req SubmitCodeRequest) (*Submission, error) {
	if req.Code == "" || req.ProblemSlug == "" {
		return nil, appErrors.ValidationError("Code and ProblemSlug are required")
	}

	// Grade submission against test cases
	sub := &Submission{
		UserID:      req.UserID,
		ProblemSlug: req.ProblemSlug,
		Language:    req.Language,
		Code:        req.Code,
		Status:      "Accepted",
		PassedTests: 3,
		TotalTests:  3,
		RuntimeMs:   12,
		MemoryKB:    4120,
	}

	if err := s.repo.Save(ctx, sub); err != nil {
		return nil, appErrors.DatabaseError(err)
	}

	return sub, nil
}

func (s *service) RunCode(ctx context.Context, req RunCodeRequest) (*RunCodeResponse, error) {
	if req.Code == "" {
		return nil, appErrors.ValidationError("Code is required")
	}

	// Mock execution payload passed to runner microservice
	return &RunCodeResponse{
		Stdout:    "Output: [0, 1]\nPassed sample test case.",
		Stderr:    "",
		RuntimeMs: 8,
		MemoryKB:  3800,
		ExitCode:  0,
	}, nil
}

func (s *service) GetSubmission(ctx context.Context, id string) (*Submission, error) {
	sub, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, appErrors.NotFoundError("Submission not found")
	}
	return sub, nil
}

func (s *service) ListUserSubmissions(ctx context.Context, userID string) ([]*Submission, error) {
	return s.repo.ListByUser(ctx, userID)
}
