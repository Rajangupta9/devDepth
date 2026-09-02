package users

import "context"

type Service interface {
	GetOrCreateAnonymous(ctx context.Context, anonID string) (*UserResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetOrCreateAnonymous(ctx context.Context, anonID string) (*UserResponse, error) {
	if anonID == "" {
		anonID = "anon_default_guest"
	}

	user, err := s.repo.UpsertAnonymous(ctx, anonID)
	if err != nil {
		return nil, err
	}

	return &UserResponse{
		ID:          user.ID,
		AnonymousID: user.AnonymousID,
		Email:       user.Email,
		Name:        user.Name,
		IsAuth:      user.Email != "",
	}, nil
}
