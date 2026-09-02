package submissions

type SubmitCodeRequest struct {
	UserID      string `json:"user_id"`
	ProblemSlug string `json:"problem_slug"`
	Language    string `json:"language"`
	Code        string `json:"code"`
}

type RunCodeRequest struct {
	Language string `json:"language"`
	Code     string `json:"code"`
	Input    string `json:"input"`
}

type RunCodeResponse struct {
	Stdout       string `json:"stdout"`
	Stderr       string `json:"stderr"`
	RuntimeMs    int64  `json:"runtime_ms"`
	MemoryKB     int64  `json:"memory_kb"`
	ExitCode     int    `json:"exit_code"`
	ErrorMessage string `json:"error_message,omitempty"`
}
