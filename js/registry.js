/**
 * Vedic Maths Learning Platform - Open-Closed Principle (OCP) Module Registry
 * 
 * CORE PRINCIPLE:
 * The platform is OPEN for extension (new math modules such as Trigonometry, Calculus,
 * Square Roots can be registered anytime) but CLOSED for modification (the core rendering,
 * routing, quiz engines, and dashboard never need changes to support new modules).
 */

class VedicRegistryClass {
  constructor() {
    this._modules = new Map();
    this._listeners = new Set();
  }

  /**
   * Register a new Vedic Maths Module.
   * Follows OCP: any module implementing the standard contract can be plugged in seamlessly.
   */
  registerModule(module) {
    if (!module || !module.id) {
      console.error("Invalid module registration: missing 'id'", module);
      return false;
    }

    // Standardize module properties with sensible defaults
    const standardized = {
      id: module.id,
      title: module.title || 'Untitled Module',
      sanskritSutra: module.sanskritSutra || '',
      englishMeaning: module.englishMeaning || '',
      category: module.category || 'Vedic Arithmetic',
      level: module.level || 'Beginner',
      badgeColor: module.badgeColor || '#8B4527',
      icon: module.icon || 'book-open',
      duration: module.duration || '2 hrs',
      lessonsCount: module.lessonsCount || (module.techniques ? module.techniques.length * 3 : 6),
      completedLessons: module.completedLessons || 0,
      description: module.description || '',
      techniques: module.techniques || [],
      solver: module.solver || null,
      practiceQuestions: module.practiceQuestions || []
    };

    this._modules.set(standardized.id, standardized);
    console.log(`[VedicRegistry] Module registered: ${standardized.title} (ID: ${standardized.id})`);

    // Notify all UI listeners that a new module is available
    this._notifyListeners('moduleRegistered', standardized);
    return true;
  }

  getModule(id) {
    return this._modules.get(id);
  }

  getAllModules() {
    return Array.from(this._modules.values());
  }

  /**
   * Collect all techniques across all registered modules
   */
  getAllTechniques() {
    const list = [];
    for (const module of this._modules.values()) {
      if (Array.isArray(module.techniques)) {
        for (const tech of module.techniques) {
          list.push({
            ...tech,
            moduleId: module.id,
            moduleTitle: module.title,
            badgeColor: module.badgeColor
          });
        }
      }
    }
    return list;
  }

  /**
   * Collect or sample practice questions across all registered modules
   */
  getAllPracticeQuestions(category = null) {
    let pool = [];
    for (const module of this._modules.values()) {
      if (category && module.category !== category) continue;
      if (Array.isArray(module.practiceQuestions)) {
        pool.push(...module.practiceQuestions.map(q => ({
          ...q,
          moduleId: module.id,
          moduleTitle: module.title
        })));
      }
    }
    return pool;
  }

  /**
   * Subscribe to registry changes
   */
  subscribe(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  _notifyListeners(event, data) {
    for (const listener of this._listeners) {
      try {
        listener(event, data);
      } catch (err) {
        console.error('[VedicRegistry] Listener error:', err);
      }
    }
  }
}

// Singleton global registry
window.VedicRegistry = new VedicRegistryClass();
