import type { CurrencyCode, MatchResult } from '../types/career'

interface CareerCardProps {
  matchResult: MatchResult
  currentCurrency: CurrencyCode
  onSelect: () => void
  showMatchScore?: boolean
}

export function CareerCard({
  matchResult,
  currentCurrency,
  onSelect,
  showMatchScore = true,
}: CareerCardProps) {
  const { career, overallScore, matchTier, matchingSkills, missingSkills, customDegreeRationale } =
    matchResult

  const getTierClass = () => {
    switch (matchTier) {
      case 'Top Match':
        return 'tier-top'
      case 'Strong Fit':
        return 'tier-strong'
      default:
        return 'tier-viable'
    }
  }

  const liveLinkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    career.marketInsights.liveSearchQuery,
  )}`

  return (
    <article className="career-card" aria-labelledby={`career-${career.id}-title`}>
      <div className="career-card-top">
        <div className="career-icon-wrapper">
          <span className="career-icon" aria-hidden="true">✦</span>
          <span className="career-category">{career.category}</span>
        </div>
        <span className="openings-count-chip">
          {career.marketInsights.openingsCountGlobal}
        </span>
      </div>

      {showMatchScore && (
        <div className={`match-badge-bar ${getTierClass()}`}>
          <div className="match-score-text">
            <strong>{overallScore}% Match</strong>
            <span>• {matchTier}</span>
          </div>
          <div className="match-progress-track" aria-hidden="true">
            <div className="match-progress-fill" style={{ width: `${overallScore}%` }} />
          </div>
        </div>
      )}

      <h3 id={`career-${career.id}-title`}>{career.title}</h3>
      <p className="career-card-description">{career.description}</p>

      {/* Degree Fit Highlight */}
      {customDegreeRationale && (
        <div className="card-degree-rationale">
          <span className="degree-indicator">Degree Synergy:</span>
          <p>{customDegreeRationale}</p>
        </div>
      )}

      <div className="career-card-skills-section">
        <div className="skills-header-small">
          <span>Prerequisite Skills</span>
          {showMatchScore && (
            <small>
              {matchingSkills.length}/{career.skills.length} matched
            </small>
          )}
        </div>
        <div className="skill-list">
          {matchingSkills.map((skill) => (
            <span key={skill} className="skill-chip matched" title="You already have this skill">
              ✓ {skill}
            </span>
          ))}
          {missingSkills.map((skill) => (
            <span key={skill} className="skill-chip missing" title="Skill to develop">
              + {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="career-card-meta">
        <span className="salary-pill">{career.salary[currentCurrency]}</span>
        <span className="sources-cited-pill" title="Verified against LinkedIn Economic Graph & WEF">
          Sourced: WEF & LinkedIn
        </span>
      </div>

      <div className="card-actions-row">
        <button className="text-button" onClick={onSelect} type="button">
          Explore Multiple Roadmaps <span aria-hidden="true">→</span>
        </button>
        <a
          href={liveLinkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-openings-link"
          title="Auto-route directly to live job postings"
        >
          Live Openings ↗
        </a>
      </div>
    </article>
  )
}
