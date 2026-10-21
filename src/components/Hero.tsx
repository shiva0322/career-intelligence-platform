import heroArtwork from '../assets/hero.png'
import type { CurrencyCode } from '../types/career'

interface HeroProps {
  onStartIntake: () => void
  totalCareers: number
  topMatchTitle?: string
  topMatchScore?: number
  currentCurrency: CurrencyCode
  onChangeCurrency: (currency: CurrencyCode) => void
}

export function Hero({
  onStartIntake,
  totalCareers,
  topMatchTitle,
  topMatchScore,
  currentCurrency,
  onChangeCurrency,
}: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="eyebrow">GLOBAL CAREER INTELLIGENCE PLATFORM</span>
        <h1>
          Break degree stereotypes. Discover <span>where your education actually leads</span>.
        </h1>
        <p>
          Don’t let narrow traditional advice limit your future. A single degree qualifies you for 8+ distinct
          high-growth global sectors—from Capital Markets and Stock Trading to Supply Chain, FinTech, and AI Analytics.
        </p>

        <div className="hero-actions">
          <button className="primary-button hero-cta" onClick={onStartIntake} type="button">
            Solve My Career Confusion (Intelligent Intake) <span>→</span>
          </button>
          <a className="secondary-button" href="#degree-matrix">
            Explore Degree Pathways Matrix <span>↓</span>
          </a>
        </div>

        {/* Currency Switcher */}
        <div className="currency-selector-bar">
          <span className="currency-label">Global Compensation View:</span>
          <div className="currency-pills">
            {(['USD', 'INR', 'EUR', 'GBP'] as CurrencyCode[]).map((cur) => (
              <button
                key={cur}
                type="button"
                className={`currency-pill ${currentCurrency === cur ? 'active' : ''}`}
                onClick={() => onChangeCurrency(cur)}
              >
                {cur === 'USD' ? '$ USD' : cur === 'INR' ? '₹ INR' : cur === 'EUR' ? '€ EUR' : '£ GBP'}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-highlights">
          <div className="highlight-pill">
            <span className="highlight-dot" />
            <span>{totalCareers} High-Demand Global Tracks</span>
          </div>
          <div className="highlight-pill">
            <span className="highlight-dot" />
            <span>Multiple Roadmaps per Role</span>
          </div>
          <div className="highlight-pill">
            <span className="highlight-dot" />
            <span>Auto-Route to Live Openings</span>
          </div>
        </div>
      </div>

      <div className="hero-card" aria-hidden="true">
        <span className="mini-label">GLOBAL MARKET INTELLIGENCE</span>
        <div className="card-orbit orbit-one" />
        <div className="card-orbit orbit-two" />
        <span className="career-symbol">✦</span>
        <img src={heroArtwork} alt="" width="300" height="300" />
        <div className="hero-card-inner">
          {topMatchTitle ? (
            <>
              <div className="hero-card-match-badge">
                Top Recommendation: {topMatchScore}% Fit
              </div>
              <h2>{topMatchTitle}</h2>
              <p>Explore multiple roadmaps and verified openings.</p>
            </>
          ) : (
            <>
              <h2>Diverse Global Pathways</h2>
              <p>From degree confusion to verified career clarity.</p>
            </>
          )}
          <div className="path-pills">
            <span>Capital Markets</span>
            <span>Wealth Ops</span>
            <span>Supply Chain</span>
            <span>FinTech</span>
          </div>
        </div>
      </div>
    </section>
  )
}
