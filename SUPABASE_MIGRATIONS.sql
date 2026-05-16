-- StudyOS Supabase Database Migrations
-- Complete schema for StudyOS Supabase tables and access control.
-- Execute this file in your Supabase SQL editor.

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_handle TEXT,
  codeforces_handle TEXT,
  github_handle TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER PROBLEMS TABLE (DSA TRACKER)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('LeetCode', 'Codeforces', 'CodeChef', 'AtCoder', 'Other')),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'Solved' CHECK (status IN ('Solved', 'Attempted', 'To Do')),
  is_bookmarked BOOLEAN DEFAULT false,
  time_taken_mins INTEGER,
  solved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_problems_user_id ON user_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problems_difficulty ON user_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_problems_solved_at ON user_problems(solved_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_problems_platform ON user_problems(platform);
ALTER TABLE user_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own problems" ON user_problems
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER NOTES TABLE (NOTES & REVISION SYSTEM)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence_level TEXT NOT NULL DEFAULT 'Medium' CHECK (confidence_level IN ('Low', 'Medium', 'High')),
  next_revision_date TIMESTAMP WITH TIME ZONE,
  topic_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_next_revision_date ON user_notes(next_revision_date);
CREATE INDEX IF NOT EXISTS idx_user_notes_topic_id ON user_notes(topic_id);
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes" ON user_notes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER TOPIC PROGRESS TABLE (ROADMAP TRACKING)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, roadmap_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_roadmap_id ON user_topic_progress(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_is_completed ON user_topic_progress(is_completed);
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own progress" ON user_topic_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ROADMAP PROGRESS SNAPSHOTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_id TEXT NOT NULL,
  completed_topics_count INTEGER DEFAULT 0,
  total_topics INTEGER DEFAULT 0,
  progress_percent INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, roadmap_id)
);

CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user_id ON roadmap_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_roadmap_id ON roadmap_progress(roadmap_id);
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own roadmap progress" ON roadmap_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- LINKED PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS linked_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('LeetCode', 'Codeforces', 'GitHub', 'CodeChef', 'AtCoder', 'Other')),
  handle TEXT NOT NULL,
  profile_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_linked_profiles_user_id ON linked_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_profiles_platform ON linked_profiles(platform);
ALTER TABLE linked_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own linked profiles" ON linked_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- BOOKMARKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('problem', 'topic', 'resource', 'note', 'article', 'other')),
  item_id UUID,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_item_type ON bookmarks(item_type);
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- REVISION HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES user_notes(id) ON DELETE CASCADE,
  revision_type TEXT NOT NULL CHECK (revision_type IN ('review', 'self_test', 'flashcard', 'article')),
  notes TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revisions_user_id ON revisions(user_id);
CREATE INDEX IF NOT EXISTS idx_revisions_note_id ON revisions(note_id);
CREATE INDEX IF NOT EXISTS idx_revisions_scheduled_at ON revisions(scheduled_at);
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own revisions" ON revisions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- CONTEST REMINDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS contest_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id TEXT NOT NULL,
  contest_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('Codeforces', 'LeetCode', 'CodeChef', 'AtCoder', 'Other')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contest_reminders_user_id ON contest_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_reminders_contest_id ON contest_reminders(contest_id);
ALTER TABLE contest_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own contest reminders" ON contest_reminders
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- AI CHAT HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_session_id ON ai_chat_history(session_id);
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own AI chat history" ON ai_chat_history
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS (Optional but recommended for updated_at)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_problems_updated_at ON user_problems;
CREATE TRIGGER update_user_problems_updated_at
  BEFORE UPDATE ON user_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_topic_progress_updated_at ON user_topic_progress;
CREATE TRIGGER update_user_topic_progress_updated_at
  BEFORE UPDATE ON user_topic_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roadmap_progress_updated_at ON roadmap_progress;
CREATE TRIGGER update_roadmap_progress_updated_at
  BEFORE UPDATE ON roadmap_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_linked_profiles_updated_at ON linked_profiles;
CREATE TRIGGER update_linked_profiles_updated_at
  BEFORE UPDATE ON linked_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookmarks_updated_at ON bookmarks;
CREATE TRIGGER update_bookmarks_updated_at
  BEFORE UPDATE ON bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_revisions_updated_at ON revisions;
CREATE TRIGGER update_revisions_updated_at
  BEFORE UPDATE ON revisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contest_reminders_updated_at ON contest_reminders;
CREATE TRIGGER update_contest_reminders_updated_at
  BEFORE UPDATE ON contest_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_chat_history_updated_at ON ai_chat_history;
CREATE TRIGGER update_ai_chat_history_updated_at
  BEFORE UPDATE ON ai_chat_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- CACHED ANALYTICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cached_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('LeetCode', 'Codeforces', 'GitHub')),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_cached_analytics_user_id ON cached_analytics(user_id);
ALTER TABLE cached_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cached analytics" ON cached_analytics
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_cached_analytics_updated_at ON cached_analytics;
CREATE TRIGGER update_cached_analytics_updated_at
  BEFORE UPDATE ON cached_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications_enabled BOOLEAN DEFAULT true,
  notify_codeforces BOOLEAN DEFAULT true,
  notify_leetcode BOOLEAN DEFAULT true,
  notify_atcoder BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notification preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
/*
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
*/
