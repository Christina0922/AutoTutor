import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogEntry } from '../types';

interface LogsState {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  getLogsByStudent: (studentId: string) => LogEntry[];
  getLogsByStatus: (studentId: string, status: LogEntry['status']) => LogEntry[];
}

export const useLogsStore = create<LogsState>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (log) => {
        set((state) => ({
          logs: [...state.logs, log],
        }));
      },
      getLogsByStudent: (studentId) => {
        return get().logs.filter((log) => log.studentId === studentId);
      },
      getLogsByStatus: (studentId, status) => {
        return get().logs.filter(
          (log) => log.studentId === studentId && log.status === status
        );
      },
    }),
    {
      name: 'auto-tutor-logs',
    }
  )
);

