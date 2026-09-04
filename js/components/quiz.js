/**
 * Interactive Vedic Practice Quiz Engine
 * Adheres strictly to OCP: Dynamically pulls questions from all registered modules in VedicRegistry.
 */

class VedicQuizEngine {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.timerInterval = null;
    this.timeSeconds = 0;
    this.isAnswered = false;
  }

  startQuiz(filterModuleId = null) {
    if (!window.VedicRegistry) return;

    let pool = [];
    if (filterModuleId) {
      const mod = window.VedicRegistry.getModule(filterModuleId);
      if (mod && mod.practiceQuestions) {
        pool = mod.practiceQuestions.map(q => ({ ...q, moduleTitle: mod.title }));
      }
    } else {
      pool = window.VedicRegistry.getAllPracticeQuestions();
    }

    if (pool.length === 0) {
      alert('No practice questions available for this selection.');
      return;
    }

    // Shuffle questions
    this.questions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    this.currentIndex = 0;
    this.score = 0;
    this.timeSeconds = 0;
    this.isAnswered = false;

    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.renderQuestion();
      this.startTimer();
    }
  }

  closeQuiz() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timeSeconds = 0;
    const timerEl = this.modal.querySelector('#quiz-timer');
    this.timerInterval = setInterval(() => {
      this.timeSeconds++;
      const mins = Math.floor(this.timeSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timeSeconds % 60).toString().padStart(2, '0');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.renderCompletion();
      return;
    }

    this.isAnswered = false;
    const q = this.questions[this.currentIndex];
    const body = this.modal.querySelector('.quiz-modal-body');

    const progressPercent = Math.round(((this.currentIndex) / this.questions.length) * 100);

    body.innerHTML = `
      <div class="quiz-header-bar">
        <div class="quiz-badge-info">
          <span class="pill-badge">${q.moduleTitle || 'Vedic Maths'}</span>
          <span class="pill-badge sub">${q.techniqueUsed || 'Mental Math'}</span>
        </div>
        <div class="quiz-meta-stats">
          <span class="quiz-count">Question ${this.currentIndex + 1} of ${this.questions.length}</span>
          <span class="quiz-timer" id="quiz-timer">00:00</span>
        </div>
      </div>

      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>

      <div class="quiz-question-box">
        <h3 class="quiz-question-text">${q.question}</h3>
      </div>

      <div class="quiz-options-grid">
        ${q.options.map((opt, i) => `
          <button class="quiz-opt-btn" data-opt="${opt}">
            <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
            <span class="opt-text">${opt}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-box" style="display: none;"></div>

      <div class="quiz-footer-actions">
        <button class="btn btn-secondary" id="btn-quit-quiz">Quit</button>
        <button class="btn btn-primary" id="btn-next-quiz" style="display: none;">
          ${this.currentIndex === this.questions.length - 1 ? 'Finish Test' : 'Next Question'} →
        </button>
      </div>
    `;

    // Attach option listeners
    const optButtons = body.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isAnswered) return;
        this.submitAnswer(btn.dataset.opt, q);
      });
    });

    body.querySelector('#btn-quit-quiz').addEventListener('click', () => this.closeQuiz());
    const nextBtn = body.querySelector('#btn-next-quiz');
    nextBtn.addEventListener('click', () => {
      this.currentIndex++;
      this.renderQuestion();
    });
  }

  submitAnswer(selected, q) {
    this.isAnswered = true;
    const body = this.modal.querySelector('.quiz-modal-body');
    const optButtons = body.querySelectorAll('.quiz-opt-btn');
    const feedbackBox = body.querySelector('#quiz-feedback-box');
    const nextBtn = body.querySelector('#btn-next-quiz');

    const isCorrect = (selected === q.correctAnswer);
    if (isCorrect) {
      this.score++;
      // Increment user XP
      if (window.VedicApp && window.VedicApp.addXP) {
        window.VedicApp.addXP(20);
      }
    }

    optButtons.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.opt === q.correctAnswer) {
        btn.classList.add('correct');
      } else if (btn.dataset.opt === selected) {
        btn.classList.add('wrong');
      }
    });

    feedbackBox.style.display = 'block';
    feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackBox.innerHTML = `
      <div class="feedback-heading">
        <strong>${isCorrect ? '✨ Brilliant! That is correct!' : '❌ Not quite right'}</strong>
      </div>
      <div class="feedback-explanation">
        <strong>Vedic Shortcut:</strong> ${q.vedicTrickExplanation || 'Apply the sutra method for rapid calculation.'}
      </div>
    `;

    nextBtn.style.display = 'inline-flex';
  }

  renderCompletion() {
    clearInterval(this.timerInterval);
    const body = this.modal.querySelector('.quiz-modal-body');
    const accuracy = Math.round((this.score / this.questions.length) * 100);
    const earnedXP = this.score * 20;

    // Trigger app streak update
    if (window.VedicApp && window.VedicApp.recordPracticeSession) {
      window.VedicApp.recordPracticeSession(this.score, this.questions.length);
    }

    body.innerHTML = `
      <div class="quiz-complete-card">
        <div class="trophy-icon-wrap">🏆</div>
        <h2>Practice Completed!</h2>
        <p class="complete-subtitle">Great job strengthening your Vedic mental calculation speed!</p>

        <div class="complete-stats-row">
          <div class="c-stat-box">
            <span class="c-stat-num">${this.score} / ${this.questions.length}</span>
            <span class="c-stat-label">Score</span>
          </div>
          <div class="c-stat-box">
            <span class="c-stat-num">${accuracy}%</span>
            <span class="c-stat-label">Accuracy</span>
          </div>
          <div class="c-stat-box">
            <span class="c-stat-num">+${earnedXP}</span>
            <span class="c-stat-label">XP Gained</span>
          </div>
        </div>

        <div class="complete-actions">
          <button class="btn btn-secondary" id="btn-close-final">Back to Dashboard</button>
          <button class="btn btn-primary" id="btn-retry-quiz">Practice Again</button>
        </div>
      </div>
    `;

    body.querySelector('#btn-close-final').addEventListener('click', () => this.closeQuiz());
    body.querySelector('#btn-retry-quiz').addEventListener('click', () => this.startQuiz());
  }
}

window.VedicQuizEngine = VedicQuizEngine;
