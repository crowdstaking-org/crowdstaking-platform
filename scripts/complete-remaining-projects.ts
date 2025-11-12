/**
 * Complete Remaining Projects Script
 * Adds missions and proposals to projects that don't have any yet
 * 
 * Usage: npx tsx scripts/complete-remaining-projects.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Mission templates (same as main seed script)
const MISSION_TEMPLATES = [
  { title: 'Brand Identity & Logo Design', description: 'Create a comprehensive brand identity including logo variations, color palette, typography system, and brand guidelines document.' },
  { title: 'Landing Page Development', description: 'Design and develop a high-converting landing page with modern UI/UX, SEO optimization, and responsive design for all devices.' },
  { title: 'Community Management Strategy', description: 'Develop and implement a community engagement strategy including Discord/Telegram setup, content calendar, and growth tactics.' },
  { title: 'Technical Documentation', description: 'Write comprehensive technical documentation including API docs, architecture diagrams, and developer guides.' },
  { title: 'Social Media Campaign', description: 'Create and execute a social media marketing campaign across Twitter, LinkedIn, and other platforms with content calendar.' },
  { title: 'Video Tutorial Series', description: 'Produce professional video tutorials showcasing key features and use cases with screen recordings and voiceovers.' },
  { title: 'Security Audit', description: 'Conduct thorough security audit of codebase, smart contracts, and infrastructure with detailed vulnerability report.' },
  { title: 'Mobile App Development', description: 'Design and develop native or cross-platform mobile application with full feature parity to web version.' },
  { title: 'API Integration & SDK', description: 'Build comprehensive API client libraries and SDKs for popular programming languages with examples.' },
  { title: 'Performance Optimization', description: 'Optimize application performance including database queries, caching strategies, and frontend bundle size reduction.' },
]

const CONTRIBUTOR_NAMES = [
  'Oliver Smith', 'Sophia Martinez', 'Lucas Johnson', 'Isabella Davis',
  'Ethan Wilson', 'Mia Anderson', 'Noah Thomas', 'Charlotte Moore',
  'Liam Jackson', 'Amelia White', 'William Harris', 'Harper Clark',
  'Benjamin Lewis', 'Evelyn Robinson', 'Henry Walker', 'Abigail Hall',
]

const BIO_TEMPLATES = {
  designer: [
    'UX/UI designer with 6+ years creating beautiful, intuitive interfaces for startups and enterprises.',
    'Creative designer specializing in branding and visual identity. Previously worked with Y Combinator startups.',
    'Product designer passionate about user research and data-driven design decisions.',
  ],
  developer: [
    'Experienced software engineer building scalable systems. Open source enthusiast and conference speaker.',
    'Full-stack developer with expertise in modern web technologies and cloud infrastructure.',
    'Senior engineer focused on developer experience and building robust, maintainable codebases.',
  ],
  marketer: [
    'Growth hacker with proven track record scaling B2B SaaS products from zero to millions in ARR.',
    'Digital marketing strategist specializing in community building and content marketing.',
    'Marketing professional with deep expertise in SEO, paid acquisition, and conversion optimization.',
  ],
  writer: [
    'Technical writer making complex systems accessible through clear, concise documentation.',
    'Developer advocate and content creator with 100k+ followers across platforms.',
    'Documentation specialist helping teams communicate technical concepts effectively.',
  ],
}

function generateWallet(): string {
  const chars = '0123456789abcdef'
  let wallet = '0x'
  for (let i = 0; i < 40; i++) {
    wallet += chars[Math.floor(Math.random() * chars.length)]
  }
  return wallet
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateName(): string {
  return pickRandom(CONTRIBUTOR_NAMES)
}

function generateBio(type: keyof typeof BIO_TEMPLATES): string {
  return pickRandom(BIO_TEMPLATES[type])
}

function generateProposalStatus(): string {
  const statuses = ['pending_review', 'approved', 'accepted', 'work_in_progress', 'completed', 'rejected']
  const weights = [40, 20, 15, 10, 10, 5]
  const total = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * total
  
  for (let i = 0; i < statuses.length; i++) {
    random -= weights[i]
    if (random <= 0) return statuses[i]
  }
  return 'pending_review'
}

function generateTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

function randomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateFoundationNotes(): string {
  const templates = [
    'Excellent proposal! Your experience aligns perfectly with our needs. Approved with slight token adjustment.',
    'Love your approach and portfolio. We\'re excited to collaborate on this.',
    'Great detailed plan. Making a small counter-offer but definitely want to move forward.',
    'Your track record speaks for itself. Let\'s make this happen!',
    'Really impressed by the deliverables you outlined. Adjusted token allocation to fit our budget.',
  ]
  return pickRandom(templates)
}

function generateDescription(missionTitle: string, name: string, role: string): string {
  const intros = [
    `Hello! I'm ${name}, a ${role} with extensive experience.`,
    `Hi, ${name} here. Passionate ${role} ready to contribute.`,
    `Hey! ${name}, experienced ${role} excited about this mission.`,
  ]
  
  const approaches = [
    'I\'ll approach this systematically: research, design/develop, iterate based on feedback, and deliver polished results.',
    'My process: thorough planning, regular updates, multiple review cycles, and exceptional final delivery.',
    'I work in clear phases with transparency at every step and ensure you\'re always in the loop.',
  ]
  
  const timelines = [
    'Timeline: 2-3 weeks with weekly check-ins.',
    'Estimated: 10-15 days including revisions.',
    'Duration: 2 weeks with mid-point review.',
  ]
  
  return `${pickRandom(intros)}\n\n${pickRandom(approaches)}\n\n${pickRandom(timelines)}\n\nLooking forward to working together!`
}

function generateDeliverable(missionTitle: string): string {
  return `✅ Complete ${missionTitle.toLowerCase()}\n✅ All source files and assets\n✅ Documentation and guidelines\n✅ 2 revision rounds included\n✅ Post-delivery support (2 weeks)`
}

async function main() {
  console.log('🔧 Completing Remaining Projects')
  console.log('=================================\n')

  try {
    // Find projects without missions
    const { data: allProjects } = await supabase
      .from('projects')
      .select('id, name')
      .order('created_at', { ascending: true })

    const { data: projectsWithMissions } = await supabase
      .from('missions')
      .select('project_id')

    const projectIdsWithMissions = new Set(
      projectsWithMissions?.map((m: any) => m.project_id) || []
    )

    const projectsNeedingMissions = allProjects?.filter(
      (p: any) => !projectIdsWithMissions.has(p.id)
    ) || []

    console.log(`📊 Found ${projectsNeedingMissions.length} projects needing missions\n`)

    const stats = {
      profiles: 0,
      missions: 0,
      proposals: 0,
    }

    const usedWallets = new Set<string>()
    const usedNames = new Set<string>()

    // Process each project
    for (let i = 0; i < projectsNeedingMissions.length; i++) {
      const project = projectsNeedingMissions[i]
      console.log(`\n📦 [${i + 1}/${projectsNeedingMissions.length}] ${project.name}`)

      // Pick 3 random missions
      const selectedMissions = []
      const missionsCopy = [...MISSION_TEMPLATES]
      for (let m = 0; m < 3; m++) {
        const idx = Math.floor(Math.random() * missionsCopy.length)
        selectedMissions.push(missionsCopy.splice(idx, 1)[0])
      }

      // Create missions
      for (let m = 0; m < selectedMissions.length; m++) {
        const template = selectedMissions[m]
        const missionStatus = Math.random() < 0.70 ? 'active' : Math.random() < 0.90 ? 'completed' : 'paused'

        console.log(`   🎯 Creating mission: ${template.title}`)

        const { data: mission, error: missionError } = await supabase
          .from('missions')
          .insert({
            project_id: project.id,
            title: template.title,
            description: template.description,
            status: missionStatus,
          })
          .select()
          .single()

        if (missionError) {
          console.error(`      ❌ Error:`, missionError.message)
          continue
        }
        stats.missions++

        // Create 2 proposals per mission
        for (let p = 0; p < 2; p++) {
          let contributorWallet = generateWallet()
          while (usedWallets.has(contributorWallet)) {
            contributorWallet = generateWallet()
          }
          usedWallets.add(contributorWallet)

          let contributorName = generateName()
          while (usedNames.has(contributorName)) {
            contributorName = generateName()
          }
          usedNames.add(contributorName)

          // Determine role
          let role = 'professional'
          let bioType: keyof typeof BIO_TEMPLATES = 'developer'
          if (template.title.toLowerCase().includes('design') || template.title.toLowerCase().includes('brand')) {
            role = 'designer'
            bioType = 'designer'
          } else if (template.title.toLowerCase().includes('community') || template.title.toLowerCase().includes('social')) {
            role = 'marketer'
            bioType = 'marketer'
          } else if (template.title.toLowerCase().includes('documentation') || template.title.toLowerCase().includes('tutorial')) {
            role = 'technical writer'
            bioType = 'writer'
          } else if (template.title.toLowerCase().includes('development') || template.title.toLowerCase().includes('app')) {
            role = 'developer'
            bioType = 'developer'
          }

          // Create contributor profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              wallet_address: contributorWallet.toLowerCase(),
              display_name: contributorName,
              bio: generateBio(bioType),
              avatar_url: Math.random() > 0.7 ? `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100000000)}` : undefined,
              github_username: Math.random() > 0.7 ? contributorName.toLowerCase().replace(' ', '') : undefined,
            })

          if (!profileError || profileError.message.includes('duplicate')) {
            if (!profileError) stats.profiles++
          }

          // Create proposal
          const status = generateProposalStatus()
          const requestedAmount = randomAmount(50000, 5000000)
          const foundationOffer = ['approved', 'accepted', 'work_in_progress', 'completed'].includes(status)
            ? Math.floor(requestedAmount * (0.80 + Math.random() * 0.15))
            : null

          const proposal: any = {
            project_id: project.id,
            mission_id: mission.id,
            creator_wallet_address: contributorWallet.toLowerCase(),
            title: `${template.title} - ${contributorName}'s Proposal`,
            description: generateDescription(template.title, contributorName, role),
            deliverable: generateDeliverable(template.title),
            requested_cstake_amount: requestedAmount,
            status: status,
          }

          if (foundationOffer) {
            proposal.foundation_offer_cstake_amount = foundationOffer
          }

          if (['approved', 'accepted', 'work_in_progress', 'completed'].includes(status)) {
            proposal.foundation_notes = generateFoundationNotes()
          }

          if (['accepted', 'work_in_progress', 'completed'].includes(status)) {
            proposal.contract_agreement_tx = generateTxHash()
          }

          if (status === 'completed') {
            const daysAgo = randomAmount(1, 30)
            const completedDate = new Date()
            completedDate.setDate(completedDate.getDate() - daysAgo)
            proposal.pioneer_confirmed_at = completedDate.toISOString()
          }

          const { error: proposalError } = await supabase
            .from('proposals')
            .insert(proposal)

          if (!proposalError) {
            stats.proposals++
          }
        }

        console.log(`      ✅ Created 2 proposals`)
      }
    }

    console.log('\n\n✅ Completed successfully!')
    console.log('\n📊 Statistics:')
    console.log(`   - New profiles: ${stats.profiles}`)
    console.log(`   - New missions: ${stats.missions}`)
    console.log(`   - New proposals: ${stats.proposals}`)

  } catch (error) {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  }
}

main().then(() => {
  console.log('\n👋 Done!')
  process.exit(0)
})



