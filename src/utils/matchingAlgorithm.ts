import type { Career, LearnerProfile, MatchResult, MatchScoreBreakdown } from '../types/career'

/**
 * Normalizes a skill string for comparison (lowercased, trimmed, and special chars removed).
 */
function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Determines whether two skills are considered matching.
 */
export function isSkillMatch(learnerSkill: string, careerSkill: string): boolean {
  const normLearner = normalizeSkill(learnerSkill)
  const normCareer = normalizeSkill(careerSkill)

  if (normLearner === normCareer) return true
  if (normLearner.length >= 3 && normCareer.includes(normLearner)) return true
  if (normCareer.length >= 3 && normLearner.includes(normCareer)) return true

  // Check sub-word intersections (e.g. "SQL" matching "SQL & Database Querying")
  const learnerWords = learnerSkill.toLowerCase().split(/\s*&\s*|\s+/)
  const careerWords = careerSkill.toLowerCase().split(/\s*&\s*|\s+/)

  return learnerWords.some(
    (lw) => lw.length >= 3 && careerWords.some((cw) => cw.includes(lw) || lw.includes(cw)),
  )
}

/**
 * Calculates a transparent, explainable match between a learner profile and a career.
 */
export function calculateCareerMatch(profile: LearnerProfile, career: Career): MatchResult {
  // 1. Qualification Alignment (Max 35 points)
  let qualificationScore: number
  let qualificationMatch: 'exact' | 'transferable' | 'alternative'

  const allProfileQualifications = [profile.qualification, ...(profile.secondaryQualifications || [])]
  const hasExact = allProfileQualifications.some((deg) => career.eligibility.includes(deg))

  if (hasExact) {
    qualificationScore = 35
    qualificationMatch = 'exact'
  } else if (career.eligibility.includes('Other') || allProfileQualifications.includes('Other')) {
    qualificationScore = 24
    qualificationMatch = 'transferable'
  } else {
    qualificationScore = 12
    qualificationMatch = 'alternative'
  }

  // 2. Skill Overlap (Max 35 points)
  const matchingSkills: string[] = []
  const missingSkills: string[] = []

  for (const cSkill of career.skills) {
    const hasSkill = profile.skills.some((lSkill) => isSkillMatch(lSkill, cSkill))
    if (hasSkill) {
      matchingSkills.push(cSkill)
    } else {
      missingSkills.push(cSkill)
    }
  }

  const skillRatio = career.skills.length > 0 ? matchingSkills.length / career.skills.length : 0
  const skillScore = Math.min(35, Math.round(skillRatio * 35))

  // 3. Interest & Domain Alignment (Max 20 points)
  let interestMatchesCount = 0
  for (const interest of profile.interests) {
    if (career.interests.includes(interest)) {
      interestMatchesCount++
    }
  }

  // Check career preference alignment with career domain
  const preferenceMatched = profile.careerPreferences.includes(career.domain)

  let interestScore: number
  if (preferenceMatched && interestMatchesCount >= 1) {
    interestScore = 20
  } else if (preferenceMatched || interestMatchesCount >= 2) {
    interestScore = 16
  } else if (interestMatchesCount === 1) {
    interestScore = 12
  } else {
    interestScore = 6
  }

  // 4. Experience Level Suitability (Max 10 points)
  const experienceScore = 10

  const overallScore = Math.min(
    100,
    Math.max(0, qualificationScore + skillScore + interestScore + experienceScore),
  )

  const breakdown: MatchScoreBreakdown = {
    qualificationScore,
    skillScore,
    interestScore,
    experienceScore,
  }

  let matchTier: 'Top Match' | 'Strong Fit' | 'Viable Transition'
  if (overallScore >= 80) {
    matchTier = 'Top Match'
  } else if (overallScore >= 60) {
    matchTier = 'Strong Fit'
  } else {
    matchTier = 'Viable Transition'
  }

  // Specific rationale for how their degree applies to this career
  const customDegreeRationale =
    career.whyDegreeFits[profile.qualification] || career.whyDegreeFits['Default']

  let explanation = ''
  if (qualificationMatch === 'exact') {
    explanation += `Directly open to your ${profile.qualification} degree (+${qualificationScore} pts). `
  } else if (qualificationMatch === 'transferable') {
    explanation += `Considers ${profile.qualification} as an open or transferable degree (+${qualificationScore} pts). `
  } else {
    explanation += `Requires transition bridging or relevant portfolio evidence (+${qualificationScore} pts). `
  }

  if (matchingSkills.length > 0) {
    explanation += `You already cover ${matchingSkills.length} of ${career.skills.length} core prerequisites: ${matchingSkills.join(', ')} (+${skillScore} pts). `
  } else {
    explanation += `Prerequisite skills to build identified in 12-week roadmaps (+${skillScore} pts). `
  }

  if (preferenceMatched) {
    explanation += `Matches your target domain preference: ${career.domain} (+${interestScore} pts).`
  }

  return {
    career,
    overallScore,
    breakdown,
    matchingSkills,
    missingSkills,
    matchTier,
    explanation,
    qualificationMatch,
    customDegreeRationale,
  }
}

/**
 * Calculates matches for all careers and sorts them by match score descending.
 */
export function rankCareers(profile: LearnerProfile, careers: Career[]): MatchResult[] {
  return careers
    .map((career) => calculateCareerMatch(profile, career))
    .sort((a, b) => b.overallScore - a.overallScore)
}
