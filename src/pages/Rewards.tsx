import { useNavigate } from 'react-router-dom';
import { useStudentsStore } from '../store/students';
import { useRewardsStore } from '../store/rewards';

export function Rewards() {
  const navigate = useNavigate();
  const { students } = useStudentsStore();
  const { rewardLogs } = useRewardsStore();

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
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>보상 및 징벌 로그</h1>
      </div>

      <div>
        {students.map((student) => {
          const studentLogs = rewardLogs.filter((log) => log.studentId === student.id);
          const stampLogs = studentLogs.filter((log) => log.type === 'stamp');
          const penaltyLogs = studentLogs.filter((log) => log.type === 'penalty');

          return (
            <div
              key={student.id}
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ marginTop: 0, fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
                {student.name}
              </h2>

              {stampLogs.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>도장 기록</h3>
                  {stampLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '8px',
                        marginBottom: '4px',
                        backgroundColor: 'var(--hover-bg)',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      +{log.value}개 - {log.reason || '도장'} (
                      {new Date(log.timestamp).toLocaleString('ko-KR')})
                    </div>
                  ))}
                </div>
              )}

              {penaltyLogs.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#c62828' }}>
                    징벌 기록
                  </h3>
                  {penaltyLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '8px',
                        marginBottom: '4px',
                        backgroundColor: '#ffebee',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: '#c62828',
                      }}
                    >
                      +{log.value}장 - {log.reason || '징벌'} (
                      {new Date(log.timestamp).toLocaleString('ko-KR')})
                    </div>
                  ))}
                </div>
              )}

              {studentLogs.length === 0 && (
                <div style={{ color: 'var(--text-secondary)' }}>기록이 없습니다.</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

