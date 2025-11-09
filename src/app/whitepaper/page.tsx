import { Layout } from '@/components/Layout'
import { WhitepaperHero } from '@/components/whitepaper/WhitepaperHero'
import { WhitepaperSection } from '@/components/whitepaper/WhitepaperSection'
import { OpenSourceComparison } from '@/components/whitepaper/OpenSourceComparison'
import { WhitepaperCTA } from '@/components/whitepaper/WhitepaperCTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investment Thesis v3.0 | CrowdStaking',
  description: 'The complete CrowdStaking investment thesis: From the economy of ideas to the decentralized venture studio that transforms creative initiative into liquid assets.',
  keywords: ['investment thesis', 'decentralized venture', 'tokenomics', 'legal tech', 'AI mediator', 'flywheel effect'],
  openGraph: {
    title: 'Investment Thesis v3.0 | CrowdStaking',
    description: 'The complete CrowdStaking investment thesis.',
    url: 'https://crowdstaking.com/whitepaper',
  },
}

/**
 * Whitepaper page - Complete investment thesis v3.0
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
                will surpass us in almost every "mechanical" activity – from
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
          title="What is CrowdStaking? The Machine That Builds Ideas"
          content={
            <>
              <p className="mb-4">
                CrowdStaking is a decentralized venture studio that turns the
                traditional model on its head.
              </p>
              <p className="mb-4">
                It's a global platform where creative initiative – not just
                mechanical work – is directly converted into real, tradable
                ownership (tokens).
              </p>
              <p>
                We create a marketplace where founders don't post "tasks" but a
                "mission". They invite the world to proactively propose how this
                mission can best be achieved. It's a place where "co-founders"
                meet, not "freelancers".
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
                  <span className="font-semibold">
                    The Transfer (The Result):
                  </span>{' '}
                  The contributor completes the work. The owners confirm "work
                  completed". The protocol transfers the 0.5% (the 10,000 project
                  tokens) to the contributor.
                </li>
              </ol>
              <p className="font-semibold">
                Result: The contributor is a co-owner. They didn't apply, they
                co-founded.
              </p>
            </>
          }
        />

        {/* Section 4: The Game Changer */}
        <WhitepaperSection
          number="4"
          title='The "Game Changer": Liquidity from Day 1'
          content={
            <>
              <p className="mb-4">
                The "flywheel" is driven by the strongest incentive of all:
                immediate liquidity.
              </p>
              <p className="mb-4">
                <span className="font-semibold">
                  The Problem ("The 10-Year Prison"):
                </span>{' '}
                Traditional "sweat equity" is an illiquid 10-year promise trapped
                in a filing cabinet.
              </p>
              <p className="mb-4">
                <span className="font-semibold">
                  The CrowdStaking Solution ("The Real-Time Market"):
                </span>{' '}
                Once a founder sets up a liquidity pool on a decentralized
                exchange (DEX), there's a free market price.
              </p>
              <p className="mb-4">
                A contributor who has earned tokens for their work now has a
                choice:
              </p>
              <ul className="list-disc ml-8 mb-4 space-y-2">
                <li>
                  Do they believe in the project? They hold (HODL) their tokens as
                  a long-term investment.
                </li>
                <li>
                  Do they need to pay bills? They sell some of their tokens
                  immediately on the market.
                </li>
              </ul>
              <p>
                They don't have to wait for the "exit". The 10-year fund cycle is
                replaced by a real-time market.
              </p>
            </>
          }
        />

        {/* Section 5: The Flywheel */}
        <WhitepaperSection
          number="5"
          title='The Machine: The "Flywheel" of Decentralized Growth'
          content={
            <>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 dark:border-yellow-400 p-4 mb-6">
                <p className="font-semibold text-gray-900 dark:text-white">
                  IMPORTANT DISTINCTION: There are two token types:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    $CSTAKE: The platform token. You only earn it for
                    contributions to the CrowdStaking platform itself.
                  </li>
                  <li>
                    $PROJECT-A: A project token. You only earn it for
                    contributions to "Project A".
                  </li>
                </ul>
              </div>

              <p className="mb-4 font-semibold">The Cycle:</p>
              <ol className="space-y-4 list-decimal ml-6">
                <li>
                  <span className="font-semibold">
                    Ignition (Work on the Platform):
                  </span>{' '}
                  Pioneers build the platform itself and earn the first $CSTAKE
                  tokens.
                </li>
                <li>
                  <span className="font-semibold">
                    Traction (The Platform Becomes Useful):
                  </span>{' '}
                  The platform becomes robust.
                </li>
                <li>
                  <span className="font-semibold">
                    Network Effect 1 (Founders Come):
                  </span>{' '}
                  A founder launches their "Project A" on CrowdStaking.
                </li>
                <li>
                  <span className="font-semibold">
                    Network Effect 2 (Talent Follows):
                  </span>{' '}
                  The developer community can now choose: work on the platform
                  (for $CSTAKE) or on "Project A" (for $PROJECT-A tokens).
                </li>
                <li>
                  <span className="font-semibold">
                    The "Index Effect" (The Business Model):
                  </span>{' '}
                  Here's the brilliant core: When "Project A" launched, the
                  protocol automatically transferred 1-2% of all its $PROJECT-A
                  tokens to the CrowdStaking DAO treasury ("treasure chest").
                </li>
                <li>
                  <span className="font-semibold">
                    Acceleration (Value Increase):
                  </span>{' '}
                  The DAO treasury now holds stakes in 1,000 different startups.
                  The $CSTAKE token, which controls this treasury, is now backed
                  by a real, diversified portfolio. It becomes a "startup index
                  fund".
                </li>
                <li>
                  <span className="font-semibold">
                    Singularity (The "Black Hole"):
                  </span>{' '}
                  The value of $CSTAKE has risen massively. The rewards for
                  contributions to the core platform become so valuable that they
                  attract the best engineers. A better platform attracts... even
                  better founders. Which... makes the treasure chest even more
                  valuable.
                </li>
              </ol>
              <p className="mt-4 font-semibold text-lg">
                The system is now unstoppable.
              </p>
            </>
          }
        />

        {/* Section 6: The Start */}
        <WhitepaperSection
          number="6"
          title="The Start: The First 365 Days (The Proof)"
          content={
            <>
              <p className="mb-4">
                How do you start such a movement? By applying the "Satoshi
                Principle": The code and the idea are the star, not the founders.
              </p>
              <p className="mb-4">
                The go-to-market strategy is this "dogfooding" approach. The story
                – "CrowdStaking builds the platform for decentralized building by
                building it decentrally" – is the living proof of the thesis.
              </p>
              <ul className="list-disc ml-8 mb-4 space-y-2">
                <li>
                  <span className="font-semibold">It's authentic:</span>{' '}
                  CrowdStaking proves the thesis live.
                </li>
                <li>
                  <span className="font-semibold">It's a filter:</span> It
                  attracts exactly the pioneers – the "1000 True Fans".
                </li>
                <li>
                  <span className="font-semibold">It's a movement:</span> People
                  aren't joining a 'company'. They're joining a movement to
                  revolutionize the venture model.
                </li>
              </ul>
              <p className="mb-4">
                This is the Bitcoin parallel. Bitcoin had no marketing budget. The
                protocol itself was the marketing. The incentive (the token) was
                the acquisition budget.
              </p>
              <p className="font-semibold">
                The protocol is the marketing. The token ($CSTAKE) is the
                acquisition budget.
              </p>
            </>
          }
        />

        {/* Section 7: The Moat */}
        <WhitepaperSection
          number="7"
          title='The "Moat": Why Open Source 3.0 Wins'
          content={
            <>
              <OpenSourceComparison />
              <p className="mt-6 mb-4">
                This combination is unbeatable. The second "moat" is the
                community. Anyone can replicate the code. But no one can copy the
                thousands of decentralized owners who already have an economic
                self-interest in the success of the original.
              </p>
            </>
          }
        />

        {/* Section 8: Legal Fortress */}
        <WhitepaperSection
          number="8"
          title='The Legal Fortress: The "Legal-Tech" Bridge'
          content={
            <>
              <p className="mb-6">
                A visionary idea needs a legally unassailable structure.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Part 1: The "Honest Foundation" (Switzerland/Liechtenstein)
                  </h4>
                  <p className="mb-3">Our solution is the "Honest Foundation".</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      The Foundation Council is staffed professionally and
                      independently (e.g., by lawyers).
                    </li>
                    <li>It's not a slave to the DAO, but a legal firewall.</li>
                    <li>
                      It reviews DAO decisions exclusively for legality and
                      compliance with the foundation's purpose. It's a "benevolent
                      overseer" that protects the protocol.
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Part 2: The "Legal-Tech" Problem (Enforcing the 1-2%)
                  </h4>
                  <p className="mb-3">
                    How is the 1-2% "index share" from "Project A" enforced?
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Technically (The Hook):</span>{' '}
                    To use the platform, a founder must deploy their token through
                    our "Factory Smart Contract". This contract programs the 1-2%
                    allocation to the CrowdStaking DAO treasury from the start.
                  </p>
                  <p>
                    <span className="font-semibold">Legally (The Bridge):</span>{' '}
                    The CrowdStaking Foundation offers a
                    "Legal-Wrapper-as-a-Service". To use this service, Founder A
                    signs a legal contract that mirrors the on-chain split (the
                    1-2%) in the real world.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border-l-4 border-gray-600 dark:border-gray-400">
                <p className="font-semibold text-gray-900 dark:text-white">
                  The 1-2% isn't just a "protocol tax". It's the price for using
                  the entire technical and legal infrastructure. This is an
                  unbeatable offer.
                </p>
              </div>
            </>
          }
        />

        {/* Section 9: The Conclusion */}
        <WhitepaperSection
          number="9"
          title="The Conclusion: The Factory"
          content={
            <>
              <p className="mb-4">
                The hard-cap model (1 billion tokens) ensures that value is based
                on scarcity and – analogous to Bitcoin – exponentially rewards the
                risk of early adopters.
              </p>
              <p className="mb-4">
                Authenticity is the strongest "growth hack". CrowdStaking doesn't
                ask for trust in an idea. It proves the idea live in the market.
              </p>
              <p className="text-xl font-bold">
                CrowdStaking is the factory for the next generation of unicorns.
              </p>
            </>
          }
        />

        <WhitepaperCTA />
      </main>
    </Layout>
  )
}

