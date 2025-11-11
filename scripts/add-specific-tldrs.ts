/**
 * Script to add specific TL;DRs to all blog articles
 * Each article gets custom-crafted key insights based on its content
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Article-specific TL;DRs with real insights
 */
const ARTICLE_TLDRS: { [slug: string]: string } = {
  'i-turned-down-2m-term-sheet-sick': `::: tldr
- VC term sheets contain trap clauses: 2x liquidation preferences, board control, founder reverse vesting
- $2M investment can mean founders own <15% after dilution and get $0 in many exit scenarios
- The "standard deal" is actually terrible: You trade control, ownership, and freedom for capital
- Alternative path: CrowdStaking lets you pay contributors with liquid tokens instead of raising VC
- Real case study: 6 months post-rejection, at $47k MRR with 65% ownership and no board control
:::`,

  'the-500b-lie-venture-capital-inefficiency': `::: tldr
- $170B deployed annually by VCs, but 90% of startups fail - massive capital misallocation
- 70%+ of VC money goes to salaries because private equity is worthless until exit
- Circular inefficiency: Founders raise capital to pay talent who wanted ownership in the first place
- The VC model was built for hardware (capital-intensive) but software needs talent, not capital
- Token-based equity breaks the circle: Contributors get liquid ownership from day one
:::`,

  'confessions-series-b-founder-prisoner': `::: tldr
- Post-Series B, VCs control the board (3-2 or worse) and can override all founder decisions
- Aggressive growth targets often destroy culture, product quality, and best talent
- "Suggested" COO/CEO replacements are actually forced demotions disguised as advice
- After dilution and liquidation preferences, founders often make less than FAANG salaries
- The golden handcuffs: Can''t leave without forfeiting millions in unvested equity
:::`,

  'the-10-year-prison-illiquid-equity': `::: tldr
- Startup equity is worth $0 until exit, which may take 7-10 years or never happen
- Real example: $400k paper value can''t pay for a $3,800 car repair
- Liquidation preferences can wipe out all employee equity even in "successful" exits
- The median outcome: 90% of equity becomes worthless, you''d have been better off at FAANG
- Liquid tokens solve this: Sell what you need for cash, hold what you believe in as investment
:::`,

  'made-47k-working-on-startup-future-of-work': `::: tldr
- Real portfolio: 3 projects, $47k/month income from token sales, $270k in liquid holdings
- Work structure: 20h/week on DeFi, 5h/week advising, 15h/week on CrowdStaking platform
- Effective rate: $259/hour vs $102/hour at Google, 2.5x higher compensation
- Complete freedom: Work from anywhere, choose projects, sell tokens anytime for cash flow
- This isn''t freelancing - it''s being a co-founder of multiple companies with liquid ownership
:::`,

  'death-of-exit-real-time-markets': `::: tldr
- Exits exist only because traditional equity is illiquid - they''re a workaround, not a goal
- Real case: $350M exit → Founder gets $3.1M after 7 years ($443k/year, less than FAANG)
- With continuous liquidity, you can realize value gradually while maintaining control indefinitely
- Traditional model: Single all-or-nothing exit. New model: Ongoing market valuation and liquidity
- The future: Founders who build for decades because they''re compensated continuously
:::`,

  'ai-mediator-protocol-fairness': `::: tldr
- Fair valuation has been humanity''s oldest unsolved problem (since King Solomon)
- AI can be a perfect neutral mediator: No ego, no hidden bias, no incentive to favor either party
- CrowdStaking''s AI proposes fair ranges but doesn''t decide - humans have final say (double handshake)
- Transparency: All reasoning visible to both parties, leveling negotiation playing field
- This solves the Oracle Problem: How to value contributions fairly without power dynamics
:::`,

  'satoshi-principle-building-without-ceo': `::: tldr
- Bitcoin''s greatest innovation wasn''t technical—it was organizational: $1T entity with no CEO
- The Satoshi Principle: You don''t need hierarchy to coordinate humans, just the right protocol
- CrowdStaking applies this to founding: Permissionless, decentralized, protocol-driven building
- Both Bitcoin and CrowdStaking make honesty profitable through game theory, not enforcement
- The future: Protocols that outlive their creators and can''t be captured or shut down
:::`,

  'open-source-dying-os-3-0-solution': `::: tldr
- Open source creates $8.8T in value but maintainers capture near-zero compensation
- Log4j (used by 93% of cloud infrastructure) was maintained by 3 unpaid volunteers
- OS 1.0 (altruism) → burnout. OS 2.0 (corporate sponsorship) → dependency. OS 3.0 → ownership.
- Token-based OS: Contributors earn liquid equity, can sell for cash or hold as investment
- Real examples: Uniswap, Curve maintainers became millionaires through token ownership
:::`,

  'interviewed-50-developers-quit-200k-jobs': `::: tldr
- 50 ex-FAANG engineers earning $200-400k/year quit for token-based portfolio work
- Four patterns: Soul-crushing boredom, lack of ownership, speed mismatch, no flexibility
- Real economics: $320k at Google → $480-720k/year as portfolio contributor (1.5-2x more)
- Not optimizing for money alone: Seeking meaning, agency, co-founders (not bosses), freedom
- In 5 years: Track A (corporate employees) vs Track B (portfolio co-founders) - best talent chooses B
:::`,

  'end-of-resume-proof-of-work': `::: tldr
- Traditional resume model is dying: Permission-based careers being replaced by proof-of-work
- Resumes show credentials; proposals show actual capabilities and work
- New model: See project → Propose contribution → Build → Get paid in ownership → Repeat
- Portfolio careers: Work on 3-8 projects simultaneously, own equity in each
- The interview is dead: Your code is the interview, your shipping history is your resume
:::`,

  'why-i-have-47-cofounders': `::: tldr
- Portfolio founding: 7 projects with 47 total co-founders, owning 5-15% of each
- Math: Diversification wins - even if 5/7 fail, 1 success outperforms single startup
- Work allocation: 45h/week total, distributed across projects by passion and need
- Risk mitigation: Not "all eggs in one basket" - some will fail, some will succeed
- Learning compounds: See 7 approaches to building, improve 7x faster than single company
:::`,

  'the-50-billion-index-fund': `::: tldr
- CrowdStaking DAO automatically accumulates 1-2% of every project launched on platform
- Projection: 10,000 projects × 1-2% each = Most diversified startup portfolio in history
- Traditional VC: $85B, 200 companies, hundreds of employees. CrowdStaking: $50B+, 10,000 projects, zero employees
- $CSTAKE token = Ownership of auto-diversifying index fund backed by real project equity
- VCs must pick winners. CrowdStaking gets exposure to ALL projects, winners pay for losers
:::`,

  'swiss-foundation-worlds-richest': `::: tldr
- Thought experiment: By 2040, a Swiss foundation with no CEO could hold $50B+ in startup equity
- The compounding machine: 50,000 projects × 5% success rate × 1-2% DAO fee = Massive treasury
- Most distributed wealth in history: Owned by thousands of $CSTAKE token holders globally
- Bitcoin parallel: In 2010, "$1T monetary system with no CEO" sounded insane. Now it exists.
- The philosophical question: Is this even "ownership" or just value accessible to participants?
:::`,

  'the-1-percent-fee-eating-vc': `::: tldr
- Traditional VC: Give 20-40% for $2M + board control. CrowdStaking: Give 1-2% for infrastructure
- What 1-2% gets you: Global talent network, DEX liquidity, legal compliance, smart contracts, AI mediation
- What 30% to VCs gets you: Money + "strategic advice" (pressure to grow) + their network
- Founder perspective: "I''d rather give 2% to a protocol that serves me than 30% to VCs who control me"
- The 1-2% isn''t a tax - it''s the best infrastructure deal in startup history
:::`,

  'last-great-idea-of-internet': `::: tldr
- Each internet era solves a fundamental problem: Web (information), Social (connection), Bitcoin (money), CrowdStaking (coordination)
- Humans generate amazing ideas but terrible at coordinating around them - CrowdStaking fixes this
- Bitcoin freed money from central banks. CrowdStaking frees building from venture capital.
- Total Addressable Market: 500M+ creators globally vs Bitcoin''s 1B financial sovereignty seekers
- Pattern repeats: Skepticism → Curiosity → Adoption → Standard. We''re at "skepticism" stage.
:::`,

  'company-formed-72-hours': `::: tldr
- Real-time case study: Company formed in 72 hours across 3 continents with zero paperwork
- Day 1: Mission posted. Day 2: 8 proposals from Berlin, Singapore, Mexico City. Day 3: 3 accepted, work begins.
- Smart contracts replace incorporation: Coordination without legal entities or lawyers
- The realization: Incorporation is just a coordination mechanism - protocols coordinate better
- The future: Companies form in days, not months. Globally. Permissionlessly.
:::`,

  'protocol-that-killed-the-job': `::: tldr
- Corporations exist because transaction costs were lower inside firms than across markets (Coase)
- Smart contracts + tokens + protocols make market coordination 100x cheaper than corporate hierarchy
- CrowdStaking projects have no HR, no managers, no office, no politics - just protocols
- The accidental revolution: 10,000 people building better coordination, not protesting
- In 20 years: "I work for a company" will sound as weird as "I work for a feudal lord" today
:::`,

  'ai-mediator-protocol-fairness': `::: tldr
- Fair resource allocation has been unsolved for 3,000 years (King Solomon to modern courts)
- AI as mediator (not dictator): Proposes fair compensation, but humans make final decision
- Perfect neutrality: No skin in game, no hidden biases, transparent reasoning visible to all
- The double handshake: Both contributor and founder must agree - AI can''t force outcomes
- This solves the Oracle Problem: Fair valuation without power dynamics or information asymmetry
:::`,
}

async function main() {
  console.log('🎯 Adding specific TL;DRs to all articles...\n')
  
  let updated = 0
  let skipped = 0
  
  for (const [slug, tldr] of Object.entries(ARTICLE_TLDRS)) {
    try {
      console.log(`📝 Updating: ${slug}`)
      
      // Fetch current article
      const { data: article, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, content')
        .eq('slug', slug)
        .single()
      
      if (fetchError || !article) {
        console.log(`   ⚠️  Not found, skipping`)
        skipped++
        continue
      }
      
      // Check if article already has a custom TL;DR (not the generic one)
      if (article.content.includes('- Key insights and takeaways from this article')) {
        // Replace generic TL;DR with specific one
        const updatedContent = article.content.replace(
          /::: tldr\n- Key insights and takeaways from this article\n- Understanding the shift from traditional to decentralized models\n- How CrowdStaking enables new possibilities for founders and contributors\n:::/,
          tldr
        )
        
        // Update in database
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ 
            content: updatedContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', article.id)
        
        if (updateError) {
          console.log(`   ❌ Error: ${updateError.message}`)
          continue
        }
        
        console.log(`   ✅ Updated with specific TL;DR`)
        updated++
      } else if (article.content.includes('::: tldr')) {
        console.log(`   ℹ️  Already has custom TL;DR, skipping`)
        skipped++
      } else {
        // Article has no TL;DR at all, add it after main title
        const titleEnd = article.content.indexOf('\n\n## ')
        if (titleEnd > 0) {
          const beforeFirstSection = article.content.substring(0, titleEnd)
          const afterFirstSection = article.content.substring(titleEnd)
          const updatedContent = beforeFirstSection + '\n\n' + tldr + '\n' + afterFirstSection
          
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ 
              content: updatedContent,
              updated_at: new Date().toISOString()
            })
            .eq('id', article.id)
          
          if (updateError) {
            console.log(`   ❌ Error: ${updateError.message}`)
            continue
          }
          
          console.log(`   ✅ Added TL;DR`)
          updated++
        }
      }
      
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Updated: ${updated} articles`)
  console.log(`   ⏭️  Skipped: ${skipped} articles`)
  console.log(`\n🎉 Done!`)
}

main().catch(console.error)

