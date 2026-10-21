import { useState, useRef } from 'react'
import type { CurrencyCode, MatchResult } from '../types/career'
import { useModalBehaviour } from '../useModalBehaviour'

interface CareerModalProps {
  matchResult: MatchResult | null
  currentCurrency: CurrencyCode
  onClose: () => void
  onCopyRoadmap: (careerTitle: string, text: string) => void
}

export function CareerModal({
  matchResult,
  currentCurrency,
  onClose,
  onCopyRoadmap,
}: CareerModalProps) {
  const modalRef = useRef<HTMLElement | null>(null)
  useModalBehaviour(matchResult !== null, onClose, modalRef)

  const [activeRoadmapId, setActiveRoadmapId] = useState<string>('')

  if (!matchResult) return null

  const { career, overallScore, matchTier, breakdown, matchingSkills, missingSkills, explanation, customDegreeRationale } =
    matchResult

  const currentRoadmap =
    career.roadmaps.find((r) => r.id === activeRoadmapId) || career.roadmaps[0]

  const skillCoveragePct = Math.round(
    career.skills.length > 0 ? (matchingSkills.length / career.skills.length) * 100 : 0,
  )

  const liveLinkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    career.marketInsights.liveSearchQuery,
  )}`
  const liveIndeedUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(
    career.marketInsights.liveSearchQuery,
  )}`

  const handleCopy = () => {
    let markdown = `# Learning Roadmap: ${career.title}\n\n`
    markdown += `**Category:** ${career.category}\n`
    markdown += `**Track Chosen:** ${currentRoadmap.name} (${currentRoadmap.duration})\n`
    markdown += `**Match Score:** ${overallScore}% (${matchTier})\n\n`
    markdown += `## Real-World Openings & Sourced Insights:\n`
    markdown += `- Active Openings: ${career.marketInsights.openingsCountGlobal}\n`
    markdown += `- Growth Rate: ${career.marketInsights.growthRateYoY}\n`
    markdown += `- Top Hiring Hubs: ${career.marketInsights.topHiringHubs.join(', ')}\n\n`
    markdown += `## Skills to Build:\n`
    missingSkills.forEach((s) => {
      markdown += `- ${s}\n`
    })
    markdown += `\n## ${currentRoadmap.name} Phases:\n`
    currentRoadmap.phases.forEach((phase) => {
      markdown += `### ${phase.phase} (${phase.duration}) - ${phase.title}\n`
      phase.topics.forEach((t) => {
        markdown += `- ${t}\n`
      })
      markdown += `*Milestone:* ${phase.milestone}\n\n`
    })

    onCopyRoadmap(career.title, markdown)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="career-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-modal-title"
        aria-describedby="career-modal-desc"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          aria-label="Close pathway details"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <div className="modal-top-meta">
          <span className="eyebrow">{career.category}</span>
          <span className="demand-badge-modal">{career.demandLevel}</span>
          <span className="openings-pill-modal">
            {career.marketInsights.openingsCountGlobal}
          </span>
        </div>

        <h2 id="career-modal-title">{career.title}</h2>
        <p id="career-modal-desc" className="modal-lead-desc">
          {career.description}
        </p>

        {/* Real-Time Live Openings & Auto-Routing Bar */}
        <div className="live-openings-routing-bar">
          <div className="routing-info">
            <span className="live-pulse-dot" />
            <div>
              <strong>Live Market Demand: {career.marketInsights.openingsCountGlobal} ({career.marketInsights.growthRateYoY})</strong>
              <small>Hiring Hubs: {career.marketInsights.topHiringHubs.join(' • ')}</small>
            </div>
          </div>
          <div className="routing-actions">
            <a
              href={liveLinkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="route-btn linkedin"
              title="Auto-route directly to live job postings on LinkedIn"
            >
              Open on LinkedIn Jobs ↗
            </a>
            <a
              href={liveIndeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="route-btn indeed"
              title="Auto-route directly to live job postings on Indeed"
            >
              Open on Indeed ↗
            </a>
          </div>
        </div>

        {/* Verified Data Sources Disclosures */}
        <div className="data-sources-disclosure">
          <span className="sources-title">Verified Data Intelligence Sources:</span>
          <div className="sources-list">
            {career.marketInsights.sources.map((src) => (
              <span key={src.name} className="source-tag">
                📄 {src.name} ({src.year}): <em>{src.metric}</em>
              </span>
            ))}
          </div>
        </div>

        {/* Explainable Match Scoring Breakdown */}
        <div className="match-explanation-box">
          <div className="match-explanation-header">
            <div className="match-score-pill">
              <span className="score-value">{overallScore}%</span>
              <span className="score-tier">{matchTier}</span>
            </div>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <span className="item-label">Degree Alignment</span>
                <span className="item-value">{breakdown.qualificationScore}/35 pts</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Skill Overlap</span>
                <span className="item-value">{breakdown.skillScore}/35 pts</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Domain Preference</span>
                <span className="item-value">{breakdown.interestScore}/20 pts</span>
              </div>
              <div className="breakdown-item">
                <span className="item-label">Experience Stage</span>
                <span className="item-value">{breakdown.experienceScore}/10 pts</span>
              </div>
            </div>
          </div>

          <p className="match-rationale-text">
            <strong>Transparent Match Rationale: </strong>
            {explanation}
          </p>

          {customDegreeRationale && (
            <div className="degree-connection-callout">
              <strong>Why your degree prepares you for this role: </strong>
              <span>{customDegreeRationale}</span>
            </div>
          )}
        </div>

        {/* Day in the Life */}
        <div className="modal-section">
          <h3>Day in the Life</h3>
          <p className="day-in-life-text">{career.dayInTheLife}</p>
        </div>

        {/* Skill Gap Analysis */}
        <div className="modal-section">
          <div className="section-title-with-badge">
            <h3>Skill Gap Analysis</h3>
            <span className="coverage-badge">
              {skillCoveragePct}% Readiness ({matchingSkills.length}/{career.skills.length} skills)
            </span>
          </div>

          <div className="skill-gap-columns">
            <div className="skill-gap-card current">
              <h4>Skills You Already Have ({matchingSkills.length})</h4>
              {matchingSkills.length > 0 ? (
                <div className="skill-list">
                  {matchingSkills.map((s) => (
                    <span key={s} className="skill-chip matched">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-subtext">None of the core required skills found in your profile yet.</p>
              )}
            </div>

            <div className="skill-gap-card missing">
              <h4>Prerequisites to Acquire ({missingSkills.length})</h4>
              {missingSkills.length > 0 ? (
                <div className="skill-list">
                  {missingSkills.map((s) => (
                    <span key={s} className="skill-chip missing">
                      + {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-subtext positive">
                  Outstanding! You meet all core prerequisite skills for this role.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MULTIPLE ALTERNATIVE ROADMAPS */}
        <div className="modal-section">
          <div className="section-title-with-badge">
            <h3>Multiple Learning Pathways & Roadmaps</h3>
            <button className="copy-roadmap-btn" onClick={handleCopy} type="button">
              📋 Copy Current Roadmap
            </button>
          </div>
          <p className="roadmap-intro">
            Choose the pathway that matches your available time and career ambitions:
          </p>

          {/* Roadmap Variant Selector */}
          <div className="roadmap-tabs-row" role="tablist">
            {career.roadmaps.map((r) => {
              const isActive = r.id === currentRoadmap.id
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`roadmap-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveRoadmapId(r.id)}
                >
                  <span className="tab-name">{r.name}</span>
                  <span className="tab-duration">{r.duration}</span>
                </button>
              )
            })}
          </div>

          <p className="roadmap-variant-desc">{currentRoadmap.description}</p>

          <div className="roadmap-phases-list">
            {currentRoadmap.phases.map((phase, idx) => (
              <div key={phase.phase} className="roadmap-phase-card">
                <div className="phase-marker">
                  <span className="phase-num">0{idx + 1}</span>
                  <span className="phase-duration">{phase.duration}</span>
                </div>
                <div className="phase-body">
                  <span className="phase-eyebrow">{phase.phase}</span>
                  <h4>{phase.title}</h4>
                  <ul className="phase-topics-list">
                    {phase.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <div className="phase-milestone-box">
                    <strong>Milestone Deliverable: </strong>
                    <span>{phase.milestone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Certifications & Practical Next Steps */}
        <div className="modal-section">
          <h3>Globally Recognized Certifications</h3>
          <div className="skill-list">
            {career.suggestedCertifications.map((cert) => (
              <span key={cert} className="cert-pill">
                🎓 {cert}
              </span>
            ))}
          </div>
          <p className="pathway-text">{career.pathway}</p>
        </div>

        {/* Common Degree Eligibility */}
        <div className="modal-section">
          <h3>Commonly Open To Degrees</h3>
          <div className="skill-list">
            {career.eligibility.map((item) => (
              <span key={item} className="eligibility-pill-modal">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Global Compensation Note */}
        <div className="salary-note">
          <div className="salary-header-row">
            <strong>Sample Global Compensation ({currentCurrency}): </strong>
            <span className="salary-bold-val">{career.salary[currentCurrency]}</span>
          </div>
          <small>
            Benchmark indices derived from Glassdoor, BLS, and Robert Half Salary Guides. Actual offers depend on candidate experience, employer scale, and geographic region.
          </small>
        </div>

        <div className="modal-actions-footer">
          <a
            href={liveLinkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            Auto-Route to Live Openings ↗
          </a>
          <button className="primary-button" onClick={onClose} type="button">
            Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  )
}
