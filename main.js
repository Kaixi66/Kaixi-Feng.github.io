// Count visits to the published homepage, excluding local previews.
(() => {
  if (
    window.location.hostname !== 'kaixi66.github.io' ||
    !window.location.pathname.startsWith('/Kaixi-Feng.github.io/')
  ) {
    return;
  }

  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.setAttribute('data-cf-beacon', JSON.stringify({
    token: '8c8dba3daf074b2cb0e585cac61b2f32'
  }));
  document.body.appendChild(beacon);
})();
