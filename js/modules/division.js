/**
 * Vedic Maths Module: Division
 * Key Sutras:
 * 1. Paravartya Yojayet (Transpose and Apply/Adjust)
 * 2. Nikhilam Division (Division near bases)
 * 3. Dhvajanka (Flag Method of Division)
 */

(function() {
  const divisionModule = {
    id: 'division',
    title: 'Division',
    sanskritSutra: 'Paravartya Yojayet & Nikhilam',
    englishMeaning: 'Transpose and Adjust & Base Division',
    category: 'Vedic Mastery',
    level: 'Advanced',
    badgeColor: '#2980B9',
    icon: 'divide',
    duration: '3.0 hrs',
    lessonsCount: 10,
    completedLessons: 7,
    description: 'Solve complex division with 2-digit and 3-digit divisors without traditional scratch calculations using transposed signs and base complements.',
    techniques: [
      {
        id: 'paravartya-yojayet',
        name: 'Paravartya Yojayet',
        sanskritName: 'परावर्त्य योजयेत्',
        translation: 'Transpose and Adjust',
        summary: 'Divide by numbers whose digits are slightly above a base (like 11, 12, 112) by changing signs and performing progressive additions.',
        badgeColor: '#2980B9',
        example: {
          problem: '1234 ÷ 112 (Base 100)',
          steps: [
            'Divisor is 112. Base is 100. Surplus is +12.',
            'Transpose signs of surplus: -1, -2 (bar 1, bar 2).',
            'Split dividend 1234 into Quotient part (12) and Remainder part (34) since Base 100 has 2 zeroes.',
            'Bring down first digit 1. Multiply 1 by (-1, -2) and add to subsequent columns.',
            'Result: Quotient = 11, Remainder = 2'
          ],
          answer: 'Quotient = 11, Remainder = 2'
        }
      },
      {
        id: 'nikhilam-division',
        name: 'Nikhilam Division',
        sanskritName: 'निखिलं भागः',
        translation: 'Division by Base Deficiency',
        summary: 'Divide by divisors just below 10, 100, 1000 (such as 9, 8, 89, 98) where deficiency becomes a direct multiplier.',
        badgeColor: '#8E44AD',
        example: {
          problem: '231 ÷ 9 (Base 10)',
          steps: [
            'Base is 10. Divisor 9 has deficiency: 10 - 9 = 1.',
            'Split dividend: 23 | 1.',
            'Bring down 2 as first quotient digit.',
            'Multiply 2 by deficiency 1 = 2. Add to next digit (3 + 2 = 5). Next quotient digit is 5.',
            'Multiply 5 by 1 = 5. Add to remainder part (1 + 5 = 6).',
            'Quotient = 25, Remainder = 6'
          ],
          answer: 'Quotient = 25, Remainder = 6'
        }
      }
    ],
    solver: {
      id: 'division-by-9-solver',
      name: 'Nikhilam Division (Divisor 9) Solver',
      inputs: [
        { name: 'dividend', label: 'Enter Dividend (e.g. 231, 312)', default: 231, type: 'number' }
      ],
      solve: function(dividend) {
        const num = parseInt(dividend);
        if (isNaN(num) || num < 10) {
          return { error: 'Please enter a positive number with at least 2 digits.' };
        }

        const digits = num.toString().split('').map(Number);
        const steps = [];
        steps.push(`Solving <strong>${num} ÷ 9</strong> using <em>Nikhilam Division</em> (Deficiency = 1):`);

        let runningSum = 0;
        const quotientDigits = [];
        for (let i = 0; i < digits.length - 1; i++) {
          runningSum += digits[i];
          quotientDigits.push(runningSum);
          steps.push(`Position ${i + 1}: Quotient digit = <strong>${runningSum}</strong> (running sum)`);
        }

        const remainder = runningSum + digits[digits.length - 1];
        let finalQuotient = parseInt(quotientDigits.join(''), 10);
        let finalRemainder = remainder;

        steps.push(`Raw remainder calculation: ${runningSum} + ${digits[digits.length - 1]} = <strong>${remainder}</strong>`);

        if (finalRemainder >= 9) {
          const extra = Math.floor(finalRemainder / 9);
          finalQuotient += extra;
          finalRemainder = finalRemainder % 9;
          steps.push(`Adjust because remainder (${remainder}) ≥ 9: Add ${extra} to quotient, remainder becomes <strong>${finalRemainder}</strong>`);
        }

        steps.push(`Final Result: Quotient = <strong>${finalQuotient}</strong>, Remainder = <strong>${finalRemainder}</strong>`);

        return {
          answer: `Q: ${finalQuotient}, R: ${finalRemainder}`,
          steps: steps
        };
      }
    },
    practiceQuestions: [
      {
        question: 'What is the quotient and remainder when 241 is divided by 9 using Vedic addition?',
        options: ['Quotient: 26, Remainder: 7', 'Quotient: 25, Remainder: 8', 'Quotient: 26, Remainder: 6', 'Quotient: 27, Remainder: 1'],
        correctAnswer: 'Quotient: 26, Remainder: 7',
        techniqueUsed: 'Nikhilam Division',
        vedicTrickExplanation: 'Quotient digits: 2, (2+4=6) => 26. Remainder: 6 + 1 = 7. Result: Q=26, R=7.'
      },
      {
        question: 'In Paravartya Yojayet division, when the divisor is 112, what are the transposed values applied?',
        options: ['-1 and -2', '+1 and +2', '-1 and +2', '+1 and -2'],
        correctAnswer: '-1 and -2',
        techniqueUsed: 'Paravartya Yojayet',
        vedicTrickExplanation: 'Paravartya means "Transpose and Adjust" - surplus (+1, +2) becomes transposed negative values (-1, -2).'
      }
    ]
  };

  if (window.VedicRegistry) {
    window.VedicRegistry.registerModule(divisionModule);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.VedicRegistry.registerModule(divisionModule);
    });
  }
})();
