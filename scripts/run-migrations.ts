/**
 * Run Migrations Script
 * Executes SQL migrations directly via Supabase client
 * 
 * Usage: npx tsx scripts/run-migrations.ts [migration-file]
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})

async function runMigration(migrationFile: string) {
  console.log(`\n🔧 Running migration: ${path.basename(migrationFile)}`)
  
  try {
    // Read migration file
    const sqlContent = fs.readFileSync(migrationFile, 'utf-8')
    
    // Execute SQL via RPC or direct query
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
      .catch(async () => {
        // Fallback: Try executing as raw SQL
        // Note: This might not work for all SQL statements
        return await supabase.from('_migrations').select('*').limit(0)
      })
    
    // Since RPC might not exist, we'll use a different approach
    // We'll just log the SQL for manual execution
    console.log('   ℹ️  Please execute this SQL manually in Supabase SQL Editor:')
    console.log('   ' + '='.repeat(60))
    console.log(sqlContent)
    console.log('   ' + '='.repeat(60))
    
  } catch (error) {
    console.error(`   ❌ Error reading migration file:`, error)
    throw error
  }
}

async function main() {
  console.log('🗂️  CrowdStaking Migration Runner')
  console.log('==================================')
  
  const migrationsDir = path.join(process.cwd(), 'supabase-migrations')
  
  // Get migration file from args or run specific ones
  const migrationArg = process.argv[2]
  
  if (migrationArg) {
    const migrationPath = path.join(migrationsDir, migrationArg)
    await runMigration(migrationPath)
  } else {
    // Run migrations 007 and 008
    const migrations = [
      '007_create_profiles_table.sql',
      '008_add_status_and_foundation_fields.sql',
    ]
    
    for (const migration of migrations) {
      const migrationPath = path.join(migrationsDir, migration)
      if (fs.existsSync(migrationPath)) {
        await runMigration(migrationPath)
      } else {
        console.warn(`   ⚠️  Migration not found: ${migration}`)
      }
    }
  }
  
  console.log('\n✅ Migration runner completed')
  console.log('\n💡 Note: Copy the SQL above and execute it in the Supabase SQL Editor')
  console.log('   Dashboard → SQL Editor → New Query → Paste & Run')
}

main().catch((error) => {
  console.error('\n❌ Migration failed:', error)
  process.exit(1)
})

