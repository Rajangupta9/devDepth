package submissions

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

func (h *Handler) Submit(w http.ResponseWriter, r *http.Request) {
	var req SubmitCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	sub, err := h.service.SubmitCode(r.Context(), req)
	if err != nil {
		gopkgHttp.BadRequest(w, err.Error())
		return
	}

	gopkgHttp.Created(w, sub)
}

func (h *Handler) Run(w http.ResponseWriter, r *http.Request) {
	var req RunCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	res, err := h.service.RunCode(r.Context(), req)
	if err != nil {
		gopkgHttp.BadRequest(w, err.Error())
		return
	}

	gopkgHttp.Success(w, res)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		gopkgHttp.BadRequest(w, "Missing id parameter")
		return
	}

	sub, err := h.service.GetSubmission(r.Context(), id)
	if err != nil {
		if appErr, ok := err.(*appErrors.AppError); ok && appErr.Code == appErrors.ErrCodeNotFound {
			gopkgHttp.NotFound(w, appErr.Message)
			return
		}
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, sub)
}
