import { useState } from 'react';
import { useStudentsStore } from '../store/students';
import { StudentCard } from '../components/StudentCard';

export function Hub() {
  const { students, addStudent } = useStudentsStore();
  const [newStudentName, setNewStudentName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      addStudent(newStudentName.trim());
      setNewStudentName('');
      setShowAddForm(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>Auto-Tutor Hub</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.open('https://zoom.us', '_blank')}
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
            Zoom 링크
          </button>
          <button
            onClick={() => window.open('https://example.com', '_blank')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--secondary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            변형문제 사이트
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            + 학생 추가
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
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
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                flex: 1,
                maxWidth: '300px',
              }}
            />
            <button
              onClick={handleAddStudent}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              추가
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewStudentName('');
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>학생 목록</h2>
        {students.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            등록된 학생이 없습니다. 학생을 추가해주세요.
          </div>
        ) : (
          students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))
        )}
      </div>
    </div>
  );
}

