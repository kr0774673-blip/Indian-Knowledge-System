/**
 * Vedic Maths Module: Fractions
 * Key Sutras:
 * 1. Urdhva Tiryagbhyam (Vertically and Crosswise) for LCM-free Fraction Addition & Subtraction
 * 2. Cross-multiplication Comparison for quick fraction ranking
 */

(function() {
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  const fractionsModule = {
    id: 'fractions',
    title: 'Fractions',
    sanskritSutra: 'Urdhva Tiryagbhyam & Vyashti Samashti',
    englishMeaning: 'Vertically & Crosswise applied to Rational Fractions',
    category: 'Vedic Foundations',
    level: 'Beginner',
    badgeColor: '#8E44AD',
    icon: 'pie-chart',
    duration: '2.0 hrs',
    lessonsCount: 6,
    completedLessons: 4,
    description: 'Add, subtract, and compare rational fractions instantly in a single crosswise step without computing cumbersome Least Common Multiples (LCM).',
    techniques: [
      {
        id: 'cross-addition-fractions',
        name: 'Vedic Cross Fraction Addition',
        sanskritName: 'ऊर्ध्वतिर्यग्भ्यां भिन्नम्',
        translation: 'Cross-multiplication of numerator and denominator',
        summary: 'To calculate (a/b) + (c/d), cross-multiply numerator and denominator (a*d + b*c) for the numerator, and multiply denominators (b*d) directly.',
        badgeColor: '#8E44AD',
        example: {
          problem: '2/5 + 3/7',
          steps: [
            'Crosswise 1: 2 × 7 = 14',
            'Crosswise 2: 3 × 5 = 15',
            'Numerator = 14 + 15 = 29',
            'Denominator = 5 × 7 = 35',
            'Result: 29/35'
          ],
          answer: '29/35'
        }
      },
      {
        id: 'fraction-comparison',
        name: 'Instant Cross-Comparison',
        sanskritName: 'तुलना सूत्रम्',
        translation: 'Quick cross comparative check',
        summary: 'Compare two fractions a/b and c/d by checking if (a * d) is greater than, equal to, or less than (b * c).',
        badgeColor: '#D35400',
        example: {
          problem: 'Which is larger: 5/7 or 7/10?',
          steps: [
            'Compute 5 × 10 = 50',
            'Compute 7 × 7 = 49',
            'Since 50 > 49, 5/7 is strictly greater than 7/10.'
          ],
          answer: '5/7 > 7/10'
        }
      }
    ],
    solver: {
      id: 'fraction-solver',
      name: 'Vedic Fraction Addition & Subtraction',
      inputs: [
        { name: 'num1', label: 'Numerator 1 (a)', default: 3, type: 'number' },
        { name: 'den1', label: 'Denominator 1 (b)', default: 4, type: 'number' },
        { name: 'op', label: 'Operation (+ or -)', default: '+', type: 'text' },
        { name: 'num2', label: 'Numerator 2 (c)', default: 2, type: 'number' },
        { name: 'den2', label: 'Denominator 2 (d)', default: 5, type: 'number' }
      ],
      solve: function(n1, d1, op, n2, d2) {
        const a = parseInt(n1), b = parseInt(d1);
        const c = parseInt(n2), d = parseInt(d2);
        const isSub = (op && op.trim() === '-');

        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || b === 0 || d === 0) {
          return { error: 'Please enter valid non-zero denominators.' };
        }

        const steps = [];
        steps.push(`Computing <strong>${a}/${b} ${isSub ? '-' : '+'} ${c}/${d}</strong> using Vedic Cross-Multiplication:`);

        const p1 = a * d;
        const p2 = c * b;
        steps.push(`<strong>Cross 1 (Left Numerator × Right Denominator):</strong> ${a} × ${d} = ${p1}`);
        steps.push(`<strong>Cross 2 (Right Numerator × Left Denominator):</strong> ${c} × ${b} = ${p2}`);

        const top = isSub ? (p1 - p2) : (p1 + p2);
        steps.push(`<strong>New Numerator:</strong> ${p1} ${isSub ? '-' : '+'} ${p2} = <strong>${top}</strong>`);

        const bottom = b * d;
        steps.push(`<strong>Vertical Denominator:</strong> ${b} × ${d} = <strong>${bottom}</strong>`);

        const common = gcd(top, bottom);
        const simplifiedTop = top / common;
        const simplifiedBottom = bottom / common;

        const rawResult = `${top}/${bottom}`;
        let finalResult = rawResult;
        if (common > 1) {
          finalResult = `${simplifiedTop}/${simplifiedBottom}`;
          steps.push(`Simplifying by GCD (${common}): <strong>${finalResult}</strong>`);
        } else {
          steps.push(`Final Answer: <strong>${finalResult}</strong>`);
        }

        return {
          answer: finalResult,
          steps: steps
        };
      }
    },
    practiceQuestions: [
      {
        question: 'Calculate 3/4 + 2/5 without using LCM:',
        options: ['23/20', '5/9', '21/20', '19/20'],
        correctAnswer: '23/20',
        techniqueUsed: 'Vedic Cross Fraction Addition',
        vedicTrickExplanation: 'Cross multiply: (3×5) + (4×2) = 15 + 8 = 23. Bottom: 4×5 = 20. Result: 23/20.'
      },
      {
        question: 'Which fraction is greater: 4/9 or 5/11?',
        options: ['5/11', '4/9', 'They are equal', 'Cannot determine'],
        correctAnswer: '5/11',
        techniqueUsed: 'Instant Cross-Comparison',
        vedicTrickExplanation: 'Cross products: 4×11 = 44 vs 9×5 = 45. Since 45 > 44, 5/11 is greater.'
      }
    ]
  };

  if (window.VedicRegistry) {
    window.VedicRegistry.registerModule(fractionsModule);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.VedicRegistry.registerModule(fractionsModule);
    });
  }
})();
