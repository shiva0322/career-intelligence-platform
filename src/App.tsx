import { useMemo, useState, useCallback, useEffect } from 'react'
import './App.css'
import type { Career, CurrencyCode, LearnerProfile, MatchResult, Qualification } from './types/career'
import { CAREERS_DATA, CAREER_DOMAINS_LIST, DEGREE_OPTIONS } from './data/careersData'
import { calculateCareerMatch } from './utils/matchingAlgorithm'
import { loadSavedProfile, resetProfile as resetSavedProfile, saveProfile } from './utils/storage'
import { Topbar } from './components/Topbar'
import { Hero } from './components/Hero'
import { ProfileBar } from './components/ProfileBar'
import { IntakeWizard } from './components/IntakeWizard'
import { DegreeMatrixShowcase } from './components/DegreeMatrixShowcase'
import { ProfileModal } from './components/ProfileModal'
import { CareerCard } from './components/CareerCard'
import { CareerModal } from './components/CareerModal'
import { SkillGapSection } from './components/SkillGapSection'
import { HowItWorks } from './components/HowItWorks'
import { Footer } from './components/Footer'
import { Toast } from './components/Toast'

export function App() {
  // 1. Learner Profile & Intake State
  const [profile, setProfile] = useState<LearnerProfile>(() => loadSavedProfile())
  const [isIntakeWizardOpen, setIsIntakeWizardOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 2. Global Currency Switcher
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('INR')

  // 3. Multi-Selection Filter State
  const [activeTab, setActiveTab] = useState<'recommendations' | 'all-catalog'>('recommendations')
  const [search, setSearch] = useState('')
  const [selectedDegrees, setSelectedDegrees] = useState<Qualification[]>([]) // Empty = All degrees
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]) // Empty = All domains
  const [sortBy, setSortBy] = useState<'score' | 'openings' | 'title'>('score')

  // 4. Modal State
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)

  // Recalculate match results when profile changes
  const allRankedMatches = useMemo(() => {
    return CAREERS_DATA.map((career) => calculateCareerMatch(profile, career)).sort(
      (a, b) => b.overallScore - a.overallScore,
    )
  }, [profile])

  const topMatch = allRankedMatches[0]

  // Filtered and sorted matches (Supporting multiple option selections)
  const displayedMatches = useMemo(() => {
    return allRankedMatches
      .filter((match) => {
        const { career } = match
        const searchTarget = `${career.title} ${career.category} ${career.domain} ${career.skills.join(
          ' ',
        )} ${career.description}`.toLowerCase()
        const matchesSearch = !search.trim() || searchTarget.includes(search.trim().toLowerCase())

        // Multiple degree selection check:
        // If selectedDegrees is empty, all match.
        // If populated, career must be open to AT LEAST ONE of the selected degrees.
        const matchesDegree =
          selectedDegrees.length === 0 ||
          selectedDegrees.some((deg) => career.eligibility.includes(deg) || career.eligibility.includes('Other'))

        // Multiple domain selection check:
        const matchesDomain =
          selectedDomains.length === 0 ||
          selectedDomains.includes(career.domain) ||
          selectedDomains.includes(career.category)

        return matchesSearch && matchesDegree && matchesDomain
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.overallScore - a.overallScore
        }
        if (sortBy === 'openings') {
          // Compare openings count numerically from string (e.g. "48,500+ Active Roles")
          const countA = parseInt(a.career.marketInsights.openingsCountGlobal.replace(/\D/g, ''), 10) || 0
          const countB = parseInt(b.career.marketInsights.openingsCountGlobal.replace(/\D/g, ''), 10) || 0
          return countB - countA
        }
        if (sortBy === 'title') {
          return a.career.title.localeCompare(b.career.title)
        }
        return 0
      })
  }, [allRankedMatches, search, selectedDegrees, selectedDomains, sortBy])

  // Multi-select toggle helpers
  const handleToggleDegreeFilter = (deg: Qualification) => {
    if (selectedDegrees.includes(deg)) {
      setSelectedDegrees(selectedDegrees.filter((d) => d !== deg))
    } else {
      setSelectedDegrees([...selectedDegrees, deg])
    }
  }

  const handleToggleDomainFilter = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain))
    } else {
      setSelectedDomains([...selectedDomains, domain])
    }
  }

  const handleClearAllFilters = () => {
    setSearch('')
    setSelectedDegrees([])
    setSelectedDomains([])
    setSortBy('score')
  }

  // Handle Intake Completion
  const handleCompleteIntake = useCallback((updated: LearnerProfile) => {
    setProfile(updated)
    saveProfile(updated)
    setIsIntakeWizardOpen(false)
    setToastMessage(`Career intelligence portal personalized for ${updated.name}! Matches recalculated.`)
  }, [])

  // Handle Profile Save
  const handleSaveProfile = useCallback((updated: LearnerProfile) => {
    setProfile(updated)
    saveProfile(updated)
    setIsProfileModalOpen(false)
    setToastMessage(`Profile parameters updated for ${updated.name}!`)
  }, [])

  // Handle Reset Profile
  const handleResetProfile = useCallback(() => {
    const defaultProf = resetSavedProfile()
    setProfile(defaultProf)
    setToastMessage(`Restored baseline student profile for ${defaultProf.name}.`)
  }, [])

  // Handle Roadmap Copy
  const handleCopyRoadmap = useCallback((careerTitle: string, markdown: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(markdown)
        .then(() => {
          setToastMessage(`12-week learning roadmap for "${careerTitle}" copied to clipboard!`)
        })
        .catch(() => {
          setToastMessage(`Roadmap generated for "${careerTitle}".`)
        })
    } else {
      setToastMessage(`Roadmap generated for "${careerTitle}".`)
    }
  }, [])

  // Handle selecting a career from DegreeMatrix or elsewhere
  const handleSelectCareerDirectly = useCallback(
    (career: Career) => {
      const match = allRankedMatches.find((m) => m.career.id === career.id)
      if (match) setSelectedMatch(match)
    },
    [allRankedMatches],
  )

  // Keyboard shortcut: Escape clears search if no modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedMatch && !isProfileModalOpen && !isIntakeWizardOpen && search) {
        setSearch('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMatch, isProfileModalOpen, isIntakeWizardOpen, search])

  return (
    <main className="app-shell">
      <Topbar
        profile={profile}
        onStartIntake={() => setIsIntakeWizardOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <Hero
        onStartIntake={() => setIsIntakeWizardOpen(true)}
        totalCareers={CAREERS_DATA.length}
        topMatchTitle={topMatch?.career.title}
        topMatchScore={topMatch?.overallScore}
        currentCurrency={currentCurrency}
        onChangeCurrency={setCurrentCurrency}
      />

      <ProfileBar
        profile={profile}
        matches={allRankedMatches}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onStartIntake={() => setIsIntakeWizardOpen(true)}
        onResetProfile={handleResetProfile}
      />

      {/* Degree Multiplier Matrix Showcase */}
      <DegreeMatrixShowcase
        onSelectCareer={handleSelectCareerDirectly}
        currentCurrency={currentCurrency}
      />

      {/* Explorer / Recommendations Section */}
      <section
        className="explorer-section"
        id={activeTab === 'recommendations' ? 'recommendations' : 'explore'}
        aria-labelledby="explorer-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">CAREER INTELLIGENCE EXPLORER</span>
            <h2 id="explorer-heading">
              {activeTab === 'recommendations'
                ? `Personalised Role Pathways for ${profile.name}`
                : 'Browse Complete Global Industry Tracks'}
            </h2>
            <p>
              {activeTab === 'recommendations'
                ? `Ranked using transparent scoring based on your ${profile.qualification} degree, ${profile.skills.length} skills, and target domain preferences.`
                : 'Inspect career opportunities across Finance, Capital Markets, FinTech, Supply Chain, Technology, and Product Strategy.'}
            </p>
          </div>

          <div className="tab-switcher" role="tablist" aria-label="Explorer View Mode">
            <button
              role="tab"
              aria-selected={activeTab === 'recommendations'}
              className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              ★ Top Matches ({allRankedMatches.filter((m) => m.overallScore >= 60).length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'all-catalog'}
              className={`tab-btn ${activeTab === 'all-catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('all-catalog')}
            >
              All Global Tracks ({CAREERS_DATA.length})
            </button>
          </div>
        </div>

        {/* Multi-Selection Filter Controls Bar */}
        <div className="filters-container">
          <div className="filters-multi-box">
            {/* Degree Multi-Select Row */}
            <div className="multi-filter-group">
              <span className="filter-group-title">
                Filter by Qualifications (Multiple Choices):
              </span>
              <div className="filter-pills-row">
                <button
                  type="button"
                  className={`filter-pill-opt ${selectedDegrees.length === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedDegrees([])}
                >
                  All Degrees
                </button>
                {DEGREE_OPTIONS.map((deg) => {
                  const isChecked = selectedDegrees.includes(deg)
                  return (
                    <button
                      key={deg}
                      type="button"
                      className={`filter-pill-opt ${isChecked ? 'active' : ''}`}
                      onClick={() => handleToggleDegreeFilter(deg)}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {deg}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Domain Multi-Select Row */}
            <div className="multi-filter-group">
              <span className="filter-group-title">
                Filter by Target Domains (Multiple Choices):
              </span>
              <div className="filter-pills-row">
                <button
                  type="button"
                  className={`filter-pill-opt ${selectedDomains.length === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedDomains([])}
                >
                  All Domains
                </button>
                {CAREER_DOMAINS_LIST.map((domain) => {
                  const isChecked = selectedDomains.includes(domain)
                  return (
                    <button
                      key={domain}
                      type="button"
                      className={`filter-pill-opt ${isChecked ? 'active' : ''}`}
                      onClick={() => handleToggleDomainFilter(domain)}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {domain}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search and Sort Row */}
            <div className="filters-search-sort-row">
              <div className="search-input-wrapper">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tracks, skills, or keywords (e.g. Capital Markets, Python, Supply Chain, Trading)..."
                  aria-label="Search tracks, domains, or skills"
                />
                {search && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearch('')}
                    aria-label="Clear search query"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="sort-wrapper">
                <label>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'score' | 'openings' | 'title')}
                  aria-label="Sort career pathways"
                >
                  <option value="score">Match Score (Highest First)</option>
                  <option value="openings">Verified Openings Count (Highest First)</option>
                  <option value="title">Career Title (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filters pill bar */}
          {(search || selectedDegrees.length > 0 || selectedDomains.length > 0) && (
            <div className="active-filters-bar">
              <span className="active-label">Active filters:</span>
              {selectedDegrees.map((deg) => (
                <span key={deg} className="filter-badge">
                  Degree: {deg}
                  <button onClick={() => handleToggleDegreeFilter(deg)} aria-label={`Remove ${deg}`}>
                    ×
                  </button>
                </span>
              ))}
              {selectedDomains.map((dom) => (
                <span key={dom} className="filter-badge">
                  Domain: {dom}
                  <button onClick={() => handleToggleDomainFilter(dom)} aria-label={`Remove ${dom}`}>
                    ×
                  </button>
                </span>
              ))}
              {search && (
                <span className="filter-badge">
                  Query: "{search}"
                  <button onClick={() => setSearch('')} aria-label="Clear search query">
                    ×
                  </button>
                </span>
              )}
              <button className="reset-all-link" onClick={handleClearAllFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count Heading */}
        <div className="results-heading">
          <h3>
            Matching Career Pathways <span>{displayedMatches.length}</span>
          </h3>
          <p>
            {selectedDegrees.length > 0
              ? `Filtered for: ${selectedDegrees.join(', ')}.`
              : 'Displaying comprehensive global trajectories.'}
          </p>
        </div>

        {/* Career Grid / Empty State */}
        {displayedMatches.length > 0 ? (
          <div className="career-grid">
            {displayedMatches.map((match) => (
              <CareerCard
                key={match.career.id}
                matchResult={match}
                currentCurrency={currentCurrency}
                onSelect={() => setSelectedMatch(match)}
                showMatchScore={activeTab === 'recommendations'}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status">
            <span className="empty-icon" aria-hidden="true">🔍</span>
            <h3>No matching pathways found</h3>
            <p>
              No career tracks match your specific combination of filters. Try clearing some selections or
              exploring the Degree Multiplier above.
            </p>
            <button className="primary-button empty-reset-btn" onClick={handleClearAllFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Skill Gap Analysis Section */}
      <SkillGapSection
        topMatches={allRankedMatches}
        currentCurrency={currentCurrency}
        onSelectCareer={handleSelectCareerDirectly}
      />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Footer */}
      <Footer
        onStartIntake={() => setIsIntakeWizardOpen(true)}
        onResetProfile={handleResetProfile}
      />

      {/* Career Details & Multiple Roadmaps Modal */}
      <CareerModal
        matchResult={selectedMatch}
        currentCurrency={currentCurrency}
        onClose={() => setSelectedMatch(null)}
        onCopyRoadmap={handleCopyRoadmap}
      />

      {/* Intake Wizard Modal */}
      {isIntakeWizardOpen && (
        <IntakeWizard
          isOpen={isIntakeWizardOpen}
          initialProfile={profile}
          onComplete={handleCompleteIntake}
          onClose={() => setIsIntakeWizardOpen(false)}
        />
      )}

      {/* Profile Parameters Editor Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          key={`${profile.name}-${profile.qualification}-${profile.skills.length}`}
          isOpen={isProfileModalOpen}
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </main>
  )
}

export default App
