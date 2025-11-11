/**
 * Profile Settings Page
 * Edit profile and privacy settings
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { showToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/Layout'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { BackButton } from '@/components/navigation/BackButton'
import { Settings as SettingsIcon } from 'lucide-react'

export default function ProfileSettingsPage() {
  const { wallet, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'basic' | 'privacy'>('basic')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Basic Info
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [availability, setAvailability] = useState('open')
  const [githubUsername, setGithubUsername] = useState('')
  const [twitterUsername, setTwitterUsername] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  // Privacy Settings
  const [showTokenHoldings, setShowTokenHoldings] = useState(false)
  const [showEarnings, setShowEarnings] = useState(false)
  const [showWalletAddress, setShowWalletAddress] = useState(false)
  const [showActivityFeed, setShowActivityFeed] = useState(true)
  const [showGithubActivity, setShowGithubActivity] = useState(true)
  const [allowFollows, setAllowFollows] = useState(true)
  const [allowEndorsements, setAllowEndorsements] = useState(true)

  // Skill input
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!wallet && !authLoading) {
      router.push('/')
      return
    }
    
    if (wallet && isAuthenticated) {
      fetchProfile()
      fetchPrivacy()
    }
  }, [wallet, isAuthenticated, authLoading])

  async function fetchProfile() {
    if (!wallet) return

    try {
      const response = await fetch(`/api/profiles/${wallet}`)
      if (response.ok) {
        const data = await response.json()
        const profile = data.profile

        setDisplayName(profile.display_name || '')
        setBio(profile.bio || '')
        setAvatarUrl(profile.avatar_url || '')
        setSkills(profile.skills || [])
        setAvailability(profile.availability_status || 'open')
        setGithubUsername(profile.github_username || '')
        setTwitterUsername(profile.twitter_username || '')
        setLinkedinUrl(profile.linkedin_url || '')
        setWebsiteUrl(profile.website_url || '')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  async function fetchPrivacy() {
    try {
      const response = await fetch('/api/profiles/privacy')
      if (response.ok) {
        const data = await response.json()
        const privacy = data.privacy

        setShowTokenHoldings(privacy.show_token_holdings)
        setShowEarnings(privacy.show_earnings)
        setShowWalletAddress(privacy.show_wallet_address)
        setShowActivityFeed(privacy.show_activity_feed)
        setShowGithubActivity(privacy.show_github_activity)
        setAllowFollows(privacy.allow_follows)
        setAllowEndorsements(privacy.allow_endorsements)
      }
    } catch (error) {
      console.error('Failed to fetch privacy:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveBasicInfo(e: React.FormEvent) {
    e.preventDefault()
    if (!wallet) return

    setSaving(true)
    try {
      const response = await fetch(`/api/profiles/${wallet}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          skills,
          availability_status: availability,
          github_username: githubUsername,
          twitter_username: twitterUsername,
          linkedin_url: linkedinUrl,
          website_url: websiteUrl,
        }),
      })

      if (response.ok) {
        showToast('Profil erfolgreich aktualisiert', 'success')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      showToast('Fehler beim Aktualisieren des Profils', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePrivacy(e: React.FormEvent) {
    e.preventDefault()

    setSaving(true)
    try {
      const response = await fetch('/api/profiles/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          show_token_holdings: showTokenHoldings,
          show_earnings: showEarnings,
          show_wallet_address: showWalletAddress,
          show_activity_feed: showActivityFeed,
          show_github_activity: showGithubActivity,
          allow_follows: allowFollows,
          allow_endorsements: allowEndorsements,
        }),
      })

      if (response.ok) {
        showToast('Privacy-Einstellungen aktualisiert', 'success')
      } else {
        throw new Error('Failed to update privacy')
      }
    } catch (error) {
      showToast('Fehler beim Aktualisieren der Privacy-Einstellungen', 'error')
    } finally {
      setSaving(false)
    }
  }

  function addSkill() {
    const skill = skillInput.trim()
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
      setSkillInput('')
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill))
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Navigation: Breadcrumbs + Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Breadcrumbs 
              items={[
                { label: 'Settings', href: '/settings/profile', icon: 'settings' },
                { label: 'Profile', icon: 'user' }
              ]} 
            />
            <BackButton 
              fallbackUrl="/"
              label="Back"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Profile Settings</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('basic')}
                className={`pb-4 px-2 font-semibold transition-colors cursor-pointer ${
                  activeTab === 'basic'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 px-2 font-semibold transition-colors cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Privacy
              </button>
            </div>
          </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <form onSubmit={handleSaveBasicInfo} className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{bio.length}/500</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="z.B. Solidity, React..."
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Hinzufügen
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm"
                      >
                        <span className="text-blue-300">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-300 hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Verfügbarkeit
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Verfügbar</option>
                    <option value="busy">Beschäftigt</option>
                    <option value="unavailable">Nicht verfügbar</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitter Username
                    </label>
                    <input
                      type="text"
                      value={twitterUsername}
                      onChange={(e) => setTwitterUsername(e.target.value)}
                      placeholder="username"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Speichern...' : 'Änderungen speichern'}
            </button>
          </form>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <form onSubmit={handleSavePrivacy} className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Sichtbarkeit</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Token Holdings anzeigen</span>
                  <input
                    type="checkbox"
                    checked={showTokenHoldings}
                    onChange={(e) => setShowTokenHoldings(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Verdienste anzeigen</span>
                  <input
                    type="checkbox"
                    checked={showEarnings}
                    onChange={(e) => setShowEarnings(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Vollständige Wallet-Adresse anzeigen</span>
                  <input
                    type="checkbox"
                    checked={showWalletAddress}
                    onChange={(e) => setShowWalletAddress(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Aktivitäts-Feed anzeigen</span>
                  <input
                    type="checkbox"
                    checked={showActivityFeed}
                    onChange={(e) => setShowActivityFeed(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">GitHub-Aktivität anzeigen</span>
                  <input
                    type="checkbox"
                    checked={showGithubActivity}
                    onChange={(e) => setShowGithubActivity(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Interaktionen</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Andere können mir folgen</span>
                  <input
                    type="checkbox"
                    checked={allowFollows}
                    onChange={(e) => setAllowFollows(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Andere können mich empfehlen</span>
                  <input
                    type="checkbox"
                    checked={allowEndorsements}
                    onChange={(e) => setAllowEndorsements(e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}
        </div>
      </div>
    </Layout>
  )
}

