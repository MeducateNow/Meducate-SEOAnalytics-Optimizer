/*
  # Create analyses table

  1. New Tables
    - `analyses`
      - `id` (uuid, primary key)
      - `url` (text, not null)
      - `result` (jsonb, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `analyses` table
    - Add policy for public access (since we're not implementing auth in this version)
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- For this demo, we'll allow public access to the analyses table
CREATE POLICY "Allow public access to analyses"
  ON analyses
  FOR ALL
  TO anon
  USING (true);