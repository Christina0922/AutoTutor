import { useMemo } from 'react';
import { useStudentsStore } from '@/store/students';
import { useRewardsStore } from '@/store/rewards';
import { Card, CardContent } from '@/components/ui/card';
import { Section } from '@/components/common/Section';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function Rewards() {
  const { students } = useStudentsStore();
  const { rewardLogs } = useRewardsStore();

  // 학생별 도장 순위 계산
  const studentRankings = useMemo(() => {
    return students
      .map((student) => {
        const stampLogs = rewardLogs.filter(
          (log) => log.studentId === student.id && log.type === 'stamp'
        );
        const totalStamps = student.stamps;
        const lastStampDate = stampLogs.length > 0
          ? Math.max(...stampLogs.map((log) => log.timestamp))
          : null;
        const hasMilestone = totalStamps >= 100;

        return {
          student,
          totalStamps,
          hasMilestone,
          lastStampDate,
        };
      })
      .sort((a, b) => b.totalStamps - a.totalStamps);
  }, [students, rewardLogs]);

  return (
    <div className="space-y-6">
      <Section title="도장 현황">
        <Card>
          <CardContent className="p-0">
            {studentRankings.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="학생이 없습니다"
                  description="학생을 추가하면 도장 현황이 표시됩니다"
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>도장</TableHead>
                    <TableHead>100개 달성</TableHead>
                    <TableHead>마지막 지급일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentRankings.map(({ student, totalStamps, hasMilestone, lastStampDate }) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-semibold">
                          {totalStamps}개
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {hasMilestone ? (
                          <Badge variant="success">달성</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lastStampDate
                          ? new Date(lastStampDate).toLocaleDateString('ko-KR')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* 도장 로그 (선택) */}
      <Section title="최근 도장 로그">
        <Card>
          <CardContent className="p-4">
            {rewardLogs.filter((log) => log.type === 'stamp').length === 0 ? (
              <EmptyState
                title="도장 로그가 없습니다"
                description="도장을 지급하면 여기에 표시됩니다"
              />
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {rewardLogs
                  .filter((log) => log.type === 'stamp')
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .slice(0, 20)
                  .map((log) => {
                    const student = students.find((s) => s.id === log.studentId);
                    return (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-success/5 border border-success/20"
                      >
                        <div>
                          <span className="font-medium">{student?.name || '알 수 없음'}</span>
                          {' - '}
                          <span className="text-success font-semibold">+{log.value}개</span>
                          {log.reason && ` (${log.reason})`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('ko-KR')}
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
