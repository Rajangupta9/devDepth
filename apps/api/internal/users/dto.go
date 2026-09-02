package users

type AnonymousUserRequest struct {
	AnonymousID string `json:"anonymous_id"`
}

type UserResponse struct {
	ID          string `json:"id"`
	AnonymousID string `json:"anonymous_id"`
	Email       string `json:"email,omitempty"`
	Name        string `json:"name,omitempty"`
	IsAuth      bool   `json:"is_authenticated"`
}
