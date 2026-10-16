// Count published-site visits, unless this browser has opted out.
(() => {
  if (
    window.location.hostname !== 'kaixi66.github.io' ||
    !window.location.pathname.startsWith('/Kaixi-Feng.github.io/')
  ) {
    return;
  }

  const preferenceKey = 'kaixi-feng:analytics-disabled';
  const url = new URL(window.location.href);
  const action = url.searchParams.get('analytics');
  let disabled = false;

  try {
    disabled = window.localStorage.getItem(preferenceKey) === '1';
  } catch {
    // Preference storage is unavailable.
  }

  if (action === 'off' || action === 'on') {
    disabled = action === 'off';
    try {
      if (disabled) {
        window.localStorage.setItem(preferenceKey, '1');
      } else {
        window.localStorage.removeItem(preferenceKey);
      }
    } catch {
      // Preference storage is unavailable.
    }

    // Remove the control from the address so copied links stay ordinary links.
    url.searchParams.delete('analytics');
    try {
      window.history.replaceState(window.history.state, '', url.href);
    } catch {
      // A restricted History API must not interrupt the preference or page.
    }
  }

  if (disabled) {
    return;
  }

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({
    token: '8c8dba3daf074b2cb0e585cac61b2f32'
  }));
  document.body.appendChild(beacon);
  // This file loads first; all optional tools stay behind the owner opt-out above.
  if (typeof window.startVisitorInsights === 'function') window.startVisitorInsights();
})();
