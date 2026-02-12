import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>설정</h1>
      </div>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
              테마
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              다크/라이트 모드 전환
            </p>
          </div>
          <button
            onClick={toggleTheme}
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
            {theme === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
        }}
      >
        <strong>데이터 저장 정책:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>문제 이미지 저장 금지</li>
          <li>정답 저장 금지</li>
          <li>채점 결과(O/X/△)만 저장</li>
          <li>숙제 범위 텍스트만 저장</li>
        </ul>
      </div>
    </div>
  );
}

