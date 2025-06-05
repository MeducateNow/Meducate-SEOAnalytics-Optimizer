/*
  # Ensure focus_keyword column exists in analyses table

  1. Changes
    - Ensures the `focus_keyword` column exists in the `analyses` table
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - This migration is a safety measure to ensure the column is properly added
*/

-- Ensure focus_keyword column exists in analyses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analyses' AND column_name = 'focus_keyword'
  ) THEN
    ALTER TABLE analyses ADD COLUMN focus_keyword TEXT;
  END IF;
END $$;