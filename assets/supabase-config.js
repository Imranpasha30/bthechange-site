// =============================================================================
// SUPABASE + hCAPTCHA CONFIG
// Replace placeholder values with your actual keys before deploying.
// =============================================================================

window.SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_ANON_KEY_HERE',
};

// Optional: hCaptcha for spam protection on submit form
// Get free site key: https://www.hcaptcha.com/ → Add Site → copy "Site key"
// Leave empty string to disable captcha (it will not render)
window.HCAPTCHA_SITE_KEY = '';

// Optional: NSFW image moderation (Sightengine, $0/month for 500 imgs)
// Get keys: https://sightengine.com/ → API → copy User + Secret
// Leave empty to disable auto-moderation (admin still reviews manually)
window.SIGHTENGINE_USER = '';
window.SIGHTENGINE_SECRET = '';
