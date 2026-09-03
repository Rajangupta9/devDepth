package notes

import (
	"context"

	appErrors "github.com/Rajangupta9/gopkg/pkg/utils/errors"
)

type Service interface {
	SaveNote(ctx context.Context, userID string, req SaveNoteRequest) (*UserNote, error)
	ListNotes(ctx context.Context, userID string) ([]*UserNote, error)
	DeleteNote(ctx context.Context, userID string, noteID string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) SaveNote(ctx context.Context, userID string, req SaveNoteRequest) (*UserNote, error) {
	if userID == "" {
		userID = "demo_user_1"
	}
	if req.Title == "" {
		return nil, appErrors.ValidationError("Note title cannot be empty")
	}

	note := &UserNote{
		UserID:   userID,
		LessonID: req.LessonID,
		Title:    req.Title,
		Content:  req.Content,
	}

	if err := s.repo.Save(ctx, note); err != nil {
		return nil, appErrors.DatabaseError(err)
	}

	return note, nil
}

func (s *service) ListNotes(ctx context.Context, userID string) ([]*UserNote, error) {
	if userID == "" {
		userID = "demo_user_1"
	}

	notes, err := s.repo.ListByUserID(ctx, userID)
	if err != nil {
		return nil, appErrors.DatabaseError(err)
	}

	return notes, nil
}

func (s *service) DeleteNote(ctx context.Context, userID string, noteID string) error {
	if userID == "" {
		userID = "demo_user_1"
	}

	if err := s.repo.Delete(ctx, userID, noteID); err != nil {
		return appErrors.DatabaseError(err)
	}

	return nil
}
