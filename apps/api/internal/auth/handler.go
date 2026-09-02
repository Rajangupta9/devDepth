package auth

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

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	resp, err := h.service.Register(r.Context(), req)
	if err != nil {
		handleError(w, err)
		return
	}

	gopkgHttp.Created(w, resp)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	resp, err := h.service.Login(r.Context(), req)
	if err != nil {
		handleError(w, err)
		return
	}

	gopkgHttp.Success(w, resp)
}

func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		gopkgHttp.BadRequest(w, "Missing user_id parameter")
		return
	}

	user, err := h.service.GetUserByID(r.Context(), userID)
	if err != nil {
		handleError(w, err)
		return
	}

	gopkgHttp.Success(w, user)
}

func handleError(w http.ResponseWriter, err error) {
	var appErr *appErrors.AppError
	if errorsIsAppError(err, &appErr) {
		switch appErr.Code {
		case appErrors.ErrCodeValidation:
			gopkgHttp.BadRequest(w, appErr.Message)
		case appErrors.ErrCodeUnauthorized:
			gopkgHttp.Unauthorized(w, appErr.Message)
		case appErrors.ErrCodeNotFound:
			gopkgHttp.NotFound(w, appErr.Message)
		default:
			gopkgHttp.InternalError(w, appErr.Message)
		}
		return
	}
	gopkgHttp.InternalError(w, err.Error())
}

func errorsIsAppError(err error, target **appErrors.AppError) bool {
	if appErr, ok := err.(*appErrors.AppError); ok {
		*target = appErr
		return true
	}
	return false
}
