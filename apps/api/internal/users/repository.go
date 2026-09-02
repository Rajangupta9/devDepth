package users

import (
	"context"
	"sync"
	"time"

	"github.com/rajangupta9/pgkit/db"
	"github.com/rajangupta9/pgkit/qb"
)

type Repository interface {
	GetByAnonymousID(ctx context.Context, anonID string) (*User, error)
	UpsertAnonymous(ctx context.Context, anonID string) (*User, error)
}

type repository struct {
	client    *db.Client
	tableName string
	mu        sync.RWMutex
	users     map[string]*User
}

func NewRepository(client *db.Client) Repository {
	return &repository{
		client:    client,
		tableName: "users",
		users:     make(map[string]*User),
	}
}

func (r *repository) GetByAnonymousID(ctx context.Context, anonID string) (*User, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("anonymous_id", qb.OpEq, anonID))
		items, err := db.QueryInto[User](ctx, r.client, query)
		if err == nil && len(items) > 0 {
			return &items[0], nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	if user, exists := r.users[anonID]; exists {
		return user, nil
	}
	return nil, nil
}

func (r *repository) UpsertAnonymous(ctx context.Context, anonID string) (*User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, exists := r.users[anonID]
	now := time.Now()
	if !exists {
		user = &User{
			ID:          "usr_" + now.Format("20060102150405"),
			AnonymousID: anonID,
			CreatedAt:   now,
			LastSeenAt:  now,
		}
		r.users[anonID] = user
	} else {
		user.LastSeenAt = now
	}

	if r.client != nil {
		query := r.client.QB(r.tableName)
		_, _ = r.client.Insert(ctx, query, map[string]any{
			"id":           user.ID,
			"anonymous_id": user.AnonymousID,
			"created_at":   user.CreatedAt,
			"last_seen_at": user.LastSeenAt,
		})
	}

	return user, nil
}
