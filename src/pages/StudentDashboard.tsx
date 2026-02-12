import { useParams, useNavigate } from 'react-router-dom';
import { useStudentsStore } from '@/store/students';
import { KpiCard } from '@/components/common/KpiCard';
import { StatusPill } from '@/components/common/StatusPill';
import { Section } from '@/components/common/Section';
import { EmptyState } from '@/components/common/EmptyState';
import { CopyAllButton } from '@/components/common/CopyAllButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Terminal, Camera } from 'lucide-react';
import { useMemo } from 'react';

export function StudentDashboard() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { getStudent, resetStamps, completeHomework } = useStudentsStore();

  const student = studentId ? getStudent(studentId) : null;

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">학생을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/')}>홈으로</Button>
      </div>
    );
  }

  const wrongAnswers = student.logs.filter((log) => log.status === 'X');
  const partialAnswers = student.logs.filter((log) => log.status === '△');
  const hasMilestone = student.stamps >= 100;

  const todayWrongAnswers = wrongAnswers.filter(
    (log) => new Date(log.timestamp) >= today
  );

  const wrongAnswersText = todayWrongAnswers
    .map((log) => `${log.unit} ${log.question}`)
    .join('\n');

  return (
    <div className="space-y-6">
      {/* 도장 100개 달성 Banner */}
      {hasMilestone && (
        <Card className="bg-warning/10 border-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎉 보드게임 데이 예정</h3>
                <p className="text-sm text-muted-foreground">
                  도장 100개를 달성했습니다. 보상 사용 후 도장이 초기화됩니다.
                </p>
              </div>
              <Button
                onClick={() => resetStamps(student.id)}
                className="bg-warning text-warning-foreground hover:bg-warning/90"
              >
                사용 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 상단 KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="오답(X) 개수"
          value={wrongAnswers.length}
          subtitle="전체 오답 수"
          tone="danger"
        />
        <KpiCard
          title="△ 개수"
          value={partialAnswers.length}
          subtitle="부분 정답 수"
          tone="warning"
        />
        <KpiCard
          title="도장 누적"
          value={student.stamps}
          subtitle="현재 보유 도장"
          tone="success"
        />
      </div>

      {/* 촬영 품질 가이드 */}
      <Card className="bg-warning/5 border-warning/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Camera className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">📸 촬영 품질 가이드</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 선명하게</li>
                <li>• 수직 각도</li>
                <li>• 번호/풀이 전체 포함</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 본문 2열 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 좌측: 오답 리스트 */}
        <Section
          title="오답 리스트 (X)"
          action={
            wrongAnswersText && (
              <CopyAllButton text={wrongAnswersText} label="전체 복사" />
            )
          }
        >
          <Card>
            <CardContent className="p-4">
              {todayWrongAnswers.length === 0 ? (
                <EmptyState
                  title="오늘 오답이 없습니다"
                  description="오늘 기록된 오답이 없습니다"
                />
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {todayWrongAnswers.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-danger/5 border border-danger/20"
                    >
                      <StatusPill status={log.status} size="sm" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {log.unit} {log.question}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Section>

        {/* 우측: △ 리스트 + 숙제 리스트 */}
        <div className="space-y-6">
          {/* △ 리스트 */}
          <Section title="△ 항목">
            <Card>
              <CardContent className="p-4">
                {partialAnswers.length === 0 ? (
                  <EmptyState
                    title="△ 항목이 없습니다"
                    description="부분 정답이 없습니다"
                  />
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {partialAnswers.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-warning/5 border border-warning/20"
                      >
                        <StatusPill status={log.status} size="sm" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {log.unit} {log.question}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString('ko-KR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Section>

          {/* 숙제 리스트 */}
          <Section title="숙제 목록">
            <Card>
              <CardContent className="p-4">
                {student.homework.length === 0 ? (
                  <EmptyState
                    title="숙제가 없습니다"
                    description="등록된 숙제가 없습니다"
                  />
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {student.homework.map((hw) => (
                      <div
                        key={hw.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          hw.completed
                            ? 'bg-muted border-border'
                            : 'bg-warning/5 border-warning/20'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Checkbox
                              checked={hw.completed}
                              onCheckedChange={() => {
                                if (!hw.completed) {
                                  completeHomework(student.id, hw.id);
                                }
                              }}
                            />
                            <span className="font-semibold">{hw.unit}</span>
                            {hw.unit === '징벌' && (
                              <Badge variant="destructive" className="text-xs">
                                징벌
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {hw.range}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(hw.assignedAt).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                        {hw.completed ? (
                          <Badge variant="success" className="ml-2">
                            완료
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="ml-2">
                            미완료
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>

      {/* 명령 콘솔 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={() => navigate('/console')}
          className="gap-2"
        >
          <Terminal className="h-4 w-4" />
          명령 콘솔 열기
        </Button>
      </div>
    </div>
  );
}
