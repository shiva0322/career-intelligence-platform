interface FooterProps {
  onStartIntake: () => void
  onResetProfile: () => void
}

export function Footer({ onStartIntake, onResetProfile }: FooterProps) {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand-col">
          <a className="brand" href="#home">
            <span className="brand-mark">CI</span>
            <span>Career Intelligence</span>
          </a>
          <p>
            An explainable, multi-pathway career guidance engine engineered to solve degree confusion. Proving that finishing your degree provides opportunities to work across diverse global sectors.
          </p>
          <span className="footer-disclaimer">
            Data Intelligence Notice: Market openings counts, hiring velocities, and compensation indices are derived from the World Economic Forum (WEF) Future of Jobs Report, LinkedIn Economic Graph, and public labor statistics. Live links auto-route to public job searches on LinkedIn and Indeed.
          </span>
        </div>

        <div className="footer-links-col">
          <h4>Exploration Matrices</h4>
          <ul>
            <li><a href="#degree-matrix">Degree Multiplier Matrix</a></li>
            <li><a href="#recommendations">Personalised Matches</a></li>
            <li><a href="#explore">Global Industry Tracks</a></li>
            <li><a href="#skill-gap">Skill Gap Intelligence</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
          </ul>
        </div>

        <div className="footer-actions-col">
          <h4>Portal Intelligence Actions</h4>
          <p>Experiencing career direction confusion or want to re-evaluate your degree?</p>
          <button className="primary-button footer-intake-btn" onClick={onStartIntake} type="button">
            Take Intelligent Intake <span>✨</span>
          </button>
          <button className="ghost-button footer-reset-btn" onClick={onResetProfile} type="button">
            Reset to Baseline Student Profile
          </button>
          <a href="#home" className="back-to-top">
            ↑ Back to Top
          </a>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© 2026 Career Intelligence Platform • Global Market Edition</span>
        <span>Verified Multi-Track Degree Pathways • 100% Client-Side Intelligence</span>
      </div>
    </footer>
  )
}
