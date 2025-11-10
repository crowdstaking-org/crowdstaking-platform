/**
 * Seed Project Tags
 * Adds relevant tags to the most visible projects for filtering
 * 
 * Tags are used for both:
 * - Tech Stack (React, Rust, Python, etc.)
 * - Categories (DeFi, SaaS, Infrastructure, etc.)
 * 
 * Run with: tsx scripts/seed-project-tags.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Tag mappings for top projects
 * Format: { projectName: [tags...] }
 * 
 * Tags include both tech stack and categories
 */
const tagMappings: Record<string, string[]> = {
  // Frontend Frameworks
  'React': ['React', 'JavaScript', 'Frontend', 'UI', 'Open Source'],
  'Vue.js': ['Vue', 'JavaScript', 'Frontend', 'UI', 'Open Source'],
  'Next.js': ['React', 'JavaScript', 'Frontend', 'Framework', 'SSR', 'Open Source'],
  
  // Machine Learning / AI
  'TensorFlow': ['Python', 'Machine Learning', 'AI', 'Data Science', 'Open Source'],
  
  // Infrastructure / DevOps
  'Kubernetes': ['Go', 'Infrastructure', 'DevOps', 'Cloud', 'Container', 'Open Source'],
  'Docker': ['Go', 'Infrastructure', 'DevOps', 'Container', 'Open Source'],
  
  // Mobile Development
  'Flutter': ['Dart', 'Mobile', 'Cross-Platform', 'UI', 'Open Source'],
  
  // Programming Languages
  'Go': ['Go', 'Programming Language', 'Backend', 'Open Source'],
  'Rust': ['Rust', 'Programming Language', 'Systems', 'Performance', 'Open Source'],
  'Deno': ['TypeScript', 'JavaScript', 'Runtime', 'Backend', 'Open Source'],
  
  // Backend Frameworks
  'Django': ['Python', 'Backend', 'Web Framework', 'Full Stack', 'Open Source'],
  
  // Desktop Applications
  'Electron': ['JavaScript', 'Desktop', 'Cross-Platform', 'Open Source'],
  
  // Community / Lists
  'awesome': ['Community', 'Lists', 'Resources', 'Open Source'],
  'freeCodeCamp': ['Education', 'JavaScript', 'Learning', 'Community', 'Open Source'],
  'build-your-own-x': ['Education', 'Tutorial', 'Learning', 'Programming', 'Open Source'],
  'public-apis': ['API', 'Resources', 'Web Development', 'Community', 'Open Source'],
}

async function seedProjectTags() {
  console.log('🌱 Starting to seed project tags...\n')
  
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const [projectName, tags] of Object.entries(tagMappings)) {
    try {
      // Find project by name
      const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('id, name, tags')
        .eq('name', projectName)
        .limit(1)

      if (fetchError) {
        console.error(`❌ Error fetching project "${projectName}":`, fetchError.message)
        errorCount++
        continue
      }

      if (!projects || projects.length === 0) {
        console.log(`⏭️  Skipping "${projectName}" - not found in database`)
        skippedCount++
        continue
      }

      const project = projects[0]

      // Check if already has tags
      if (project.tags && project.tags.length > 0) {
        console.log(`⏭️  Skipping "${projectName}" - already has tags: ${project.tags.join(', ')}`)
        skippedCount++
        continue
      }

      // Update with tags
      const { error: updateError } = await supabase
        .from('projects')
        .update({ tags })
        .eq('id', project.id)

      if (updateError) {
        console.error(`❌ Error updating "${projectName}":`, updateError.message)
        errorCount++
        continue
      }

      console.log(`✅ Updated "${projectName}" with tags: ${tags.join(', ')}`)
      updatedCount++
    } catch (err) {
      console.error(`❌ Unexpected error for "${projectName}":`, err)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`  ✅ Updated: ${updatedCount}`)
  console.log(`  ⏭️  Skipped: ${skippedCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)
  console.log(`  📝 Total: ${Object.keys(tagMappings).length}`)

  if (updatedCount > 0) {
    console.log('\n✨ Project tags seeded successfully!')
  } else {
    console.log('\n⚠️  No projects were updated.')
  }
}

// Run the seed function
seedProjectTags()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Fatal error:', err)
    process.exit(1)
  })

