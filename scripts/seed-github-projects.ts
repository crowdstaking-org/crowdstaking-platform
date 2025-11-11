/**
 * GitHub Projects Seed Script
 * Fetches trending GitHub repositories and creates realistic CrowdStaking projects
 * with missions, proposals, and user profiles
 * 
 * Usage: npx tsx scripts/seed-github-projects.ts
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

// GitHub API endpoint for trending repos
const GITHUB_API = 'https://api.github.com/search/repositories?q=stars:>50000&sort=stars&order=desc&per_page=15'

// Fallback data if GitHub API fails
const FALLBACK_REPOS = [
  { name: 'freeCodeCamp', full_name: 'freeCodeCamp/freeCodeCamp', description: 'freeCodeCamp.org\'s open-source codebase and curriculum. Learn to code for free.', owner: { login: 'freeCodeCamp', avatar_url: 'https://avatars.githubusercontent.com/u/9892522' }, stargazers_count: 380000 },
  { name: 'react', full_name: 'facebook/react', description: 'The library for web and native user interfaces', owner: { login: 'facebook', avatar_url: 'https://avatars.githubusercontent.com/u/69631' }, stargazers_count: 220000 },
  { name: 'tensorflow', full_name: 'tensorflow/tensorflow', description: 'An Open Source Machine Learning Framework for Everyone', owner: { login: 'tensorflow', avatar_url: 'https://avatars.githubusercontent.com/u/15658638' }, stargazers_count: 180000 },
  { name: 'vue', full_name: 'vuejs/vue', description: '🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework', owner: { login: 'vuejs', avatar_url: 'https://avatars.githubusercontent.com/u/6128107' }, stargazers_count: 205000 },
  { name: 'kubernetes', full_name: 'kubernetes/kubernetes', description: 'Production-Grade Container Orchestration', owner: { login: 'kubernetes', avatar_url: 'https://avatars.githubusercontent.com/u/13629408' }, stargazers_count: 105000 },
  { name: 'next.js', full_name: 'vercel/next.js', description: 'The React Framework for Production', owner: { login: 'vercel', avatar_url: 'https://avatars.githubusercontent.com/u/14985020' }, stargazers_count: 118000 },
  { name: 'Python', full_name: 'TheAlgorithms/Python', description: 'All Algorithms implemented in Python', owner: { login: 'TheAlgorithms', avatar_url: 'https://avatars.githubusercontent.com/u/20487725' }, stargazers_count: 175000 },
  { name: 'flutter', full_name: 'flutter/flutter', description: 'Flutter makes it easy to build beautiful apps for mobile and beyond', owner: { login: 'flutter', avatar_url: 'https://avatars.githubusercontent.com/u/14101776' }, stargazers_count: 160000 },
  { name: 'django', full_name: 'django/django', description: 'The Web framework for perfectionists with deadlines', owner: { login: 'django', avatar_url: 'https://avatars.githubusercontent.com/u/27804' }, stargazers_count: 75000 },
  { name: 'rust', full_name: 'rust-lang/rust', description: 'Empowering everyone to build reliable and efficient software', owner: { login: 'rust-lang', avatar_url: 'https://avatars.githubusercontent.com/u/5430905' }, stargazers_count: 90000 },
  { name: 'bitcoin', full_name: 'bitcoin/bitcoin', description: 'Bitcoin Core integration/staging tree', owner: { login: 'bitcoin', avatar_url: 'https://avatars.githubusercontent.com/u/528860' }, stargazers_count: 75000 },
  { name: 'deno', full_name: 'denoland/deno', description: 'A modern runtime for JavaScript and TypeScript', owner: { login: 'denoland', avatar_url: 'https://avatars.githubusercontent.com/u/42048915' }, stargazers_count: 92000 },
  { name: 'ansible', full_name: 'ansible/ansible', description: 'Ansible is a radically simple IT automation platform', owner: { login: 'ansible', avatar_url: 'https://avatars.githubusercontent.com/u/1507452' }, stargazers_count: 60000 },
  { name: 'go', full_name: 'golang/go', description: 'The Go programming language', owner: { login: 'golang', avatar_url: 'https://avatars.githubusercontent.com/u/4314092' }, stargazers_count: 118000 },
  { name: 'electron', full_name: 'electron/electron', description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS', owner: { login: 'electron', avatar_url: 'https://avatars.githubusercontent.com/u/13409222' }, stargazers_count: 111000 },
]

// Mission templates
const MISSION_TEMPLATES = [
  {
    title: 'Brand Identity & Logo Design',
    description: 'Create a comprehensive brand identity including logo variations, color palette, typography system, and brand guidelines document.',
  },
  {
    title: 'Landing Page Development',
    description: 'Design and develop a high-converting landing page with modern UI/UX, SEO optimization, and responsive design for all devices.',
  },
  {
    title: 'Community Management Strategy',
    description: 'Develop and implement a community engagement strategy including Discord/Telegram setup, content calendar, and growth tactics.',
  },
  {
    title: 'Technical Documentation',
    description: 'Write comprehensive technical documentation including API docs, architecture diagrams, and developer guides.',
  },
  {
    title: 'Social Media Campaign',
    description: 'Create and execute a social media marketing campaign across Twitter, LinkedIn, and other platforms with content calendar.',
  },
  {
    title: 'Video Tutorial Series',
    description: 'Produce professional video tutorials showcasing key features and use cases with screen recordings and voiceovers.',
  },
  {
    title: 'Security Audit',
    description: 'Conduct thorough security audit of codebase, smart contracts, and infrastructure with detailed vulnerability report.',
  },
  {
    title: 'Mobile App Development',
    description: 'Design and develop native or cross-platform mobile application with full feature parity to web version.',
  },
  {
    title: 'API Integration & SDK',
    description: 'Build comprehensive API client libraries and SDKs for popular programming languages with examples.',
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize application performance including database queries, caching strategies, and frontend bundle size reduction.',
  },
]

// Proposal status distribution weights
const PROPOSAL_STATUS_WEIGHTS = {
  'pending_review': 40,
  'approved': 20,
  'accepted': 15,
  'work_in_progress': 10,
  'completed': 10,
  'rejected': 5,
}

// Sample names for contributors
const CONTRIBUTOR_NAMES = [
  'Alex Chen', 'Sarah Johnson', 'Michael Rodriguez', 'Emma Williams',
  'David Kim', 'Lisa Zhang', 'James Anderson', 'Maria Garcia',
  'Robert Taylor', 'Jennifer Lee', 'Daniel Martinez', 'Jessica Brown',
  'Christopher Wilson', 'Ashley Davis', 'Matthew Moore', 'Amanda White',
  'Joshua Thompson', 'Stephanie Martin', 'Andrew Jackson', 'Melissa Harris',
]

// Bio templates by role
const BIO_TEMPLATES = {
  designer: [
    'Senior Product Designer with 8+ years experience at top tech companies. Specialized in UI/UX, branding, and design systems.',
    'Award-winning designer focused on user-centered design. Former lead designer at successful startups.',
    'Creative director with expertise in brand identity and visual storytelling. Portfolio includes Fortune 500 clients.',
  ],
  developer: [
    'Full-stack developer specialized in React, Next.js, and modern web technologies. 10+ years building scalable applications.',
    'Senior Software Engineer with expertise in TypeScript, Node.js, and cloud infrastructure. Open source contributor.',
    'Frontend architect passionate about performance and accessibility. Speaker at major tech conferences.',
  ],
  marketer: [
    'Growth marketing specialist with proven track record growing startups from 0 to millions of users.',
    'Community builder and content strategist. Experienced in building engaged communities for Web3 projects.',
    'Digital marketing expert focused on SEO, content marketing, and social media growth strategies.',
  ],
  writer: [
    'Technical writer with 7+ years documenting complex software systems. Former software engineer turned writer.',
    'Content creator specializing in developer education. Published author and conference speaker.',
    'Documentation specialist helping developers understand and adopt new technologies through clear writing.',
  ],
}

/**
 * Helper Functions
 */

// Generate random Ethereum wallet address
function generateWallet(): string {
  const chars = '0123456789abcdef'
  let wallet = '0x'
  for (let i = 0; i < 40; i++) {
    wallet += chars[Math.floor(Math.random() * chars.length)]
  }
  return wallet
}

// Generate token symbol from project name
function generateTokenSymbol(name: string): string {
  // Remove special characters and take first 3-5 letters
  const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const length = Math.random() > 0.5 ? 4 : 3
  return clean.slice(0, length) || 'TKN'
}

// Pick random item from array
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Pick random name
function generateName(): string {
  return pickRandom(CONTRIBUTOR_NAMES)
}

// Generate bio based on type
function generateBio(type: keyof typeof BIO_TEMPLATES): string {
  return pickRandom(BIO_TEMPLATES[type])
}

// Generate weighted random status
function generateProposalStatus(): string {
  const total = Object.values(PROPOSAL_STATUS_WEIGHTS).reduce((a, b) => a + b, 0)
  let random = Math.random() * total
  
  for (const [status, weight] of Object.entries(PROPOSAL_STATUS_WEIGHTS)) {
    random -= weight
    if (random <= 0) return status
  }
  
  return 'pending_review'
}

// Generate transaction hash (fake)
function generateTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = '0x'
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

// Generate random amount between min and max
function randomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate foundation notes
function generateFoundationNotes(): string {
  const templates = [
    'Great proposal! We love your approach and experience. Approved with slight adjustment to token allocation.',
    'Excellent work history and clear deliverables. We\'re excited to work with you on this mission.',
    'Your portfolio speaks for itself. We\'re making a small counter-offer but would love to move forward.',
    'Really impressed by your detailed plan. Let\'s make this happen with the adjusted token amount.',
    'Perfect fit for what we need. We\'ve adjusted the token allocation to align with our budget.',
  ]
  return pickRandom(templates)
}

// Generate detailed proposal description
function generateProposalDescription(missionTitle: string, contributorName: string, role: string): string {
  const intros = [
    `Hi! I'm ${contributorName}, a seasoned ${role} with extensive experience in this field.`,
    `Hello, ${contributorName} here. I've been working as a ${role} for over 8 years.`,
    `Hey there! I'm ${contributorName}, specializing in ${role} with a proven track record.`,
  ]
  
  const approaches = [
    `For this mission, I'll take a comprehensive approach starting with thorough research and planning. I'll create detailed mockups/prototypes for review, iterate based on feedback, and deliver a polished final product.`,
    `My methodology involves breaking this down into clear phases: discovery, design/development, testing, and delivery. You'll receive regular updates and have multiple review checkpoints.`,
    `I plan to tackle this systematically by first understanding your vision, then creating initial drafts, incorporating your feedback, and refining until we achieve excellence.`,
  ]
  
  const timelines = [
    `Timeline: 2 weeks for complete delivery with mid-point review.`,
    `Expected completion: 3 weeks with weekly progress updates.`,
    `Estimated timeline: 10-14 days including revision rounds.`,
  ]
  
  const tools = [
    `Tools I'll use: Figma, Adobe Creative Suite, and modern design systems.`,
    `Tech stack: React, TypeScript, Next.js, Tailwind CSS, and industry best practices.`,
    `I'll leverage professional tools including Notion for project management, GitHub for version control, and Slack for communication.`,
  ]
  
  return `${pickRandom(intros)}\n\n${pickRandom(approaches)}\n\n${pickRandom(timelines)}\n\n${pickRandom(tools)}\n\nLooking forward to contributing to this amazing project!`
}

// Generate deliverable text
function generateDeliverable(missionTitle: string): string {
  const deliverables = [
    `✅ Complete ${missionTitle.toLowerCase()} package\n✅ Source files in industry-standard formats\n✅ Comprehensive documentation and guidelines\n✅ Revision rounds included\n✅ Full commercial usage rights`,
    `- Finalized ${missionTitle.toLowerCase()} deliverable\n- All source files and assets\n- Detailed documentation\n- 2 rounds of revisions\n- Post-delivery support (1 month)`,
    `1. Complete ${missionTitle.toLowerCase()} implementation\n2. Source files and documentation\n3. Style guide / technical documentation\n4. Training session (optional)\n5. 30-day support period`,
  ]
  return pickRandom(deliverables)
}

/**
 * Fetch GitHub trending repositories
 */
async function fetchGitHubRepos() {
  console.log('📡 Fetching trending GitHub repositories...')
  
  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CrowdStaking-Seeder',
      },
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`   ✅ Fetched ${data.items.length} repositories from GitHub API`)
    return data.items.slice(0, 15)
  } catch (error) {
    console.warn('   ⚠️  GitHub API failed, using fallback data')
    console.warn(`   Error: ${error}`)
    return FALLBACK_REPOS
  }
}

/**
 * Main seeding function
 */
async function seed() {
  console.log('🌱 CrowdStaking GitHub Projects Seeder')
  console.log('========================================\n')

  try {
    // Fetch GitHub repos
    const repos = await fetchGitHubRepos()
    
    console.log('\n📊 Seeding Plan:')
    console.log(`   - Projects: ${repos.length}`)
    console.log(`   - Missions per project: 3`)
    console.log(`   - Proposals per mission: 2`)
    console.log(`   - Expected total: ~${repos.length * 3 * 2} proposals\n`)

    const stats = {
      profiles: 0,
      projects: 0,
      missions: 0,
      proposals: 0,
    }

    // Track created wallets to avoid duplicates
    const usedWallets = new Set<string>()
    const usedNames = new Set<string>()

    // Loop through each repo and create project
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i]
      console.log(`\n📦 [${i + 1}/${repos.length}] Processing: ${repo.name}`)

      // Generate unique founder wallet
      let founderWallet = generateWallet()
      while (usedWallets.has(founderWallet)) {
        founderWallet = generateWallet()
      }
      usedWallets.add(founderWallet)

      // Create founder profile
      console.log(`   👤 Creating founder profile...`)
      const founderProfile = {
        wallet_address: founderWallet.toLowerCase(),
        display_name: `${repo.owner.login} Team`,
        bio: `Building ${repo.name} - ${repo.description?.slice(0, 150) || 'Innovative open source project'}`,
        avatar_url: repo.owner.avatar_url,
        github_username: repo.owner.login,
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(founderProfile)

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error(`   ❌ Error creating founder profile:`, profileError)
        continue
      }
      stats.profiles++

      // Create project
      console.log(`   📝 Creating project...`)
      const tokenSymbol = generateTokenSymbol(repo.name)
      const totalSupply = randomAmount(500000000, 2000000000)
      const tokenStatusRandom = Math.random()
      const tokenStatus = tokenStatusRandom < 0.60 ? 'illiquid' : tokenStatusRandom < 0.85 ? 'pending' : 'live'

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          founder_wallet_address: founderWallet.toLowerCase(),
          name: repo.name,
          description: repo.description || `An innovative project based on ${repo.name}`,
          token_name: `${repo.name} Token`,
          token_symbol: tokenSymbol,
          total_supply: totalSupply,
          token_status: tokenStatus,
          status: 'active',
        })
        .select()
        .single()

      if (projectError) {
        console.error(`   ❌ Error creating project:`, projectError)
        continue
      }
      stats.projects++
      console.log(`   ✅ Project created: ${project.name} (${tokenSymbol})`)

      // Create 3 missions for this project
      const selectedMissions = []
      const missionTemplatesCopy = [...MISSION_TEMPLATES]
      for (let m = 0; m < 3; m++) {
        const missionIndex = Math.floor(Math.random() * missionTemplatesCopy.length)
        selectedMissions.push(missionTemplatesCopy.splice(missionIndex, 1)[0])
      }

      for (let m = 0; m < selectedMissions.length; m++) {
        const missionTemplate = selectedMissions[m]
        const missionStatusRandom = Math.random()
        const missionStatus = missionStatusRandom < 0.70 ? 'active' : missionStatusRandom < 0.90 ? 'completed' : 'paused'

        console.log(`   🎯 Creating mission ${m + 1}/3: ${missionTemplate.title}`)

        const { data: mission, error: missionError } = await supabase
          .from('missions')
          .insert({
            project_id: project.id,
            title: missionTemplate.title,
            description: missionTemplate.description,
            status: missionStatus,
          })
          .select()
          .single()

        if (missionError) {
          console.error(`      ❌ Error creating mission:`, missionError)
          continue
        }
        stats.missions++

        // Create 2 proposals for this mission
        for (let p = 0; p < 2; p++) {
          // Generate unique contributor wallet
          let contributorWallet = generateWallet()
          while (usedWallets.has(contributorWallet)) {
            contributorWallet = generateWallet()
          }
          usedWallets.add(contributorWallet)

          // Generate unique contributor name
          let contributorName = generateName()
          while (usedNames.has(contributorName)) {
            contributorName = generateName()
          }
          usedNames.add(contributorName)

          // Determine role based on mission
          let role = 'professional'
          let bioType: keyof typeof BIO_TEMPLATES = 'developer'
          if (missionTemplate.title.toLowerCase().includes('design') || missionTemplate.title.toLowerCase().includes('brand')) {
            role = 'designer'
            bioType = 'designer'
          } else if (missionTemplate.title.toLowerCase().includes('community') || missionTemplate.title.toLowerCase().includes('social')) {
            role = 'marketer'
            bioType = 'marketer'
          } else if (missionTemplate.title.toLowerCase().includes('documentation') || missionTemplate.title.toLowerCase().includes('tutorial')) {
            role = 'technical writer'
            bioType = 'writer'
          } else if (missionTemplate.title.toLowerCase().includes('development') || missionTemplate.title.toLowerCase().includes('app')) {
            role = 'developer'
            bioType = 'developer'
          }

          // Create contributor profile
          const contributorProfile = {
            wallet_address: contributorWallet.toLowerCase(),
            display_name: contributorName,
            bio: generateBio(bioType),
            avatar_url: Math.random() > 0.7 ? `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100000000)}` : undefined,
            github_username: Math.random() > 0.7 ? contributorName.toLowerCase().replace(' ', '') : undefined,
          }

          const { error: contributorProfileError } = await supabase
            .from('profiles')
            .insert(contributorProfile)

          if (!contributorProfileError || contributorProfileError.message.includes('duplicate')) {
            if (!contributorProfileError) stats.profiles++
          }

          // Generate proposal
          const status = generateProposalStatus()
          const requestedAmount = randomAmount(50000, 5000000) // 0.05% - 0.5%
          const foundationOffer = status === 'approved' || status === 'accepted' || status === 'work_in_progress' || status === 'completed'
            ? Math.floor(requestedAmount * (0.80 + Math.random() * 0.15)) // 80-95% of requested
            : null

          const proposal: any = {
            project_id: project.id,
            mission_id: mission.id,
            creator_wallet_address: contributorWallet.toLowerCase(),
            title: `${missionTemplate.title} - ${contributorName}'s Proposal`,
            description: generateProposalDescription(missionTemplate.title, contributorName, role),
            deliverable: generateDeliverable(missionTemplate.title),
            requested_cstake_amount: requestedAmount,
            status: status,
          }

          // Add status-specific fields
          if (foundationOffer) {
            proposal.foundation_offer_cstake_amount = foundationOffer
          }

          if (status === 'approved' || status === 'accepted' || status === 'work_in_progress' || status === 'completed') {
            proposal.foundation_notes = generateFoundationNotes()
          }

          if (status === 'accepted' || status === 'work_in_progress' || status === 'completed') {
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

          if (proposalError) {
            console.error(`      ❌ Error creating proposal:`, proposalError)
          } else {
            stats.proposals++
          }
        }

        console.log(`      ✅ Created 2 proposals for mission`)
      }
    }

    console.log('\n✅ Seeding completed successfully!')
    console.log('\n📊 Final Statistics:')
    console.log(`   - Profiles created: ${stats.profiles}`)
    console.log(`   - Projects created: ${stats.projects}`)
    console.log(`   - Missions created: ${stats.missions}`)
    console.log(`   - Proposals created: ${stats.proposals}`)

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeder
seed().then(() => {
  console.log('\n👋 Done! Your database is now populated with GitHub-based projects.')
  process.exit(0)
})


