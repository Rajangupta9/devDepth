import React, { useEffect, useState } from 'react';
import { Course } from '../../types';
import { DevDepthAPI } from '../../api/client';
import { Card, Button, Badge, Icon, radius, useTheme } from '@devdepth/ui';
import { LessonViewer } from './LessonViewer';

interface CourseHubProps {
  onSelectLesson: (lessonId: string) => void;
}

export const CourseHub: React.FC<CourseHubProps> = ({ onSelectLesson }) => {
  const { colors } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [viewingLessonId, setViewingLessonId] = useState<string | null>(null);

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

  if (viewingLessonId && activeCourse) {
    return (
      <LessonViewer
        course={activeCourse}
        initialLessonId={viewingLessonId}
        onBackToCourses={() => setViewingLessonId(null)}
        onOpenVisualizer={(visId) => onSelectLesson(visId)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="purple">AlgoMaster Sheet Specs</Badge>
          <Badge variant="info">Step-by-Step Learning</Badge>
        </div>
        <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: 900, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
          Interactive CS Roadmaps & Concept Sheets
        </h1>
        <p style={{ margin: '6px 0 0 0', fontSize: '1rem', color: colors.muted }}>
          Pattern-based learning modules with interactive visualizer labs and Go backend execution.
        </p>
      </div>

      {/* Category Filter Pills (AlgoMaster Style) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', borderBottom: `1px solid ${colors.borderSubtle}` }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 20px',
              borderRadius: radius.full,
              border: selectedCategory === cat.id ? `1px solid ${colors.primary}` : `1px solid ${colors.borderSubtle}`,
              backgroundColor: selectedCategory === cat.id ? colors.primaryGlow : colors.surface,
              color: selectedCategory === cat.id ? colors.primaryLight : colors.muted,
              fontWeight: selectedCategory === cat.id ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 200ms ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Split Grid */}
      {loading ? (
        <Card variant="surface" style={{ padding: '48px', textAlign: 'center', color: colors.muted }}>
          Loading DevDepth courses from Go Backend API...
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
          {/* Left Column: Course Selector Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map((course) => {
              const isSelected = activeCourse?.id === course.id;
              return (
                <Card
                  key={course.id}
                  variant={isSelected ? 'glow' : 'glass'}
                  interactive
                  onClick={() => setActiveCourse(course)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="primary">{course.category.toUpperCase()}</Badge>
                    <span style={{ fontSize: '0.75rem', color: colors.subtle, fontWeight: 600 }}>{course.level}</span>
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: colors.text }}>
                    {course.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: '0.85rem', color: colors.muted, lineHeight: 1.5 }}>
                    {course.description}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: colors.cyan, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Icon name="layers" size={14} /> {course.modules.length} Modules Included
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Right Column: Active Course Modules & Lessons */}
          {activeCourse && (
            <Card variant="glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Badge variant="purple">{activeCourse.category.toUpperCase()}</Badge>
                  <Badge variant="easy">{activeCourse.level}</Badge>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
                  {activeCourse.title}
                </h2>
                <p style={{ margin: '6px 0 0 0', color: colors.muted, fontSize: '0.95rem' }}>
                  {activeCourse.description}
                </p>
              </div>

              {/* Modules List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeCourse.modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: radius.md,
                      padding: '20px',
                      border: `1px solid ${colors.borderSubtle}`,
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: colors.text, marginBottom: '4px' }}>
                      Module {idx + 1}: {mod.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: colors.muted, marginBottom: '16px' }}>
                      {mod.description}
                    </div>

                    {/* Lessons list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            backgroundColor: colors.surface,
                            borderRadius: radius.sm,
                            border: `1px solid ${colors.borderSubtle}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Icon name="checkCircle" size={18} color={colors.success} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.text }}>{les.title}</div>
                              <div style={{ fontSize: '0.78rem', color: colors.subtle, display: 'flex', gap: '12px', marginTop: '2px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Icon name="clock" size={12} /> {les.estimated_mins} mins
                                </span>
                                {les.visualizer_id && (
                                  <span style={{ color: colors.cyan, fontWeight: 700 }}>
                                    ⚡ Interactive Visual Lab
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setViewingLessonId(les.id)}
                            rightIcon={<Icon name="arrowRight" size={14} />}
                          >
                            Open Lab
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
