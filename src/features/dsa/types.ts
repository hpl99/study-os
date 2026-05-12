export type ProblemDifficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "Solved" | "Attempted" | "To Do";
export type Platform = "LeetCode" | "Codeforces" | "CodeChef" | "AtCoder" | "Other";

export interface UserProblem {
  id: string;
  user_id: string;
  platform: Platform;
  title: string;
  url: string;
  difficulty: ProblemDifficulty;
  topic_tags: string[];
  status: ProblemStatus;
  is_bookmarked: boolean;
  time_taken_mins?: number;
  solved_at?: string;
  created_at: string;
}

export interface ProblemFormData {
  platform: Platform;
  title: string;
  url: string;
  difficulty: ProblemDifficulty;
  topic_tags: string; // comma separated for the form
  time_taken_mins?: number;
}
