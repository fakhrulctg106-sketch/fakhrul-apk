const stored = JSON.parse(
  localStorage.getItem('fakhrulapk_apps') || '[]'
);

// Admin থেকে আসা নতুন app-এর field ঠিকভাবে মিলিয়ে নেওয়া
const customApps = stored.map(a => ({
  ...a,

  // Admin-এর iconUrl থাকলে সেটি ব্যবহার করবে
  icon: a.iconUrl || a.icon || 'assets/icon-default.svg',

  // Admin-এর apkUrl থাকলে সেটি ব্যবহার করবে
  apk: a.apkUrl || a.apk || '#'
}));

const apps = [...customApps, ...DEFAULT_APPS];

let category = 'All';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[c]));
}

function card(a) {
  return `
    <article class="app-card">

      <img
        src="${esc(a.icon || 'assets/icon-default.svg')}"
        alt="${esc(a.name || '')}"
        onerror="this.src='assets/icon-default.svg'"
      >

      <div class="app-info">

        <span class="tag">
          ${esc(a.category || '')}
        </span>

        <h3>
          ${esc(a.name || '')}
        </h3>

        <p>
          ${esc(a.developer || '')}
        </p>

        <div class="meta">
          ${esc(a.version || '')} · ${esc(a.size || '')}
        </div>

      </div>

      <a
        class="download"
        href="app.html?id=${encodeURIComponent(a.id)}"
      >
        View
      </a>

    </article>
  `;
}

function render() {

  const q = (
    document.getElementById('search')?.value || ''
  ).toLowerCase();

  const list = apps.filter(a => {

    const text = `
      ${a.name || ''}
      ${a.developer || ''}
      ${a.category || ''}
    `.toLowerCase();

    return (
      (category === 'All' || a.category === category) &&
      text.includes(q)
    );
  });

  const el = document.getElementById('apps');

  if (el) {

    el.innerHTML =
      list.map(card).join('') ||
      '<div class="empty">No apps found.</div>';

    const count = document.getElementById('count');

    if (count) {
      count.textContent = `${list.length} apps`;
    }
  }
}

function filterApps() {
  render();
}

function setCategory(c) {
  category = c;
  render();
}

function detail() {

  const id =
    new URLSearchParams(location.search).get('id');

  const a = apps.find(x => x.id === id);

  const el = document.getElementById('detail');

  if (!el) return;

  if (!a) {

    el.innerHTML =
      '<div class="empty">App not found.</div>';

    return;
  }

  const icon =
    a.icon ||
    a.iconUrl ||
    'assets/icon-default.svg';

  const apk =
    a.apk ||
    a.apkUrl ||
    '#';

  el.innerHTML = `
    <div class="detail-card">

      <img
        class="detail-icon"
        src="${esc(icon)}"
        alt="${esc(a.name || '')}"
        onerror="this.src='assets/icon-default.svg'"
      >

      <div>

        <span class="tag">
          ${esc(a.category || '')}
        </span>

        <h1>
          ${esc(a.name || '')}
        </h1>

        <p class="developer">
          By ${esc(a.developer || '')}
        </p>

        <p>
          ${esc(a.description || '')}
        </p>

        <div class="facts">

          <span>
            <b>Version</b>
            ${esc(a.version || '')}
          </span>

          <span>
            <b>Size</b>
            ${esc(a.size || '')}
          </span>

          <span>
            <b>Android</b>
            ${esc(a.android || '')}
          </span>

        </div>

        <a
          class="primary download-big"
          href="${esc(apk)}"
          ${
            apk === '#'
              ? `onclick="alert('Add your real APK URL from the Admin page.');return false;"`
              : ''
          }
        >
          Download APK
        </a>

      </div>

    </div>
  `;
}

render();
detail();
