(() => {
  // Google Search only. Other Google products manage language separately.
  if (!/^www\.google\.(?:[a-z]{2,3}|co\.[a-z]{2}|com\.[a-z]{2})$/.test(location.hostname)) return;
  if (!['/', '/webhp', '/search'].includes(location.pathname)) return;

  chrome.storage.local.get(['google_language_enabled', 'google_language', 'google_results_only'], (settings) => {
    if (!chrome.runtime?.id || settings.google_language_enabled !== true) return;
    const language = ['en', 'ja', 'ko'].includes(settings.google_language) ? settings.google_language : 'en';
    const url = new URL(location.href);
    let changed = false;

    if (url.searchParams.get('hl') !== language) {
      url.searchParams.set('hl', language);
      changed = true;
    }
    if (location.pathname === '/search' && settings.google_results_only === true &&
        url.searchParams.get('lr') !== `lang_${language}`) {
      url.searchParams.set('lr', `lang_${language}`);
      changed = true;
    }
    if (changed) location.replace(url.href);
  });
})();
