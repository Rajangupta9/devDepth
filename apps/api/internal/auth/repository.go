package auth

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/rajangupta9/pgkit/db"
	"github.com/rajangupta9/pgkit/qb"
)

var ErrUserNotFound = errors.New("user not found")
var ErrUserAlreadyExists = errors.New("user already exists")

type Repository interface {
	CreateUser(ctx context.Context, user *User) error
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, id string) (*User, error)
}

type postgresRepository struct {
	client    *db.Client
	tableName string
	mu        sync.RWMutex
	users     map[string]*User
}

func NewRepository(client *db.Client) Repository {
	return &postgresRepository{
		client:    client,
		tableName: "users",
		users:     make(map[string]*User),
	}
}

func (r *postgresRepository) CreateUser(ctx context.Context, user *User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	if user.ID == "" {
		user.ID = "usr_" + time.Now().Format("20060102150405")
	}

	// Use pgkit PostgreSQL client if initialized
	if r.client != nil {
		query := r.client.QB(r.tableName)
		_, err := r.client.Insert(ctx, query, map[string]any{
			"id":            user.ID,
			"email":         user.Email,
			"password_hash": user.PasswordHash,
			"full_name":     user.FullName,
			"role":          user.Role,
			"goal":          user.Goal,
			"created_at":    user.CreatedAt,
			"updated_at":    user.UpdatedAt,
		})
		return err
	}

	// Fallback memory store
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, u := range r.users {
		if u.Email == user.Email {
			return ErrUserAlreadyExists
		}
	}

	r.users[user.ID] = user
	return nil
}

func (r *postgresRepository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("email", qb.OpEq, email))
		users, err := db.QueryInto[User](ctx, r.client, query)
		if err != nil || len(users) == 0 {
			return nil, ErrUserNotFound
		}
		return &users[0], nil
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, u := range r.users {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, ErrUserNotFound
}

func (r *postgresRepository) GetUserByID(ctx context.Context, id string) (*User, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("id", qb.OpEq, id))
		users, err := db.QueryInto[User](ctx, r.client, query)
		if err != nil || len(users) == 0 {
			return nil, ErrUserNotFound
		}
		return &users[0], nil
	}

	r.mu.RLock()
	defer r.mu.RUnlock()

	if u, exists := r.users[id]; exists {
		return u, nil
	}
	return nil, ErrUserNotFound
}
