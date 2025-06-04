/*
  # Create user settings table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key, references profiles.id)
      - `google_analytics_id` (text)
      - `google_search_console_verified` (boolean)
      - `email_notifications` (jsonb)
      - `api_key` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `user_settings` table
    - Add policies for authenticated users to read and update their own settings
*/

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  google_analytics_id text,
  google_search_console_verified boolean DEFAULT false,
  email_notifications jsonb DEFAULT '{"weeklyReports": true, "contentPerformance": true, "seoAlerts": true}'::jsonb,
  api_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
