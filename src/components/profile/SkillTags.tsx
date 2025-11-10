/**
 * Skill Tags Component
 * Displays skills with endorsement counts
 */

'use client'

import { useState, useEffect } from 'react'

interface SkillTagsProps {
  skills: string[]
  walletAddress: string
  editable?: boolean
  onSkillsChange?: (skills: string[]) => void
}

export function SkillTags({ skills, walletAddress, editable = false, onSkillsChange }: SkillTagsProps) {
  const [endorsements, setEndorsements] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchEndorsementCounts()
  }, [walletAddress])

  async function fetchEndorsementCounts() {
    try {
      const response = await fetch(`/api/social/endorsements/${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        const counts: Record<string, number> = {}
        Object.entries(data.bySkill || {}).forEach(([skill, info]: [string, any]) => {
          counts[skill] = info.count
        })
        setEndorsements(counts)
      }
    } catch (error) {
      console.error('Failed to fetch endorsement counts:', error)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div
          key={skill}
          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm"
        >
          <span className="text-blue-300">{skill}</span>
          {endorsements[skill] > 0 && (
            <span className="text-xs text-gray-400">+{endorsements[skill]}</span>
          )}
        </div>
      ))}
    </div>
  )
}

