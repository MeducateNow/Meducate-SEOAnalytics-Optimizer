/*
  # Add focus_keyword column to analyses table

  1. Changes
    - Add `focus_keyword` column to the `analyses` table
    - This column stores the user-provided focus keyword used for SEO scoring
*/

-- Add focus_keyword column to analyses table
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS focus_keyword TEXT;