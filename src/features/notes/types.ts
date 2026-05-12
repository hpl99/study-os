export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface UserNote {
  id: string;
  user_id: string;
  title: string;
  topic_id?: string;
  content: string;
  confidence_level: ConfidenceLevel;
  next_revision_date?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  confidence_level: ConfidenceLevel;
  topic_id?: string;
}
