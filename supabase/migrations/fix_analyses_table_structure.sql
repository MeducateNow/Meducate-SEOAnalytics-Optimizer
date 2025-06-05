/*
  # Fix analyses table structure for proper JSON storage

  1. Changes
    - Ensure the `result` column is properly configured for JSON storage
    - Add proper constraints and defaults
    - Ensure the table has the correct structure for storing analysis results
*/

-- Make sure the analyses table exists with the correct structure
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  result jsonb NOT NULL,
  score integer,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Ensure RLS is enabled
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