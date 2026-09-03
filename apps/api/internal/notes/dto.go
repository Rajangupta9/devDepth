package notes

type SaveNoteRequest struct {
	LessonID string `json:"lesson_id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
}

type UserNoteResponse struct {
	Note *UserNote `json:"note"`
}
