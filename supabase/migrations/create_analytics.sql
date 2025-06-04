/*
  # Create analytics tables

  1. New Tables
    - `content_analytics`
      - `id` (uuid, primary key)
      - `content_id` (uuid, references content.id)
      - `views` (integer)
      - `unique_visitors` (integer)
      - `avg_time_on_page` (integer) - in seconds
      - `bounce_rate` (numeric)
      - `date` (date)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    
    - `traffic_sources`
      - `id` (uuid, primary key)
      - `content_id` (uuid, references content.id)
      - `source` (text) - 'organic', 'direct', 'referral', 'social', 'email', 'other'
      - `visits` (integer)
      - `date` (date)
      - `created_at` (timestamp with time zone)
    
    - `device_analytics`
      - `id` (uuid, primary key)
      - `content_id` (uuid, references content.id)
      - `device_type` (text) - 'desktop', 'mobile', 'tablet'
      - `visits` (integer)
      - `date` (date)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read analytics for their own content
*/

-- Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  avg_time_on_page integer DEFAULT 0,
  bounce_rate numeric DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read analytics for their own content"
  ON content_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = content_analytics.content_id
      AND content.user_id = auth.uid()
    )
  );

-- Traffic Sources Table
CREATE TABLE IF NOT EXISTS traffic_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  source text NOT NULL CHECK (source IN ('organic', 'direct', 'referral', 'social', 'email', 'other')),
  visits integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traffic_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read traffic sources for their own content"
  ON traffic_sources
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = traffic_sources.content_id
      AND content.user_id = auth.uid()
    )
  );

-- Device Analytics Table
CREATE TABLE IF NOT EXISTS device_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  device_type text NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  visits integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE device_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read device analytics for their own content"
  ON device_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content
      WHERE content.id = device_analytics.content_id
      AND content.user_id = auth.uid()
    )
  );
