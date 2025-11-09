'use client'

import React, { useState, useEffect } from 'react'
import type { Proposal } from '@/types/proposal'

/**
 * My Contributions Tab for Cofounder Dashboard
 * PHASE 4: Shows user's proposals with double handshake UI
 * Client Component - fetches real proposals from API
 */
export function MyContributionsTab() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState('all')

  useEffect(() => {
    fetchMyProposals()
  }, [])

  const fetchMyProposals = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/proposals/me')
      
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

  const handleResponse = async (proposalId: string, action: 'accept' | 'reject') => {
    const actionText = action === 'accept' ? 'akzeptieren' : 'ablehnen'
    
    if (!confirm(`Möchtest du dieses Angebot wirklich ${actionText}?`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/proposals/respond/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to respond')
      }
      
      const data = await response.json()
      
      // Refresh proposals
      await fetchMyProposals()
      alert(data.message || `Erfolgreich ${action === 'accept' ? 'akzeptiert' : 'abgelehnt'}!`)
    } catch (err: any) {
      console.error('Response failed:', err)
      alert(`Aktion fehlgeschlagen: ${err.message}`)
    }
  }

  const handleConfirmWork = async (proposalId: string) => {
    if (!confirm('Möchtest du bestätigen, dass die Arbeit abgeschlossen ist?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/contracts/confirm-work/${proposalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to confirm work')
      }
      
      const data = await response.json()
      
      // Refresh proposals
      await fetchMyProposals()
      alert(data.message || 'Arbeit als abgeschlossen markiert!')
    } catch (err: any) {
      console.error('Confirm work failed:', err)
      alert(`Aktion fehlgeschlagen: ${err.message}`)
    }
  }

  // Filter proposals by status
  const filteredProposals = proposals.filter(p => {
    if (activeSubTab === 'all') return true
    if (activeSubTab === 'pending') return p.status === 'pending_review'
    if (activeSubTab === 'action') return ['counter_offer_pending', 'approved', 'work_in_progress'].includes(p.status)
    if (activeSubTab === 'in_progress') return p.status === 'work_in_progress'
    if (activeSubTab === 'completed') return p.status === 'completed'
    if (activeSubTab === 'rejected') return p.status === 'rejected'
    return true
  })

  const subTabs = [
    { id: 'all', label: 'Alle', count: proposals.length },
    { id: 'pending', label: 'Pending Review', count: proposals.filter(p => p.status === 'pending_review').length },
    { id: 'action', label: 'Aktion erforderlich', count: proposals.filter(p => ['counter_offer_pending', 'approved', 'work_in_progress'].includes(p.status)).length },
    { id: 'in_progress', label: 'In Arbeit', count: proposals.filter(p => p.status === 'work_in_progress').length },
    { id: 'completed', label: 'Abgeschlossen', count: proposals.filter(p => p.status === 'completed').length },
    { id: 'rejected', label: 'Abgelehnt', count: proposals.filter(p => p.status === 'rejected').length },
  ]

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Lade deine Proposals...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Fehler</h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchMyProposals}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filteredProposals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Keine Proposals in dieser Kategorie.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map(proposal => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onResponse={handleResponse}
              onConfirmWork={handleConfirmWork}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Proposal Card Component with Response UI
 */
function ProposalCard({ 
  proposal, 
  onResponse,
  onConfirmWork
}: { 
  proposal: Proposal
  onResponse: (id: string, action: 'accept' | 'reject') => void
  onConfirmWork: (id: string) => void
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {proposal.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Erstellt: {new Date(proposal.created_at).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
          {proposal.description}
        </p>
      </div>

      <div className="flex justify-between items-center text-sm mb-4">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Deine Anfrage:</span>{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {proposal.requested_cstake_amount.toLocaleString()} $CSTAKE
          </span>
        </div>
      </div>

      {/* Counter-Offer Response UI */}
      {proposal.status === 'counter_offer_pending' && (
        <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
            🤝 Counter-Offer erhalten
          </p>
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Foundation Angebot:</span>{' '}
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {proposal.foundation_offer_cstake_amount?.toLocaleString()} $CSTAKE
              </span>
              {' '}
              <span className="text-gray-500">
                (Du hast {proposal.requested_cstake_amount.toLocaleString()} angefragt)
              </span>
            </p>
          </div>
          {proposal.foundation_notes && (
            <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded border border-purple-100 dark:border-purple-900">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{proposal.foundation_notes}"
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => onResponse(proposal.id, 'accept')}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              ✓ Akzeptieren
            </button>
            <button
              onClick={() => onResponse(proposal.id, 'reject')}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ✗ Ablehnen
            </button>
          </div>
        </div>
      )}

      {/* Approval Response UI */}
      {proposal.status === 'approved' && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-semibold text-green-900 dark:text-green-300 mb-2">
            ✅ Proposal genehmigt!
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Die Foundation hat deine Anfrage für{' '}
            <span className="font-bold">{proposal.requested_cstake_amount.toLocaleString()} $CSTAKE</span>{' '}
            genehmigt.
          </p>
          {proposal.foundation_notes && (
            <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded border border-green-100 dark:border-green-900">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{proposal.foundation_notes}"
              </p>
            </div>
          )}
          <button
            onClick={() => onResponse(proposal.id, 'accept')}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ✓ Akzeptieren & Arbeit beginnen
          </button>
        </div>
      )}

      {/* Rejected state */}
      {proposal.status === 'rejected' && proposal.foundation_notes && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="font-semibold text-red-900 dark:text-red-300 mb-2">
            Ablehnungsgrund:
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {proposal.foundation_notes}
          </p>
        </div>
      )}

      {/* Accepted state */}
      {proposal.status === 'accepted' && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold text-blue-900 dark:text-blue-300">
            🎉 Double Handshake komplett! Arbeit kann beginnen.
          </p>
        </div>
      )}

      {/* Work in Progress - Not Confirmed Yet */}
      {proposal.status === 'work_in_progress' && !proposal.pioneer_confirmed_at && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
            🚧 Arbeit läuft
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Die Vereinbarung ist auf der Blockchain gespeichert. Arbeite an der Aufgabe und markiere sie als abgeschlossen, wenn du fertig bist.
          </p>
          {proposal.contract_agreement_tx && (
            <a
              href={`https://${process.env.NODE_ENV === 'development' ? 'sepolia.' : ''}basescan.org/tx/${proposal.contract_agreement_tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-3 block"
            >
              📜 Blockchain-Vereinbarung anzeigen →
            </a>
          )}
          <button
            onClick={() => onConfirmWork(proposal.id)}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ✅ Arbeit als abgeschlossen markieren
          </button>
        </div>
      )}

      {/* Work in Progress - Confirmed, Awaiting Admin */}
      {proposal.status === 'work_in_progress' && proposal.pioneer_confirmed_at && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            ⏳ Warten auf Admin-Verifizierung
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Du hast die Arbeit als abgeschlossen markiert am {new Date(proposal.pioneer_confirmed_at).toLocaleString('de-DE')}.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Die Foundation wird deine Arbeit überprüfen und die Tokens freigeben.
          </p>
        </div>
      )}

      {/* Completed State */}
      {proposal.status === 'completed' && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-semibold text-green-900 dark:text-green-300 mb-2">
            ✅ Abgeschlossen & Tokens erhalten!
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Die Tokens wurden erfolgreich an deine Wallet übertragen.
          </p>
          {proposal.contract_release_tx && (
            <a
              href={`https://${process.env.NODE_ENV === 'development' ? 'sepolia.' : ''}basescan.org/tx/${proposal.contract_release_tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              📜 Token-Release-Transaktion anzeigen →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }: { status: string }) {
  const config = {
    pending_review: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-400',
      label: 'Pending Review'
    },
    counter_offer_pending: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-400',
      label: 'Counter-Offer'
    },
    approved: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      label: 'Genehmigt'
    },
    accepted: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-400',
      label: 'Akzeptiert'
    },
    work_in_progress: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-400',
      label: 'In Arbeit'
    },
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      label: 'Abgeschlossen'
    },
    rejected: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-400',
      label: 'Abgelehnt'
    },
  }
  
  const style = config[status as keyof typeof config] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status
  }
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

