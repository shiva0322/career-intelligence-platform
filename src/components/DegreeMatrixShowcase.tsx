import { useState } from 'react'
import type { Career, CurrencyCode, Qualification } from '../types/career'
import { DEGREE_OPTIONS, CAREERS_DATA } from '../data/careersData'

interface DegreeMatrixShowcaseProps {
  onSelectCareer: (career: Career) => void
  currentCurrency: CurrencyCode
}

export function DegreeMatrixShowcase({
  onSelectCareer,
  currentCurrency,
}: DegreeMatrixShowcaseProps) {
  const [selectedDegree, setSelectedDegree] = useState<Qualification>('B.Com')

  // Find all careers open to this degree
  const eligibleCareers = CAREERS_DATA.filter((career) =>
    career.eligibility.includes(selectedDegree) || career.eligibility.includes('Other'),
  )

  return (
    <section className="degree-matrix-section" id="degree-matrix" aria-labelledby="degree-matrix-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">DEGREE MULTIPLIER INTELLIGENCE</span>
          <h2 id="degree-matrix-title">Where Can Your Degree Take You?</h2>
          <p>
            Break free from single-track assumptions. Select any degree below to reveal the diverse global
            industries, market openings, and career tracks it qualifies you to enter.
          </p>
        </div>
      </div>

      {/* Degree Selector Tabs */}
      <div className="matrix-degree-selector" role="tablist" aria-label="Select degree to explore tracks">
        {DEGREE_OPTIONS.map((deg) => (
          <button
            key={deg}
            type="button"
            role="tab"
            aria-selected={selectedDegree === deg}
            className={`matrix-tab-btn ${selectedDegree === deg ? 'active' : ''}`}
            onClick={() => setSelectedDegree(deg)}
          >
            {deg}
          </button>
        ))}
      </div>

      {/* Degree Banner with Fact */}
      <div className="matrix-highlight-banner">
        <div className="matrix-banner-text">
          <h3>
            {selectedDegree} Graduate Potential: <span>{eligibleCareers.length} High-Growth Sectors</span>
          </h3>
          <p>
            {selectedDegree === 'B.Com'
              ? 'A B.Com is not limited to standard accounting. It directly qualifies you for Capital Markets Trading, Private Wealth Management, Global Supply Chain Operations, Corporate Banking Underwriting, and FinTech Systems Analysis.'
              : selectedDegree === 'BA'
              ? 'Humanities and Arts graduates command high value across Enterprise Customer Success, International Talent Operations, Digital Growth Strategy, and Product Design Architecture.'
              : selectedDegree === 'BCA' || selectedDegree === 'B.Sc'
              ? 'Analytical and computing degrees directly open paths in Data & AI Analytics, Cloud Web Engineering, FinTech Business Systems, and Product Strategy.'
              : `Graduates with a ${selectedDegree} degree possess rigorous analytical frameworks, quantitative modeling, and systems thinking applicable across global industries.`}
          </p>
        </div>
        <div className="matrix-stat-badge">
          <span className="stat-big">{eligibleCareers.length}</span>
          <span className="stat-label">Diverse Roles Available</span>
        </div>
      </div>

      {/* Grid of diverse tracks for this degree */}
      <div className="matrix-careers-grid">
        {eligibleCareers.map((career) => {
          const rationale =
            career.whyDegreeFits[selectedDegree] || career.whyDegreeFits['Default']
          const liveUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
            career.marketInsights.liveSearchQuery,
          )}`

          return (
            <article key={career.id} className="matrix-career-card">
              <div className="matrix-card-header">
                <span className="matrix-category">{career.category}</span>
                <span className="matrix-openings-badge">
                  {career.marketInsights.openingsCountGlobal}
                </span>
              </div>

              <h4>{career.title}</h4>
              <p className="matrix-desc">{career.description}</p>

              <div className="matrix-rationale-box">
                <strong>Why {selectedDegree} fits this role:</strong>
                <p>{rationale}</p>
              </div>

              <div className="matrix-skills-row">
                <span className="skills-label">Core Prerequisites:</span>
                <div className="skill-list">
                  {career.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="matrix-salary-line">
                <span className="salary-label">Sample Compensation:</span>
                <strong>{career.salary[currentCurrency]}</strong>
              </div>

              <div className="matrix-card-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onSelectCareer(career)}
                >
                  View Roadmaps <span>→</span>
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-openings-link"
                  title="Auto-route to live verified job openings on LinkedIn"
                >
                  Inspect Live Openings ↗
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
