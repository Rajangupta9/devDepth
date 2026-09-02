package courses

type Lesson struct {
	ID            string `json:"id" db:"id"`
	Title         string `json:"title" db:"title"`
	Slug          string `json:"slug" db:"slug"`
	Type          string `json:"type" db:"type"` // "concept", "lab", "visualization", "practice"
	Content       string `json:"content" db:"content"`
	VisualizerID  string `json:"visualizer_id,omitempty" db:"visualizer_id"`
	EstimatedMins int    `json:"estimated_mins" db:"estimated_mins"`
}

type Module struct {
	ID          string   `json:"id" db:"id"`
	Title       string   `json:"title" db:"title"`
	Description string   `json:"description" db:"description"`
	Lessons     []Lesson `json:"lessons" db:"lessons"`
}

type Course struct {
	ID          string   `json:"id" db:"id"`
	Slug        string   `json:"slug" db:"slug"`
	Title       string   `json:"title" db:"title"`
	Category    string   `json:"category" db:"category"` // "dsa", "networking", "os", "databases", "system_design"
	Description string   `json:"description" db:"description"`
	Level       string   `json:"level" db:"level"`
	Modules     []Module `json:"modules" db:"modules"`
}
