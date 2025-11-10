/**
 * Admin Proposals List Page
 * View and manage all proposals
 * 
 * PHASE 4: Admin panel for proposal review
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin } from '@/lib/auth'
import { Layout } from '@/components/Layout'
import { UserProfileLink } from '@/components/profile/UserProfileLink'
import type { Proposal } from '@/types/proposal'

export default function AdminProposalsPage() {
  const router = useRouter()
  const { wallet } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check admin access
  const hasAdminAccess = wallet && isAdmin(wallet)
  
  useEffect(() => {
    if (wallet && hasAdminAccess) {
      fetchProposals()
    } else if (!hasAdminAccess) {
      setLoading(false)
    }
  }, [wallet, hasAdminAccess])
  
  const fetchProposals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/proposals/admin')
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch proposals')
      }
      
      const data = await response.json()
      setProposals(data.proposals || [])
    } catch (err: any) {
      console.error('Failed to fetch proposals:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Proposals...</p>
          </div>
        </div>
      </Layout>
    )
  }
  
  // Access denied
  if (!hasAdminAccess) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Zugriff verweigert</h1>
            <p className="text-gray-600 mb-6">Admin-Zugriff erforderlich</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zur Startseite
            </button>
          </div>
        </div>
      </Layout>
    )
  }
  
  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Fehler</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProposals}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin: Proposal Review</h1>
          <p className="text-gray-600">
            Verwalte und bewerte eingehende Proposals
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Gesamt"
            value={proposals.length}
            color="blue"
          />
          <StatCard
            label="Pending Review"
            value={proposals.filter(p => p.status === 'pending_review').length}
            color="yellow"
          />
          <StatCard
            label="Counter-Offer"
            value={proposals.filter(p => p.status === 'counter_offer_pending').length}
            color="purple"
          />
          <StatCard
            label="Akzeptiert"
            value={proposals.filter(p => p.status === 'accepted').length}
            color="green"
          />
        </div>
        
        {/* Proposals List */}
        {proposals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">Noch keine Proposals vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map(proposal => (
              <Link
                key={proposal.id}
                href={`/admin/proposals/${proposal.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Von:</span>
                      <UserProfileLink
                        walletAddress={proposal.creator_wallet_address}
                        displayName={proposal.creator?.display_name}
                        avatarUrl={proposal.creator?.avatar_url}
                        trustScore={proposal.creator?.trust_score}
                        showTrustScore={true}
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Erstellt: {new Date(proposal.created_at).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <StatusBadge status={proposal.status} />
                    <p className="text-lg font-bold mt-2 text-blue-600">
                      {proposal.requested_cstake_amount.toLocaleString()} $CSTAKE
                    </p>
                    {proposal.foundation_offer_cstake_amount && (
                      <p className="text-sm text-gray-600 mt-1">
                        Angebot: {proposal.foundation_offer_cstake_amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }: { status: string }) {
  const config = {
    pending_review: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending Review'
    },
    counter_offer_pending: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      label: 'Counter-Offer'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Genehmigt'
    },
    accepted: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Akzeptiert'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Abgelehnt'
    },
  }
  
  const style = config[status as keyof typeof config] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

/**
 * Stat Card Component
 */
function StatCard({ 
  label, 
  value, 
  color 
}: { 
  label: string
  value: number
  color: 'blue' | 'yellow' | 'purple' | 'green'
}) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    purple: 'border-purple-200 bg-purple-50 text-purple-900',
    green: 'border-green-200 bg-green-50 text-green-900',
  }
  
  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm opacity-75 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

