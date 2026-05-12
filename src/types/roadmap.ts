export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Resource {
  id: string;
  type: "video" | "article" | "book" | "documentation";
  title: string;
  url: string;
  author: string;
  duration?: string; // e.g. "15 mins", "1 hour"
}

export interface PracticeProblem {
  id: string;
  title: string;
  url: string;
  platform: "LeetCode" | "HackerRank" | "Codeforces" | "GeeksforGeeks" | "Other";
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  prerequisites: string[]; // array of topic ids
  resources: Resource[];
  problems: PracticeProblem[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  icon: string; // lucide icon name or svg
  topics: Topic[];
}

export interface UserTopicProgress {
  id: string;
  user_id: string;
  roadmap_id: string;
  topic_id: string;
  is_completed: boolean;
  completed_at: string | null;
}
