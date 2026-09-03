import React, { useState, useEffect } from 'react';
import { useTheme, Card, Button, Badge, Icon } from '@devdepth/ui';
import { UserNote } from '../../types';
import { DevDepthAPI } from '../../api/client';

export const UserDashboard: React.FC = () => {
  const { mode, colors } = useTheme();
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Note Form State
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');

  const loadNotes = async () => {
    setLoading(true);
    const res = await DevDepthAPI.getNotes();
    if (res.success && res.data) {
      setNotes(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSaving(true);
    setMsg('');

    const res = await DevDepthAPI.saveNote({
      title,
      content,
      lesson_id: 'user_custom_note',
    });

    if (res.success) {
      setMsg('Note saved successfully to PostgreSQL database via pgkit!');
      setTitle('');
      setContent('');
      loadNotes();
    } else {
      setMsg(res.error || 'Failed to save note.');
    }
    setIsSaving(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    const res = await DevDepthAPI.deleteNote(noteId);
    if (res.success) {
      loadNotes();
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '8px 0', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* User Profile Header Card */}
      <div className="glass-panel" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.indigo})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                boxShadow: `0 8px 24px ${colors.primaryGlow}`,
              }}
            >
              <Icon name="user" size={32} color="#FFF" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: colors.text }}>
                  Developer Account Profile
                </h1>
                <Badge variant="primary">V1 Local Identity</Badge>
                <Badge variant="easy">PostgreSQL Synced</Badge>
              </div>
              <p style={{ margin: '4px 0 0 0', color: colors.muted, fontSize: '14px' }}>
                All user notes, exercise submissions, and mastery progress are persisted in PostgreSQL via <strong>pgkit/db</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '10px 18px', background: colors.surface, borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
              <div style={{ fontSize: '11px', color: colors.subtle, fontWeight: 600 }}>Active Saved Notes</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: colors.primaryLight }}>{notes.length}</div>
            </div>
            <div style={{ padding: '10px 18px', background: colors.surface, borderRadius: '12px', border: `1px solid ${colors.borderSubtle}` }}>
              <div style={{ fontSize: '11px', color: colors.subtle, fontWeight: 600 }}>DB Engine</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: colors.success }}>pgkit/db</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Create Note & Saved Notes List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px' }}>
        {/* Left Column: Create Note Form */}
        <Card variant="glass">
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800, color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="edit" size={18} color={colors.primaryLight} /> Save Personal CS Note
          </h3>

          {msg && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: colors.primaryGlow, color: colors.primaryLight, fontSize: '0.85rem', fontWeight: 600 }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: colors.muted, marginBottom: '6px' }}>
                Note Title / Topic
              </label>
              <input
                type="text"
                placeholder="e.g. B+ Tree Indexing or TCP SYN Packet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderSubtle}`,
                  color: colors.text,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: colors.muted, marginBottom: '6px' }}>
                Note Content / Summary
              </label>
              <textarea
                rows={6}
                placeholder="Write your intuition, complexity analysis, or formula notes..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderSubtle}`,
                  color: colors.text,
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'sans-serif',
                }}
              />
            </div>

            <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Icon name="check" size={16} />}>
              Save Note to Database
            </Button>
          </form>
        </Card>

        {/* Right Column: Saved Notes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="bookOpen" size={18} color={colors.cyan} /> My Saved CS Notes
            </h3>

            <input
              type="text"
              placeholder="Filter notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: colors.surface,
                border: `1px solid ${colors.borderSubtle}`,
                color: colors.text,
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
          </div>

          {loading ? (
            <Card variant="surface" style={{ textAlign: 'center', padding: '32px', color: colors.muted }}>
              Loading user notes from PostgreSQL API...
            </Card>
          ) : filteredNotes.length === 0 ? (
            <Card variant="surface" style={{ textAlign: 'center', padding: '32px', color: colors.muted }}>
              No notes found. Create your first note on the left!
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} variant="surface" interactive style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: colors.text }}>
                    {note.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: colors.subtle }}>
                      {note.updated_at ? new Date(note.updated_at).toLocaleDateString() : 'Just now'}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.error,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title="Delete note"
                    >
                      <Icon name="trash" size={15} color={colors.error} />
                    </button>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.875rem', color: colors.muted, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
