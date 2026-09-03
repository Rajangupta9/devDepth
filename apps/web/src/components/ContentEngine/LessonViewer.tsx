import React, { useState } from 'react';
import { Course, Lesson } from '../../types';
import { Card, Button, Badge, Icon, CodeBlock, radius, useTheme } from '@devdepth/ui';

interface LessonViewerProps {
  course: Course;
  initialLessonId?: string;
  onBackToCourses: () => void;
  onOpenVisualizer: (visualizerId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  course,
  initialLessonId,
  onBackToCourses,
  onOpenVisualizer,
}) => {
  const { colors } = useTheme();

  // Find all lessons flattened for prev/next navigation
  const allLessons: { lesson: Lesson; moduleTitle: string }[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      allLessons.push({ lesson: les, moduleTitle: mod.title });
    });
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || (allLessons[0] ? allLessons[0].lesson.id : '')
  );
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  const currentLessonObj = allLessons.find((item) => item.lesson.id === activeLessonId) || allLessons[0];
  const currentLesson = currentLessonObj?.lesson;
  const currentLessonIndex = allLessons.findIndex((item) => item.lesson.id === activeLessonId);

  const toggleComplete = (id: string) => {
    if (completedLessonIds.includes(id)) {
      setCompletedLessonIds(completedLessonIds.filter((item) => item !== id));
    } else {
      setCompletedLessonIds([...completedLessonIds, id]);
    }
  };

  const isCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;
  const progressPercent = Math.round((completedLessonIds.length / Math.max(1, allLessons.length)) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Left Sidebar: AlgoMaster Chapter & Module Tree */}
      <Card variant="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '80px' }}>
        {/* Back Button & Course Title */}
        <div>
          <button
            onClick={onBackToCourses}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              color: colors.primaryLight,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '10px',
              padding: 0,
            }}
          >
            ← Back to Roadmaps
          </button>

          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
            {course.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <Badge variant="purple">{course.category.toUpperCase()}</Badge>
            <span style={{ fontSize: '0.75rem', color: colors.subtle, fontWeight: 600 }}>{course.level}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: colors.text, marginBottom: '6px' }}>
            <span>Overall Progress</span>
            <span style={{ color: colors.success }}>{progressPercent}%</span>
          </div>

          <div style={{ width: '100%', height: '6px', backgroundColor: colors.surface, borderRadius: radius.full, overflow: 'hidden', border: `1px solid ${colors.borderSubtle}` }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: colors.success,
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>

        {/* Chapter Search Filter */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: radius.sm,
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderSubtle}`,
              color: colors.text,
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Module Chapters Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '520px', overflowY: 'auto' }}>
          {course.modules.map((mod, mIdx) => {
            const filteredLessons = mod.lessons.filter((l) =>
              l.title.toLowerCase().includes(searchFilter.toLowerCase())
            );

            if (filteredLessons.length === 0 && searchFilter) return null;

            return (
              <div key={mod.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.muted }}>
                  Module {mIdx + 1}: {mod.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: `2px solid ${colors.borderSubtle}`, paddingLeft: '8px' }}>
                  {filteredLessons.map((les) => {
                    const isActive = les.id === activeLessonId;
                    const isDone = completedLessonIds.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLessonId(les.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: radius.sm,
                          backgroundColor: isActive ? colors.primaryGlow : 'transparent',
                          border: isActive ? `1px solid ${colors.primary}` : '1px solid transparent',
                          color: isActive ? colors.primaryLight : colors.text,
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                          <Icon
                            name={isDone ? 'checkCircle' : 'fileCode'}
                            size={14}
                            color={isDone ? colors.success : isActive ? colors.primaryLight : colors.muted}
                          />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {les.title}
                          </span>
                        </div>

                        {les.visualizer_id && (
                          <span style={{ fontSize: '0.65rem', color: colors.cyan, fontWeight: 700 }}>LAB</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Right Column: AlgoMaster Lesson Reading Workspace */}
      {currentLesson ? (
        <Card variant="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Breadcrumb Navigation */}
          <div style={{ fontSize: '0.8rem', color: colors.muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Learn</span>
            <span>/</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{course.title}</span>
            <span>/</span>
            <span style={{ color: colors.primaryLight, fontWeight: 700 }}>{currentLesson.title}</span>
          </div>

          {/* Title Header & Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderBottom: `1px solid ${colors.borderSubtle}`, paddingBottom: '20px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, color: colors.text, fontFamily: 'Outfit, sans-serif' }}>
                {currentLesson.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <Badge variant="info">Estimated: {currentLesson.estimated_mins} mins</Badge>
                {currentLesson.visualizer_id && (
                  <Badge variant="purple">⚡ Interactive Visual Lab Available</Badge>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                variant={isCompleted ? 'secondary' : 'primary'}
                size="sm"
                leftIcon={<Icon name="checkCircle" size={16} />}
                onClick={() => toggleComplete(currentLesson.id)}
              >
                {isCompleted ? 'Marked Complete' : 'Mark Complete'}
              </Button>

              {currentLesson.visualizer_id && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Icon name="zap" size={16} />}
                  onClick={() => onOpenVisualizer(currentLesson.visualizer_id!)}
                >
                  Open Visual Lab
                </Button>
              )}
            </div>
          </div>

          {/* Lesson Content Markdown & Intuition Box */}
          <div style={{ fontSize: '1rem', color: colors.text, lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: 0 }}>
              {currentLesson.content}
            </p>

            {/* Intuition Alert Box */}
            <div
              style={{
                backgroundColor: colors.surface,
                borderLeft: `4px solid ${colors.primary}`,
                padding: '16px 20px',
                borderRadius: radius.sm,
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <Icon name="sparkles" size={20} color={colors.primaryLight} />
              <div>
                <strong style={{ color: colors.primaryLight, display: 'block', marginBottom: '4px' }}>
                  Key Engineering Intuition:
                </strong>
                <span style={{ fontSize: '0.9rem', color: colors.muted }}>
                  Understanding memory layouts and pointer arithmetic guarantees logarithmic or constant time execution bottlenecks in production systems.
                </span>
              </div>
            </div>

            {/* Code Spec Example */}
            <CodeBlock
              code={
                currentLesson.visualizer_id === 'two_pointers' ? `def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        curr_sum = nums[left] + nums[right]\n        if curr_sum == target:\n            return [left, right]\n        elif curr_sum > target:\n            right -= 1\n        else:\n            left += 1` :
                currentLesson.visualizer_id === 'tcp_handshake' ? `// TCP 3-Way Handshake Socket Initialization\nClient -> SYN (seq=x) -> Server\nServer -> SYN+ACK (seq=y, ack=x+1) -> Client\nClient -> ACK (ack=y+1) -> Server` :
                `// Standard Algorithmic Spec\nfunction processElements(input) {\n    let left = 0;\n    let right = input.length - 1;\n    // O(log N) reduction loop\n}`
              }
              language={currentLesson.visualizer_id === 'tcp_handshake' ? 'go' : 'python'}
            />
          </div>

          {/* Chapter Navigation Footer Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px', borderTop: `1px solid ${colors.borderSubtle}`, marginTop: '16px' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentLessonIndex <= 0}
              onClick={() => {
                if (currentLessonIndex > 0) {
                  setActiveLessonId(allLessons[currentLessonIndex - 1].lesson.id);
                }
              }}
              leftIcon={<Icon name="arrowLeft" size={14} />}
            >
              Previous Lesson
            </Button>

            <span style={{ fontSize: '0.8rem', color: colors.subtle, fontWeight: 600 }}>
              Lesson {currentLessonIndex + 1} of {allLessons.length}
            </span>

            <Button
              variant="primary"
              size="sm"
              disabled={currentLessonIndex >= allLessons.length - 1}
              onClick={() => {
                if (currentLessonIndex < allLessons.length - 1) {
                  setActiveLessonId(allLessons[currentLessonIndex + 1].lesson.id);
                }
              }}
              rightIcon={<Icon name="arrowRight" size={14} />}
            >
              Next Lesson
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
