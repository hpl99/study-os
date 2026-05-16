export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type ResourceType = "book" | "playlist" | "official-docs" | "practice";

export interface Resource {
  type: ResourceType;
  title: string;
  link: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  completed?: boolean;
  progress?: number;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  estimatedHours: number;
  icon: string;
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
