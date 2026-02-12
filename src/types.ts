export type ResultStatus = "O" | "X" | "△";

export interface LogEntry {
  id: string;
  studentId: string;
  unit: string;
  question: string;
  status: ResultStatus;
  timestamp: number;
}

export interface Homework {
  id: string;
  unit: string;
  range: string;
  assignedAt: number;
  completed: boolean;
}

export interface RewardLog {
  id: string;
  studentId: string;
  type: "stamp" | "penalty";
  value: number;
  reason?: string;
  timestamp: number;
}

export interface Student {
  id: string;
  name: string;
  stamps: number;
  logs: LogEntry[];
  homework: Homework[];
}

