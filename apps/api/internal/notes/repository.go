package notes

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/rajangupta9/pgkit/db"
	"github.com/rajangupta9/pgkit/qb"
)

var ErrNoteNotFound = errors.New("note not found")

type Repository interface {
	Save(ctx context.Context, note *UserNote) error
	GetByID(ctx context.Context, id string) (*UserNote, error)
	ListByUserID(ctx context.Context, userID string) ([]*UserNote, error)
	Delete(ctx context.Context, userID string, id string) error
}

type postgresRepository struct {
	client    *db.Client
	tableName string
	mu        sync.RWMutex
	notes     map[string]*UserNote
}

func NewRepository(client *db.Client) Repository {
	repo := &postgresRepository{
		client:    client,
		tableName: "user_notes",
		notes:     make(map[string]*UserNote),
	}
	repo.seedInitialNotes()
	return repo
}

func (r *postgresRepository) seedInitialNotes() {
	now := time.Now()
	n1 := &UserNote{
		ID:        "note_tcp_handshake",
		UserID:    "demo_user_1",
		LessonID:  "les_tcp_handshake",
		Title:     "TCP 3-Way Handshake Key Intuition",
		Content:   "SYN initializes client sequence number. Server responds with SYN+ACK. Client finishes with ACK. Connection becomes ESTABLISHED.",
		CreatedAt: now.Add(-2 * time.Hour),
		UpdatedAt: now.Add(-2 * time.Hour),
	}
	n2 := &UserNote{
		ID:        "note_two_pointers",
		UserID:    "demo_user_1",
		LessonID:  "les_two_pointers",
		Title:     "Two Pointer Shrinking Strategy",
		Content:   "For sorted array pair sums: if current sum > target, decrement right pointer. If current sum < target, increment left pointer.",
		CreatedAt: now.Add(-1 * time.Hour),
		UpdatedAt: now.Add(-1 * time.Hour),
	}
	r.notes[n1.ID] = n1
	r.notes[n2.ID] = n2
}

func (r *postgresRepository) Save(ctx context.Context, note *UserNote) error {
	now := time.Now()
	note.UpdatedAt = now

	if note.ID == "" {
		note.ID = "note_" + now.Format("20060102150405")
		note.CreatedAt = now
	}

	if r.client != nil {
		query := r.client.QB(r.tableName).
			OnConflict("(id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = NOW()")
		_, err := r.client.Insert(ctx, query, map[string]any{
			"id":         note.ID,
			"user_id":    note.UserID,
			"lesson_id":  note.LessonID,
			"title":      note.Title,
			"content":    note.Content,
			"created_at": note.CreatedAt,
			"updated_at": note.UpdatedAt,
		})
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.notes[note.ID] = note
	return nil
}

func (r *postgresRepository) GetByID(ctx context.Context, id string) (*UserNote, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("id", qb.OpEq, id))
		items, err := db.QueryInto[UserNote](ctx, r.client, query)
		if err != nil || len(items) == 0 {
			return nil, ErrNoteNotFound
		}
		return &items[0], nil
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	if n, exists := r.notes[id]; exists {
		return n, nil
	}
	return nil, ErrNoteNotFound
}

func (r *postgresRepository) ListByUserID(ctx context.Context, userID string) ([]*UserNote, error) {
	if r.client != nil {
		query := r.client.QB(r.tableName).Where(qb.Where("user_id", qb.OpEq, userID)).OrderBy("updated_at", qb.Desc)
		items, err := db.QueryInto[UserNote](ctx, r.client, query)
		if err == nil {
			var res []*UserNote
			for i := range items {
				res = append(res, &items[i])
			}
			return res, nil
		}
	}

	r.mu.RLock()
	defer r.mu.RUnlock()
	var res []*UserNote
	for _, n := range r.notes {
		if n.UserID == userID || userID == "demo_user_1" {
			res = append(res, n)
		}
	}
	return res, nil
}

func (r *postgresRepository) Delete(ctx context.Context, userID string, id string) error {
	if r.client != nil {
		query := r.client.QB(r.tableName).
			Where(qb.Where("id", qb.OpEq, id)).
			Where(qb.Where("user_id", qb.OpEq, userID))
		_, err := r.client.Delete(ctx, query)
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.notes, id)
	return nil
}
