/*
  # Create content table

  1. New Tables
    - `content`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `type` (text, not null) - 'webinar' or 'article'
      - `status` (text, not null) - 'draft' or 'published'
      - `user_id` (uuid, references profiles.id)
      - `meta_description` (text)
      - `keywords` (text array)
      - `tags` (text array)
      - `seo_optimized` (boolean)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `content` table
    - Add policies for authenticated users to CRUD their own content
*/

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('webinar', 'article')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meta_description text,
  keywords text[],
  tags text[],
  seo_optimized boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own content"
  ON content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own content"
  ON content
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own content"
  ON content
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON content
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
