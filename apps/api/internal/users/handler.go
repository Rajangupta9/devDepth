package users

import (
	"encoding/json"
	"net/http"

	gopkgHttp "github.com/Rajangupta9/gopkg/pkg/http"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetOrCreateAnonymous(w http.ResponseWriter, r *http.Request) {
	var req AnonymousUserRequest
	_ = json.NewDecoder(r.Body).Decode(&req)

	if req.AnonymousID == "" {
		req.AnonymousID = r.Header.Get("X-Anonymous-ID")
	}

	user, err := h.service.GetOrCreateAnonymous(r.Context(), req.AnonymousID)
	if err != nil {
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, user)
}
