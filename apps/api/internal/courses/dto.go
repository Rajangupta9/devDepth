package courses

type CreateCourseRequest struct {
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Level       string   `json:"level"`
	Modules     []Module `json:"modules"`
}
