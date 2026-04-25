// src/lib/types.ts

export type UserProfile = {
  id?: string;
  device_id: string;
  age_range: string;
  goal: string;
  baseline_condition: string;
};

export type DailyLog = {
  id?: string;
  user_id?: string;
  date: string;
  sleep: string;
  condition: string[];
  weight?: number | null;
  menstrual: string;
  activity: string;
  ai_result?: string;
  actions?: string[];
  completed_actions?: number[];
  score?: number;
};

export type UserStats = {
  streak_days: number;
  total_logs: number;
  avg_score: number;
};
