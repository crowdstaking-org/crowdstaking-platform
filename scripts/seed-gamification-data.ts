/**
 * Seed Gamification Data Script
 * Creates test profiles with stats, badges, and social relationships
 * 
 * Usage: npx tsx scripts/seed-gamification-data.ts
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

// Test wallet addresses
const testWallets = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
  '0x3333333333333333333333333333333333333333',
  '0x4444444444444444444444444444444444444444',
  '0x5555555555555555555555555555555555555555',
]

async function seedProfiles() {
  console.log('\n📝 Seeding profiles...')

  const profiles = [
    {
      wallet_address: testWallets[0],
      display_name: 'Alice the Builder',
      bio: 'Experienced Solidity developer and Web3 enthusiast',
      skills: ['Solidity', 'React', 'TypeScript'],
      availability_status: 'open',
      github_username: 'alice-builder',
      trust_score: 85,
      total_earned_tokens: 50000,
      profile_views: 120,
    },
    {
      wallet_address: testWallets[1],
      display_name: 'Bob the Designer',
      bio: 'UI/UX designer specializing in Web3 applications',
      skills: ['UI/UX', 'Figma', 'Design Systems'],
      availability_status: 'busy',
      twitter_username: 'bobdesigns',
      trust_score: 72,
      total_earned_tokens: 30000,
      profile_views: 85,
    },
    {
      wallet_address: testWallets[2],
      display_name: 'Charlie the Founder',
      bio: 'Building the future of decentralized collaboration',
      skills: ['Product Management', 'Tokenomics'],
      availability_status: 'open',
      trust_score: 68,
      total_earned_tokens: 10000,
      profile_views: 45,
    },
    {
      wallet_address: testWallets[3],
      display_name: 'Diana the Contributor',
      bio: 'Frontend developer passionate about DeFi',
      skills: ['React', 'Next.js', 'Tailwind'],
      availability_status: 'open',
      trust_score: 78,
      total_earned_tokens: 25000,
      profile_views: 60,
    },
    {
      wallet_address: testWallets[4],
      display_name: 'Eve the Newbie',
      bio: 'Just getting started in Web3',
      skills: ['JavaScript', 'Learning'],
      availability_status: 'open',
      trust_score: 50,
      total_earned_tokens: 0,
      profile_views: 5,
    },
  ]

  for (const profile of profiles) {
    const { error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'wallet_address' })

    if (error) {
      console.error(`Failed to create profile ${profile.display_name}:`, error)
    } else {
      console.log(`✅ Created profile: ${profile.display_name}`)
    }
  }
}

async function seedProfileStats() {
  console.log('\n📊 Seeding profile stats...')

  const stats = [
    {
      wallet_address: testWallets[0],
      proposals_submitted: 15,
      proposals_accepted: 13,
      proposals_completed: 12,
      missions_completed: 12,
      completion_rate: 92.3,
      avg_response_time_hours: 4.5,
      projects_created: 0,
      endorsements_count: 8,
      total_activity_days: 45,
      streak_days: 7,
    },
    {
      wallet_address: testWallets[1],
      proposals_submitted: 8,
      proposals_accepted: 7,
      proposals_completed: 6,
      missions_completed: 6,
      completion_rate: 85.7,
      avg_response_time_hours: 12.0,
      projects_created: 0,
      endorsements_count: 5,
      total_activity_days: 30,
      streak_days: 3,
    },
    {
      wallet_address: testWallets[2],
      proposals_submitted: 0,
      proposals_accepted: 0,
      proposals_completed: 0,
      missions_completed: 0,
      completion_rate: 0,
      projects_created: 2,
      projects_live: 1,
      missions_created: 8,
      total_missions_payout: 75000,
      total_activity_days: 20,
      streak_days: 1,
    },
    {
      wallet_address: testWallets[3],
      proposals_submitted: 5,
      proposals_accepted: 5,
      proposals_completed: 4,
      missions_completed: 4,
      completion_rate: 80.0,
      avg_response_time_hours: 8.0,
      projects_created: 0,
      endorsements_count: 3,
      total_activity_days: 15,
      streak_days: 2,
    },
    {
      wallet_address: testWallets[4],
      proposals_submitted: 1,
      proposals_accepted: 0,
      proposals_completed: 0,
      missions_completed: 0,
      completion_rate: 0,
      projects_created: 0,
      total_activity_days: 2,
      streak_days: 1,
    },
  ]

  for (const stat of stats) {
    const { error } = await supabase
      .from('profile_stats')
      .upsert(stat, { onConflict: 'wallet_address' })

    if (error) {
      console.error(`Failed to create stats for ${stat.wallet_address}:`, error)
    } else {
      console.log(`✅ Created stats for ${stat.wallet_address}`)
    }
  }
}

async function seedBadges() {
  console.log('\n🏆 Seeding user badges...')

  const userBadges = [
    // Alice - experienced contributor
    { wallet_address: testWallets[0], badge_id: 'first_mission' },
    { wallet_address: testWallets[0], badge_id: 'speed_demon' },
    { wallet_address: testWallets[0], badge_id: 'reliable' },
    { wallet_address: testWallets[0], badge_id: 'networker' },

    // Bob
    { wallet_address: testWallets[1], badge_id: 'first_mission' },
    { wallet_address: testWallets[1], badge_id: 'speed_demon' },

    // Charlie - founder
    { wallet_address: testWallets[2], badge_id: 'lift_off' },
    { wallet_address: testWallets[2], badge_id: 'fair_founder' },

    // Diana
    { wallet_address: testWallets[3], badge_id: 'first_mission' },
  ]

  for (const badge of userBadges) {
    const { error } = await supabase.from('user_badges').insert(badge)

    if (error && error.code !== '23505') {
      // Ignore duplicate key errors
      console.error(`Failed to award badge:`, error)
    } else {
      console.log(`✅ Awarded ${badge.badge_id} to ${badge.wallet_address}`)
    }
  }
}

async function seedFollows() {
  console.log('\n👥 Seeding follow relationships...')

  const follows = [
    // Alice follows Bob, Charlie, Diana
    { follower_address: testWallets[0], following_address: testWallets[1] },
    { follower_address: testWallets[0], following_address: testWallets[2] },
    { follower_address: testWallets[0], following_address: testWallets[3] },

    // Bob follows Alice, Charlie
    { follower_address: testWallets[1], following_address: testWallets[0] },
    { follower_address: testWallets[1], following_address: testWallets[2] },

    // Charlie follows Alice
    { follower_address: testWallets[2], following_address: testWallets[0] },

    // Diana follows Alice, Bob
    { follower_address: testWallets[3], following_address: testWallets[0] },
    { follower_address: testWallets[3], following_address: testWallets[1] },

    // Eve follows everyone
    { follower_address: testWallets[4], following_address: testWallets[0] },
    { follower_address: testWallets[4], following_address: testWallets[1] },
    { follower_address: testWallets[4], following_address: testWallets[2] },
    { follower_address: testWallets[4], following_address: testWallets[3] },
  ]

  for (const follow of follows) {
    const { error } = await supabase.from('follows').insert(follow)

    if (error && error.code !== '23505') {
      console.error(`Failed to create follow:`, error)
    } else {
      console.log(`✅ ${follow.follower_address} follows ${follow.following_address}`)
    }
  }
}

async function seedEndorsements() {
  console.log('\n⭐ Seeding endorsements...')

  const endorsements = [
    // Alice endorsed by Bob and Diana
    {
      endorser_address: testWallets[1],
      endorsed_address: testWallets[0],
      skill: 'Solidity',
      message: 'Alice writes excellent smart contracts!',
    },
    {
      endorser_address: testWallets[3],
      endorsed_address: testWallets[0],
      skill: 'React',
      message: 'Great frontend work',
    },
    {
      endorser_address: testWallets[2],
      endorsed_address: testWallets[0],
      skill: 'Solidity',
      message: 'Very reliable contributor',
    },

    // Bob endorsed by Alice
    {
      endorser_address: testWallets[0],
      endorsed_address: testWallets[1],
      skill: 'UI/UX',
      message: 'Beautiful designs!',
    },
  ]

  for (const endorsement of endorsements) {
    const { error } = await supabase.from('endorsements').insert(endorsement)

    if (error && error.code !== '23505') {
      console.error(`Failed to create endorsement:`, error)
    } else {
      console.log(`✅ ${endorsement.endorser_address} endorsed ${endorsement.endorsed_address}`)
    }
  }
}

async function main() {
  console.log('🌱 Starting Gamification Data Seeding')
  console.log('===================================')

  await seedProfiles()
  await seedProfileStats()
  await seedBadges()
  await seedFollows()
  await seedEndorsements()

  console.log('\n✅ Gamification data seeding completed!')
  console.log('\nTest Wallets:')
  testWallets.forEach((wallet, index) => {
    console.log(`  ${index + 1}. ${wallet}`)
  })
}

main().catch((error) => {
  console.error('\n❌ Seeding failed:', error)
  process.exit(1)
})

