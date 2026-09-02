package courses

import (
	"context"

	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
)

type Service interface {
	CreateCourse(ctx context.Context, req CreateCourseRequest) (*Course, error)
	GetCourse(ctx context.Context, slug string) (*Course, error)
	ListCourses(ctx context.Context, category string) ([]*Course, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateCourse(ctx context.Context, req CreateCourseRequest) (*Course, error) {
	if req.Title == "" || req.Slug == "" {
		return nil, appErrors.ValidationError("Title and Slug are required")
	}

	c := &Course{
		Slug:        req.Slug,
		Title:       req.Title,
		Category:    req.Category,
		Description: req.Description,
		Level:       req.Level,
		Modules:     req.Modules,
	}

	if err := s.repo.Create(ctx, c); err != nil {
		return nil, appErrors.DatabaseError(err)
	}

	return c, nil
}

func (s *service) GetCourse(ctx context.Context, slug string) (*Course, error) {
	c, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, appErrors.NotFoundError("Course not found")
	}
	return c, nil
}

func (s *service) ListCourses(ctx context.Context, category string) ([]*Course, error) {
	return s.repo.List(ctx, category)
}
