import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentsStore } from '../store/students';
import { useLogsStore } from '../store/logs';
import { useRewardsStore } from '../store/rewards';
import { LogInput } from '../components/LogInput';
import { LogEntry, Homework, RewardLog, ResultStatus } from '../types';

export function CommandConsole() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { getStudent, addLog: addStudentLog, addHomework, updateStamps } = useStudentsStore();
  const { addLog } = useLogsStore();
  const { addRewardLog } = useRewardsStore();
  const [history, setHistory] = useState<string[]>([]);

  const student = studentId ? getStudent(studentId) : null;

  const parseCommand = (command: string): void => {
    if (!student) return;

    const parts = command.trim().split(/\s+/);
    if (parts.length < 2) {
      setHistory((prev) => [...prev, `❌ 잘못된 명령어: ${command}`]);
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
      setHistory((prev) => [...prev, `✅ 숙제 추가: ${unit} ${range}`]);
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
        setHistory((prev) => [...prev, `✅ 도장 ${value}개 추가`]);
      } else if (parts[1]?.startsWith('-')) {
        updateStamps(student.id, -value);
        setHistory((prev) => [...prev, `✅ 도장 ${value}개 차감`]);
      }
      return;
    }

    // !징벌 명령어: !징벌 +2
    if (parts[0] === '!징벌') {
      const value = parseInt(parts[1]?.replace(/[+-]/, '') || '0', 10);
      
      // 숙제 페이지 추가
      const penaltyHomework: Homework = {
        id: `penalty-${Date.now()}`,
        unit: '징벌',
        range: `${value}장`,
        assignedAt: Date.now(),
        completed: false,
      };
      addHomework(student.id, penaltyHomework);

      // 징벌 로그 기록
      const penaltyLog: RewardLog = {
        id: `penalty-${Date.now()}`,
        studentId: student.id,
        type: 'penalty',
        value,
        reason: '징벌',
        timestamp: Date.now(),
      };
      addRewardLog(penaltyLog);

      setHistory((prev) => [...prev, `⚠️ 징벌 ${value}장 추가`]);
      return;
    }

    // 일반 채점 입력: 다각형 12 X
    const unit = parts[0];
    const question = parts[1] || '';
    const statusStr = parts[2]?.toUpperCase();

    if (!['O', 'X', '△'].includes(statusStr || '')) {
      setHistory((prev) => [...prev, `❌ 잘못된 상태: ${statusStr} (O/X/△만 가능)`]);
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
      setHistory((prev) => [...prev, `❌ 오답 기록: ${unit} ${question}`]);
    } else {
      setHistory((prev) => [...prev, `✅ 기록: ${unit} ${question} ${status}`]);
    }
  };

  if (!student) {
    return (
      <div style={{ padding: '24px' }}>
        <p>학생을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          ← 뒤로
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
          명령 콘솔 - {student.name}
        </h1>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          명령어 형식: 단원명 문제번호 상태 (예: 다각형 12 X)
          <br />
          특수 명령: !숙제 단원 범위 | !도장 +1 | !징벌 +2
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <LogInput
          onCommand={parseCommand}
          placeholder="명령어 입력 (예: 다각형 12 X)"
        />
      </div>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '16px',
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        {history.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }}>명령어 입력 기록이 없습니다.</div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

