/**
 * Vedic Maths Module: Trigonometry (Open-Closed Principle Demonstration)
 * 
 * PROOF OF OCP:
 * This module was created independently without modifying ANY existing core code.
 * By simply registering with VedicRegistry, it automatically populates:
 * - Course list
 * - Interactive Step-by-Step Solver
 * - Speed Practice Quizzes
 * - Dashboard metrics
 */

(function() {
  const trigonometryModule = {
    id: 'trigonometry',
    title: 'Vedic Trigonometry & Triples',
    sanskritSutra: 'Bodhayana Sulba & Urdhva Tiryagbhyam',
    englishMeaning: 'Pythagorean Triples generation & Angle ratios',
    category: 'Vedic Geometry',
    level: 'Advanced',
    badgeColor: '#16A085',
    icon: 'triangle',
    duration: '4.0 hrs',
    lessonsCount: 12,
    completedLessons: 5,
    description: 'Construct rational right triangles, instantaneous Pythagorean triples, and solve trigonometric ratios mentally using ancient Sulba seed formulas.',
    techniques: [
      {
        id: 'sulba-pythagorean-triples',
        name: 'Bodhayana Sulba Triples',
        sanskritName: 'बोधायन शुल्ब सूत्रम्',
        translation: 'The diagonal chord produces both areas',
        summary: 'Generate infinite Pythagorean triples (a, b, c) instantly from any two integer seeds (m, n) where m > n using: a = m² - n², b = 2mn, c = m² + n².',
        badgeColor: '#16A085',
        example: {
          problem: 'Generate a right triangle triple from seeds m = 3, n = 2',
          steps: [
            'Base (a) = m² - n² = 3² - 2² = 9 - 4 = 5',
            'Perpendicular (b) = 2 × m × n = 2 × 3 × 2 = 12',
            'Hypotenuse (c) = m² + n² = 3² + 2² = 9 + 4 = 13',
            'Resulting Triple: (5, 12, 13) where 5² + 12² = 25 + 144 = 169 = 13²'
          ],
          answer: '(5, 12, 13)'
        }
      },
      {
        id: 'vedic-trig-ratios',
        name: 'Instant Trig Ratios from Seeds',
        sanskritName: 'त्रिकोणमिति अनुपात',
        translation: 'Trigonometric ratios without square roots',
        summary: 'Determine exact sin θ, cos θ, and tan θ for any rational angle directly from integer seeds: sin θ = 2mn/(m²+n²), cos θ = (m²-n²)/(m²+n²), tan θ = 2mn/(m²-n²).',
        badgeColor: '#2C3E50',
        example: {
          problem: 'Find exact sin θ, cos θ, tan θ for seed (m=4, n=1)',
          steps: [
            'm² - n² = 16 - 1 = 15',
            '2mn = 2 × 4 × 1 = 8',
            'm² + n² = 16 + 1 = 17',
            'sin θ = 8/17, cos θ = 15/17, tan θ = 8/15'
          ],
          answer: 'sin θ = 8/17, cos θ = 15/17, tan θ = 8/15'
        }
      }
    ],
    solver: {
      id: 'trig-triples-solver',
      name: 'Vedic Sulba Pythagorean Triple Solver',
      inputs: [
        { name: 'm', label: 'Seed Number m (e.g. 3)', default: 3, type: 'number' },
        { name: 'n', label: 'Seed Number n (must be < m, e.g. 2)', default: 2, type: 'number' }
      ],
      solve: function(mVal, nVal) {
        const m = parseInt(mVal);
        const n = parseInt(nVal);

        if (isNaN(m) || isNaN(n) || m <= n || n <= 0) {
          return { error: 'Please enter positive integers where m is strictly greater than n (m > n > 0).' };
        }

        const a = (m * m) - (n * n);
        const b = 2 * m * n;
        const c = (m * m) + (n * n);

        const steps = [];
        steps.push(`Applying Bodhayana Sulba Formula with seeds <strong>m = ${m}</strong> and <strong>n = ${n}</strong>:`);
        steps.push(`<strong>1. Base Side (a = m² - n²):</strong> ${m}² - ${n}² = ${m*m} - ${n*n} = <strong>${a}</strong>`);
        steps.push(`<strong>2. Perpendicular Side (b = 2mn):</strong> 2 × ${m} × ${n} = <strong>${b}</strong>`);
        steps.push(`<strong>3. Hypotenuse (c = m² + n²):</strong> ${m}² + ${n}² = ${m*m} + ${n*n} = <strong>${c}</strong>`);
        steps.push(`<strong>Verification:</strong> ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a + b*b} = ${c}² (${c*c}) ✓`);
        steps.push(`<strong>Exact Trig Ratios:</strong> sin θ = ${b}/${c}, cos θ = ${a}/${c}, tan θ = ${b}/${a}`);

        return {
          answer: `Triple: (${a}, ${b}, ${c}) | Hypotenuse = ${c}`,
          steps: steps
        };
      }
    },
    practiceQuestions: [
      {
        question: 'Using the Sulba seed formula with m=3 and n=2, what is the hypotenuse?',
        options: ['13', '15', '12', '11'],
        correctAnswer: '13',
        techniqueUsed: 'Bodhayana Sulba Triples',
        vedicTrickExplanation: 'Formula: c = m² + n² = 3² + 2² = 9 + 4 = 13.'
      },
      {
        question: 'What Pythagorean triple is produced by Vedic seeds m=4, n=3?',
        options: ['(7, 24, 25)', '(8, 15, 17)', '(5, 12, 13)', '(9, 40, 41)'],
        correctAnswer: '(7, 24, 25)',
        techniqueUsed: 'Bodhayana Sulba Triples',
        vedicTrickExplanation: 'a = 16 - 9 = 7; b = 2(4)(3) = 24; c = 16 + 9 = 25. Triple: (7, 24, 25).'
      },
      {
        question: 'In Vedic trigonometry, if a triple is (5, 12, 13), what is sin θ (where opposite is 12)?',
        options: ['12/13', '5/13', '12/5', '5/12'],
        correctAnswer: '12/13',
        techniqueUsed: 'Instant Trig Ratios',
        vedicTrickExplanation: 'sin θ = Perpendicular / Hypotenuse = 12 / 13.'
      }
    ]
  };

  if (window.VedicRegistry) {
    window.VedicRegistry.registerModule(trigonometryModule);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.VedicRegistry.registerModule(trigonometryModule);
    });
  }
})();
