package problems

type CreateProblemRequest struct {
	Slug        string     `json:"slug"`
	Title       string     `json:"title"`
	Statement   string     `json:"statement"`
	Difficulty  string     `json:"difficulty"`
	Topic       string     `json:"topic"`
	Pattern     string     `json:"pattern"`
	Constraints string     `json:"constraints"`
	TestCases   []TestCase `json:"test_cases"`
	Hints       []string   `json:"hints"`
}

type FilterProblemsRequest struct {
	Topic      string `json:"topic"`
	Difficulty string `json:"difficulty"`
	Pattern    string `json:"pattern"`
}
