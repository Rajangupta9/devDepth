package submissions

import "time"

type Submission struct {
	ID           string    `json:"id" db:"id"`
	UserID       string    `json:"user_id" db:"user_id"`
	ProblemSlug  string    `json:"problem_slug" db:"problem_slug"`
	Language     string    `json:"language" db:"language"` // "javascript", "python", "go", "cpp", "java"
	Code         string    `json:"code" db:"code"`
	Status       string    `json:"status" db:"status"` // "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"
	PassedTests  int       `json:"passed_tests" db:"passed_tests"`
	TotalTests   int       `json:"total_tests" db:"total_tests"`
	RuntimeMs    int64     `json:"runtime_ms" db:"runtime_ms"`
	MemoryKB     int64     `json:"memory_kb" db:"memory_kb"`
	ErrorMessage string    `json:"error_message,omitempty" db:"error_message"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}
