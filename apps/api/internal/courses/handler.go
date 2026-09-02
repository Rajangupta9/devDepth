package courses

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
	category := r.URL.Query().Get("category")
	courses, err := h.service.ListCourses(r.Context(), category)
	if err != nil {
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, courses)
}

func (h *Handler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	if slug == "" {
		gopkgHttp.BadRequest(w, "Missing slug parameter")
		return
	}

	course, err := h.service.GetCourse(r.Context(), slug)
	if err != nil {
		if appErr, ok := err.(*appErrors.AppError); ok && appErr.Code == appErrors.ErrCodeNotFound {
			gopkgHttp.NotFound(w, appErr.Message)
			return
		}
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, course)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateCourseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	course, err := h.service.CreateCourse(r.Context(), req)
	if err != nil {
		gopkgHttp.BadRequest(w, err.Error())
		return
	}

	gopkgHttp.Created(w, course)
}
