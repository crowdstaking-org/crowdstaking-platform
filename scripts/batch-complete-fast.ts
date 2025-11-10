/**
 * Fast Batch Completion Script
 * Quickly completes remaining projects with missions and proposals
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MISSIONS = [
  { title: 'Brand Identity Design', description: 'Create comprehensive brand identity' },
  { title: 'Landing Page Development', description: 'Develop high-converting landing page' },
  { title: 'Technical Documentation', description: 'Write comprehensive technical docs' },
  { title: 'Security Audit', description: 'Conduct thorough security audit' },
  { title: 'Performance Optimization', description: 'Optimize application performance' },
  { title: 'Social Media Campaign', description: 'Execute social media strategy' },
  { title: 'Mobile App Development', description: 'Build mobile application' },
  { title: 'API Integration', description: 'Integrate with external APIs' },
]

function genWallet() {
  return '0x' + Array.from({length: 40}, () => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('')
}

async function run() {
  console.log('🚀 Fast Batch Completion\n')
  
  // Get all projects and missions
  const { data: allProjects } = await supabase.from('projects').select('id, name').order('created_at')
  const { data: projectsWithMissions } = await supabase.from('missions').select('project_id')
  const withMissionsSet = new Set(projectsWithMissions?.map((m: any) => m.project_id))
  const projectsToProcess = allProjects?.filter((p: any) => !withMissionsSet.has(p.id))
  
  console.log(`Found ${projectsToProcess?.length || 0} projects\n`)
  
  for (const project of projectsToProcess || []) {
    console.log(`📦 ${project.name}`)
    
    // Batch create 3 missions
    const missionsData = []
    for (let i = 0; i < 3; i++) {
      const template = MISSIONS[Math.floor(Math.random() * MISSIONS.length)]
      missionsData.push({
        project_id: project.id,
        title: template.title,
        description: template.description,
        status: Math.random() < 0.7 ? 'active' : 'completed'
      })
    }
    
    const { data: missions } = await supabase
      .from('missions')
      .insert(missionsData)
      .select()
    
    // Batch create proposals
    const allProfiles = []
    const allProposals = []
    
    for (const mission of missions || []) {
      for (let p = 0; p < 2; p++) {
        const wallet = genWallet()
        const amount = Math.floor(Math.random() * 4950000) + 50000
        const statusRand = Math.random()
        const status = statusRand < 0.4 ? 'pending_review' : 
                      statusRand < 0.6 ? 'approved' : 
                      statusRand < 0.75 ? 'completed' : 'accepted'
        
        allProfiles.push({
          wallet_address: wallet.toLowerCase(),
          display_name: `Contributor ${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          bio: 'Experienced professional contributing to innovative projects'
        })
        
        allProposals.push({
          project_id: project.id,
          mission_id: mission.id,
          creator_wallet_address: wallet.toLowerCase(),
          title: `${mission.title} - Professional Proposal`,
          description: 'Experienced contributor ready to deliver high-quality work with proven track record.',
          deliverable: 'Complete deliverable package with documentation',
          requested_cstake_amount: amount,
          status: status,
          foundation_offer_cstake_amount: ['approved', 'accepted', 'completed'].includes(status) ? Math.floor(amount * 0.85) : null,
          foundation_notes: ['approved', 'accepted'].includes(status) ? 'Approved with adjustment' : null,
          contract_agreement_tx: ['accepted', 'completed'].includes(status) ? genWallet().replace('0x', '0x') + genWallet().replace('0x', '') : null,
        })
      }
    }
    
    // Batch insert profiles (ignore duplicates)
    await supabase.from('profiles').insert(allProfiles).then(() => {}, () => {})
    
    // Batch insert proposals
    await supabase.from('proposals').insert(allProposals)
    
    console.log(`   ✅ 3 missions, 6 proposals\n`)
  }
  
  // Final stats
  const projectsCount = await supabase.from('projects').select('*', { count: 'exact', head: true })
  const missionsCount = await supabase.from('missions').select('*', { count: 'exact', head: true })
  const proposalsCount = await supabase.from('proposals').select('*', { count: 'exact', head: true })
  const profilesCount = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const stats = [{
    projects: projectsCount.count,
    missions: missionsCount.count,
    proposals: proposalsCount.count,
    profiles: profilesCount.count
  }]
  
  console.log('✅ Complete!\n')
  console.log('📊 Final Totals:')
  console.log(`   Projects: ${stats[0].projects || '?'}`)
  console.log(`   Missions: ${stats[0].missions || '?'}`)
  console.log(`   Proposals: ${stats[0].proposals || '?'}`)
  console.log(`   Profiles: ${stats[0].profiles || '?'}`)
}

run().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

