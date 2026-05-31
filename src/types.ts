export interface UserStats {
  username: string;
  avatarUrl: string;
  completedMissionsCount: number;
  currentStreak: number;
  level: number;
  checklist: {
    prayer: boolean;
    word: boolean;
    obedience: boolean;
  };
}

export interface ScriptureVerse {
  id: string;
  planId: string;
  reference: string;
  verseLines: string[];
  simpleMeaning: string;
  context: string;
  application: string;
  reflection: string;
  actionStep: string;
  dayNumber: number;
  totalDays: number;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  theme: string;
}

export interface Prayer {
  id: string;
  text: string;
  timestamp: string;
  categoryTags: string[];
  answered: boolean;
  answerText?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  iconType: string;
  status: "idle" | "active" | "completed";
}

export interface PathStage {
  id: string;
  name: string;
  description: string;
  completedDate?: string;
  completed: boolean;
  active: boolean;
  progressPercent?: number;
  subtracks?: {
    id: string;
    label: string;
    subtitle: string;
    icon: string;
  }[];
  requirements?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface CurriculumLesson {
  id: string;
  title: string;
  goal: string;
  scripture: string;
  practice: string;
  verseId: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumPlan {
  id: string;
  title: string;
  topics: CurriculumTopic[];
}

export type SubscriptionTier = "free" | "disciple_plus" | "church_leader";

export interface User {
  id: number;
  email: string;
  username: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
