import { useState, useMemo } from 'react';
import { useStudentsStore } from '@/store/students';
import { useLogsStore } from '@/store/logs';
import { StudentCard } from '@/components/common/StudentCard';
import { KpiCard } from '@/components/common/KpiCard';
import { Section } from '@/components/common/Section';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';

export function Hub() {
  const { students, addStudent } = useStudentsStore();
  const { logs } = useLogsStore();
  const [newStudentName, setNewStudentName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      addStudent(newStudentName.trim());
      setNewStudentName('');
      setShowAddForm(false);
    }
  };

  // 오늘 날짜 기준 필터링
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }, []);

  // KPI 계산
  const todayWrongAnswers = useMemo(() => {
    return students.reduce((sum, student) => {
      return sum + student.logs.filter(
        (log) => log.status === 'X' && log.timestamp >= today
      ).length;
    }, 0);
  }, [students, today]);

  const todayPartialAnswers = useMemo(() => {
    return students.reduce((sum, student) => {
      return sum + student.logs.filter(
        (log) => log.status === '△' && log.timestamp >= today
      ).length;
    }, 0);
  }, [students, today]);

  const incompleteHomeworkCount = useMemo(() => {
    return students.reduce((sum, student) => {
      return sum + student.homework.filter((h) => !h.completed).length;
    }, 0);
  }, [students]);

  const todayStampsGiven = useMemo(() => {
    // 로그에서 오늘 지급된 도장 수 계산 (실제로는 rewards store에서 가져와야 함)
    return 0; // 임시
  }, []);

  // 최근 커맨드 로그 (전체 로그에서 최근 10개)
  const recentLogs = useMemo(() => {
    return logs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }, [logs]);

  // 검색 필터링
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="오늘 총 오답(X)"
          value={todayWrongAnswers}
          description="오늘 기록된 오답 수"
        />
        <KpiCard
          title="△ 수"
          value={todayPartialAnswers}
          description="오늘 기록된 부분 정답 수"
        />
        <KpiCard
          title="미완료 숙제"
          value={incompleteHomeworkCount}
          description="전체 미완료 숙제 수"
        />
        <KpiCard
          title="오늘 도장 지급"
          value={todayStampsGiven}
          description="오늘 지급된 도장 수"
        />
      </div>

      {/* 학생 리스트 */}
      <Section
        title="학생 리스트"
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="이름 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9"
              />
            </div>
            {!showAddForm ? (
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                학생 추가
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddStudent();
                    if (e.key === 'Escape') {
                      setShowAddForm(false);
                      setNewStudentName('');
                    }
                  }}
                  placeholder="학생 이름 입력"
                  autoFocus
                  className="w-48"
                />
                <Button onClick={handleAddStudent} size="sm">
                  추가
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewStudentName('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  취소
                </Button>
              </div>
            )}
          </div>
        }
      >
        {filteredStudents.length === 0 ? (
          <EmptyState
            title="등록된 학생이 없습니다"
            description="학생을 추가하여 시작하세요"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </Section>

      {/* 최근 커맨드 로그 */}
      <Section title="최근 커맨드 로그">
        <Card>
          <CardContent className="p-4">
            {recentLogs.length === 0 ? (
              <EmptyState
                title="로그가 없습니다"
                description="명령어를 입력하면 여기에 표시됩니다"
              />
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log) => {
                  const student = students.find((s) => s.id === log.studentId);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-medium">{student?.name || '알 수 없음'}</span>
                          {' - '}
                          <span>{log.unit}</span>
                          {log.question && ` ${log.question}`}
                          {' '}
                          <span className={`font-semibold ${
                            log.status === 'O' ? 'text-success' :
                            log.status === 'X' ? 'text-danger' :
                            'text-warning'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
