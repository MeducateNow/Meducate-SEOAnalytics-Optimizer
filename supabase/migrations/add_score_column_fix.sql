/*
  # Add score column to analyses table (fix)

  1. Changes
    - Add `score` column to the `analyses` table to store SEO scores
    - The score is an integer representing the overall SEO score out of 100
    - Default value is NULL for backward compatibility with existing records
*/

-- Add score column to analyses table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analyses' AND column_name = 'score'
  ) THEN
    ALTER TABLE analyses ADD COLUMN score INTEGER;
  END IF;
END $$;