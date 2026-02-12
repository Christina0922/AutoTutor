import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { StampCounter } from './StampCounter';
import { useRewardsStore } from '../store/rewards';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const navigate = useNavigate();
  const { getPenaltyCount } = useRewardsStore();
  
  const wrongAnswers = student.logs.filter((log) => log.status === 'X').length;
  const incompleteHomework = student.homework.filter((h) => !h.completed).length;
  const penaltyCount = getPenaltyCount(student.id);
  const hasPenalty = penaltyCount > 0;

  return (
    <div
      className="student-card"
      onClick={() => navigate(`/student/${student.id}`)}
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        backgroundColor: 'var(--card-bg)',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--card-bg)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          {student.name}
        </h3>
        {hasPenalty && (
          <span
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            경고
          </span>
        )}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '14px' }}>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>오답: </span>
          <span style={{ fontWeight: 600, color: '#ff4444' }}>{wrongAnswers}개</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>미완료 숙제: </span>
          <span style={{ fontWeight: 600, color: '#ff8800' }}>{incompleteHomework}개</span>
        </div>
        <div>
          <StampCounter stamps={student.stamps} />
        </div>
      </div>
    </div>
  );
}

