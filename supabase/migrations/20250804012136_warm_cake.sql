/*
  # Enhanced Announcements System

  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `content` (text, rich HTML content)
      - `type` (enum: feature, update, news, bugfix)
      - `priority` (enum: low, medium, high)
      - `status` (enum: draft, scheduled, published, archived)
      - `scheduled_at` (timestamptz, when to publish)
      - `published_at` (timestamptz, when actually published)
      - `timezone` (text, user's selected timezone)
      - `image_url` (text, optional)
      - `link_url` (text, optional)
      - `link_text` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `announcements` table
    - Add policies for user isolation
    - Users can only access their own announcements

  3. Functions
    - Auto-update `updated_at` timestamp
    - Handle scheduled publishing logic
*/

-- Create enum types
CREATE TYPE announcement_type AS ENUM ('feature', 'update', 'news', 'bugfix');
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE announcement_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  type announcement_type NOT NULL DEFAULT 'feature',
  priority announcement_priority NOT NULL DEFAULT 'medium',
  status announcement_status NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  timezone text NOT NULL DEFAULT 'UTC',
  image_url text,
  link_url text,
  link_text text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for user isolation
CREATE POLICY "Users can view own announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own announcements"
  ON announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own announcements"
  ON announcements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own announcements"
  ON announcements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle scheduled publishing
CREATE OR REPLACE FUNCTION publish_scheduled_announcements()
RETURNS void AS $$
BEGIN
  UPDATE announcements
  SET 
    status = 'published',
    published_at = now()
  WHERE 
    status = 'scheduled' 
    AND scheduled_at <= now()
    AND scheduled_at IS NOT NULL;
END;
$$ language 'plpgsql';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_announcements_user_id ON announcements(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_scheduled_at ON announcements(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at) WHERE status = 'published';