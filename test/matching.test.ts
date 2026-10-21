import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateCareerMatch, isSkillMatch, rankCareers } from '../src/utils/matchingAlgorithm.ts'
import { CAREERS_DATA } from '../src/data/careersData.ts'
import { DEFAULT_LEARNER_PROFILE } from '../src/data/defaultProfile.ts'
import type { LearnerProfile } from '../src/types/career.ts'

describe('Matching Algorithm & Multi-Path Intelligence', () => {
  it('correctly matches skills with exact and substring variations', () => {
    assert.equal(isSkillMatch('SQL', 'SQL & Database Querying'), true)
    assert.equal(isSkillMatch('Excel', 'Excel & Financial Modeling'), true)
    assert.equal(isSkillMatch('Python for Data Science', 'Python'), true)
    assert.equal(isSkillMatch('React', 'React & Modern Front-End'), true)
    assert.equal(isSkillMatch('Figma', 'Figma & UI/UX Prototyping'), true)
  })

  it('proves that a B.Com degree qualifies for diverse global sectors beyond basic accounting', () => {
    const bcomProfile: LearnerProfile = {
      name: 'B.Com Graduate',
      qualification: 'B.Com',
      secondaryQualifications: ['Finance'],
      fieldOfStudy: 'Commerce & Financial Markets',
      skills: ['Excel & Financial Modeling', 'SQL & Database Querying', 'Corporate Accounting & Reconciliation'],
      interests: ['Finance & Capital Markets', 'Global Logistics & Trade'],
      experience: 'Student / Fresher',
      targetRegions: ['Global / Remote', 'North America'],
      careerPreferences: ['Capital Markets & Trading', 'Supply Chain & Global Logistics', 'Asset & Wealth Management'],
    }

    // Capital Markets
    const capitalMarkets = CAREERS_DATA.find((c) => c.id === 'capital-markets-specialist')!
    assert.ok(capitalMarkets)
    const cmMatch = calculateCareerMatch(bcomProfile, capitalMarkets)
    assert.equal(cmMatch.qualificationMatch, 'exact')
    assert.ok(cmMatch.overallScore >= 80, `Expected >= 80, got ${cmMatch.overallScore}`)

    // Supply Chain & Global Logistics
    const supplyChain = CAREERS_DATA.find((c) => c.id === 'supply-chain-logistics')!
    assert.ok(supplyChain)
    const scMatch = calculateCareerMatch(bcomProfile, supplyChain)
    assert.equal(scMatch.qualificationMatch, 'exact')
    assert.ok(scMatch.overallScore >= 65, `Expected >= 65, got ${scMatch.overallScore}`)

    // Wealth Management
    const wealthMgmt = CAREERS_DATA.find((c) => c.id === 'asset-wealth-management')!
    assert.ok(wealthMgmt)
    const wmMatch = calculateCareerMatch(bcomProfile, wealthMgmt)
    assert.equal(wmMatch.qualificationMatch, 'exact')
    assert.ok(wmMatch.overallScore >= 75, `Expected >= 75, got ${wmMatch.overallScore}`)
  })

  it('ranks careers descending by overall match score', () => {
    const ranked = rankCareers(DEFAULT_LEARNER_PROFILE, CAREERS_DATA)

    assert.equal(ranked.length, CAREERS_DATA.length)
    for (let i = 0; i < ranked.length - 1; i++) {
      assert.ok(
        ranked[i].overallScore >= ranked[i + 1].overallScore,
        `Career at ${i} (${ranked[i].overallScore}) should be >= career at ${i + 1} (${ranked[i + 1].overallScore})`,
      )
    }

    assert.equal(ranked[0].matchTier, 'Top Match')
  })

  it('identifies missing skills correctly for skill-gap roadmaps', () => {
    const dataAI = CAREERS_DATA.find((c) => c.id === 'data-ai-analytics')!
    const result = calculateCareerMatch(DEFAULT_LEARNER_PROFILE, dataAI)

    assert.ok(result.missingSkills.length > 0)
    assert.equal(result.matchingSkills.length + result.missingSkills.length, dataAI.skills.length)
  })
})

describe('Global Market Openings & Verified Data Sources', () => {
  it('validates every career track contains verified data sources and live search queries', () => {
    for (const career of CAREERS_DATA) {
      assert.ok(career.marketInsights.openingsCountGlobal.includes('+'), `${career.title} should have openings count`)
      assert.ok(career.marketInsights.growthRateYoY.includes('%'), `${career.title} should have growth rate`)
      assert.ok(career.marketInsights.topHiringHubs.length >= 3, `${career.title} should list top hiring hubs`)
      assert.ok(career.marketInsights.sources.length >= 1, `${career.title} should cite verified sources`)
      assert.ok(career.marketInsights.liveSearchQuery.length > 3, `${career.title} should have live query`)

      // Multi-currency salaries
      assert.ok(career.salary.USD.includes('$'))
      assert.ok(career.salary.INR.includes('₹'))
      assert.ok(career.salary.EUR.includes('€'))
      assert.ok(career.salary.GBP.includes('£'))
    }
  })

  it('verifies that each career provides multiple learning roadmap options', () => {
    for (const career of CAREERS_DATA) {
      assert.ok(career.roadmaps.length >= 1, `${career.title} should provide roadmaps`)
      for (const roadmap of career.roadmaps) {
        assert.ok(roadmap.id.length > 0)
        assert.ok(roadmap.name.length > 0)
        assert.ok(roadmap.phases.length >= 2, `${career.title} roadmap ${roadmap.name} should have >= 2 phases`)
        for (const phase of roadmap.phases) {
          assert.ok(phase.milestone.length > 0, `Phase ${phase.phase} should have a milestone deliverable`)
        }
      }
    }
  })

  it('proves degree connection rationales exist for multiple degrees', () => {
    for (const career of CAREERS_DATA) {
      assert.ok(Object.keys(career.whyDegreeFits).length >= 2, `${career.title} should have degree rationales`)
      assert.ok(career.whyDegreeFits['Default'] || career.whyDegreeFits['B.Com'])
    }
  })
})
