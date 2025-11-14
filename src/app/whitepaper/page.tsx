import { Layout } from '@/components/Layout'
import { WhitepaperHero } from '@/components/whitepaper/WhitepaperHero'
import { WhitepaperSection } from '@/components/whitepaper/WhitepaperSection'
import { WhitepaperCTA } from '@/components/whitepaper/WhitepaperCTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Partnership Protocol | CrowdStaking',
  description:
    'CrowdStaking v4.0: The proof-of-work protocol that converts creative initiative into earned, non-tradable dividend rights via Soulbound Tokens.',
  keywords: ['digital partnership', 'proof-of-work protocol', 'soulbound tokens', 'earned dividend', 'legal tech'],
  openGraph: {
    title: 'Digital Partnership Protocol | CrowdStaking',
    description: 'The definitive thesis for the CrowdStaking partnership protocol.',
    url: 'https://crowdstaking.com/whitepaper',
  },
}

/**
 * Whitepaper page - Digital partnership protocol thesis (v4.0)
 */
export default function WhitepaperPage() {
  return (
    <Layout>
      <main className="bg-white dark:bg-gray-900">
        <WhitepaperHero />

        {/* Section 1: The Inevitable Future */}
        <WhitepaperSection
          number="1"
          title="The Inevitable Future: The Economy of Pure Ideas"
          content={
            <>
              <p className="mb-4">
                We stand at a fundamental turning point. Artificial intelligence
                will surpass us in almost every "mechanical" activity - from
                writing code to creating images. The last, irreplaceable bastion
                of humanity is the idea itself: the pure, unpredictable, creative
                execution of a vision.
              </p>
              <p className="mb-4">
                But what is today's biggest bottleneck for a brilliant idea?
                Capital.
              </p>
              <p className="mb-4">
                The traditional venture model is a relic. It forces visionaries to
                chase capital instead of bundling talent. It treats talent as
                "contractors" who complete tasks, not as "creators" who
                proactively expand a vision.
              </p>
              <p>
                CrowdStaking is the answer to this new reality. It's the
                infrastructure for a world where ideas matter more than money.
              </p>
            </>
          }
        />

        {/* Section 2: What is CrowdStaking */}
        <WhitepaperSection
          number="2"
          title="What is CrowdStaking? The Digital Partnership Protocol"
          content={
            <>
              <p className="mb-4">
                CrowdStaking is a digital partnership protocol. It prioritizes
                creative initiative over capital and rewrites how ownership is
                allocated.
              </p>
              <p className="mb-4">
                It is a global platform where founders publish missions rather
                than task lists, and contributors proactively pitch how to move
                those missions forward.
              </p>
              <p>
                Ownership is granted as Soulbound Tokens (SBTs) - non-tradable
                partner certificates. Shares can never be bought. They must be
                earned through work or an approved capital partnership.
              </p>
            </>
          }
        />

        {/* Section 3: The Mechanics */}
        <WhitepaperSection
          number="3"
          title='The Mechanics: The "AI Mediator" & The "Double Handshake"'
          content={
            <>
              <p className="mb-4">
                This is the core innovation. It solves the "Oracle Problem" (How
                do you fairly value work?) in a brilliant way. The AI isn't the
                dictator, it's the neutral mediator.
              </p>
              <p className="mb-4 font-semibold">
                Here's how the "Permissionless Creativity" process works:
              </p>
              <ol className="space-y-4 mb-4 list-decimal ml-6">
                <li>
                  <span className="font-semibold">The Mission (Founder):</span> A
                  founder (Owner) posts their idea and "mission" on CrowdStaking.
                </li>
                <li>
                  <span className="font-semibold">
                    The Proposal (Contributor):
                  </span>{' '}
                  A contributor (developer, marketer) has their own idea to
                  advance the project. They submit this proposal.
                </li>
                <li>
                  <span className="font-semibold">AI Mediation (Protocol):</span>{' '}
                  The AI, fed with the founder's mission, analyzes the proposal.
                  It provides a transparent, neutral price estimate: "Based on
                  complexity and potential 'impact' on the mission, we suggest a
                  share of 0.5% of the project."
                </li>
                <li>
                  <span className="font-semibold">
                    The "Double Handshake" (The "Magic Moment"):
                  </span>{' '}
                  Now both human parties must agree:
                  <ul className="list-disc ml-8 mt-2 space-y-2">
                    <li>
                      The Contributor: Sees the proposal and decides: "Yes, for
                      0.5% I'm willing to do this work."
                    </li>
                    <li>
                      The Owners: (Initially just the founder, later the DAO)
                      vote: "Yes, we want this contribution for 0.5%."
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">The SBT Mint (Result):</span>{' '}
                  The contributor completes the work. Owners confirm it. The
                  protocol mints a Soulbound Token that records the 0.5% partner
                  share.
                </li>
              </ol>
              <p className="font-semibold">
                Result: The contributor is a co-owner. They didn't apply, they
                co-founded.
              </p>
            </>
          }
        />

        {/* Section 4: Capital Partners */}
        <WhitepaperSection
          number="4"
          title="The Capital Partner Model: The Only Allowed Exception"
          content={
            <>
              <p className="mb-4">
                Projects still need capital for LLMs, servers, and hardware. Our
                protocol forbids buying shares, but it allows capital partners to
                join as co-builders through governance.
              </p>
              <ol className="list-decimal ml-6 space-y-4 mb-4">
                <li>
                  <span className="font-semibold">Capital Proposal:</span> "I
                  contribute 20,000 USDC for year-one hosting in exchange for a
                  3% partner share."
                </li>
                <li>
                  <span className="font-semibold">Partner Vote:</span> Existing
                  SBT holders decide whether those 20,000 USDC are worth 3% of
                  future dividends.
                </li>
                <li>
                  <span className="font-semibold">Deposit & Mint:</span> Upon
                  approval, the capital flows into the capital vault and the
                  protocol mints a 3% SBT. The investor becomes an active partner
                  with full governance rights.
                </li>
              </ol>
              <p>
                This keeps us outside the SEC Howey definition of a passive
                security while still enabling projects to fund critical
                infrastructure.
              </p>
            </>
          }
        />

        {/* Section 5: Earned Dividend */}
        <WhitepaperSection
          number="5"
          title='The Game Changer: The Earned Dividend Model'
          content={
            <>
              <p className="mb-4">
                We replace speculation with real-time cash flow. Partners earn
                dividends precisely when the product earns revenue.
              </p>
              <ul className="list-disc ml-8 mb-4 space-y-2">
                <li>
                  <span className="font-semibold">Revenue Capture:</span> All
                  on-chain earnings flow into a transparent dividend vault.
                </li>
                <li>
                  <span className="font-semibold">Partner Governance:</span> SBT
                  holders vote to reinvest or distribute funds.
                </li>
                <li>
                  <span className="font-semibold">Claim Function:</span> When a
                  payout is approved, each partner calls `claim()`. The contract
                  checks their share (e.g., 0.5%) and transfers the exact USDC
                  amount.
                </li>
              </ul>
              <p>
                Contributors don't wait for a distant exit. They receive earned
                dividends for the work (or capital) they put in.
              </p>
            </>
          }
        />

        {/* Section 6: Platform Flywheel */}
        <WhitepaperSection
          number="6"
          title="The Platform Flywheel: How CrowdStaking Funds Itself"
          content={
            <>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 dark:border-yellow-400 p-4 mb-6">
                <p className="font-semibold text-gray-900 dark:text-white">
                  IMPORTANT DISTINCTION: There are no tradable platform tokens.
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    Project SBTs: Earned per project mission and bound to that
                    project's dividend vault.
                  </li>
                  <li>
                    $CROWDSTAKING SBTs: Earned by contributors who build the
                    platform itself and unlock the main vault.
                  </li>
                </ul>
              </div>

              <p className="mb-4 font-semibold">The Cycle:</p>
              <ol className="space-y-4 list-decimal ml-6">
                <li>
                  <span className="font-semibold">Ignition:</span> Pioneers build
                  CrowdStaking and earn $CROWDSTAKING SBTs.
                </li>
                <li>
                  <span className="font-semibold">Launch:</span> Founders post
                  missions and onboard partners.
                </li>
                <li>
                  <span className="font-semibold">Partner Fee:</span> Each
                  project mints 1-2% of its SBT supply to the CrowdStaking
                  foundation; cash from those shares flows into the main vault.
                </li>
                <li>
                  <span className="font-semibold">Dividends:</span> Platform
                  contributors claim their share of the main vault through their
                  SBTs.
                </li>
                <li>
                  <span className="font-semibold">Reinforcement:</span> The more
                  projects succeed, the more attractive it is to work on the
                  platform - and vice versa.
                </li>
              </ol>
              <p className="mt-4 font-semibold text-lg">
                The system becomes self-financing and self-reinforcing.
              </p>
            </>
          }
        />

        {/* Section 7: Regulatory Moat */}
        <WhitepaperSection
          number="7"
          title="The Moat: Regulatory Clarity as Product"
          content={
            <>
              <p className="mb-4">
                Our biggest moat is legal clarity. CrowdStaking is engineered to
                stay outside the SEC Howey Test and MiCA definitions of regulated
                financial instruments.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Proof-of-Work Admissions
                  </h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>No "investment of money" path - work earns ownership.</li>
                    <li>
                      Capital partners become active governors, not passive
                      investors.
                    </li>
                    <li>
                      Soulbound Tokens eliminate secondary-market obligations.
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    The Honest Foundation
                  </h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Independent Swiss/Liechtenstein firewall.</li>
                    <li>
                      Reviews DAO decisions solely for legality and purpose
                      alignment.
                    </li>
                    <li>
                      Provides the legal wrapper mirroring on-chain splits in the
                      real world.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="font-semibold">
                CrowdStaking is SaaS for partnership governance, financing, and
                dividend accounting - not an exchange.
              </p>
            </>
          }
        />

        {/* Section 8: Two-Track Launch */}
        <WhitepaperSection
          number="8"
          title="The Two-Track Launch Strategy"
          content={
            <>
              <p className="mb-6">
                We launch on two parallel tracks to win both ideologues and
                pragmatists.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-700">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Track 1: The Movement (Testnet)
                  </h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Public build-in-public testnet run.</li>
                    <li>Dogfood the protocol by building CrowdStaking on CrowdStaking.</li>
                    <li>
                      Promise: All $CROWDSTAKING testnet SBTs convert 1:1 to
                      mainnet SBTs.
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border-2 border-orange-200 dark:border-orange-700">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Track 2: The Product (Mainnet)
                  </h4>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Use the capital-partner model to raise seed funding.</li>
                    <li>
                      Establish the Honest Foundation and build the offline
                      banking oracle with honesty bonds.
                    </li>
                    <li>
                      Deliver a compliant product for pragmatic teams like "Sarah".
                    </li>
                  </ul>
                </div>
              </div>

              <p className="font-semibold">
                The protocol is the marketing. Traction from both tracks becomes
                fundraising leverage.
              </p>
            </>
          }
        />

        {/* Section 9: The Conclusion */}
        <WhitepaperSection
          number="9"
          title="The Conclusion: The Digital Partnership Protocol"
          content={
            <>
              <p className="mb-4">
                Authenticity remains the strongest growth loop. CrowdStaking does
                not ask for trust in a pitch deck - it proves the thesis live by
                operating its own partnership protocol.
              </p>
              <p className="text-xl font-bold">
                CrowdStaking is the digital partnership protocol that turns ideas
                into earned dividend rights.
              </p>
            </>
          }
        />

        <WhitepaperCTA />
      </main>
    </Layout>
  )
}

