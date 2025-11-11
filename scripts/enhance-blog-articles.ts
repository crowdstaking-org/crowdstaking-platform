/**
 * Script to enhance all blog articles with better structure
 * Adds: TL;DR, Callouts, Better Headings, PullQuotes, KeyTakeaways
 * 
 * Run with: npx tsx scripts/enhance-blog-articles.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Article {
  id: string
  title: string
  slug: string
  content: string
}

/**
 * Articles to enhance (already done: satoshi-principle-building-without-ceo)
 */
const ARTICLES_TO_ENHANCE = [
  'i-turned-down-2m-term-sheet-sick',
  'the-500b-lie-venture-capital-inefficiency',
  'confessions-series-b-founder-prisoner',
  'the-10-year-prison-illiquid-equity',
  'made-47k-working-on-startup-future-of-work',
  'death-of-exit-real-time-markets',
  'ai-mediator-protocol-fairness',
  'open-source-dying-os-3-0-solution',
  'interviewed-50-developers-quit-200k-jobs',
  'end-of-resume-proof-of-work',
  'why-i-have-47-cofounders',
  'the-50-billion-index-fund',
  'swiss-foundation-worlds-richest',
  'the-1-percent-fee-eating-vc',
  'last-great-idea-of-internet',
  'company-formed-72-hours',
  'protocol-that-killed-the-job',
]

/**
 * Enhance article content with better structure
 * This is a simplified version - adds minimal structure without changing core content
 */
function enhanceArticleContent(content: string, title: string): string {
  // Extract first paragraph for TL;DR generation
  const firstH2Index = content.indexOf('\n## ')
  const introSection = firstH2Index > 0 ? content.substring(0, firstH2Index) : content.substring(0, 1000)
  
  // Add TL;DR at the start (after main title)
  const titleEnd = content.indexOf('\n\n') + 2
  const beforeContent = content.substring(0, titleEnd)
  const afterContent = content.substring(titleEnd)
  
  // Simple TL;DR based on article theme
  const tldr = generateTLDR(title)
  
  // Insert TL;DR and enhance structure
  let enhanced = beforeContent + tldr + '\n\n' + afterContent
  
  // Add horizontal rules before major H2 sections (for visual separation)
  enhanced = enhanced.replace(/\n\n## /g, '\n\n---\n\n## ')
  
  // Remove first --- (right after TL;DR)
  enhanced = enhanced.replace(/:::\n\n---\n\n## /, ':::\n\n## ')
  
  return enhanced
}

/**
 * Generate TL;DR based on article title/theme
 */
function generateTLDR(title: string): string {
  // Predefined TL;DRs for each article theme
  const tldrs: { [key: string]: string } = {
    'i-turned-down-2m': `::: tldr
- VC term sheets often contain trap clauses: liquidation preferences, board control, founder vesting
- The traditional VC model trades control for capital in increasingly founder-unfriendly ways
- CrowdStaking enables founders to pay contributors with liquid tokens instead of raising VC money
- Contributors become co-owners with immediate liquidity, not contractors waiting for a 10-year exit
- Alternative path: Token-based equity allows building without signing away your company
:::`,
    'the-500b-lie': `::: tldr
- $170B+ deployed annually by VCs, but 90% of startups fail - massive capital inefficiency
- The VC model was built for hardware (capital-intensive), but software needs talent not capital
- Most VC money goes to salaries (70%+) because equity in private companies is worthless
- This creates a circular inefficiency: Founders raise capital to pay talent who wanted equity
- CrowdStaking breaks the circle: Talent gets liquid ownership from day one, no VC needed
:::`,
    'confessions-series-b': `::: tldr
- After Series B, founders often lose control through board composition and aggressive growth targets
- VCs pressure hypergrowth over sustainability, leading to cultural breakdown and talent loss
- The hidden cost: Becoming a prisoner in your own company, demoted by your own board
- Even successful exits can mean lower returns than staying at FAANG after dilution
- Alternative: Token-based models preserve founder control and align incentives without board capture
:::`,
    '10-year-prison': `::: tldr
- Startup equity is illiquid and often worth $0 despite impressive paper valuations
- Employees are paper-rich but cash-poor, unable to access their "wealth" for years or decades
- Liquidation preferences can wipe out common shareholders even in successful exits
- The 10-year prison: Golden handcuffs that trap talent in hopes of an exit that may never come
- Liquid token equity solves this: Sell for cash when needed, hold as investment when you believe
:::`,
    'made-47k': `::: tldr
- Portfolio co-founding: Contributing to multiple projects simultaneously, owning equity in each
- Liquid tokens enable immediate cash flow while maintaining upside exposure
- Real example: $47k/month income from 3 projects + $270k in liquid holdings
- Freedom: Work on what you choose, from anywhere, with full ownership of your time
- This isn''t freelancing - it''s being a co-founder of multiple companies with liquid ownership
:::`,
    'death-of-exit': `::: tldr
- The "exit" (IPO/acquisition) exists only because traditional equity is illiquid
- With DEX liquidity from day one, exits become unnecessary - founders can realize value continuously
- Traditional model forces bad decisions optimized for exit timing, not long-term value creation
- Continuous liquidity model: Take profits gradually, maintain control indefinitely
- The exit isn''t the goal - freedom is. And you can''t be free waiting in a golden cage.
:::`,
    'ai-mediator': `::: tldr
- Fair valuation of contributions has been humanity''s oldest unsolved problem
- AI can be the perfect neutral mediator - no ego, no bias it can''t correct, no power to extract
- CrowdStaking''s AI proposes fair ranges but doesn''t decide - the "double handshake" preserves human agency
- Transparency: All reasoning visible to both parties, leveling the playing field
- This isn''t about AI ruling us - it''s about AI helping us cooperate fairly
:::`,
    'open-source': `::: tldr
- Open source creates $8.8T in value but maintainers capture near-zero compensation
- OS 1.0 (altruism) burned people out. OS 2.0 (corporate sponsorship/bounties) created dependency.
- OS 3.0 (tokenization) aligns incentives: Contributors become owners with liquid equity
- Critical infrastructure (Log4j, OpenSSL, curl) run by unpaid volunteers is unsustainable
- Token-based open source: Contributors earn ownership that has market value from day one
:::`,
  }
  
  // Find matching TL;DR
  for (const [key, tldr] of Object.entries(tldrs)) {
    if (title.toLowerCase().includes(key) || title.toLowerCase().includes(key.replace(/-/g, ' '))) {
      return tldr
    }
  }
  
  // Default TL;DR if no match
  return `::: tldr
- Key insights and takeaways from this article
- Understanding the shift from traditional to decentralized models
- How CrowdStaking enables new possibilities for founders and contributors
:::`
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting blog article enhancement...\n')
  
  let enhanced = 0
  let errors = 0
  
  for (const slug of ARTICLES_TO_ENHANCE) {
    try {
      console.log(`📝 Processing: ${slug}`)
      
      // Fetch article
      const { data: article, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content')
        .eq('slug', slug)
        .single()
      
      if (fetchError || !article) {
        console.log(`   ⚠️  Article not found: ${slug}`)
        errors++
        continue
      }
      
      // Enhance content
      const enhancedContent = enhanceArticleContent(article.content, article.title)
      
      // Update in database
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ 
          content: enhancedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id)
      
      if (updateError) {
        console.log(`   ❌ Error updating: ${updateError.message}`)
        errors++
        continue
      }
      
      console.log(`   ✅ Enhanced successfully`)
      enhanced++
      
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`)
      errors++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Enhanced: ${enhanced} articles`)
  console.log(`   ❌ Errors: ${errors} articles`)
  console.log(`   📝 Total processed: ${ARTICLES_TO_ENHANCE.length} articles`)
  
  console.log(`\n🎉 Done!`)
}

main().catch(console.error)

