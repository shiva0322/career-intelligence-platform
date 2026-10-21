import type { LearnerProfile } from '../types/career'
import { DEFAULT_LEARNER_PROFILE } from '../data/defaultProfile'

const STORAGE_KEY = 'career_intelligence_learner_profile_v1'

/**
 * Loads the learner profile from localStorage, falling back to default if unavailable.
 */
export function loadSavedProfile(): LearnerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_LEARNER_PROFILE

    const parsed = JSON.parse(raw) as Partial<LearnerProfile>
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.qualification === 'string' &&
      Array.isArray(parsed.skills)
    ) {
      return {
        ...DEFAULT_LEARNER_PROFILE,
        ...parsed,
      }
    }
  } catch (err) {
    console.warn('Failed to load profile from localStorage, using default:', err)
  }
  return DEFAULT_LEARNER_PROFILE
}

/**
 * Saves the learner profile to localStorage.
 */
export function saveProfile(profile: LearnerProfile): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return true
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err)
    return false
  }
}

/**
 * Clears saved profile and restores the default demo profile.
 */
export function resetProfile(): LearnerProfile {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to remove profile from localStorage:', err)
  }
  return DEFAULT_LEARNER_PROFILE
}
