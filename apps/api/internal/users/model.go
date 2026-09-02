package users

import "time"

type User struct {
	ID          string    `json:"id" db:"id"`
	AnonymousID string    `json:"anonymous_id" db:"anonymous_id"`
	Email       string    `json:"email,omitempty" db:"email"`
	Name        string    `json:"name,omitempty" db:"name"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	LastSeenAt  time.Time `json:"last_seen_at" db:"last_seen_at"`
}
