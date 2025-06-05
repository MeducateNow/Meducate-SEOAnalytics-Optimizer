import { createClient } from '@supabase/supabase-js'

// Get environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client with environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to refresh schema cache
export async function refreshSchemaCache() {
  try {
    // First, try to force a schema refresh using a direct query
    await supabase.rpc('get_schema_version')
    
    // Then, explicitly query the analyses table structure to ensure it's in the cache
    await supabase.from('analyses').select('id').limit(1)
    
    console.log('Schema cache refreshed')
    return true
  } catch (error) {
    console.error('Failed to refresh schema cache:', error)
    return false
  }
}

// Enhanced function to verify the analyses table structure
export async function verifyAnalysesTableStructure() {
  try {
    // First refresh the schema cache
    await refreshSchemaCache()
    
    // Then check if we can access the focus_keyword column
    const { data, error } = await supabase
      .from('analyses')
      .select('focus_keyword')
      .limit(1)
    
    if (error) {
      console.error('Error verifying analyses table structure:', error)
      
      // If there's an error, try to execute the migration directly
      try {
        await supabase.rpc('execute_sql', {
          sql_query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'analyses' AND column_name = 'focus_keyword'
              ) THEN
                ALTER TABLE analyses ADD COLUMN focus_keyword TEXT;
              END IF;
            END $$;
          `
        })
        
        // Refresh the schema cache again after the migration
        await refreshSchemaCache()
        
        console.log('Applied focus_keyword column migration directly')
        return true
      } catch (migrationError) {
        console.error('Failed to apply migration directly:', migrationError)
        return false
      }
    }
    
    console.log('Analyses table structure verified')
    return true
  } catch (error) {
    console.error('Failed to verify analyses table structure:', error)
    return false
  }
}

// Initialize by refreshing schema cache and verifying table structure
refreshSchemaCache().then(() => {
  verifyAnalysesTableStructure()
})
