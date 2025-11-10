/**
 * Run Gamification Migrations Script
 * Executes migrations 009-014 for the gamification system
 * 
 * Usage: npx tsx scripts/run-gamification-migrations.ts
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

async function runMigration(migrationFile: string): Promise<boolean> {
  console.log(`\n🔧 Running migration: ${path.basename(migrationFile)}`)
  
  try {
    // Read migration file
    const sqlContent = fs.readFileSync(migrationFile, 'utf-8')
    
    // Execute SQL via RPC (Supabase's way to run raw SQL)
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      // If RPC doesn't exist, try direct execution
      console.log('   ℹ️  RPC method not available, trying direct execution...')
      
      // Split into individual statements and execute one by one
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: execError } = await (supabase as any).rpc('query', { 
            query_text: statement + ';' 
          })
          
          if (execError) {
            console.error(`   ❌ Error executing statement:`, execError)
            console.log(`   Statement: ${statement.substring(0, 100)}...`)
            throw execError
          }
        }
      }
    }
    
    console.log(`   ✅ Migration completed successfully`)
    return true
    
  } catch (error: any) {
    console.error(`   ❌ Error running migration:`, error.message)
    console.log('\n   💡 Please execute this migration manually in Supabase SQL Editor:')
    console.log('   ' + '='.repeat(60))
    const sqlContent = fs.readFileSync(migrationFile, 'utf-8')
    console.log(sqlContent)
    console.log('   ' + '='.repeat(60))
    return false
  }
}

async function main() {
  console.log('🎮 CrowdStaking Gamification Migration Runner')
  console.log('=============================================')
  
  const migrationsDir = path.join(process.cwd(), 'supabase-migrations')
  
  // Gamification migrations in order
  const migrations = [
    '009_extend_profiles_for_gamification.sql',
    '010_create_profile_stats.sql',
    '011_create_badges_system.sql',
    '012_create_social_features.sql',
    '013_create_privacy_settings.sql',
    '014_create_activity_timeline.sql',
  ]
  
  let successCount = 0
  let failureCount = 0
  
  for (const migration of migrations) {
    const migrationPath = path.join(migrationsDir, migration)
    
    if (!fs.existsSync(migrationPath)) {
      console.warn(`   ⚠️  Migration not found: ${migration}`)
      failureCount++
      continue
    }
    
    const success = await runMigration(migrationPath)
    if (success) {
      successCount++
    } else {
      failureCount++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`✅ Completed: ${successCount}/${migrations.length} migrations`)
  if (failureCount > 0) {
    console.log(`❌ Failed: ${failureCount} migrations`)
    console.log('\n💡 Note: Copy the SQL above and execute it in the Supabase SQL Editor')
    console.log('   Dashboard → SQL Editor → New Query → Paste & Run')
  }
}

main().catch((error) => {
  console.error('\n❌ Migration failed:', error)
  process.exit(1)
})

