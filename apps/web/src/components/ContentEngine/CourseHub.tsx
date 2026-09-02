import React, { useEffect, useState } from 'react';
import { Course } from '../../types';
import { DevDepthAPI } from '../../api/client';
import { BookOpen, Clock, Layers, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface CourseHubProps {
  onSelectLesson: (lessonId: string) => void;
}

export const CourseHub: React.FC<CourseHubProps> = ({ onSelectLesson }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
      const res = await DevDepthAPI.getCourses(categoryFilter);
      if (res.success && res.data) {
        setCourses(res.data);
        if (res.data.length > 0 && !activeCourse) {
          setActiveCourse(res.data[0]);
        }
      }
      setLoading(false);
    }
    loadCourses();
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'dsa', label: 'DSA & Algorithms' },
    { id: 'networking', label: 'Computer Networks' },
    { id: 'operating-systems', label: 'Operating Systems' },
    { id: 'databases', label: 'Databases' },
    { id: 'system-design', label: 'System Design' },
  ];

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'var(--primary-glow)', color: 'var(--primary-light)', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
          <Layers size={14} /> DevDepth Content Engine
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Interactive Learning Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Schema-driven interactive courses across CS fundamentals. Every concept connects to a live visual state machine.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '32px' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: selectedCategory === cat.id ? '1px solid var(--border-active)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedCategory === cat.id ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === cat.id ? 'var(--primary-light)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Course Content */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading DevDepth courses from Go Backend API...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Left Column: Course Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map((course) => {
              const isSelected = activeCourse?.id === course.id;
              return (
                <div
                  key={course.id}
                  className="glass-card"
                  onClick={() => setActiveCourse(course)}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--border-active)' : undefined,
                    background: isSelected ? 'var(--bg-card-hover)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-primary">{course.category.toUpperCase()}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500 }}>{course.level}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{course.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{course.description}</p>
                  <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {course.modules.length} Modules Available <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Course Detail & Modules */}
          {activeCourse && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>{activeCourse.category.toUpperCase()}</span>
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>{activeCourse.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{activeCourse.description}</p>
              </div>

              {/* Modules & Lessons List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeCourse.modules.map((mod, idx) => (
                  <div key={mod.id} style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                      Module {idx + 1}: {mod.title}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      {mod.description}
                    </div>

                    {/* Lessons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircle2 size={18} color="var(--accent-emerald)" />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px' }}>{les.title}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} /> {les.estimated_mins} mins
                                </span>
                                {les.visualizer_id && (
                                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                                    • Interactive Visual Lab
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => onSelectLesson(les.id)}>
                            Open Lesson
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
