/*
  # Create SEO suggestions table

  1. New Tables
    - `seo_suggestions`
      - `id` (uuid, primary key)
      - `content_id` (uuid, references content.id)
      - `suggested_keywords` (text array)
      - `suggested_meta_description` (text)
      - `seo_score` (integer)
      - `issues` (text array)
      - `recommendations` (text array)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `seo_suggestions` table
    - Add policies for authenticated users to read and update SEO suggestions for their own content
*/

CREATE TABLE IF NOT EXISTS seo_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  suggested_keywords text[],
  suggested_meta_description text,
  seo_score integer DEFAULT 0,
  issues text[],
  recommendations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seo_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read SEO suggestions for their own content"
  ON seo_suggestions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = seo_suggestions.content_id
      AND content.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update SEO suggestions for their own content"
  ON seo_suggestions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = seo_suggestions.content_id
      AND content.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert SEO suggestions for their own content"
  ON seo_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = seo_suggestions.content_id
      AND content.user_id = auth.uid()
    )
  );
