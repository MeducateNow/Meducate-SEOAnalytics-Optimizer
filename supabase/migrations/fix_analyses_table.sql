/*
  # Fix analyses table structure

  1. Changes
    - Ensure the `analyses` table exists with proper structure
    - Add user_id column for future authentication support
    - Ensure RLS policies are properly set up
*/

-- Check if table exists and create if it doesn't
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  result jsonb NOT NULL,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Make sure RLS is enabled
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public access to analyses" ON analyses;

-- Create new policy for public access
CREATE POLICY "Allow public access to analyses"
  ON analyses
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);