import { useParams, useNavigate } from 'react-router-dom';
import { useStudentsStore } from '../store/students';
import { useRewardsStore } from '../store/rewards';
import { OXBadge } from '../components/OXBadge';
import { StampCounter } from '../components/StampCounter';

export function StudentDashboard() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { getStudent, resetStamps, completeHomework } = useStudentsStore();
  const { getPenaltyCount } = useRewardsStore();

  const student = studentId ? getStudent(studentId) : null;

  if (!student) {
    return (
      <div style={{ padding: '24px' }}>
        <p>학생을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로</button>
      </div>
    );
  }

  const wrongAnswers = student.logs.filter((log) => log.status === 'X');
  const partialAnswers = student.logs.filter((log) => log.status === '△');
  const incompleteHomework = student.homework.filter((h) => !h.completed);
  const penaltyCount = getPenaltyCount(student.id);
  const hasMilestone = student.stamps >= 100;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWrongAnswers = wrongAnswers.filter(
    (log) => new Date(log.timestamp) >= today
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{student.name}</h1>
          <button
            onClick={() => navigate(`/console/${student.id}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            명령 콘솔 열기
          </button>
        </div>
      </div>

      {hasMilestone && (
        <div
          style={{
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '20px',
          }}
        >
          🎉 보드게임 데이 달성!
          <br />
          <button
            onClick={() => resetStamps(student.id)}
            style={{
              marginTop: '12px',
              padding: '10px 24px',
              backgroundColor: '#000',
              color: '#ffc107',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            사용 완료
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            도장 개수
          </h2>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffc107' }}>
            {student.stamps}개
          </div>
          <StampCounter stamps={student.stamps} />
        </div>

        {penaltyCount > 0 && (
          <div
            style={{
              backgroundColor: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#c62828' }}>
              징벌
            </h2>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#c62828' }}>
              {penaltyCount}장
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: '#fff3e0',
          border: '1px solid #ffcc80',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
          📸 촬영 품질 가이드
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#e65100' }}>
          <li>선명하게</li>
          <li>수직 각도</li>
          <li>번호/풀이 전체 포함</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            오늘 오답 리스트 ({todayWrongAnswers.length}개)
          </h2>
          {todayWrongAnswers.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>오늘 오답이 없습니다.</div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {todayWrongAnswers.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    marginBottom: '4px',
                    backgroundColor: 'var(--hover-bg)',
                    borderRadius: '4px',
                  }}
                >
                  <OXBadge status={log.status} size="small" />
                  <span>{log.unit} {log.question}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            △ 항목 ({partialAnswers.length}개)
          </h2>
          {partialAnswers.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>△ 항목이 없습니다.</div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {partialAnswers.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    marginBottom: '4px',
                    backgroundColor: 'var(--hover-bg)',
                    borderRadius: '4px',
                  }}
                >
                  <OXBadge status={log.status} size="small" />
                  <span>{log.unit} {log.question}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          숙제 목록 ({incompleteHomework.length}개 미완료)
        </h2>
        {student.homework.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }}>숙제가 없습니다.</div>
        ) : (
          <div>
            {student.homework.map((hw) => (
              <div
                key={hw.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: hw.completed ? 'var(--hover-bg)' : '#fff3e0',
                  border: `1px solid ${hw.completed ? 'var(--border-color)' : '#ffcc80'}`,
                  borderRadius: '6px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{hw.unit}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{hw.range}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(hw.assignedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {hw.completed ? (
                    <span style={{ color: '#4caf50', fontWeight: 600 }}>완료</span>
                  ) : (
                    <>
                      <span style={{ color: '#ff9800', fontWeight: 600 }}>미완료</span>
                      <button
                        onClick={() => completeHomework(student.id, hw.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        완료 처리
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

