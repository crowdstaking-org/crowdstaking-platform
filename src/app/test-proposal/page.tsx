'use client'

/**
 * Test Page for Proposal Submission
 * Full-cycle integration test: Frontend -> API -> Database
 */

import { useState } from 'react'

export default function TestProposalPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requested_cstake_amount: 1000,
  })
  
  const [walletAddress, setWalletAddress] = useState('0x1234567890123456789012345678901234567890')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [proposals, setProposals] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': walletAddress,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Proposal erstellt! ID: ' + data.data.proposal.id })
        // Reset form
        setFormData({
          title: '',
          description: '',
          requested_cstake_amount: 1000,
        })
        // Reload proposals
        fetchProposals()
      } else {
        setMessage({ type: 'error', text: data.error || 'Fehler beim Erstellen' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Netzwerkfehler: ' + (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals')
      const data = await response.json()
      if (response.ok) {
        setProposals(data.data.proposals)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Proposals:', error)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🧪 Proposal Integration Test</h1>
      
      {/* Wallet Address Input */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Wallet Address (für Test):
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* Proposal Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Titel:
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            minLength={1}
            maxLength={200}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Proposal-Titel"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Beschreibung:
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Beschreibe dein Proposal..."
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Angeforderte cSTAKE Menge:
          </label>
          <input
            type="number"
            value={formData.requested_cstake_amount}
            onChange={(e) => setFormData({ ...formData, requested_cstake_amount: parseFloat(e.target.value) })}
            required
            min={1}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Wird erstellt...' : 'Proposal erstellen'}
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '4px',
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Load Proposals Button */}
      <button
        onClick={fetchProposals}
        style={{
          padding: '0.5rem 1rem',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        📋 Proposals laden
      </button>

      {/* Proposals List */}
      {proposals.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gespeicherte Proposals ({proposals.length})</h2>
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#f9f9f9',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{proposal.title}</h3>
              <p style={{ marginBottom: '0.5rem', color: '#666' }}>{proposal.description}</p>
              <div style={{ fontSize: '0.9rem', color: '#999' }}>
                <div>💰 Amount: {proposal.requested_cstake_amount} cSTAKE</div>
                <div>👤 Creator: {proposal.creator_wallet_address}</div>
                <div>🆔 ID: {proposal.id}</div>
                <div>📅 Created: {new Date(proposal.created_at).toLocaleString('de-DE')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


