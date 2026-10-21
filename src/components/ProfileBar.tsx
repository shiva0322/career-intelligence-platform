import type { LearnerProfile, MatchResult } from '../types/career'

interface ProfileBarProps {
  profile: LearnerProfile
  matches: MatchResult[]
  onOpenProfile: () => void
  onStartIntake: () => void
  onResetProfile: () => void
}

export function ProfileBar({
  profile,
  matches,
  onOpenProfile,
  onStartIntake,
  onResetProfile,
}: ProfileBarProps) {
  const topMatchesCount = matches.filter((m) => m.matchTier === 'Top Match').length
  const strongMatchesCount = matches.filter((m) => m.matchTier === 'Strong Fit').length

  const allDegrees = [profile.qualification, ...(profile.secondaryQualifications || [])]

  return (
    <section className="profile-banner-section" aria-labelledby="profile-heading">
      <div className="profile-banner-card">
        <div className="profile-banner-main">
          <div className="profile-banner-identity">
            <span className="profile-avatar-large">{profile.name.charAt(0) || 'U'}</span>
            <div>
              <div className="profile-title-row">
                <h2 id="profile-heading">{profile.name}’s Career Intelligence Profile</h2>
                <div className="qualification-tags-cluster">
                  {allDegrees.map((deg) => (
                    <span key={deg} className="profile-qualification-tag">
                      {deg}
                    </span>
                  ))}
                </div>
              </div>
              <p className="profile-meta">
                <span>{profile.fieldOfStudy}</span> • <span>{profile.experience}</span> •{' '}
                <span>Regions: {profile.targetRegions.join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="profile-banner-actions">
            <button className="primary-button edit-btn" onClick={onStartIntake}>
              Retake Intelligent Intake <span aria-hidden="true">✨</span>
            </button>
            <button className="secondary-button" onClick={onOpenProfile}>
              Edit Parameters <span aria-hidden="true">✎</span>
            </button>
            <button
              className="ghost-button"
              onClick={onResetProfile}
              title="Reset profile back to baseline student demo"
            >
              Reset to Demo
            </button>
          </div>
        </div>

        {/* Confusion Goal Highlight */}
        {profile.confusionGoal && (
          <div className="confusion-goal-banner">
            <span className="goal-label">Selected Dilemma to Solve:</span>
            <p className="goal-text">“{profile.confusionGoal}”</p>
          </div>
        )}

        <div className="profile-banner-details">
          <div className="detail-group">
            <span className="detail-label">Your Current Competencies ({profile.skills.length}):</span>
            <div className="skill-pills-row">
              {profile.skills.map((skill) => (
                <span key={skill} className="skill-pill-active">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-group">
            <span className="detail-label">Target Industry Domains ({profile.careerPreferences.length}):</span>
            <div className="interest-pills-row">
              {profile.careerPreferences.map((pref) => (
                <span key={pref} className="interest-pill">
                  {pref}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-match-stats">
            <div className="match-stat-item">
              <span className="stat-number">{topMatchesCount}</span>
              <span className="stat-text">Top Matches (80%+)</span>
            </div>
            <div className="match-stat-item">
              <span className="stat-number">{strongMatchesCount}</span>
              <span className="stat-text">Strong Fits (60–79%)</span>
            </div>
            <div className="match-stat-item">
              <span className="stat-number">{matches.length}</span>
              <span className="stat-text">Global Tracks Analyzed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
