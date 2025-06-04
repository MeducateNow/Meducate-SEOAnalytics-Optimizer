/*
  # Create database functions

  1. Functions
    - `handle_new_user()`: Creates a profile and user settings when a new user signs up
    - `update_updated_at_column()`: Updates the updated_at timestamp when a record is updated
  
  2. Triggers
    - Add trigger to create profile and settings on new user
    - Add triggers to update updated_at columns on various tables
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Create default settings for the new user
  INSERT INTO user_settings (id, api_key)
  VALUES (NEW.id, encode(gen_random_bytes(32), 'hex'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and settings when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables
DO $$
BEGIN
  -- For profiles table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at'
  ) THEN
    CREATE TRIGGER set_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  
  -- For content table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_content_updated_at'
  ) THEN
    CREATE TRIGGER set_content_updated_at
      BEFORE UPDATE ON content
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  
  -- For content_analytics table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_content_analytics_updated_at'
  ) THEN
    CREATE TRIGGER set_content_analytics_updated_at
      BEFORE UPDATE ON content_analytics
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  
  -- For seo_suggestions table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_seo_suggestions_updated_at'
  ) THEN
    CREATE TRIGGER set_seo_suggestions_updated_at
      BEFORE UPDATE ON seo_suggestions
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  
  -- For user_settings table
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_settings_updated_at'
  ) THEN
    CREATE TRIGGER set_user_settings_updated_at
      BEFORE UPDATE ON user_settings
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END
$$;
