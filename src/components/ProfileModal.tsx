import { useRef, useState } from 'react'
import type { CareerPreference, ExperienceLevel, GlobalRegion, LearnerProfile, Qualification } from '../types/career'
import {
  CAREER_DOMAINS_LIST,
  COMMON_SKILLS_LIST,
  DEGREE_OPTIONS,
  GLOBAL_REGIONS_LIST,
} from '../data/careersData'
import { useModalBehaviour } from '../useModalBehaviour'

interface ProfileModalProps {
  isOpen: boolean
  profile: LearnerProfile
  onSave: (updated: LearnerProfile) => void
  onClose: () => void
}

const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'Student / Fresher',
  '0–1 year',
  '1–3 years',
  '3+ years',
]

export function ProfileModal({
  isOpen,
  profile,
  onSave,
  onClose,
}: ProfileModalProps) {
  const modalRef = useRef<HTMLElement | null>(null)
  useModalBehaviour(isOpen, onClose, modalRef)

  // Local form state
  const [name, setName] = useState(profile.name)
  const [qualification, setQualification] = useState<Qualification>(profile.qualification)
  const [secondaryQualifications, setSecondaryQualifications] = useState<Qualification[]>(
    profile.secondaryQualifications || [],
  )
  const [fieldOfStudy, setFieldOfStudy] = useState(profile.fieldOfStudy)
  const [experience, setExperience] = useState<ExperienceLevel>(profile.experience)
  const [targetRegions, setTargetRegions] = useState<GlobalRegion[]>(
    profile.targetRegions || ['Global / Remote', 'North America', 'India & South Asia'],
  )
  const [skills, setSkills] = useState<string[]>(profile.skills)
  const [preferences, setPreferences] = useState<CareerPreference[]>(profile.careerPreferences)

  const [newSkillInput, setNewSkillInput] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleToggleSecondaryDegree = (deg: Qualification) => {
    if (secondaryQualifications.includes(deg)) {
      setSecondaryQualifications(secondaryQualifications.filter((d) => d !== deg))
    } else {
      setSecondaryQualifications([...secondaryQualifications, deg])
    }
  }

  const handleToggleRegion = (reg: GlobalRegion) => {
    if (targetRegions.includes(reg)) {
      if (targetRegions.length > 1) {
        setTargetRegions(targetRegions.filter((r) => r !== reg))
      }
    } else {
      setTargetRegions([...targetRegions, reg])
    }
  }

  const handleAddCustomSkill = () => {
    const trimmed = newSkillInput.trim()
    if (!trimmed) return

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setValidationError(`"${trimmed}" is already in your skills list.`)
      return
    }

    setSkills([...skills, trimmed])
    setNewSkillInput('')
    setValidationError(null)
  }

  const handleTogglePopularSkill = (skill: string) => {
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkills(skills.filter((s) => s.toLowerCase() !== skill.toLowerCase()))
    } else {
      setSkills([...skills, skill])
    }
    setValidationError(null)
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleTogglePreference = (pref: CareerPreference) => {
    if (preferences.includes(pref)) {
      if (preferences.length > 1) {
        setPreferences(preferences.filter((p) => p !== pref))
      }
    } else {
      setPreferences([...preferences, pref])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setValidationError('Please enter your name.')
      return
    }
    if (skills.length === 0) {
      setValidationError('Please select or add at least one skill.')
      return
    }
    if (preferences.length === 0) {
      setValidationError('Please select at least one domain preference.')
      return
    }

    const updatedProfile: LearnerProfile = {
      name: name.trim(),
      qualification,
      secondaryQualifications,
      fieldOfStudy: fieldOfStudy.trim() || `${qualification} Graduate`,
      experience,
      targetRegions,
      skills,
      interests: profile.interests,
      careerPreferences: preferences,
      confusionGoal: profile.confusionGoal,
    }

    onSave(updatedProfile)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="profile-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-desc"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          aria-label="Close profile editor"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <div className="modal-header">
          <span className="eyebrow">CUSTOMIZE LEARNER PARAMETERS</span>
          <h2 id="profile-modal-title">Edit Your Career Profile Parameters</h2>
          <p id="profile-modal-desc">
            Update your qualifications, target regions, competencies, and sector preferences. The intelligence engine recalculates all matches instantly.
          </p>
        </div>

        {validationError && (
          <div className="validation-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid-two">
            <label className="form-field">
              <span>Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                required
              />
            </label>

            <label className="form-field">
              <span>Primary Qualification</span>
              <select
                value={qualification}
                onChange={(e) => setQualification(e.target.value as Qualification)}
              >
                {DEGREE_OPTIONS.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-section-box">
            <label className="section-label">
              <span>Secondary Degrees, Minors & Specializations (Multiple Selections)</span>
              <small>Degrees and coursework that expand your cross-disciplinary eligibility:</small>
            </label>
            <div className="multi-select-pills-row">
              {DEGREE_OPTIONS.filter((d) => d !== qualification).map((deg) => (
                <button
                  key={deg}
                  type="button"
                  className={`tag-toggle-btn ${secondaryQualifications.includes(deg) ? 'selected' : ''}`}
                  onClick={() => handleToggleSecondaryDegree(deg)}
                >
                  {secondaryQualifications.includes(deg) ? '✓ ' : '+ '}
                  {deg}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid-two">
            <label className="form-field">
              <span>Specialization / Focus Area</span>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Commerce, Computer Science, Finance"
              />
            </label>

            <label className="form-field">
              <span>Experience Level</span>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-section-box">
            <label className="section-label">
              <span>Target Global Markets (Multiple Selections)</span>
              <small>Regions where you want to benchmark openings and compensations:</small>
            </label>
            <div className="multi-select-pills-row">
              {GLOBAL_REGIONS_LIST.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  className={`tag-toggle-btn ${targetRegions.includes(reg) ? 'selected' : ''}`}
                  onClick={() => handleToggleRegion(reg)}
                >
                  {targetRegions.includes(reg) ? '✓ ' : '+ '}
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Management */}
          <div className="form-section-box">
            <label className="section-label">
              <span>Your Existing Skills & Strengths ({skills.length} selected)</span>
              <small>Competencies you already possess:</small>
            </label>

            <div className="active-skills-container" aria-label="Currently selected skills">
              {skills.map((skill) => (
                <span key={skill} className="editable-skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="custom-skill-input-row">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type a custom skill..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomSkill()
                  }
                }}
              />
              <button
                type="button"
                className="secondary-button add-skill-btn"
                onClick={handleAddCustomSkill}
              >
                + Add Skill
              </button>
            </div>

            <div className="popular-skills-prompt">
              <span className="small-prompt-title">Toggle common industry skills:</span>
              <div className="quick-add-pills">
                {COMMON_SKILLS_LIST.map((skill) => {
                  const isSelected = skills.some((s) => s.toLowerCase() === skill.toLowerCase())
                  return (
                    <button
                      key={skill}
                      type="button"
                      className={`quick-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleTogglePopularSkill(skill)}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Career Preferences */}
          <div className="form-section-box">
            <label className="section-label">
              <span>Target Career Domains ({preferences.length} selected)</span>
              <small>Select multiple industry verticals you want to evaluate:</small>
            </label>
            <div className="preference-pills-row">
              {CAREER_DOMAINS_LIST.map((pref) => {
                const active = preferences.includes(pref as CareerPreference)
                return (
                  <button
                    key={pref}
                    type="button"
                    className={`pref-pill ${active ? 'active' : ''}`}
                    onClick={() => handleTogglePreference(pref as CareerPreference)}
                  >
                    {active ? '✓ ' : '+ '}
                    {pref}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Parameters & Recalculate Matches <span>→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
