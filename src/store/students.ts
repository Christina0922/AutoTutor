import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, LogEntry, Homework } from '../types';

interface StudentsState {
  students: Student[];
  currentStudentId: string | null;
  setCurrentStudent: (id: string | null) => void;
  addStudent: (name: string) => void;
  addLog: (studentId: string, log: LogEntry) => void;
  addHomework: (studentId: string, homework: Homework) => void;
  completeHomework: (studentId: string, homeworkId: string) => void;
  updateStamps: (studentId: string, delta: number) => void;
  resetStamps: (studentId: string) => void;
  getStudent: (id: string) => Student | undefined;
}

export const useStudentsStore = create<StudentsState>()(
  persist(
    (set, get) => ({
      students: [],
      currentStudentId: null,
      setCurrentStudent: (id) => set({ currentStudentId: id }),
      addStudent: (name) => {
        const newStudent: Student = {
          id: `student-${Date.now()}`,
          name,
          stamps: 0,
          logs: [],
          homework: [],
        };
        set((state) => ({
          students: [...state.students, newStudent],
        }));
      },
      addLog: (studentId, log) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? { ...s, logs: [...s.logs, log] }
              : s
          ),
        }));
      },
      addHomework: (studentId, homework) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? { ...s, homework: [...s.homework, homework] }
              : s
          ),
        }));
      },
      completeHomework: (studentId, homeworkId) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  homework: s.homework.map((h) =>
                    h.id === homeworkId ? { ...h, completed: true } : h
                  ),
                }
              : s
          ),
        }));
      },
      updateStamps: (studentId, delta) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? { ...s, stamps: Math.max(0, s.stamps + delta) }
              : s
          ),
        }));
      },
      resetStamps: (studentId) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId ? { ...s, stamps: 0 } : s
          ),
        }));
      },
      getStudent: (id) => {
        return get().students.find((s) => s.id === id);
      },
    }),
    {
      name: 'auto-tutor-students',
    }
  )
);

