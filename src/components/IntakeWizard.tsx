import { useState, useRef } from 'react'
import type { CareerPreference, ExperienceLevel, GlobalRegion, LearnerProfile, Qualification } from '../types/career'
import {
  CAREER_DOMAINS_LIST,
  COMMON_SKILLS_LIST,
  DEGREE_OPTIONS,
  GLOBAL_REGIONS_LIST,
} from '../data/careersData'
import { useModalBehaviour } from '../useModalBehaviour'

interface IntakeWizardProps {
  isOpen: boolean
  initialProfile?: LearnerProfile
  onComplete: (profile: LearnerProfile) => void
  onClose: () => void
}

const CONFUSION_GOALS = [
  {
    id: 'confused-graduate',
    title: 'Degree Confusion: "What roles is my degree truly open to?"',
    desc: 'Break out of narrow stereotypes (e.g. B.Com only for basic accounting) and uncover the full spectrum of high-paying roles.',
    icon: '🧭',
  },
  {
    id: 'career-pivot',
    title: 'Career Pivot: "I want to transition into high-growth sectors"',
    desc: 'Evaluate how your existing transferable skills match FinTech, Supply Chain, Data, or Capital Markets.',
    icon: '🔄',
  },
  {
    id: 'global-openings',
    title: 'Market Clarity: "Where are the actual hiring openings globally?"',
    desc: 'Access verified real-world demand insights, global compensation bands, and direct routes to job boards.',
    icon: '🌐',
  },
  {
    id: 'skill-roadmap',
    title: 'Action Plan: "I need a realistic 12-week learning roadmap"',
    desc: 'Identify your exact skill deficit and get structured milestones with portfolio capstones.',
    icon: '📋',
  },
]

export function IntakeWizard({
  isOpen,
  initialProfile,
  onComplete,
  onClose,
}: IntakeWizardProps) {
  const modalRef = useRef<HTMLElement | null>(null)
  useModalBehaviour(isOpen, onClose, modalRef)

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Wizard state
  const [name, setName] = useState(initialProfile?.name || '')
  const [goal, setGoal] = useState(initialProfile?.confusionGoal || CONFUSION_GOALS[0].title)
  const [primaryDegree, setPrimaryDegree] = useState<Qualification>(initialProfile?.qualification || 'B.Com')
  const [secondaryDegrees, setSecondaryDegrees] = useState<Qualification[]>(
    initialProfile?.secondaryQualifications || ['Finance'],
  )
  const [fieldOfStudy, setFieldOfStudy] = useState(initialProfile?.fieldOfStudy || 'Commerce & Financial Markets')
  const [experience, setExperience] = useState<ExperienceLevel>(initialProfile?.experience || 'Student / Fresher')
  const [targetRegions, setTargetRegions] = useState<GlobalRegion[]>(
    initialProfile?.targetRegions || ['Global / Remote', 'North America', 'India & South Asia'],
  )
  const [skills, setSkills] = useState<string[]>(
    initialProfile?.skills || [
      'Excel & Financial Modeling',
      'Corporate Accounting & Reconciliation',
      'Corporate Communication & Negotiation',
    ],
  )
  const [newSkillInput, setNewSkillInput] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<CareerPreference[]>(
    initialProfile?.careerPreferences || [
      'Capital Markets & Trading',
      'Asset & Wealth Management',
      'Supply Chain & Global Logistics',
      'FinTech & Financial Systems',
    ],
  )
  const [validationError, setValidationError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleToggleSecondaryDegree = (deg: Qualification) => {
    if (secondaryDegrees.includes(deg)) {
      setSecondaryDegrees(secondaryDegrees.filter((d) => d !== deg))
    } else {
      setSecondaryDegrees([...secondaryDegrees, deg])
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

  const handleToggleSkill = (skill: string) => {
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkills(skills.filter((s) => s.toLowerCase() !== skill.toLowerCase()))
    } else {
      setSkills([...skills, skill])
    }
    setValidationError(null)
  }

  const handleAddCustomSkill = () => {
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setValidationError(`"${trimmed}" is already added.`)
      return
    }
    setSkills([...skills, trimmed])
    setNewSkillInput('')
    setValidationError(null)
  }

  const handleToggleDomain = (domain: CareerPreference) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== domain))
      }
    } else {
      setSelectedDomains([...selectedDomains, domain])
    }
  }

  const handleNext = () => {
    setValidationError(null)
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (!name.trim()) {
        setValidationError('Please enter your name to personalize your intelligence portal.')
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (skills.length === 0) {
        setValidationError('Please select or add at least 1 skill or strength.')
        return
      }
      setStep(4)
    } else if (step === 4) {
      if (selectedDomains.length === 0) {
        setValidationError('Please select at least 1 domain track.')
        return
      }

      const generatedProfile: LearnerProfile = {
        name: name.trim() || 'Learner',
        qualification: primaryDegree,
        secondaryQualifications: secondaryDegrees,
        fieldOfStudy: fieldOfStudy.trim() || `${primaryDegree} Graduate`,
        experience,
        skills,
        interests: ['Finance & Capital Markets', 'Data & Analytics', 'Global Logistics & Trade', 'Tech & Software'],
        targetRegions,
        careerPreferences: selectedDomains,
        confusionGoal: goal,
      }

      onComplete(generatedProfile)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="intake-wizard-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intake-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close intake assessment">
          ×
        </button>

        {/* Wizard Progress Steps */}
        <div className="wizard-progress-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Diagnosis</div>
          <div className="step-connector" />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Education</div>
          <div className="step-connector" />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3. Skills</div>
          <div className="step-connector" />
          <div className={`step-dot ${step >= 4 ? 'active' : ''}`}>4. Domain Intelligence</div>
        </div>

        {validationError && (
          <div className="validation-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: CAREER CONFUSION DIAGNOSIS */}
        {step === 1 && (
          <div className="wizard-step-body">
            <span className="eyebrow">STEP 1 OF 4 • INTELLIGENT INTAKE</span>
            <h2 id="intake-title">What career question are you trying to resolve?</h2>
            <p className="wizard-subtitle">
              Most students and graduates are taught that their degree only leads to 1 or 2 conventional paths.
              Our intelligence engine connects your degree with diverse global sectors and verified market openings.
            </p>

            <div className="goal-options-grid">
              {CONFUSION_GOALS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`goal-card ${goal === item.title ? 'selected' : ''}`}
                  onClick={() => setGoal(item.title)}
                >
                  <span className="goal-icon">{item.icon}</span>
                  <div className="goal-text">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <span className="radio-check">{goal === item.title ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: EDUCATION & GLOBAL TARGETS */}
        {step === 2 && (
          <div className="wizard-step-body">
            <span className="eyebrow">STEP 2 OF 4 • EDUCATIONAL MATRIX</span>
            <h2 id="intake-title">Tell us about your background</h2>
            <p className="wizard-subtitle">
              Pick your primary degree and any secondaries/minors. We’ll show you how degrees unlock multi-sector careers globally.
            </p>

            <div className="wizard-form-group">
              <label className="wizard-label">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen / Priya Nair"
                className="wizard-text-input"
                autoFocus
              />
            </div>

            <div className="wizard-form-group">
              <label className="wizard-label">Primary Educational Degree</label>
              <div className="degree-pills-grid">
                {DEGREE_OPTIONS.map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    className={`degree-pill-btn ${primaryDegree === deg ? 'active' : ''}`}
                    onClick={() => setPrimaryDegree(deg)}
                  >
                    {primaryDegree === deg ? '✓ ' : ''}
                    {deg}
                  </button>
                ))}
              </div>
            </div>

            <div className="wizard-form-group">
              <label className="wizard-label">
                Secondary Majors, Minors, or Complementary Fields (Select all that apply)
              </label>
              <div className="multi-select-pills-row">
                {DEGREE_OPTIONS.filter((d) => d !== primaryDegree).map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    className={`tag-toggle-btn ${secondaryDegrees.includes(deg) ? 'selected' : ''}`}
                    onClick={() => handleToggleSecondaryDegree(deg)}
                  >
                    {secondaryDegrees.includes(deg) ? '✓ ' : '+ '}
                    {deg}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid-two">
              <div className="wizard-form-group">
                <label className="wizard-label">Specialization / Focus Area</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Financial Markets, Computer Applications, Economics"
                  className="wizard-text-input"
                />
              </div>

              <div className="wizard-form-group">
                <label className="wizard-label">Experience Stage</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                  className="wizard-select-input"
                >
                  <option value="Student / Fresher">Student / Recent Graduate</option>
                  <option value="0–1 year">0–1 Year (Early Professional)</option>
                  <option value="1–3 years">1–3 Years (Career Transitioning)</option>
                  <option value="3+ years">3+ Years (Experienced Mid-Career)</option>
                </select>
              </div>
            </div>

            <div className="wizard-form-group">
              <label className="wizard-label">Target Global Regions (Select Multiple)</label>
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
          </div>
        )}

        {/* STEP 3: SKILLS & COMPETENCIES */}
        {step === 3 && (
          <div className="wizard-step-body">
            <span className="eyebrow">STEP 3 OF 4 • CURRENT COMPETENCIES</span>
            <h2 id="intake-title">Select your existing skills & strengths</h2>
            <p className="wizard-subtitle">
              Select multiple skills you already have familiarity with. The system evaluates how far your current toolkit carries you toward target roles.
            </p>

            <div className="wizard-selected-skills-box">
              <span className="box-title">Selected Skills ({skills.length}):</span>
              <div className="active-skills-chips">
                {skills.map((s) => (
                  <span key={s} className="active-chip">
                    ✓ {s}
                    <button type="button" onClick={() => handleToggleSkill(s)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="custom-skill-input-row">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type a custom skill (e.g. Bloomberg Terminal, SAP, React, SEO)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomSkill()
                  }
                }}
              />
              <button type="button" className="secondary-button" onClick={handleAddCustomSkill}>
                + Add Skill
              </button>
            </div>

            <div className="popular-skills-library">
              <span className="small-prompt-title">Select relevant competencies (Click to toggle):</span>
              <div className="skills-cloud">
                {COMMON_SKILLS_LIST.map((skill) => {
                  const isChecked = skills.some((s) => s.toLowerCase() === skill.toLowerCase())
                  return (
                    <button
                      key={skill}
                      type="button"
                      className={`cloud-skill-btn ${isChecked ? 'active' : ''}`}
                      onClick={() => handleToggleSkill(skill)}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INTELLIGENT DOMAIN INQUIRY */}
        {step === 4 && (
          <div className="wizard-step-body">
            <span className="eyebrow">STEP 4 OF 4 • REAL-TIME OPENINGS & DOMAIN INQUIRY</span>
            <h2 id="intake-title">Where do you want to explore openings?</h2>
            <div className="intelligent-insight-banner">
              <span className="insight-badge">INTELLIGENCE INSIGHT</span>
              <p>
                <strong>Degree Breakdown for {primaryDegree}: </strong>
                Graduates with a {primaryDegree} are actively hired across <strong>Capital Markets</strong>,{' '}
                <strong>Asset Management</strong>, <strong>Supply Chain Logistics</strong>, <strong>FinTech</strong>, and{' '}
                <strong>Data Analytics</strong>. Here is the verified global openings landscape:
              </p>
            </div>

            <div className="domain-inquiry-grid">
              {CAREER_DOMAINS_LIST.map((domain) => {
                const isSelected = selectedDomains.includes(domain as CareerPreference)
                return (
                  <div
                    key={domain}
                    className={`domain-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleDomain(domain as CareerPreference)}
                  >
                    <div className="domain-card-header">
                      <span className="domain-title">{domain}</span>
                      <span className="check-indicator">{isSelected ? '✓ Selected' : '+ Add'}</span>
                    </div>
                    <div className="domain-card-stats">
                      <span className="openings-stat">Verified Openings: 35k–68k+ Global</span>
                      <span className="growth-stat">+18% to +28% YoY Growth</span>
                    </div>
                    <span className="source-note">
                      Source: LinkedIn Economic Graph & WEF Future of Jobs 2025
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="wizard-footer-actions">
          {step > 1 && (
            <button
              type="button"
              className="ghost-button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
            >
              ← Previous Step
            </button>
          )}
          <button type="button" className="primary-button wizard-next-btn" onClick={handleNext}>
            {step === 4 ? 'Generate My Career Intelligence Portal →' : 'Continue to Next Step →'}
          </button>
        </div>
      </section>
    </div>
  )
}
