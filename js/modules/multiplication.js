/**
 * Vedic Maths Module: Multiplication
 * Key Sutras:
 * 1. Urdhva Tiryagbhyam (Vertically and Crosswise) - Universal multiplication
 * 2. Nikhilam Base Method - Fast multiplication near powers of 10
 * 3. Ekadhikena Purvena - Squares of numbers ending in 5
 * 4. Multiplication by 11 (Vedic sandwich addition)
 */

(function() {
  const multiplicationModule = {
    id: 'multiplication',
    title: 'Multiplication',
    sanskritSutra: 'Urdhva Tiryagbhyam & Nikhilam',
    englishMeaning: 'Vertically and Crosswise & All from 9, last from 10',
    category: 'Vedic Mastery',
    level: 'Intermediate',
    badgeColor: '#27AE60',
    icon: 'x-mark',
    duration: '3.5 hrs',
    lessonsCount: 14,
    completedLessons: 10,
    description: 'Calculate 2-digit and 3-digit products in seconds using the universal Vertically & Crosswise formula and near-base shortcuts.',
    techniques: [
      {
        id: 'urdhva-tiryagbhyam',
        name: 'Urdhva Tiryagbhyam',
        sanskritName: 'ऊर्ध्वतिर्यग्भ्याम्',
        translation: 'Vertically and Crosswise',
        summary: 'The master Vedic multiplication algorithm. Calculates 2x2 and 3x3 products in a single line using vertical and criss-cross multiplications.',
        badgeColor: '#27AE60',
        example: {
          problem: '23 × 14',
          steps: [
            'Step 1 (Right Vertical): 3 × 4 = 12. Write 2, carry 1.',
            'Step 2 (Crosswise sum): (2 × 4) + (3 × 1) + 1 (carry) = 8 + 3 + 1 = 12. Write 2, carry 1.',
            'Step 3 (Left Vertical): (2 × 1) + 1 (carry) = 3.',
            'Result: 322'
          ],
          answer: '322'
        }
      },
      {
        id: 'nikhilam-multiplication',
        name: 'Nikhilam Base Multiplication',
        sanskritName: 'निखिलं गुणनम्',
        translation: 'Deficiency / Surplus from Base 100, 1000',
        summary: 'Multiply numbers close to 100 (e.g. 96 × 93 or 104 × 107) mentally in two simple steps.',
        badgeColor: '#8E44AD',
        example: {
          problem: '97 × 94 (Base 100)',
          steps: [
            'Deficiencies: 97 is (-3), 94 is (-6).',
            'Left Hand Side: Cross-subtract: 97 - 6 = 91 (or 94 - 3 = 91).',
            'Right Hand Side: Multiply deficiencies: (-3) × (-6) = +18.',
            'Combine LHS and RHS: 9118'
          ],
          answer: '9118'
        }
      },
      {
        id: 'squaring-ends-5',
        name: 'Squares of Numbers Ending in 5',
        sanskritName: 'एकाधिकेन पूर्वेण वर्ग',
        translation: 'By one more than the previous for squares',
        summary: 'Instant square of any number ending in 5: Multiply the leading number by (itself + 1), and suffix 25.',
        badgeColor: '#C0392B',
        example: {
          problem: '75²',
          steps: [
            'Leading digit is 7. "One more than 7" is 8.',
            'Left part: 7 × 8 = 56.',
            'Right part: 5² = 25.',
            'Combine: 5,625'
          ],
          answer: '5,625'
        }
      },
      {
        id: 'multiply-by-11',
        name: 'Multiplication by 11',
        sanskritName: 'एकादश गुणनम्',
        translation: 'Sandwich addition between digits',
        summary: 'Split the digits of the number and insert their sum in the middle.',
        badgeColor: '#2980B9',
        example: {
          problem: '23 × 11',
          steps: [
            'Keep first digit: 2',
            'Middle digit: 2 + 3 = 5',
            'Keep last digit: 3',
            'Combined: 253'
          ],
          answer: '253'
        }
      }
    ],
    solver: {
      id: 'urdhva-solver',
      name: 'Urdhva Tiryagbhyam (2-Digit) Solver',
      inputs: [
        { name: 'num1', label: 'First 2-Digit Number (e.g. 23)', default: 23, type: 'number' },
        { name: 'num2', label: 'Second 2-Digit Number (e.g. 14)', default: 14, type: 'number' }
      ],
      solve: function(n1, n2) {
        const a = parseInt(n1);
        const b = parseInt(n2);
        if (isNaN(a) || isNaN(b) || a < 10 || a > 99 || b < 10 || b > 99) {
          return { error: 'Please enter two 2-digit numbers between 10 and 99.' };
        }

        const a1 = Math.floor(a / 10), a0 = a % 10;
        const b1 = Math.floor(b / 10), b0 = b % 10;

        const steps = [];
        steps.push(`Solving <strong>${a} × ${b}</strong> using <em>Urdhva Tiryagbhyam</em> (Vertically & Crosswise):`);
        
        // Step 1: Right vertical
        const step1Val = a0 * b0;
        const digit0 = step1Val % 10;
        const carry1 = Math.floor(step1Val / 10);
        steps.push(`<strong>Step 1 (Right Vertical):</strong> ${a0} × ${b0} = ${step1Val}. <br>→ Units digit: <strong>${digit0}</strong> ${carry1 > 0 ? `(Carry ${carry1})` : ''}`);

        // Step 2: Crosswise
        const crossSum = (a1 * b0) + (a0 * b1) + carry1;
        const digit1 = crossSum % 10;
        const carry2 = Math.floor(crossSum / 10);
        steps.push(`<strong>Step 2 (Crosswise & Add):</strong> (${a1} × ${b0}) + (${a0} × ${b1}) ${carry1 > 0 ? `+ ${carry1} (carry)` : ''} = ${crossSum}. <br>→ Tens digit: <strong>${digit1}</strong> ${carry2 > 0 ? `(Carry ${carry2})` : ''}`);

        // Step 3: Left vertical
        const leftVal = (a1 * b1) + carry2;
        steps.push(`<strong>Step 3 (Left Vertical):</strong> (${a1} × ${b1}) ${carry2 > 0 ? `+ ${carry2} (carry)` : ''} = <strong>${leftVal}</strong>`);

        const answer = a * b;
        steps.push(`Combine digits: <strong>${answer}</strong>`);

        return {
          answer: answer,
          steps: steps
        };
      }
    },
    practiceQuestions: [
      {
        question: 'Calculate 23 × 11 using the Vedic 11s shortcut:',
        options: ['253', '243', '263', '233'],
        correctAnswer: '253',
        techniqueUsed: 'Multiplication by 11',
        vedicTrickExplanation: 'Keep 2 and 3 at the ends, place their sum (2 + 3 = 5) in the middle: 253.'
      },
      {
        question: 'Calculate 85² using "Ekadhikena Purvena":',
        options: ['7,225', '7,125', '6,825', '7,325'],
        correctAnswer: '7,225',
        techniqueUsed: 'Squares ending in 5',
        vedicTrickExplanation: 'Leading digit 8 × (8 + 1) = 8 × 9 = 72. Suffix 25 => 7,225.'
      },
      {
        question: 'What is 98 × 96 using Nikhilam Base 100 method?',
        options: ['9,408', '9,508', '9,308', '9,418'],
        correctAnswer: '9,408',
        techniqueUsed: 'Nikhilam Base Multiplication',
        vedicTrickExplanation: 'Deficiencies: -2 and -4. LHS: 98 - 4 = 94. RHS: (-2) × (-4) = 08. Result: 9,408.'
      },
      {
        question: 'Using Urdhva Tiryagbhyam, multiply 31 × 23:',
        options: ['713', '723', '693', '733'],
        correctAnswer: '713',
        techniqueUsed: 'Urdhva Tiryagbhyam',
        vedicTrickExplanation: 'Step 1: 1×3=3. Step 2: (3×3)+(1×2)=11 (write 1, carry 1). Step 3: (3×2)+1=7 => 713.'
      }
    ]
  };

  if (window.VedicRegistry) {
    window.VedicRegistry.registerModule(multiplicationModule);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.VedicRegistry.registerModule(multiplicationModule);
    });
  }
})();
