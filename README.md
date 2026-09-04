# Vedic Maths Learning Platform 🪷

A modern, high-performance Vedic Mathematics e-learning platform architected strictly according to the **Open-Closed Principle (OCP)**. It matches the reference dashboard layout, integrates custom assets (Hero, Logo, Continue Learning), supports a warm **Dark & Light Mode**, and features interactive step-by-step sutra solvers and speed quizzes.

---

## 📸 Interface & Design System

The UI mirrors the reference dashboard:
- **Left Sidebar**:
  - Vedic brand logo, title, and tagline (*"Learn Faster. Calculate Smarter."*)
  - Active navigation pill with terracotta styling
  - Quick links to: Dashboard, Courses, Techniques, Practice, Tests, Progress, Resources, Profile, Logout
- **Header Topbar**:
  - View title
  - **Light / Dark Mode switch** (instant toggle with smooth CSS variable transitions and `localStorage` persistence)
  - Notification alert center
  - User profile badge (`Kalyani` • Level 4)
- **Dashboard Sections**:
  1. **Hero Card**: Greeting banner with girl studying illustration, floating mental math equations ($23 \times 11 = 253$, $9^2 = 81$), and "Continue Learning" CTA.
  2. **Today's Thought**: Inspirational Vedic wisdom quote with an authentic mandala SVG watermark.
  3. **4-Metric Stats Row**: Enrolled Courses (`6`), Completed Lessons (`32 of 85` with progress bar), Accuracy (`92%`), and Study Time (`18h 45m`).
  4. **Continue Learning Widget**: Abacus visual thumbnail, progress tracker (`60%`), and "Resume" action for *Lesson 5 • Vertical & Crosswise Multiplication*.
  5. **Top Techniques**: Quick access to *Urdhva Tiryagbhyam*, *Nikhilam Navatashcaramam Dashatah*, *Ekadhikena Purvena*, and *Paravartya Yojayet*.
  6. **Recent Activity Table**: Tabular history of practice tests and completed lessons with status badges.
  7. **Quick Practice Widget**: Daily 10 questions mixed speed test with XP rewards and streak counter.
  8. **Achievements & Streak Tracker**: Level 4 Vedic Learner with XP progression and 7-day flame streak.

---

## 🏛️ Open-Closed Principle (OCP) Architecture

> **"Software entities should be open for extension, but closed for modification."**

### How it works in this platform:
- The **Core System** (`js/registry.js`, `js/app.js`, `js/components/solver.js`, `js/components/quiz.js`) is completely decoupled from individual mathematical topics.
- All courses, techniques, step-by-step solvers, and practice questions are managed by `VedicRegistry`.
- Adding a brand new topic (such as **Trigonometry**, **Algebra**, or **Square Roots**) requires **ZERO changes** to `index.html`, `app.js`, `solver.js`, or `quiz.js`.

### Example: Adding a New Module in 2 Minutes
Simply create a new file (e.g. `js/modules/square-roots.js`) and register it:

```javascript
window.VedicRegistry.registerModule({
  id: 'square-roots',
  title: 'Vedic Square Roots & Duplex',
  sanskritSutra: 'Vilokanam & Dwandwa Yoga',
  englishMeaning: 'By Observation & Duplex Combination',
  category: 'Vedic Arithmetic',
  level: 'Intermediate',
  badgeColor: '#E67E22',
  description: 'Extract square roots of 4-digit and 5-digit numbers by inspection.',
  techniques: [
    {
      name: 'Duplex Method (Dwandwa Yoga)',
      sanskritName: 'द्वन्द्व योग',
      translation: 'Squaring and doubling combinations',
      summary: 'Find square roots in seconds using duplex values.'
    }
  ],
  solver: {
    name: 'Inspection Square Root Solver',
    inputs: [{ name: 'num', label: 'Perfect Square (e.g. 7225)', default: 7225, type: 'number' }],
    solve: function(n) {
      const root = Math.sqrt(n);
      return { answer: root, steps: [`Calculated square root of ${n} = ${root}`] };
    }
  },
  practiceQuestions: [
    {
      question: 'What is √7225 using the Vedic units inspection method?',
      options: ['85', '75', '95', '65'],
      correctAnswer: '85',
      vedicTrickExplanation: 'Ends in 25 so unit is 5. 72 is 8 × 9, so tens digit is 8. Root is 85!'
    }
  ]
});
```

Include `<script src="js/modules/square-roots.js"></script>` and it **automatically** appears in:
1. The **Courses Catalog**
2. The **Interactive Step-by-Step Solver** dropdown
3. The **Speed Practice Quiz** engine
4. The **Enrolled Courses** counter

---

## 🗂️ File Directory

```
Indian-Knowledge-System
├── index.html                           # Main web application structure
├── style.css                            # CSS variables (Light/Dark mode), layouts & responsive rules
├── README.md                            # Documentation & architecture explanation
├── assets/
│   └── mandala.svg                      # Geometric Vedic Mandala SVG watermark
└── js/
    ├── registry.js                      # Central OCP Module Registry
    ├── app.js                           # UI coordinator, theme toggle, view router, stats store
    ├── modules/
    │   ├── addition-subtraction.js      # Ekadhikena & Nikhilam base subtractions
    │   ├── multiplication.js            # Urdhva Tiryagbhyam & Base multiplication
    │   ├── division.js                  # Paravartya Yojayet & Nikhilam division
    │   ├── fractions.js                 # Crosswise fraction arithmetic without LCM
    │   └── trigonometry.js              # Bodhayana Sulba triples & angle ratios (OCP proof)
    └── components/
        ├── solver.js                    # Dynamic step-by-step sutra visualizer
        └── quiz.js                      # Speed practice quiz runner with XP & streak scoring
```

---

## 🚀 How to Run

### Method 1: Direct Browser Launch
Simply double click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Live Development Server
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```
Then visit `http://localhost:3000`.

### Method 3: Simply click in URL: https://kr0774673-blip.github.io/Indian-Knowledge-System/

