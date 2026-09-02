package auth

import "time"

// User represents the user account entity in DevDepth PostgreSQL DB
type User struct {
	ID           string    `json:"id" db:"id"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	FullName     string    `json:"full_name" db:"full_name"`
	Role         string    `json:"role" db:"role"` // "learner", "editor", "admin"
	Goal         string    `json:"goal" db:"goal"` // "dsa", "cs_fundamentals", "system_design"
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}
