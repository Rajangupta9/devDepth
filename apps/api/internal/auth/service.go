package auth

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
	"github.com/Rajangupta9/gopkg/pkg/utils/validation"
)

type Service interface {
	Register(ctx context.Context, req RegisterRequest) (*AuthResponse, error)
	Login(ctx context.Context, req LoginRequest) (*AuthResponse, error)
	GetUserByID(ctx context.Context, id string) (*User, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Register(ctx context.Context, req RegisterRequest) (*AuthResponse, error) {
	if req.Email == "" || req.Password == "" {
		return nil, appErrors.ValidationError("Email and password are required")
	}

	if err := validation.Email(req.Email); err != nil {
		return nil, appErrors.ValidationError("Invalid email format")
	}

	existing, _ := s.repo.GetUserByEmail(ctx, req.Email)
	if existing != nil {
		return nil, appErrors.New(appErrors.ErrCodeValidation, "User with this email already exists")
	}

	hashedPassword := hashPassword(req.Password)
	role := "learner"
	if req.Goal == "" {
		req.Goal = "dsa"
	}

	user := &User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		FullName:     req.FullName,
		Role:         role,
		Goal:         req.Goal,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, appErrors.DatabaseError(err)
	}

	token := generateMockToken(user.ID)
	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *service) Login(ctx context.Context, req LoginRequest) (*AuthResponse, error) {
	if req.Email == "" || req.Password == "" {
		return nil, appErrors.ValidationError("Email and password are required")
	}

	user, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil, appErrors.UnauthorizedError("Invalid credentials")
	}

	if user.PasswordHash != hashPassword(req.Password) {
		return nil, appErrors.UnauthorizedError("Invalid credentials")
	}

	token := generateMockToken(user.ID)
	return &AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *service) GetUserByID(ctx context.Context, id string) (*User, error) {
	user, err := s.repo.GetUserByID(ctx, id)
	if err != nil {
		return nil, appErrors.NotFoundError("User not found")
	}
	return user, nil
}

func hashPassword(password string) string {
	h := sha256.New()
	h.Write([]byte(password))
	return hex.EncodeToString(h.Sum(nil))
}

func generateMockToken(userID string) string {
	return fmt.Sprintf("devdepth_jwt_%s_token", userID)
}
