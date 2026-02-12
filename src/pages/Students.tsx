import { useState, useMemo } from 'react';
import { useStudentsStore } from '@/store/students';
import { StudentCard } from '@/components/common/StudentCard';
import { Section } from '@/components/common/Section';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export function Students() {
  const { students, addStudent } = useStudentsStore();
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

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  return (
    <Section
      title="학생 관리"
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
  );
}

