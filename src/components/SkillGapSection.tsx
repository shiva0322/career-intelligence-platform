import type { Career, CurrencyCode, MatchResult } from '../types/career'

interface SkillGapSectionProps {
  topMatches: MatchResult[]
  currentCurrency: CurrencyCode
  onSelectCareer: (career: Career) => void
}

export function SkillGapSection({
  topMatches,
  onSelectCareer,
}: SkillGapSectionProps) {
  const missingSkillFrequency: Record<string, number> = {}
  topMatches.slice(0, 5).forEach((match) => {
    match.missingSkills.forEach((skill) => {
      missingSkillFrequency[skill] = (missingSkillFrequency[skill] || 0) + 1
    })
  })

  const highImpactSkills = Object.entries(missingSkillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <section className="skill-gap-section" id="skill-gap" aria-labelledby="skill-gap-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SKILL GAP INTELLIGENCE</span>
          <h2 id="skill-gap-heading">Your Readiness & Highest-Leverage Cross-Domain Skills</h2>
          <p>
            Learn once, qualify for many. These high-leverage skills are shared across multiple high-demand
            global tracks—from Capital Markets and FinTech to Global Supply Chain.
          </p>
        </div>
      </div>

      {highImpactSkills.length > 0 && (
        <div className="high-impact-banner">
          <div className="impact-header">
            <span className="impact-icon">⚡</span>
            <div>
              <h3>High-Leverage Multi-Track Skills</h3>
              <p>
                Acquiring these specific competencies unlocks the highest number of simultaneous global job openings:
              </p>
            </div>
          </div>
          <div className="high-impact-pills">
            {highImpactSkills.map(([skill, count]) => (
              <div key={skill} className="high-impact-card">
                <span className="skill-name">{skill}</span>
                <span className="unlock-count">Unlocks {count} target role tracks</span>
                <small className="source-caption">Sourced: WEF Future of Jobs 2025</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="skill-gap-grid">
        {topMatches.slice(0, 3).map((match) => {
          const { career, overallScore, matchingSkills, missingSkills } = match
          const coveragePct = Math.round(
            career.skills.length > 0 ? (matchingSkills.length / career.skills.length) * 100 : 0,
          )

          const liveUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
            career.marketInsights.liveSearchQuery,
          )}`

          return (
            <div key={career.id} className="gap-analysis-card">
              <div className="gap-card-header">
                <div>
                  <span className="gap-card-cat">{career.category}</span>
                  <h4>{career.title}</h4>
                </div>
                <span className="gap-card-score">{overallScore}% Fit</span>
              </div>

              <div className="gap-openings-metric">
                <span className="pulse-indicator" />
                <span>{career.marketInsights.openingsCountGlobal} ({career.marketInsights.growthRateYoY})</span>
              </div>

              <div className="gap-metric-row">
                <span>Skill Readiness</span>
                <strong>{coveragePct}% ({matchingSkills.length}/{career.skills.length} skills)</strong>
              </div>
              <div className="gap-progress-bar">
                <div className="gap-progress-fill" style={{ width: `${coveragePct}%` }} />
              </div>

              <div className="gap-tags-block">
                <span className="tags-label">You already have:</span>
                <div className="skill-list">
                  {matchingSkills.length > 0 ? (
                    matchingSkills.map((s) => (
                      <span key={s} className="skill-chip matched">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="no-skills-text">Prerequisites to develop</span>
                  )}
                </div>
              </div>

              <div className="gap-tags-block">
                <span className="tags-label">Bridgeable skill gap:</span>
                <div className="skill-list">
                  {missingSkills.map((s) => (
                    <span key={s} className="skill-chip missing">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="gap-actions-row">
                <button
                  className="secondary-button view-roadmap-btn"
                  onClick={() => onSelectCareer(career)}
                  type="button"
                >
                  Inspect Roadmaps <span>→</span>
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-live-link"
                >
                  Live Openings ↗
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
