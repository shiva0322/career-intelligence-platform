import type { LearnerProfile } from '../types/career'

interface TopbarProps {
  profile: LearnerProfile
  onStartIntake: () => void
  onOpenProfile: () => void
}

export function Topbar({ profile, onStartIntake, onOpenProfile }: TopbarProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#home">
        <span className="brand-mark">CI</span>
        <span>Career Intelligence</span>
      </a>

      <nav aria-label="Main Navigation">
        <a href="#degree-matrix">Degree Multiplier</a>
        <a href="#recommendations">My Matches</a>
        <a href="#skill-gap">Skill Gap</a>
        <a href="#how-it-works">How It Works</a>
      </nav>

      <div className="topbar-actions">
        <button
          className="solve-confusion-btn"
          onClick={onStartIntake}
          type="button"
          title="Start interactive intake to resolve career confusion"
        >
          <span className="sparkle-icon">✨</span>
          <span>Solve Career Confusion</span>
        </button>

        <button
          className="profile-pill-button"
          onClick={onOpenProfile}
          title="Click to view and edit your profile parameters"
          aria-label={`Current profile: ${profile.name}, ${profile.qualification}. Click to edit.`}
        >
          <span className="profile-pill-avatar">{profile.name.charAt(0) || 'U'}</span>
          <span className="profile-pill-info">
            <strong>{profile.name}</strong>
            <small>{profile.qualification} • {profile.skills.length} skills</small>
          </span>
          <span className="profile-pill-edit-icon" aria-hidden="true">✎</span>
        </button>

        <span className="location-tag">Global Index • 2025/2026</span>
      </div>
    </header>
  )
}
