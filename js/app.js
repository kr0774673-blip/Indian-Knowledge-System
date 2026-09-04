/**
 * Main Application Coordinator for Vedic Maths Learning Platform
 * Manages:
 * - Theme Switcher (Dark / Light mode) with localStorage persistence
 * - Open-Closed Principle (OCP) Dynamic View Rendering
 * - Single Page Router (Dashboard, Courses, Techniques/Solver, Practice, Tests, Progress, Resources)
 * - User XP, Streak, and Activity State
 */

class VedicAppCoordinator {
  constructor() {
    this.currentView = 'dashboard';
    this.userState = this.loadUserState();
    this.solverComponent = null;
    this.quizEngine = null;
  }

  init() {
    this.initTheme();
    this.initRouter();
    this.initComponents();
    this.navigateTo(this.currentView);
    this.bindGlobalEvents();

    // Listen to OCP Registry extensions
    if (window.VedicRegistry) {
      window.VedicRegistry.subscribe((event, data) => {
        console.log(`[VedicApp] Received event: ${event}`, data);
        this.updateDynamicCounters();
        if (this.currentView === 'courses') {
          this.renderCoursesView();
        }
      });
    }

    console.log('[VedicApp] Initialized successfully.');
  }

  renderCurrentView() {
    this.navigateTo(this.currentView);
  }

  loadUserState() {
    const saved = localStorage.getItem('vedic_user_state');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      name: 'Kalyani',
      level: 4,
      title: 'Vedic Learner',
      xp: 680,
      xpTarget: 1000,
      streakDays: 7,
      completedLessons: 32,
      totalLessons: 85,
      accuracy: 92,
      studyTime: '18h 45m',
      recentActivities: [
        { topic: 'Multiplication using Urdhva Tiryagbhyam', type: 'Practice', score: '9 / 10', date: 'May 20, 2024' },
        { topic: 'Squares of numbers ending with 5', type: 'Lesson', score: 'Completed', date: 'May 19, 2024' },
        { topic: 'Division using Nikhilam', type: 'Practice', score: '8 / 10', date: 'May 18, 2024' },
        { topic: 'Introduction to Vedic Maths', type: 'Lesson', score: 'Completed', date: 'May 17, 2024' }
      ]
    };
  }

  saveUserState() {
    localStorage.setItem('vedic_user_state', JSON.stringify(this.userState));
    this.updateUserUI();
  }

  addXP(amount) {
    this.userState.xp += amount;
    if (this.userState.xp >= this.userState.xpTarget) {
      this.userState.level += 1;
      this.userState.xp = this.userState.xp - this.userState.xpTarget;
      this.userState.xpTarget = Math.round(this.userState.xpTarget * 1.3);
      this.showToast(`🎉 Level Up! You reached Level ${this.userState.level}!`);
    }
    this.saveUserState();
  }

  recordPracticeSession(score, total) {
    const accuracy = Math.round((score / total) * 100);
    this.userState.accuracy = Math.round((this.userState.accuracy * 0.7) + (accuracy * 0.3));
    this.userState.recentActivities.unshift({
      topic: 'Vedic Quick Practice',
      type: 'Practice',
      score: `${score} / ${total}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    if (this.userState.recentActivities.length > 6) {
      this.userState.recentActivities.pop();
    }
    this.saveUserState();
    this.renderRecentActivities();
  }

  /* -------------------------------------------------------------
     THEME MANAGEMENT (Dark / Light Mode)
  ------------------------------------------------------------- */
  initTheme() {
    const savedTheme = localStorage.getItem('vedic_theme') || 'light';
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vedic_theme', theme);

    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  /* -------------------------------------------------------------
     ROUTER & VIEWS
  ------------------------------------------------------------- */
  initRouter() {
    const navLinks = document.querySelectorAll('[data-view]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    // Handle mobile hamburger menu and close button
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    };

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
      });
    }

    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }
  }

  navigateTo(viewName) {
    this.currentView = viewName;

    // Update active state in sidebar and mobile bottom nav
    document.querySelectorAll('.nav-item').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });
    document.querySelectorAll('.mob-nav-item').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');

    // Update Topbar Title
    const titleMap = {
      dashboard: 'Indian Knowledge System',
      courses: 'Courses & Modules',
      techniques: 'Techniques & Sutra Solver',
      practice: 'Speed Practice',
      tests: 'Vedic Tests & Challenges',
      progress: 'Learning Analytics',
      resources: '16 Sutras & Vedic Formulas',
      profile: 'Learner Profile'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titleMap[viewName] || 'Vedic Maths';

    // Show / hide view panels
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) {
      activeSec.classList.add('active');
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    if (viewName === 'courses') {
      this.renderCoursesView();
    } else if (viewName === 'techniques') {
      if (!this.solverComponent) {
        this.solverComponent = new VedicSolverComponent('solver-container');
      }
    } else if (viewName === 'resources') {
      this.renderResourcesView();
    }
  }

  /* -------------------------------------------------------------
     COMPONENTS INITIALIZATION
  ------------------------------------------------------------- */
  initComponents() {
    this.quizEngine = new VedicQuizEngine('quiz-modal');
    this.updateUserUI();
    this.renderTopTechniques();
    this.renderRecentActivities();
    this.updateDynamicCounters();
  }

  updateUserUI() {
    // Topbar user info
    const userNameEl = document.getElementById('user-display-name');
    if (userNameEl) userNameEl.textContent = this.userState.name;

    // Achievement card
    const badgeName = document.getElementById('achieve-badge-name');
    if (badgeName) badgeName.textContent = `Level ${this.userState.level}`;
    const badgeTitle = document.getElementById('achieve-badge-title');
    if (badgeTitle) badgeTitle.textContent = this.userState.title;

    const xpText = document.getElementById('achieve-xp-text');
    if (xpText) xpText.textContent = `${this.userState.xp} / ${this.userState.xpTarget} XP`;

    const xpBar = document.getElementById('achieve-xp-bar');
    if (xpBar) {
      const pct = Math.min(100, Math.round((this.userState.xp / this.userState.xpTarget) * 100));
      xpBar.style.width = `${pct}%`;
    }

    // Streak card
    const streakDays = document.getElementById('streak-days-count');
    if (streakDays) streakDays.textContent = `${this.userState.streakDays}`;
  }

  updateDynamicCounters() {
    if (!window.VedicRegistry) return;
    const allModules = window.VedicRegistry.getAllModules();

    // Stat: Courses Enrolled
    const enrolledEl = document.getElementById('stat-courses-enrolled');
    if (enrolledEl) enrolledEl.textContent = allModules.length;

    // Stat: Lessons Completed
    const lessonsEl = document.getElementById('stat-lessons-completed');
    if (lessonsEl) lessonsEl.textContent = `${this.userState.completedLessons}`;
    const totalLessonsEl = document.getElementById('stat-lessons-total');
    if (totalLessonsEl) totalLessonsEl.textContent = `of ${this.userState.totalLessons}`;
    const lessonsBar = document.getElementById('stat-lessons-bar');
    if (lessonsBar) {
      const pct = Math.round((this.userState.completedLessons / this.userState.totalLessons) * 100);
      lessonsBar.style.width = `${pct}%`;
    }

    // Stat: Accuracy
    const accEl = document.getElementById('stat-accuracy');
    if (accEl) accEl.textContent = `${this.userState.accuracy}%`;

    // Stat: Study Time
    const timeEl = document.getElementById('stat-study-time');
    if (timeEl) timeEl.textContent = this.userState.studyTime;
  }

  /* -------------------------------------------------------------
     RENDER TECHNIQUES ON DASHBOARD
  ------------------------------------------------------------- */
  renderTopTechniques() {
    const container = document.getElementById('top-techniques-grid');
    if (!container || !window.VedicRegistry) return;

    const techniques = window.VedicRegistry.getAllTechniques();
    // Use first 4 matching user's dashboard image
    const displayList = techniques.slice(0, 4);

    container.innerHTML = displayList.map(tech => `
      <div class="technique-card" data-tech-id="${tech.id}" data-module-id="${tech.moduleId}">
        <div class="tech-icon-circle" style="background-color: ${this.hexToRgba(tech.badgeColor, 0.12)}; color: ${tech.badgeColor};">
          ${this.getTechniqueIconSvg(tech.id)}
        </div>
        <div class="tech-info">
          <h4 class="tech-name">${tech.name}</h4>
          <p class="tech-translation">${tech.translation}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.technique-card').forEach(card => {
      card.addEventListener('click', () => {
        this.navigateTo('techniques');
      });
    });
  }

  getTechniqueIconSvg(id) {
    if (id === 'urdhva-tiryagbhyam') {
      // Cross arrows icon
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17L17 7M17 7H9M17 7V15M7 7L17 17M7 7H15M7 7V15"/></svg>`;
    } else if (id === 'nikhilam-subtraction' || id === 'nikhilam-multiplication') {
      // S-curve / Yin-yang style Vedic complement
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"/></svg>`;
    } else if (id === 'ekadhikena-addition' || id === 'squaring-ends-5') {
      // Down arrow with line
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3v14M18 12l-6 6-6-6M6 21h12"/></svg>`;
    } else {
      // Star / geometry
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
  }

  /* -------------------------------------------------------------
     RENDER RECENT ACTIVITIES ON DASHBOARD
  ------------------------------------------------------------- */
  renderRecentActivities() {
    const tbody = document.getElementById('recent-activity-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.userState.recentActivities.map(item => `
      <tr>
        <td class="td-topic"><strong>${item.topic}</strong></td>
        <td><span class="activity-type-pill ${item.type.toLowerCase()}">${item.type}</span></td>
        <td>
          ${item.score === 'Completed' ? '<span class="status-completed-pill">Completed</span>' : `<span class="score-text">${item.score}</span>`}
        </td>
        <td class="td-date">${item.date}</td>
      </tr>
    `).join('');
  }

  /* -------------------------------------------------------------
     RENDER COURSES VIEW (OCP in action!)
  ------------------------------------------------------------- */
  renderCoursesView() {
    const container = document.getElementById('courses-grid');
    if (!container || !window.VedicRegistry) return;

    const modules = window.VedicRegistry.getAllModules();
    container.innerHTML = modules.map(m => `
      <div class="course-module-card">
        <div class="course-header" style="border-top: 4px solid ${m.badgeColor}">
          <div class="course-badge-row">
            <span class="course-cat-tag">${m.category}</span>
            <span class="course-diff-tag ${m.level.toLowerCase()}">${m.level}</span>
          </div>
          <h3 class="course-title">${m.title}</h3>
          <p class="course-sanskrit"><em>${m.sanskritSutra}</em></p>
          <p class="course-meaning">"${m.englishMeaning}"</p>
        </div>
        <div class="course-body">
          <p class="course-desc">${m.description}</p>
          
          <div class="course-meta-pills">
            <span>⏱ ${m.duration}</span>
            <span>📚 ${m.lessonsCount} Lessons</span>
            <span>✨ ${m.techniques ? m.techniques.length : 0} Techniques</span>
          </div>

          <div class="course-techniques-preview">
            <strong>Key Techniques:</strong>
            <ul>
              ${(m.techniques || []).map(t => `<li><strong>${t.name}</strong>: ${t.translation}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="course-footer">
          <button class="btn btn-primary btn-open-solver" data-module-id="${m.id}">
            Try Interactive Solver
          </button>
          <button class="btn btn-secondary btn-start-module-quiz" data-module-id="${m.id}">
            Practice Quiz
          </button>
        </div>
      </div>
    `).join('');

    // Attach actions
    container.querySelectorAll('.btn-open-solver').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigateTo('techniques');
      });
    });

    container.querySelectorAll('.btn-start-module-quiz').forEach(btn => {
      btn.addEventListener('click', () => {
        const modId = btn.dataset.moduleId;
        this.quizEngine.startQuiz(modId);
      });
    });
  }

  /* -------------------------------------------------------------
     RENDER 16 SUTRAS RESOURCE VIEW
  ------------------------------------------------------------- */
  renderResourcesView() {
    const container = document.getElementById('resources-content');
    if (!container) return;

    const sutras = [
      { num: 1, name: 'Ekādhikena Pūrveṇa', meaning: 'By one more than the previous one', use: 'Squaring numbers ending in 5, recurring decimals' },
      { num: 2, name: 'Nikhilaṁ Navataścaramaṁ Daśataḥ', meaning: 'All from 9 and the last from 10', use: 'Instant subtraction from bases, base multiplication and division' },
      { num: 3, name: 'Ūrdhva-Tiryagbhyām', meaning: 'Vertically and crosswise', use: 'Universal multiplication, fractions, algebraic equations' },
      { num: 4, name: 'Parāvartya Yojayet', meaning: 'Transpose and adjust', use: 'Division by numbers above base, linear and quadratic equations' },
      { num: 5, name: 'Śūnyaṁ Sāmyasamuccaye', meaning: 'When the collection is the same, it is zero', use: 'Factorization and solving equations' },
      { num: 6, name: 'Ānūrūpye Śūnyamanyat', meaning: 'If one is in ratio, the other is zero', use: 'Solving simultaneous linear equations' },
      { num: 7, name: 'Saṅkalana-Vyavakalanābhyām', meaning: 'By addition and by subtraction', use: 'Simultaneous equations with crossed coefficients' },
      { num: 8, name: 'Pūraṇāpūraṇābhyām', meaning: 'By the completion or non-completion', use: 'Solving cubics and quadratics' },
      { num: 9, name: 'Calana-Kalanābhyām', meaning: 'Differences and Similarities', use: 'Finding roots of quadratics and differential calculus origins' },
      { num: 10, name: 'Yāvadūnam', meaning: 'Whatever the deficiency', use: 'Squaring numbers near 10, 100, 1000' },
      { num: 11, name: 'Vyaṣṭisamaṣṭiḥ', meaning: 'Part and Whole', use: 'Solving equations by isolating variables' },
      { num: 12, name: 'Śeṣāṇyaṅkena Carameṇa', meaning: 'The remainders by the last digit', use: 'Expressing fractions in recurring decimals' },
      { num: 13, name: 'Sopāntyadvayamantyam', meaning: 'The ultimate and twice the penultimate', use: 'Special fractions and equations' },
      { num: 14, name: 'Ekanyūnena Pūrveṇa', meaning: 'By one less than the previous one', use: 'Multiplication by series of 9s (99, 999...)' },
      { num: 15, name: 'Guṇitasamuccayaḥ', meaning: 'The product of the sum is the sum of the products', use: 'Checking mathematical calculations' },
      { num: 16, name: 'Guṇakasamuccayaḥ', meaning: 'All the multipliers', use: 'Factorization of polynomials' }
    ];

    container.innerHTML = `
      <div class="resource-header-banner">
        <h2>The 16 Primary Vedic Sutras</h2>
        <p>Rediscovered from the Atharva Veda by Swami Bharati Krishna Tirtha (1884–1960). These 16 mental formulas cover arithmetic, algebra, and geometry.</p>
      </div>
      <div class="sutras-table-wrap">
        <table class="sutras-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Sanskrit Sutra</th>
              <th>English Meaning</th>
              <th>Primary Mathematical Applications</th>
            </tr>
          </thead>
          <tbody>
            ${sutras.map(s => `
              <tr>
                <td class="sutra-num">${s.num}</td>
                <td class="sutra-name"><strong>${s.name}</strong></td>
                <td class="sutra-meaning">"${s.meaning}"</td>
                <td class="sutra-use">${s.use}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* -------------------------------------------------------------
     GLOBAL EVENTS BINDING
  ------------------------------------------------------------- */
  bindGlobalEvents() {
    // Continue Learning buttons
    document.querySelectorAll('#btn-continue-learning, #btn-resume-lesson').forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigateTo('techniques');
        this.showToast('Resuming Lesson 5: Vertical & Crosswise Multiplication');
      });
    });

    // Quick Practice button
    const quickPracticeBtn = document.getElementById('btn-quick-practice');
    if (quickPracticeBtn) {
      quickPracticeBtn.addEventListener('click', () => {
        this.quizEngine.startQuiz();
      });
    }

    // View all courses link
    const viewAllCourses = document.getElementById('link-view-all-courses');
    if (viewAllCourses) {
      viewAllCourses.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('courses');
      });
    }

    // View all techniques link
    const viewAllTech = document.getElementById('link-view-all-techniques');
    if (viewAllTech) {
      viewAllTech.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('techniques');
      });
    }

    // View all activity link
    const viewAllAct = document.getElementById('link-view-all-activity');
    if (viewAllAct) {
      viewAllAct.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('progress');
      });
    }

    // Notification bell
    const notifBtn = document.getElementById('btn-notifications');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.showToast('🔔 You have completed 32 lessons! Keep up your streak!');
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('Logged out session. Welcome back anytime!');
      });
    }
  }

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.VedicApp = new VedicAppCoordinator();
  window.VedicApp.init();
});
