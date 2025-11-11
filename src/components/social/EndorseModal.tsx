/**
 * Endorse Modal Component
 * Modal for skill endorsement with message
 */

'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { showToast } from '@/lib/toast'

interface EndorseModalProps {
  targetAddress: string
  targetName: string
  onClose: () => void
  onSuccess: () => void
}

export function EndorseModal({ targetAddress, targetName, onClose, onSuccess }: EndorseModalProps) {
  const { wallet, isAuthenticated } = useAuth()
  const [skill, setSkill] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!wallet || !isAuthenticated) {
      showToast('Please log in to endorse users', 'error')
      onClose()
      return
    }

    // Validate wallet format
    if (!wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.error('Invalid wallet format:', wallet)
      showToast('Invalid wallet address format', 'error')
      onClose()
      return
    }

    if (!skill.trim()) {
      showToast('Please enter a skill', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/social/endorse', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-wallet-address': wallet,
        },
        body: JSON.stringify({
          endorsed_address: targetAddress,
          skill: skill.trim(),
          message: message.trim() || undefined,
        }),
      })

      if (response.ok) {
        showToast('Endorsement submitted successfully', 'success')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        if (response.status === 401) {
          showToast('Please log in to endorse users', 'error')
        } else {
          throw new Error(error.error || 'Failed to endorse')
        }
      }
    } catch (error: any) {
      showToast(error.message || 'Error while endorsing', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Endorse {targetName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill *
            </label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g. Solidity, React, Design..."
              maxLength={50}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">2-50 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why do you endorse this skill?"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{message.length}/500 characters</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !skill.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Endorse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

