/*
  # Create get_schema_version function

  1. New Functions
    - `get_schema_version` - A simple function that returns the current timestamp
    - This function is used to force a refresh of the Supabase client's schema cache
*/

-- Create a function to help refresh schema cache
CREATE OR REPLACE FUNCTION get_schema_version()
RETURNS timestamp
LANGUAGE SQL
AS $$
  SELECT now();
$$;