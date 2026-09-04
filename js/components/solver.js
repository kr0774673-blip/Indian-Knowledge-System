/**
 * Interactive Vedic Solver Component
 * Adheres strictly to OCP: Dynamically queries VedicRegistry for modules with solvers.
 */

class VedicSolverComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentSolver = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    
    // Subscribe to registry updates so new modules (like Trigonometry) register their solvers dynamically
    if (window.VedicRegistry) {
      window.VedicRegistry.subscribe((event, module) => {
        if (event === 'moduleRegistered' && module.solver) {
          this.render();
        }
      });
    }
  }

  render() {
    const modules = window.VedicRegistry ? window.VedicRegistry.getAllModules() : [];
    const solvers = [];
    modules.forEach(m => {
      if (m.solver) {
        solvers.push({
          moduleId: m.id,
          moduleTitle: m.title,
          ...m.solver
        });
      }
    });

    if (solvers.length === 0) {
      this.container.innerHTML = `<p class="empty-state">No solvers registered yet.</p>`;
      return;
    }

    if (!this.currentSolver || !solvers.some(s => s.id === this.currentSolver.id)) {
      this.currentSolver = solvers[0];
    }

    this.container.innerHTML = `
      <div class="solver-card">
        <div class="solver-header">
          <div>
            <span class="badge-tag">Interactive Vedic Calculator</span>
            <h3 class="solver-title">${this.currentSolver.name}</h3>
            <p class="solver-desc">Experience mental math magic with step-by-step sutra breakdowns.</p>
          </div>
          <div class="solver-selector-wrap">
            <label for="solver-select">Select Sutra / Technique:</label>
            <select id="solver-select" class="form-select">
              ${solvers.map(s => `<option value="${s.id}" ${s.id === this.currentSolver.id ? 'selected' : ''}>${s.moduleTitle} — ${s.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="solver-body">
          <form id="solver-form" class="solver-form">
            <div class="solver-inputs-grid" id="solver-inputs-grid">
              ${this.currentSolver.inputs.map(inp => `
                <div class="input-group">
                  <label for="inp-${inp.name}">${inp.label}</label>
                  <input 
                    type="${inp.type || 'text'}" 
                    id="inp-${inp.name}" 
                    name="${inp.name}" 
                    value="${inp.default !== undefined ? inp.default : ''}" 
                    class="form-control" 
                    required
                  />
                </div>
              `).join('')}
            </div>
            <div class="solver-actions">
              <button type="submit" class="btn btn-primary" id="btn-calculate-vedic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Calculate with Vedic Sutra
              </button>
            </div>
          </form>

          <div id="solver-results" class="solver-results">
            <!-- Dynamic step by step results appear here -->
          </div>
        </div>
      </div>
    `;

    this.bindEvents(solvers);
    this.executeCurrentSolver();
  }

  bindEvents(solvers) {
    const select = this.container.querySelector('#solver-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const found = solvers.find(s => s.id === e.target.value);
        if (found) {
          this.currentSolver = found;
          this.render();
        }
      });
    }

    const form = this.container.querySelector('#solver-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.executeCurrentSolver();
      });
    }
  }

  executeCurrentSolver() {
    if (!this.currentSolver) return;

    const values = [];
    for (const inp of this.currentSolver.inputs) {
      const el = this.container.querySelector(`#inp-${inp.name}`);
      values.push(el ? el.value : inp.default);
    }

    const result = this.currentSolver.solve(...values);
    const resultsContainer = this.container.querySelector('#solver-results');

    if (result.error) {
      resultsContainer.innerHTML = `
        <div class="solver-alert error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div><strong>Input Notice:</strong> ${result.error}</div>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="solution-card">
        <div class="solution-summary">
          <div class="summary-label">Vedic Final Answer</div>
          <div class="summary-value">${result.answer}</div>
        </div>

        <div class="solution-steps-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Step-by-Step Sutra Working
        </div>

        <ol class="solution-steps-list">
          ${result.steps.map((step, idx) => `
            <li class="solution-step-item" style="animation-delay: ${idx * 60}ms">
              <span class="step-num">${idx + 1}</span>
              <div class="step-text">${step}</div>
            </li>
          `).join('')}
        </ol>
      </div>
    `;
  }
}

window.VedicSolverComponent = VedicSolverComponent;
