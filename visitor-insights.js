// Optional visitor insights: explicit consent, with the shared owner opt-out.
(() => {
  let initialized = false;
  window.loadVisitorInsights = (config = {}) => {
    if (initialized || config.consent !== true ||
        window.location.hostname !== 'kaixi66.github.io' ||
        !window.location.pathname.startsWith('/Kaixi-Feng.github.io/')) return;

    try {
      if (window.localStorage.getItem('kaixi-feng:analytics-disabled') === '1') return;
    } catch {
      // Fail closed if the saved owner preference cannot be checked.
      return;
    }

    const clarityId = typeof config.clarityProjectId === 'string' &&
      /^[a-z0-9]{6,32}$/.test(config.clarityProjectId) ? config.clarityProjectId : null;
    const statcounter = config.statcounter;
    const validStatcounter = statcounter && /^\d{5,12}$/.test(String(statcounter.projectId)) &&
      typeof statcounter.security === 'string' && /^[a-f0-9]{8}$/i.test(statcounter.security);
    if (!clarityId && !validStatcounter) return;
    initialized = true;

    const load = (src, provider) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.setAttribute('data-visitor-insights', provider);
      document.head.appendChild(script);
    };

    if (clarityId) {
      window.clarity = window.clarity || function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
      load('https://www.clarity.ms/tag/' + clarityId, 'clarity');

      // Fixed event names describe public-page actions, without sending link queries or emails.
      const events = new Map([
        ['https://arxiv.org/abs/2610.09016', 'paper_pair'],
        ['https://arxiv.org/abs/2610.09144', 'paper_diva'],
        ['https://arxiv.org/abs/2602.17951', 'paper_rocket'],
        ['https://arxiv.org/abs/2606.27755', 'paper_drop_then_recovery'],
        ['https://arxiv.org/abs/2609.30913', 'paper_causeway']
      ]);
      document.addEventListener('click', event => {
        const link = event.target.closest?.('a[href]');
        if (!link) return;
        const target = new URL(link.href, window.location.href);
        const name = target.protocol === 'mailto:' ? 'contact_email' :
          target.hostname === 'scholar.google.com' ? 'google_scholar' :
          events.get(target.origin + target.pathname);
        if (name) window.clarity('event', name);
      });
    }

    if (validStatcounter) {
      window.sc_project = Number(statcounter.projectId);
      window.sc_security = statcounter.security;
      window.sc_invisible = 1;
      window.sc_https = 1;
      load('https://www.statcounter.com/counter/counter.js', 'statcounter');
    }
  };

  let controlsReady = false;
  window.startVisitorInsights = () => {
    if (controlsReady || window.location.hostname !== 'kaixi66.github.io' ||
        !window.location.pathname.startsWith('/Kaixi-Feng.github.io/')) return;
    controlsReady = true;

    const settings = document.getElementById('analytics-settings');
    const panel = document.getElementById('analytics-options');
    const status = document.getElementById('analytics-choice-status');
    if (!settings || !panel || !status) return;
    const consentKey = 'kaixi-feng:insights-consent-v1';
    const config = { consent: true, clarityProjectId: 'yy937kf7wk',
      statcounter: { projectId: 13360146, security: '7e0e479b' } };
    let choice = null;
    let hadFocus = false;
    const url = new URL(window.location.href);

    try { choice = window.localStorage.getItem(consentKey); } catch { /* Ask again. */ }
    if (url.searchParams.get('insights') === 'off') {
      choice = 'declined';
      try {
        window.localStorage.setItem(consentKey, choice);
        url.searchParams.delete('insights');
        window.history.replaceState(window.history.state, '', url.href);
      } catch { /* Keep the opt-out URL if the preference cannot be saved. */ }
    }

    const setStatus = () => {
      status.textContent = choice === 'granted' ? 'Optional analytics are on.' :
        choice === 'declined' ? 'Optional analytics are off.' : 'Optional analytics are off until you choose.';
    };
    const close = () => {
      panel.hidden = true;
      if (hadFocus || panel.contains(document.activeElement)) settings.focus();
    };
    settings.hidden = false;
    settings.addEventListener('click', () => {
      hadFocus = true;
      setStatus();
      panel.hidden = false;
      panel.focus();
    });
    document.getElementById('analytics-close').addEventListener('click', close);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
    document.getElementById('analytics-allow').addEventListener('click', () => {
      try {
        window.localStorage.setItem(consentKey, 'granted');
      } catch {
        status.textContent = 'Your browser could not save this choice. Optional analytics remain off.';
        return;
      }
      choice = 'granted';
      window.loadVisitorInsights(config);
      setStatus();
      close();
    });
    document.getElementById('analytics-decline').addEventListener('click', () => {
      choice = 'declined';
      try { window.localStorage.setItem(consentKey, choice); } catch { /* Use the opt-out URL below. */ }
      setStatus();
      close();
      if (initialized) {
        if (window.clarity) window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
        const next = new URL(window.location.href);
        next.searchParams.set('insights', 'off');
        // Reload to stop both providers, including any in-flight initialization.
        window.location.replace(next.href);
      }
    });

    setStatus();
    if (choice === 'granted') window.loadVisitorInsights(config);
    else if (choice !== 'declined') panel.hidden = false;
  };
})();
