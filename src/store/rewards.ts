import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RewardLog } from '../types';

interface RewardsState {
  rewardLogs: RewardLog[];
  addRewardLog: (log: RewardLog) => void;
  getRewardLogsByStudent: (studentId: string) => RewardLog[];
  getPenaltyCount: (studentId: string) => number;
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      rewardLogs: [],
      addRewardLog: (log) => {
        set((state) => ({
          rewardLogs: [...state.rewardLogs, log],
        }));
      },
      getRewardLogsByStudent: (studentId) => {
        return get().rewardLogs.filter((log) => log.studentId === studentId);
      },
      getPenaltyCount: (studentId) => {
        return get().rewardLogs
          .filter((log) => log.studentId === studentId && log.type === 'penalty')
          .reduce((sum, log) => sum + log.value, 0);
      },
    }),
    {
      name: 'auto-tutor-rewards',
    }
  )
);

