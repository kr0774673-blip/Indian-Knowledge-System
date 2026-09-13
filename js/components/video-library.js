/**
 * Vedic Video Lectures Component
 * ------------------------------------------------------------------
 * Adds "Video Lectures" playback backed by Supabase Storage + a
 * `video_lectures` table, without modifying VedicRegistry, the
 * quiz engine, or the solver component. Follows the same pattern
 * as VedicQuizEngine / VedicSolverComponent: a self-contained class
 * that mounts into a dedicated modal and reuses the existing design
 * system (same CSS variables / btn classes / modal conventions).
 * ------------------------------------------------------------------
 */

class VedicVideoLibraryComponent {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.currentModuleId = null;
    this.videos = [];
    this.activeVideo = null;
  }

  init() {
    if (!this.modal) return;

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) this.close();
    });
  }

  async openForModule(moduleId) {
    if (!this.modal) return;
    this.currentModuleId = moduleId;
    this.activeVideo = null;

    const module = window.VedicRegistry ? window.VedicRegistry.getModule(moduleId) : null;
    this.moduleTitle = module ? module.title : 'This Course';

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this._renderLoading();

    if (!window.VedicSupabase || !window.VedicSupabase.isConfigured) {
      this._renderNotConfigured();
      return;
    }

    try {
      this.videos = await window.VedicSupabase.getVideosForModule(moduleId);
      this._renderList();
    } catch (err) {
      console.error('[VedicVideoLibrary] Failed to load videos:', err);
      this._renderError(err);
    }
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.activeVideo = null;
  }

  /* ---------------------------------------------------------------
     RENDER STATES
  --------------------------------------------------------------- */
  _shell(bodyHtml) {
    const body = this.modal.querySelector('.video-modal-body');
    if (body) body.innerHTML = bodyHtml;
  }

  _renderLoading() {
    this._shell(`
      <div class="video-modal-header">
        <h3>🎥 Video Lectures</h3>
        <button class="video-modal-close" id="video-modal-close-btn" aria-label="Close">&times;</button>
      </div>
      <div class="video-empty-state">
        <div class="video-spinner"></div>
        <p>Loading lectures for <strong>${this.moduleTitle}</strong>&hellip;</p>
      </div>
    `);
    this._bindCloseButton();
  }

  _renderNotConfigured() {
    this._shell(`
      <div class="video-modal-header">
        <h3>🎥 Video Lectures</h3>
        <button class="video-modal-close" id="video-modal-close-btn" aria-label="Close">&times;</button>
      </div>
      <div class="video-empty-state">
        <p><strong>Supabase isn't connected yet.</strong></p>
        <p class="video-empty-sub">
          Add your project URL and anon key in
          <code>js/services/supabase-client.js</code> to start storing and
          streaming video lectures for <strong>${this.moduleTitle}</strong>.
        </p>
      </div>
    `);
    this._bindCloseButton();
  }

  _renderError(err) {
    this._shell(`
      <div class="video-modal-header">
        <h3>🎥 Video Lectures</h3>
        <button class="video-modal-close" id="video-modal-close-btn" aria-label="Close">&times;</button>
      </div>
      <div class="video-empty-state">
        <p><strong>Couldn't load lectures right now.</strong></p>
        <p class="video-empty-sub">${(err && err.message) || 'Please try again in a moment.'}</p>
      </div>
    `);
    this._bindCloseButton();
  }

  _renderList() {
    if (!this.videos || this.videos.length === 0) {
      this._shell(`
        <div class="video-modal-header">
          <h3>🎥 Video Lectures</h3>
          <button class="video-modal-close" id="video-modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="video-empty-state">
          <p><strong>No lectures uploaded yet for ${this.moduleTitle}.</strong></p>
          <p class="video-empty-sub">Check back soon — new sessions are added regularly.</p>
        </div>
      `);
      this._bindCloseButton();
      return;
    }

    this._shell(`
      <div class="video-modal-header">
        <div>
          <h3>🎥 Video Lectures</h3>
          <p class="video-modal-subtitle">${this.moduleTitle}</p>
        </div>
        <button class="video-modal-close" id="video-modal-close-btn" aria-label="Close">&times;</button>
      </div>

      <div class="video-player-slot" id="video-player-slot"></div>

      <div class="video-list">
        ${this.videos.map((v, i) => `
          <div class="video-card" data-video-index="${i}">
            <div class="video-card-thumb">
              ${v.thumbnail_url
                ? `<img src="${v.thumbnail_url}" alt="${this._escape(v.title)}" loading="lazy" />`
                : `<div class="video-card-thumb-fallback">▶</div>`}
            </div>
            <div class="video-card-info">
              <h4>${this._escape(v.title)}</h4>
              ${v.description ? `<p class="video-card-desc">${this._escape(v.description)}</p>` : ''}
              ${v.duration_label ? `<span class="video-card-duration">⏱ ${this._escape(v.duration_label)}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `);

    this._bindCloseButton();
    this.modal.querySelectorAll('.video-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.videoIndex, 10);
        this._playVideo(this.videos[idx]);
      });
    });
  }

  _playVideo(video) {
    this.activeVideo = video;
    const slot = this.modal.querySelector('#video-player-slot');
    if (!slot) return;

    if (!video.resolvedUrl) {
      slot.innerHTML = `<div class="video-empty-state"><p>This lecture's file could not be found.</p></div>`;
      slot.classList.add('active');
      return;
    }

    if (this._isEmbeddable(video.resolvedUrl)) {
      slot.innerHTML = `
        <div class="video-player-frame">
          <iframe
            src="${this._toEmbedUrl(video.resolvedUrl)}"
            title="${this._escape(video.title)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <h4 class="video-now-playing-title">${this._escape(video.title)}</h4>
      `;
    } else {
      slot.innerHTML = `
        <div class="video-player-frame">
          <video controls preload="metadata" src="${video.resolvedUrl}"></video>
        </div>
        <h4 class="video-now-playing-title">${this._escape(video.title)}</h4>
      `;
    }
    slot.classList.add('active');
    slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  _isEmbeddable(url) {
    return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
  }

  _toEmbedUrl(url) {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  }

  _bindCloseButton() {
    const btn = this.modal.querySelector('#video-modal-close-btn');
    if (btn) btn.addEventListener('click', () => this.close());
  }

  _escape(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }
}
