/**
 * Seed Development Data Script
 * Creates test projects, missions, and proposals for development
 * 
 * Usage: npx tsx scripts/seed-dev-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

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
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Test wallet addresses
const FOUNDER_WALLET = '0x1234567890123456789012345678901234567890'
const PIONEER_WALLET_1 = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
const PIONEER_WALLET_2 = '0x9876543210987654321098765432109876543210'

/**
 * Main seeding function
 */
async function seed() {
  console.log('🌱 CrowdStaking Development Data Seeder')
  console.log('========================================\n')

  try {
    // 1. Create Project
    console.log('📦 Creating test project...')
    
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('founder_wallet_address', FOUNDER_WALLET.toLowerCase())
      .single()

    let projectId: string

    if (existingProject) {
      console.log('   ℹ️  Project already exists, reusing...')
      projectId = existingProject.id
    } else {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          founder_wallet_address: FOUNDER_WALLET.toLowerCase(),
          name: 'Flight-AI',
          description: 'Revolutionary AI-powered flight booking and travel planning platform',
          token_name: 'Flight-AI Token',
          token_symbol: 'FLAI',
          total_supply: 1000000000,
          token_status: 'illiquid',
          status: 'active',
        })
        .select()
        .single()

      if (projectError) {
        console.error('   ❌ Error creating project:', projectError)
        throw projectError
      }

      projectId = project.id
      console.log(`   ✅ Project created: ${project.name} (${projectId})`)
    }

    // 2. Create Missions
    console.log('\n🎯 Creating test missions...')
    
    const missions = [
      {
        title: 'Logo & Brand Identity Design',
        description: 'Create a professional logo and brand identity package including color scheme, typography, and brand guidelines',
      },
      {
        title: 'Landing Page Development',
        description: 'Develop a responsive landing page with modern design and conversion optimization',
      },
      {
        title: 'Social Media Strategy',
        description: 'Create and implement a comprehensive social media marketing strategy',
      },
    ]

    const missionIds: string[] = []

    for (const mission of missions) {
      const { data: existingMission } = await supabase
        .from('missions')
        .select('id')
        .eq('project_id', projectId)
        .eq('title', mission.title)
        .single()

      if (existingMission) {
        console.log(`   ℹ️  Mission "${mission.title}" already exists, reusing...`)
        missionIds.push(existingMission.id)
      } else {
        const { data: newMission, error: missionError } = await supabase
          .from('missions')
          .insert({
            project_id: projectId,
            title: mission.title,
            description: mission.description,
            status: 'active',
          })
          .select()
          .single()

        if (missionError) {
          console.error(`   ❌ Error creating mission "${mission.title}":`, missionError)
          continue
        }

        missionIds.push(newMission.id)
        console.log(`   ✅ Mission created: ${mission.title}`)
      }
    }

    // 3. Create Proposals
    console.log('\n📝 Creating test proposals...')
    
    const proposals = [
      {
        mission_id: missionIds[0], // Logo mission
        creator_wallet_address: PIONEER_WALLET_1.toLowerCase(),
        title: 'Professional Brand Identity Package',
        description: 'Hello, I\'m a Senior Brand Designer with 8 years of experience. I\'ve worked with startups like Stripe, Notion, and Linear. I can create a complete brand identity for Flight-AI including:\n\n- Logo variations (horizontal, vertical, icon)\n- Color palette (primary, secondary, accent)\n- Typography system\n- Brand guidelines document\n- Social media templates\n\nDeliverable: Complete Figma file + exported assets in all formats\nTimeline: 2 weeks',
        deliverable: 'Complete brand identity package in Figma with all logo variations, color system, typography, and 20-page brand guidelines PDF',
        requested_cstake_amount: 1500000, // 0.15%
        status: 'pending_review',
      },
      {
        mission_id: missionIds[1], // Landing page mission
        creator_wallet_address: PIONEER_WALLET_2.toLowerCase(),
        title: 'Modern Next.js Landing Page',
        description: 'Hi! I\'m a full-stack developer specializing in Next.js and modern web technologies. I can build a high-converting landing page with:\n\n- Responsive design (mobile-first)\n- SEO optimization\n- Fast loading times (<2s)\n- Conversion tracking\n- A/B testing ready\n\nTech stack: Next.js 14, TypeScript, Tailwind CSS, Framer Motion',
        deliverable: 'Fully functional landing page deployed on Vercel with source code, documentation, and performance report',
        requested_cstake_amount: 2000000, // 0.2%
        status: 'pending_review',
      },
      {
        project_id: projectId, // Direct to project (no mission)
        creator_wallet_address: PIONEER_WALLET_1.toLowerCase(),
        title: 'Technical Whitepaper Writing',
        description: 'I\'m a technical writer with blockchain expertise. I can write a comprehensive whitepaper explaining Flight-AI\'s tokenomics, technology, and vision.\n\nIncludes:\n- Executive summary\n- Problem/solution\n- Technology architecture\n- Tokenomics breakdown\n- Roadmap\n- Team introduction',
        deliverable: '25-page professional whitepaper in PDF with custom graphics and diagrams',
        requested_cstake_amount: 1800000, // 0.18%
        status: 'approved',
        foundation_offer_cstake_amount: 1500000, // Counter-offer: 0.15%
        foundation_notes: 'Great proposal! We\'d like to accept with a slight adjustment to 0.15% tokens. The scope looks perfect for our needs.',
      },
    ]

    for (const proposal of proposals) {
      const { data: existingProposal } = await supabase
        .from('proposals')
        .select('id')
        .eq('title', proposal.title)
        .eq('creator_wallet_address', proposal.creator_wallet_address)
        .single()

      if (existingProposal) {
        console.log(`   ℹ️  Proposal "${proposal.title}" already exists, skipping...`)
        continue
      }

      const { data: newProposal, error: proposalError } = await supabase
        .from('proposals')
        .insert(proposal)
        .select()
        .single()

      if (proposalError) {
        console.error(`   ❌ Error creating proposal "${proposal.title}":`, proposalError)
        continue
      }

      console.log(`   ✅ Proposal created: ${proposal.title}`)
    }

    console.log('\n✅ Seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Project ID: ${projectId}`)
    console.log(`   - Missions: ${missionIds.length}`)
    console.log(`   - Proposals: ${proposals.length}`)
    console.log(`\n🧪 Test with wallet: ${FOUNDER_WALLET}`)

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeder
seed().then(() => {
  console.log('\n👋 Done!')
  process.exit(0)
})

