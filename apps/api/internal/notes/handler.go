package notes

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

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		userID = r.Header.Get("X-Anonymous-ID")
	}

	notes, err := h.service.ListNotes(r.Context(), userID)
	if err != nil {
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, notes)
}

func (h *Handler) Save(w http.ResponseWriter, r *http.Request) {
	var req SaveNoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid request payload")
		return
	}

	userID := r.Header.Get("X-Anonymous-ID")
	note, err := h.service.SaveNote(r.Context(), userID, req)
	if err != nil {
		gopkgHttp.BadRequest(w, err.Error())
		return
	}

	gopkgHttp.Created(w, note)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	noteID := r.URL.Query().Get("id")
	if noteID == "" {
		gopkgHttp.BadRequest(w, "Missing id parameter")
		return
	}

	userID := r.Header.Get("X-Anonymous-ID")
	if err := h.service.DeleteNote(r.Context(), userID, noteID); err != nil {
		gopkgHttp.InternalError(w, err.Error())
		return
	}

	gopkgHttp.Success(w, map[string]string{"message": "Note deleted successfully"})
}
