export type Qualification =
  | 'B.Com'
  | 'BBA'
  | 'BCA'
  | 'B.Sc'
  | 'BA'
  | 'Diploma'
  | 'B.E./B.Tech'
  | 'Economics'
  | 'Finance'
  | 'Other'

export type ExperienceLevel =
  | 'Student / Fresher'
  | '0–1 year'
  | '1–3 years'
  | '3+ years'

export type GlobalRegion =
  | 'Global / Remote'
  | 'North America'
  | 'Europe & UK'
  | 'Asia-Pacific'
  | 'India & South Asia'
  | 'Middle East'

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP'

export type CareerPreference =
  | 'Capital Markets & Trading'
  | 'Asset & Wealth Management'
  | 'Corporate Banking & Credit'
  | 'Supply Chain & Global Logistics'
  | 'FinTech & Financial Systems'
  | 'Analytical & Data'
  | 'Operations & Management'
  | 'Tech & Software'
  | 'Customer & Business'
  | 'Marketing & Creative'
  | 'People & HR'
  | 'Healthcare & Administration'

export interface LearnerProfile {
  name: string
  qualification: Qualification
  secondaryQualifications?: Qualification[]
  fieldOfStudy: string
  skills: string[]
  interests: string[]
  experience: ExperienceLevel
  targetRegions: GlobalRegion[]
  careerPreferences: CareerPreference[]
  confusionGoal?: string
}

export interface RoadmapPhase {
  phase: string
  duration: string
  title: string
  topics: string[]
  milestone: string
}

export interface RoadmapVariant {
  id: string
  name: string // e.g. "Fast-Track Industry Entry", "Global Certified Specialist", "Non-Traditional Transition"
  duration: string // e.g. "8–10 Weeks", "16–20 Weeks"
  description: string
  phases: RoadmapPhase[]
}

export interface DataSourceCitation {
  name: string // e.g. "LinkedIn Economic Graph", "World Economic Forum Future of Jobs", "Bureau of Labor Statistics"
  year: number | string
  metric: string
  url?: string
}

export interface JobMarketInsights {
  openingsCountGlobal: string // e.g. "48,200+ Active Roles"
  growthRateYoY: string // e.g. "+22% YoY"
  hiringVelocity: 'Very High' | 'High' | 'Steady'
  topHiringHubs: string[]
  sources: DataSourceCitation[]
  liveSearchQuery: string // Query term to search on live job boards
}

export interface SalaryByCurrency {
  USD: string
  INR: string
  EUR: string
  GBP: string
}

export interface Career {
  id: string
  title: string
  category: string
  domain: CareerPreference
  description: string
  skills: string[]
  eligibility: Qualification[]
  fieldsOfStudy: string[]
  interests: string[]
  salary: SalaryByCurrency
  demandLevel: 'High Growth' | 'Steady Demand' | 'Emerging'
  dayInTheLife: string
  pathway: string
  roadmaps: RoadmapVariant[]
  suggestedCertifications: string[]
  marketInsights: JobMarketInsights
  whyDegreeFits: Record<string, string> // Custom explanation per degree (e.g. why B.Com fits Asset Management)
}

export interface MatchScoreBreakdown {
  qualificationScore: number // max 35
  skillScore: number // max 35
  interestScore: number // max 20
  experienceScore: number // max 10
}

export interface MatchResult {
  career: Career
  overallScore: number // 0-100
  breakdown: MatchScoreBreakdown
  matchingSkills: string[]
  missingSkills: string[]
  matchTier: 'Top Match' | 'Strong Fit' | 'Viable Transition'
  explanation: string
  qualificationMatch: 'exact' | 'transferable' | 'alternative'
  customDegreeRationale?: string
}
