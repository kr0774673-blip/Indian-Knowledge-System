(function () {
  const SUPABASE_URL = window.__SUPABASE_URL__ || 'https://bhbhh.supabase.co'; //replace the superbase link 
  const SUPABASE_ANON_KEY = window.__SUPABASE_ANON_KEY__ || 'your api';

  const VIDEO_TABLE = 'video_lectures'; 
  const VIDEO_BUCKET = 'course-videos';

  const isConfigured =
    SUPABASE_URL && !SUPABASE_URL.includes('YOUR-PROJECT-REF') &&
    SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('YOUR-SUPABASE-ANON');

  let client = null;

  function getClient() {
    if (!isConfigured) return null;
    if (client) return client;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('[VedicSupabase] supabase-js SDK not loaded yet.');
      return null;
    }
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  }

  // Publicly exposed, minimal surface -- everything else stays encapsulated.
  window.VedicSupabase = {
    isConfigured,
    videoTable: VIDEO_TABLE,
    videoBucket: VIDEO_BUCKET,

    /**
     * Fetch all published video lectures for a given Vedic module id,
     * ordered by sort_order. Resolves storage paths to public URLs.
     */
    async getVideosForModule(moduleId) {
      const sb = getClient();
      if (!sb) throw new Error('Supabase is not configured yet.');

      const { data, error } = await sb
        .from(VIDEO_TABLE)
        .select('*')
        .eq('module_id', moduleId)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      return (data || []).map((row) => this._withResolvedUrl(row, sb));
    },

    /**
     * Fetch a single video lecture by id.
     */
    async getVideoById(id) {
      const sb = getClient();
      if (!sb) throw new Error('Supabase is not configured yet.');

      const { data, error } = await sb
        .from(VIDEO_TABLE)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return this._withResolvedUrl(data, sb);
    },

    /**
     * Upload a video file to Storage and create its metadata row.
     * Used by the optional lightweight admin panel in video-library.js.
     */
    async uploadVideo({ file, moduleId, title, description, durationLabel, onProgress }) {
      const sb = getClient();
      if (!sb) throw new Error('Supabase is not configured yet.');

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const path = `${moduleId}/${Date.now()}_${safeName}`;

      const { error: uploadError } = await sb.storage
        .from(VIDEO_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Storage SDK doesn't expose granular progress on the JS client;
      // callers can still show an indeterminate spinner via onProgress(null).
      if (typeof onProgress === 'function') onProgress(100);

      const { data: countData } = await sb
        .from(VIDEO_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('module_id', moduleId);

      const { data, error: insertError } = await sb
        .from(VIDEO_TABLE)
        .insert({
          module_id: moduleId,
          title: title || file.name,
          description: description || '',
          storage_path: path,
          duration_label: durationLabel || '',
          sort_order: (countData ? countData.length : 0) + 1
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return this._withResolvedUrl(data, sb);
    },

    _withResolvedUrl(row, sb) {
      if (!row) return row;
      if (row.video_url) {
        // External link (e.g. YouTube/Vimeo) takes priority if present.
        return { ...row, resolvedUrl: row.video_url, isExternal: true };
      }
      if (row.storage_path) {
        const { data } = sb.storage.from(VIDEO_BUCKET).getPublicUrl(row.storage_path);
        return { ...row, resolvedUrl: data ? data.publicUrl : null, isExternal: false };
      }
      return { ...row, resolvedUrl: null, isExternal: false };
    }
  };
})();
