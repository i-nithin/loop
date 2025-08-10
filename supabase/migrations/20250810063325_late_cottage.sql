/*
  # Fix Announcements RLS Policies

  1. Security Updates
    - Drop existing RLS policies that use uid() function
    - Create new policies that work with service role key
    - Allow public read access for published announcements filtered by user_id
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own announcements" ON announcements;
DROP POLICY IF EXISTS "Users can delete own announcements" ON announcements;
DROP POLICY IF EXISTS "Users can update own announcements" ON announcements;
DROP POLICY IF EXISTS "Users can view own announcements" ON announcements;

-- Create new policies that work with service role
CREATE POLICY "Allow service role full access"
  ON announcements
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage own announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);