package auth

import (
	"context"
	"os"
	"strconv"
	"time"

	gopkgAuth "github.com/Rajangupta9/gopkg/pkg/auth"
	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
	"github.com/Rajangupta9/gopkg/pkg/utils/validation"
)

type Service interface {
	Register(ctx context.Context, req RegisterRequest) (*AuthResponse, error)
	Login(ctx context.Context, req LoginRequest) (*AuthResponse, error)
	GetUserByID(ctx context.Context, id string) (*User, error)
}

type service struct {
	repo   Repository
	jwtCfg gopkgAuth.JWTConfig
}

func NewService(repo Repository) Service {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "devdepth_gopkg_auth_jwt_secret_2026_super_secure_98765"
	}
	jwtCfg := gopkgAuth.DefaultJWTConfig([]byte(secret), "devdepth-api")
	return &service{
		repo:   repo,
		jwtCfg: jwtCfg,
	}
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

	hashedPassword, err := gopkgAuth.HashPassword(req.Password, gopkgAuth.DefaultArgon2idParams)
	if err != nil {
		return nil, appErrors.InternalError("Failed to secure password")
	}

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

	accountID, _ := strconv.ParseInt(user.ID, 10, 64)
	if accountID == 0 {
		accountID = time.Now().UnixNano()
	}

	token, exp, err := gopkgAuth.IssueAccessToken(s.jwtCfg, accountID, 0, gopkgAuth.SubjectRoot, time.Now())
	if err != nil {
		return nil, appErrors.InternalError("Failed to issue access token")
	}

	expiresIn := int64(time.Until(exp).Seconds())

	return &AuthResponse{
		Token:     token,
		TokenType: "Bearer",
		ExpiresIn: expiresIn,
		User:      user,
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

	valid, err := gopkgAuth.VerifyPassword(req.Password, user.PasswordHash)
	if err != nil || !valid {
		return nil, appErrors.UnauthorizedError("Invalid credentials")
	}

	accountID, _ := strconv.ParseInt(user.ID, 10, 64)
	if accountID == 0 {
		accountID = time.Now().UnixNano()
	}

	token, exp, err := gopkgAuth.IssueAccessToken(s.jwtCfg, accountID, 0, gopkgAuth.SubjectRoot, time.Now())
	if err != nil {
		return nil, appErrors.InternalError("Failed to issue access token")
	}

	expiresIn := int64(time.Until(exp).Seconds())

	return &AuthResponse{
		Token:     token,
		TokenType: "Bearer",
		ExpiresIn: expiresIn,
		User:      user,
	}, nil
}

func (s *service) GetUserByID(ctx context.Context, id string) (*User, error) {
	user, err := s.repo.GetUserByID(ctx, id)
	if err != nil {
		return nil, appErrors.NotFoundError("User not found")
	}
	return user, nil
}
