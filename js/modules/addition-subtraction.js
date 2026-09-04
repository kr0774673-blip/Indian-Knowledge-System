/**
 * Vedic Maths Module: Addition & Subtraction
 * Key Sutras:
 * 1. Ekadhikena Purvena (By one more than previous) - Running dot additions
 * 2. Nikhilam Navatashcaramam Dashatah (All from 9 and last from 10) - Instant subtraction from bases (10, 100, 1000, etc.)
 */

(function() {
  const additionSubtractionModule = {
    id: 'addition-subtraction',
    title: 'Addition & Subtraction',
    sanskritSutra: 'Ekadhikena Purvena & Nikhilam',
    englishMeaning: 'By one more than the previous & All from 9, last from 10',
    category: 'Vedic Foundations',
    level: 'Beginner',
    badgeColor: '#E67E22',
    icon: 'plus-minus',
    duration: '2.5 hrs',
    lessonsCount: 8,
    completedLessons: 6,
    description: 'Master instantaneous mental subtraction from powers of 10 without borrowing, plus rapid columnar addition using Ekadhikena dots.',
    techniques: [
      {
        id: 'nikhilam-subtraction',
        name: 'Nikhilam Navatashcaramam Dashatah',
        sanskritName: 'निखिलं नवतश्चरमं दशतः',
        translation: 'All from 9 and the last from 10',
        summary: 'Subtract any number from powers of 10 (100, 1000, 10000) from left to right in one single step without carrying or borrowing.',
        badgeColor: '#E67E22',
        example: {
          problem: '1000 - 357',
          steps: [
            'Subtract the first digit (3) from 9 -> 9 - 3 = 6',
            'Subtract the middle digit (5) from 9 -> 9 - 5 = 4',
            'Subtract the last digit (7) from 10 -> 10 - 7 = 3',
            'Combine from left to right: 643'
          ],
          answer: '643'
        }
      },
      {
        id: 'ekadhikena-addition',
        name: 'Ekadhikena Purvena Addition',
        sanskritName: 'एकाधिकेन पूर्वेण',
        translation: 'By one more than the previous',
        summary: 'Add columns of numbers rapidly by placing a dot (representing 10) whenever the running sum hits or exceeds 10, carrying only single digits.',
        badgeColor: '#27AE60',
        example: {
          problem: '48 + 37',
          steps: [
            'Units column: 8 + 7 = 15. Drop a dot on the previous column and retain 5.',
            'Tens column: 4 + 3 + 1 (from dot) = 8.',
            'Result: 85'
          ],
          answer: '85'
        }
      }
    ],
    solver: {
      id: 'subtraction-solver',
      name: 'Nikhilam Base Subtraction Solver',
      inputs: [
        { name: 'base', label: 'Base Number (e.g. 1000, 10000)', default: 1000, type: 'number' },
        { name: 'subtrahend', label: 'Number to Subtract', default: 368, type: 'number' }
      ],
      solve: function(base, num) {
        const b = parseInt(base);
        const n = parseInt(num);
        if (isNaN(b) || isNaN(n) || n >= b || b < 10) {
          return { error: 'Please enter a valid base (10, 100, 1000...) greater than the number to subtract.' };
        }

        const numStr = n.toString().padStart(b.toString().length - 1, '0');
        const digits = numStr.split('').map(Number);
        const steps = [];
        const resultDigits = [];

        steps.push(`Applying Sutra: <em>Nikhilam Navatashcaramam Dashatah</em> ("All from 9, last from 10")`);
        steps.push(`Target problem: <strong>${b} - ${n}</strong>`);

        for (let i = 0; i < digits.length; i++) {
          const isLast = (i === digits.length - 1);
          const subBase = isLast ? 10 : 9;
          const diff = subBase - digits[i];
          resultDigits.push(diff);
          steps.push(`Position ${i + 1} (${isLast ? 'Last digit from 10' : 'From 9'}): ${subBase} - ${digits[i]} = <strong>${diff}</strong>`);
        }

        const answer = parseInt(resultDigits.join(''), 10);
        steps.push(`Combine digits left to right: <strong>${answer}</strong>`);

        return {
          answer: answer,
          steps: steps
        };
      }
    },
    practiceQuestions: [
      {
        question: 'Calculate 10,000 - 4,728 using "All from 9 and last from 10":',
        options: ['5,272', '5,382', '5,282', '6,272'],
        correctAnswer: '5,272',
        techniqueUsed: 'Nikhilam Navatashcaramam Dashatah',
        vedicTrickExplanation: '9-4=5, 9-7=2, 9-2=7, 10-8=2 => 5,272 in a single glance!'
      },
      {
        question: 'What is 1,000 - 684 using Vedic mental subtraction?',
        options: ['326', '316', '416', '318'],
        correctAnswer: '316',
        techniqueUsed: 'Nikhilam Navatashcaramam Dashatah',
        vedicTrickExplanation: 'From left: 9-6 = 3, 9-8 = 1, 10-4 = 6. Combined: 316.'
      },
      {
        question: 'What is 100,000 - 83,415?',
        options: ['16,585', '17,585', '16,595', '26,585'],
        correctAnswer: '16,585',
        techniqueUsed: 'Nikhilam Navatashcaramam Dashatah',
        vedicTrickExplanation: '9-8=1, 9-3=6, 9-4=5, 9-1=8, 10-5=5 => 16,585.'
      }
    ]
  };

  if (window.VedicRegistry) {
    window.VedicRegistry.registerModule(additionSubtractionModule);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.VedicRegistry.registerModule(additionSubtractionModule);
    });
  }
})();
