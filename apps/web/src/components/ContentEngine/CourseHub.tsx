import React, { useEffect, useState } from 'react';
import { Course } from '../../types';
import { DevDepthAPI } from '../../api/client';
import { Clock, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '@devdepth/ui';

interface CourseHubProps {
  onSelectLesson: (lessonId: string) => void;
}

export const CourseHub: React.FC<CourseHubProps> = ({ onSelectLesson }) => {
  const { colors } = useTheme();
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
    <div style={{ padding: '8px 0', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: colors.primaryGlow, color: colors.primaryLight, fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
          <Layers size={14} /> DevDepth Content Engine
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: colors.text }}>Interactive Learning Hub</h1>
        <p style={{ color: colors.muted, fontSize: '16px' }}>
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
              padding: '8px 18px',
              borderRadius: '9999px',
              border: selectedCategory === cat.id ? `1px solid ${colors.primary}` : `1px solid ${colors.borderSubtle}`,
              background: selectedCategory === cat.id ? colors.primaryGlow : colors.surface,
              color: selectedCategory === cat.id ? colors.primaryLight : colors.muted,
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
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: colors.muted }}>
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
                    borderColor: isSelected ? colors.primary : undefined,
                    background: isSelected ? colors.surfaceHover : undefined,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-primary">{course.category.toUpperCase()}</span>
                    <span style={{ fontSize: '12px', color: colors.subtle, fontWeight: 500 }}>{course.level}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', color: colors.text }}>{course.title}</h3>
                  <p style={{ fontSize: '13px', color: colors.muted, marginBottom: '12px' }}>{course.description}</p>
                  <div style={{ fontSize: '12px', color: colors.cyan, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {course.modules.length} Modules Available <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Course Detail & Modules */}
          {activeCourse && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: '20px', marginBottom: '24px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>{activeCourse.category.toUpperCase()}</span>
                <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: colors.text }}>{activeCourse.title}</h2>
                <p style={{ color: colors.muted, fontSize: '15px' }}>{activeCourse.description}</p>
              </div>

              {/* Modules & Lessons List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeCourse.modules.map((mod, idx) => (
                  <div key={mod.id} style={{ background: colors.background, borderRadius: 'var(--radius-md)', padding: '16px', border: `1px solid ${colors.borderSubtle}` }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px', color: colors.text }}>
                      Module {idx + 1}: {mod.title}
                    </div>
                    <div style={{ fontSize: '13px', color: colors.muted, marginBottom: '16px' }}>
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
                            background: colors.surface,
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${colors.borderSubtle}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <CheckCircle2 size={18} color={colors.success} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px', color: colors.text }}>{les.title}</div>
                              <div style={{ fontSize: '12px', color: colors.subtle, display: 'flex', gap: '12px', marginTop: '2px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={12} /> {les.estimated_mins} mins
                                </span>
                                {les.visualizer_id && (
                                  <span style={{ color: colors.cyan, fontWeight: 600 }}>
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
