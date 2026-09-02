package problems

type TestCase struct {
	Input    string `json:"input" db:"input"`
	Expected string `json:"expected" db:"expected"`
	IsHidden bool   `json:"is_hidden" db:"is_hidden"`
}

type Problem struct {
	ID          string     `json:"id" db:"id"`
	Slug        string     `json:"slug" db:"slug"`
	Title       string     `json:"title" db:"title"`
	Statement   string     `json:"statement" db:"statement"`
	Difficulty  string     `json:"difficulty" db:"difficulty"` // "easy", "medium", "hard"
	Topic       string     `json:"topic" db:"topic"`
	Pattern     string     `json:"pattern" db:"pattern"`
	Constraints string     `json:"constraints" db:"constraints"`
	TestCases   []TestCase `json:"test_cases" db:"test_cases"`
	Hints       []string   `json:"hints" db:"hints"`
}
