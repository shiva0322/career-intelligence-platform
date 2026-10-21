# Career Intelligence Platform

A comprehensive single-page career guidance and intelligence platform for learners and graduates across Tamil Nadu, India.
Personalize your educational background and skills, receive transparently ranked recommendations, identify skill gaps against real industry roles, and follow step-by-step 12-week learning roadmaps.

> **Prototype notice** — all career pathways, salary figures (e.g. ₹3–6 LPA), and eligibility lists in this project are illustrative sample data for demonstration and prototyping purposes. They are **not** verified recruitment postings, not an official determination of eligibility, and not a promise of employment.

---

## Key Features

- **Learner Profile Management** — configure your qualification (`B.Com`, `BBA`, `BCA`, `B.Sc`, `BA`, `Diploma`, `B.E./B.Tech`, `Other`), specialization, existing skills, career domain preferences, and location. Profile preferences are saved to `localStorage` with a 1-click "Reset to Demo" option.
- **Explainable Recommendation Engine** — transparent mathematical scoring model out of 100 points:
  - Educational qualification fit (max 35 pts)
  - Prerequisite skills overlap (max 35 pts)
  - Interest & career preferences alignment (max 20 pts)
  - Experience level suitability (max 10 pts)
  - Plain-language explanation generated for every recommendation.
- **Skill-Gap Intelligence** — compares your current skills with each career's requirements. Displays high-leverage skills that unlock the most job tracks in Tamil Nadu and calculates percentage readiness.
- **Prioritised 12-Week Roadmaps** — every career includes a 3-phase roadmap:
  - Phase 1: Core Foundations & Prerequisites (Weeks 1–4)
  - Phase 2: Applied Tooling & Workflows (Weeks 5–8)
  - Phase 3: Portfolio Projects & Interview Launch (Weeks 9–12)
  - Interactive "Copy Roadmap Summary" button to export learning plans.
- **Career Explorer with Multi-Dimensional Filtering** — live free-text search (matching titles, descriptions, and skills), qualification filter with quick-sync to profile, career field filter, and sorting by match score, market demand, or title.
- **Accessible & Responsive Design** — dialogs implement `role="dialog"` + `aria-modal`, trap tab focus, restore focus to triggers, close on Escape key or backdrop click, and lock background scrolling. Fully responsive on desktop, tablet, and mobile.
- **Visual System Derived from Hero Artwork** — authentic violet gradient ramp (`#975be6` → `#7c1cef` → `#380981`) sampled directly from [`src/assets/hero.png`](src/assets/hero.png), with seamless dark-mode support via CSS custom properties.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Pure CSS with Design Tokens & Native CSS Nesting (zero CSS framework bloat) |
| Linting | ESLint 10 + TypeScript ESLint |
| Testing | Node.js native test runner (`node --experimental-strip-types --test`) |
| Storage | LocalStorage with safe fallbacks and schema validation |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run automated tests (matching engine, catalog, filtering)
npm test

# 3. Start development server (runs on http://localhost:5173/)
npm run dev

# 4. Run type checks and production build
npm run build

# 5. Run ESLint checks
npm run lint

# 6. Preview production build locally
npm run preview
```

---

## Project Structure

```
.
├── index.html                     # HTML shell, metadata, Open Graph & Twitter tags
├── public/                        # Static assets (favicon.svg, icons.svg)
├── src/
│   ├── App.tsx                    # Main app orchestrator, state management, search/filters
│   ├── App.css                    # Component styles, responsive breakpoints, animations
│   ├── index.css                  # Design tokens, resets, dark-mode tokens
│   ├── main.tsx                   # React 19 DOM entry point
│   ├── useModalBehaviour.ts       # Accessible modal hook (Esc, focus trap, scroll lock)
│   ├── assets/
│   │   └── hero.png               # Brand hero artwork
│   ├── components/
│   │   ├── Topbar.tsx             # Header, navigation, profile pill button
│   │   ├── Hero.tsx               # Hero section, value proposition, artwork card
│   │   ├── ProfileBar.tsx         # Active learner summary banner & quick stats
│   │   ├── ProfileModal.tsx       # Profile editor modal with skills tag input
│   │   ├── CareerCard.tsx         # Pathway card with match score and skill chips
│   │   ├── CareerModal.tsx        # Pathway modal, score breakdown, 12-wk roadmap
│   │   ├── SkillGapSection.tsx    # High-impact skills & readiness overview
│   │   ├── HowItWorks.tsx         # 3-step structured guidance
│   │   ├── Footer.tsx             # Honest disclaimer, navigation, reset button
│   │   └── Toast.tsx              # Transient notification alert
│   ├── data/
│   │   ├── careersData.ts         # 12 detailed career records with 3-phase roadmaps
│   │   └── defaultProfile.ts      # Baseline student profile (B.Com, Coimbatore)
│   ├── types/
│   │   └── career.ts              # TypeScript interfaces for Profile, Career, MatchResult
│   └── utils/
│       ├── matchingAlgorithm.ts   # Transparent scoring logic and explanation generator
│       └── storage.ts             # Safe LocalStorage persistence
└── test/
    └── matching.test.ts           # Automated tests for matching, skill gap, and filters
```

---

## Verification & Testing

All unit tests run and pass cleanly using Node's native test runner:
- Correct skill matching with substring variations
- High match score calculation for aligned qualifications and skills
- Low score calculation for unaligned pathways
- Ranking careers descending by match percentage
- Accurate skill-gap identification (matching vs missing skills)
- 12 comprehensive career pathways with complete 3-phase roadmaps
- Filtering by educational qualification
- Keyword search across titles, categories, and required skills
- Domain category filtering

Execute `npm test` to verify.
Execute `npm run build && npm run lint` to verify TypeScript and lint checks.
