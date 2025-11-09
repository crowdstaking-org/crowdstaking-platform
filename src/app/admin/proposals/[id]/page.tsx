/**
 * Admin Proposal Detail Page
 * View and take action on individual proposals
 * 
 * PHASE 4: Admin can accept, reject, or counter-offer
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '@/hooks/useAuth'
import { isAdmin } from '@/lib/auth'
import { Layout } from '@/components/Layout'
import type { Proposal } from '@/types/proposal'

export default function AdminProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { wallet } = useAuth()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)
  
  const hasAdminAccess = wallet && isAdmin(wallet)
  
  useEffect(() => {
    if (hasAdminAccess) {
      fetchProposal()
    } else {
      setLoading(false)
    }
  }, [params.id, hasAdminAccess])
  
  const fetchProposal = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/proposals/admin')
      
      if (!response.ok) {
        throw new Error('Failed to fetch proposals')
      }
      
      const data = await response.json()
      const found = data.proposals?.find((p: Proposal) => p.id === params.id)
      
      if (!found) {
        throw new Error('Proposal not found')
      }
      
      setProposal(found)
    } catch (err: any) {
      console.error('Failed to fetch proposal:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAction = async (
    action: 'accept' | 'reject' | 'counter_offer',
    data?: { foundation_offer_cstake_amount?: number; foundation_notes?: string }
  ) => {
    try {
      const response = await fetch(`/api/proposals/admin/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Action failed')
      }
      
      // Refresh proposal
      await fetchProposal()
      
      // Close modals
      setShowAcceptModal(false)
      setShowRejectModal(false)
      setShowCounterOfferModal(false)
      
      alert(`Proposal erfolgreich ${action === 'accept' ? 'akzeptiert' : action === 'reject' ? 'abgelehnt' : 'Counter-Offer gesendet'}!`)
    } catch (err: any) {
      console.error('Action failed:', err)
      alert(`Aktion fehlgeschlagen: ${err.message}`)
    }
  }
  
  const [releasingTokens, setReleasingTokens] = useState(false)
  
  const handleReleaseTokens = async () => {
    if (!confirm('Möchtest du die Tokens wirklich an den Pioneer freigeben?')) {
      return
    }
    
    try {
      setReleasingTokens(true)
      
      const response = await fetch(`/api/contracts/release-agreement/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to release tokens')
      }
      
      const data = await response.json()
      
      // Refresh proposal
      await fetchProposal()
      
      alert(data.message || 'Tokens erfolgreich freigegeben!')
    } catch (err: any) {
      console.error('Release tokens failed:', err)
      alert(`Token-Freigabe fehlgeschlagen: ${err.message}`)
    } finally {
      setReleasingTokens(false)
    }
  }
  
  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Lade Proposal...</p>
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
  if (error || !proposal) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Fehler</h2>
            <p className="text-red-600 mb-4">{error || 'Proposal nicht gefunden'}</p>
            <button
              onClick={() => router.push('/admin/proposals')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zurück zur Liste
            </button>
          </div>
        </div>
      </Layout>
    )
  }
  
  const isPending = proposal.status === 'pending_review'
  const canTakeAction = isPending
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Back button */}
        <button
          onClick={() => router.push('/admin/proposals')}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
        >
          ← Zurück zur Liste
        </button>
        
        {/* Proposal card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4">{proposal.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600">
              <div>
                <span className="font-semibold">Von:</span>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {proposal.creator_wallet_address}
                </code>
              </div>
              
              <div>
                <span className="font-semibold">Erstellt:</span>{' '}
                {new Date(proposal.created_at).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-4">
              <StatusBadge status={proposal.status} />
              <div className="text-2xl font-bold text-blue-600">
                {proposal.requested_cstake_amount.toLocaleString()} $CSTAKE
              </div>
            </div>
            
            {proposal.foundation_offer_cstake_amount && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Foundation Counter-Offer:</span>{' '}
                  {proposal.foundation_offer_cstake_amount.toLocaleString()} $CSTAKE
                </p>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Beschreibung</h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <ReactMarkdown>{proposal.description}</ReactMarkdown>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3">Deliverable</h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <ReactMarkdown>{proposal.deliverable}</ReactMarkdown>
              </div>
            </div>
            
            {proposal.foundation_notes && (
              <div>
                <h3 className="text-xl font-bold mb-3">Foundation Notes</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-gray-700">{proposal.foundation_notes}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          {canTakeAction && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Dieses Proposal wartet auf deine Entscheidung:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="flex-1 min-w-[150px] bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  ✓ Akzeptieren
                </button>
                <button
                  onClick={() => setShowCounterOfferModal(true)}
                  className="flex-1 min-w-[150px] bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  ↔ Counter-Offer
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 min-w-[150px] bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  ✗ Ablehnen
                </button>
              </div>
            </div>
          )}
          
          {!canTakeAction && proposal.status !== 'work_in_progress' && proposal.status !== 'completed' && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Dieses Proposal wurde bereits bearbeitet.
              </p>
            </div>
          )}
          
          {/* Work in Progress - Waiting for Pioneer Confirmation */}
          {proposal.status === 'work_in_progress' && !proposal.pioneer_confirmed_at && (
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="font-semibold text-yellow-900 mb-2">
                  ⏳ Pioneer arbeitet an der Aufgabe
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Die Blockchain-Vereinbarung wurde erstellt. Warte darauf, dass der Pioneer die Arbeit als abgeschlossen markiert.
                </p>
                {proposal.contract_agreement_tx && (
                  <a
                    href={`https://${process.env.NODE_ENV === 'development' ? 'sepolia.' : ''}basescan.org/tx/${proposal.contract_agreement_tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    📜 Blockchain-Vereinbarung anzeigen →
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Work in Progress - Pioneer Confirmed, Ready to Release */}
          {proposal.status === 'work_in_progress' && proposal.pioneer_confirmed_at && (
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="font-semibold text-green-900 mb-2">
                  ✅ Pioneer hat die Arbeit als abgeschlossen markiert
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Bestätigt am: {new Date(proposal.pioneer_confirmed_at).toLocaleString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Überprüfe die Arbeit und gib die Tokens frei, wenn alles in Ordnung ist.
                </p>
                <button
                  onClick={handleReleaseTokens}
                  disabled={releasingTokens}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {releasingTokens ? '⏳ Gebe Tokens frei...' : '💰 Tokens freigeben'}
                </button>
              </div>
            </div>
          )}
          
          {/* Completed State */}
          {proposal.status === 'completed' && (
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="font-semibold text-green-900 mb-2">
                  ✅ Abgeschlossen
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Tokens wurden erfolgreich an den Pioneer freigegeben!
                </p>
                {proposal.contract_release_tx && (
                  <a
                    href={`https://${process.env.NODE_ENV === 'development' ? 'sepolia.' : ''}basescan.org/tx/${proposal.contract_release_tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    📜 Token-Release-Transaktion anzeigen →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals - will be implemented in next ticket */}
      {showAcceptModal && (
        <AcceptModal
          onClose={() => setShowAcceptModal(false)}
          onConfirm={(notes) => handleAction('accept', { foundation_notes: notes })}
          proposal={proposal}
        />
      )}
      
      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={(notes) => handleAction('reject', { foundation_notes: notes })}
          proposal={proposal}
        />
      )}
      
      {showCounterOfferModal && (
        <CounterOfferModal
          onClose={() => setShowCounterOfferModal(false)}
          onConfirm={(amount, notes) => handleAction('counter_offer', {
            foundation_offer_cstake_amount: amount,
            foundation_notes: notes
          })}
          proposal={proposal}
        />
      )}
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
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Akzeptiert'
    },
    work_in_progress: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'In Arbeit'
    },
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Abgeschlossen'
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
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

/**
 * Placeholder modal components - will be fully implemented in next ticket
 */
function AcceptModal({ 
  onClose, 
  onConfirm, 
  proposal 
}: { 
  onClose: () => void
  onConfirm: (notes: string) => void
  proposal: Proposal 
}) {
  const [notes, setNotes] = useState('')
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Proposal akzeptieren</h2>
        <p className="text-gray-600 mb-4">
          Bestätige die Annahme von <strong>{proposal.requested_cstake_amount.toLocaleString()} $CSTAKE</strong>
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Optionale Notizen
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Z.B. Glückwunsch! Wir freuen uns auf die Zusammenarbeit..."
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(notes)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Akzeptieren
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

function RejectModal({ 
  onClose, 
  onConfirm, 
  proposal 
}: { 
  onClose: () => void
  onConfirm: (notes: string) => void
  proposal: Proposal 
}) {
  const [notes, setNotes] = useState('')
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Proposal ablehnen</h2>
        <p className="text-gray-600 mb-4">
          Begründe die Ablehnung, damit der Pioneer Feedback erhält.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">
            Ablehnungsgrund (erforderlich) *
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Erkläre, warum das Proposal nicht angenommen werden kann..."
            required
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (!notes.trim()) {
                alert('Bitte gib einen Ablehnungsgrund an')
                return
              }
              onConfirm(notes)
            }}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Ablehnen
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

function CounterOfferModal({ 
  onClose, 
  onConfirm, 
  proposal 
}: { 
  onClose: () => void
  onConfirm: (amount: number, notes: string) => void
  proposal: Proposal 
}) {
  const [amount, setAmount] = useState(Math.round(proposal.requested_cstake_amount * 0.8))
  const [notes, setNotes] = useState('')
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Counter-Offer erstellen</h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Angefordert: <strong className="text-gray-900">{proposal.requested_cstake_amount.toLocaleString()} $CSTAKE</strong>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Dein Angebot (in $CSTAKE) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. 1200"
              min="1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Vorschlag: {Math.round(proposal.requested_cstake_amount * 0.8).toLocaleString()} (80%)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">
              Erklärung (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Erkläre, warum du einen anderen Betrag anbietest..."
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (!amount || amount <= 0) {
                alert('Bitte gib einen gültigen Betrag ein')
                return
              }
              onConfirm(amount, notes)
            }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Counter-Offer senden
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

