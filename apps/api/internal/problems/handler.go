package problems

import (
	"encoding/json"
	"net/http"

	gopkgHttp "github.com/Rajangupta9/gopkg/pkg/http"
	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	filter := FilterProblemsRequest{
		Topic:      r.URL.Query().Get("topic"),
		Difficulty: r.URL.Query().Get("difficulty"),
		Pattern:    r.URL.Query().Get("pattern"),
	}

	problems, err := h.service.ListProblems(r.Context(), filter)
	if err != nil {
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, problems)
}

func (h *Handler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	if slug == "" {
		gopkgHttp.BadRequest(w, "Missing slug parameter")
		return
	}

	problem, err := h.service.GetProblem(r.Context(), slug)
	if err != nil {
		if appErr, ok := err.(*appErrors.AppError); ok && appErr.Code == appErrors.ErrCodeNotFound {
			gopkgHttp.NotFound(w, appErr.Message)
			return
		}
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, problem)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateProblemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	problem, err := h.service.CreateProblem(r.Context(), req)
	if err != nil {
		gopkgHttp.BadRequest(w, err.Error())
		return
	}

	gopkgHttp.Created(w, problem)
}
