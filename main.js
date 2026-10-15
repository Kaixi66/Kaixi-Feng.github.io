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
  let saved = true;

  try {
    disabled = window.localStorage.getItem(preferenceKey) === '1';
  } catch {
    saved = false;
  }

  if (action === 'off' || action === 'on') {
    disabled = action === 'off';
    try {
      if (disabled) {
        window.localStorage.setItem(preferenceKey, '1');
      } else {
        window.localStorage.removeItem(preferenceKey);
      }
      saved = true;
    } catch {
      saved = false;
    }

    // Remove the control from the address so copied links stay ordinary links.
    url.searchParams.delete('analytics');
    try {
      window.history.replaceState(window.history.state, '', url.href);
    } catch {
      // A restricted History API must not interrupt the preference or page.
    }
  }

  if (disabled || action === 'on') {
    const notice = document.createElement('div');
    notice.setAttribute('role', 'status');
    notice.setAttribute('data-analytics-status', disabled ? 'disabled' : 'enabled');
    notice.lang = 'zh-CN';
    notice.textContent = disabled
      ? (saved ? '此浏览器已暂停访问统计。 ' : '本次访问不计入统计；浏览器未允许保存设置。 ')
      : (saved ? '此浏览器已恢复访问统计。 ' : '本次已恢复统计；浏览器未允许保存设置。 ');
    Object.assign(notice.style, {
      position: 'fixed', bottom: '16px', right: '16px', zIndex: '50',
      maxWidth: 'calc(100% - 32px)', padding: '10px 14px',
      background: '#eeede5', color: '#272821', border: '1px solid #b5b4a8',
      fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.6'
    });
    const control = document.createElement('a');
    const controlUrl = new URL(url.href);
    controlUrl.searchParams.set('analytics', disabled ? 'on' : 'off');
    control.href = controlUrl.href;
    control.textContent = disabled ? '恢复统计' : '暂停统计';
    control.style.textDecoration = 'underline';
    notice.appendChild(control);
    document.body.appendChild(notice);
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
})();
