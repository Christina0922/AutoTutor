import { useState, useRef, KeyboardEvent } from 'react';
import { useStudentsStore } from '@/store/students';
import { useLogsStore } from '@/store/logs';
import { useRewardsStore } from '@/store/rewards';
import { LogEntry, Homework, RewardLog, ResultStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/common/Section';
import { EmptyState } from '@/components/common/EmptyState';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CommandConsole() {
  const { students, getStudent, addLog: addStudentLog, addHomework, updateStamps } = useStudentsStore();
  const { addLog } = useLogsStore();
  const { addRewardLog } = useRewardsStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'success' | 'error'; message: string; timestamp: number }>>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const student = selectedStudentId ? getStudent(selectedStudentId) : null;

  const addHistory = (type: 'success' | 'error', message: string) => {
    setHistory((prev) => [...prev, { type, message, timestamp: Date.now() }]);
  };

  const parseCommand = (command: string): void => {
    if (!student) {
      addHistory('error', '학생을 선택해주세요');
      return;
    }

    const parts = command.trim().split(/\s+/);
    if (parts.length < 2) {
      addHistory('error', `잘못된 명령어: ${command}`);
      return;
    }

    // !숙제 명령어: !숙제 다각형 12-15p
    if (parts[0] === '!숙제') {
      const unit = parts[1] || '미지정';
      const range = parts.slice(2).join(' ') || '미지정';
      
      const homework: Homework = {
        id: `homework-${Date.now()}`,
        unit,
        range,
        assignedAt: Date.now(),
        completed: false,
      };
      
      addHomework(student.id, homework);
      addHistory('success', `숙제 추가: ${unit} ${range}`);
      setCommand('');
      return;
    }

    // !도장 명령어: !도장 +1
    if (parts[0] === '!도장') {
      const value = parseInt(parts[1]?.replace(/[+-]/, '') || '0', 10);
      if (parts[1]?.startsWith('+')) {
        updateStamps(student.id, value);
        const rewardLog: RewardLog = {
          id: `stamp-${Date.now()}`,
          studentId: student.id,
          type: 'stamp',
          value,
          reason: '도장',
          timestamp: Date.now(),
        };
        addRewardLog(rewardLog);
        addHistory('success', `도장 ${value}개 추가`);
      } else if (parts[1]?.startsWith('-')) {
        updateStamps(student.id, -value);
        addHistory('success', `도장 ${value}개 차감`);
      }
      setCommand('');
      return;
    }

    // !징벌 명령어: !징벌 +2
    if (parts[0] === '!징벌') {
      const value = parseInt(parts[1]?.replace(/[+-]/, '') || '0', 10);
      
      const penaltyHomework: Homework = {
        id: `penalty-${Date.now()}`,
        unit: '징벌',
        range: `${value}장`,
        assignedAt: Date.now(),
        completed: false,
      };
      addHomework(student.id, penaltyHomework);

      const penaltyLog: RewardLog = {
        id: `penalty-${Date.now()}`,
        studentId: student.id,
        type: 'penalty',
        value,
        reason: '징벌',
        timestamp: Date.now(),
      };
      addRewardLog(penaltyLog);

      addHistory('success', `징벌 ${value}장 추가`);
      setCommand('');
      return;
    }

    // 일반 채점 입력: 다각형 12 X
    const unit = parts[0];
    const question = parts[1] || '';
    const statusStr = parts[2]?.toUpperCase();

    if (!['O', 'X', '△'].includes(statusStr || '')) {
      addHistory('error', `잘못된 상태: ${statusStr} (O/X/△만 가능)`);
      return;
    }

    const status = statusStr as ResultStatus;
    const logEntry: LogEntry = {
      id: `log-${Date.now()}`,
      studentId: student.id,
      unit,
      question,
      status,
      timestamp: Date.now(),
    };

    addLog(logEntry);
    addStudentLog(student.id, logEntry);

    if (status === 'X') {
      addHistory('success', `오답 기록: ${unit} ${question}`);
    } else {
      addHistory('success', `기록: ${unit} ${question} ${status}`);
    }
    setCommand('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (command.trim()) {
        parseCommand(command);
      }
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 좌측: 커맨드 입력 패널 */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>명령어 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">학생 선택</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="학생을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {students.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      등록된 학생이 없습니다
                    </div>
                  ) : (
                    students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">명령어</label>
              <textarea
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="예: 다각형 12 X&#10;예: !숙제 다각형 12-15p&#10;예: !도장 +1"
                className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter: 실행 | Shift+Enter: 줄바꿈
              </p>
            </div>
            <Button
              onClick={() => {
                if (command.trim()) {
                  parseCommand(command);
                }
              }}
              disabled={!student || !command.trim()}
              className="w-full"
            >
              실행
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 우측: 치트시트 + 로그 */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>명령어 규격</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold mb-1">일반 채점</div>
                <code className="block bg-muted p-2 rounded text-xs">
                  단원명 문제번호 상태
                </code>
                <p className="text-muted-foreground text-xs mt-1">
                  예: 다각형 12 X
                </p>
              </div>
              <div>
                <div className="font-semibold mb-1">숙제 추가</div>
                <code className="block bg-muted p-2 rounded text-xs">
                  !숙제 단원명 범위
                </code>
                <p className="text-muted-foreground text-xs mt-1">
                  예: !숙제 다각형 12-15p
                </p>
              </div>
              <div>
                <div className="font-semibold mb-1">도장 지급</div>
                <code className="block bg-muted p-2 rounded text-xs">
                  !도장 +숫자
                </code>
                <p className="text-muted-foreground text-xs mt-1">
                  예: !도장 +1
                </p>
              </div>
              <div>
                <div className="font-semibold mb-1">징벌</div>
                <code className="block bg-muted p-2 rounded text-xs">
                  !징벌 +숫자
                </code>
                <p className="text-muted-foreground text-xs mt-1">
                  예: !징벌 +2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>실행 로그</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <EmptyState
                title="로그가 없습니다"
                description="명령어를 실행하면 여기에 표시됩니다"
              />
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {history.slice().reverse().map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-sm ${
                      item.type === 'success'
                        ? 'bg-success/10 text-success-foreground'
                        : 'bg-danger/10 text-danger-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleTimeString('ko-KR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
