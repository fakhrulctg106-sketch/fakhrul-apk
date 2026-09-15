const STORAGE_KEY = 'fakhrulapk_apps';

/* =========================
   LOAD CUSTOM APPS
========================= */

function loadCustomApps() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    if (!Array.isArray(stored)) return [];

    return stored.map(a => ({
      ...a,

      // Admin-এর field → Store-এর field
      icon: a.iconUrl || a.icon || 'assets/icon-default.svg',
      apk: a.apkUrl || a.apk || '#'
    }));
  } catch (error) {
    console.error('Could not load custom apps:', error);
    return [];
  }
}


/* =========================
   ALL APPS
========================= */

const customApps = loadCustomApps();

const apps = [
  ...customApps,
  ...(typeof DEFAULT_APPS !== 'undefined' ? DEFAULT_APPS : [])
];

let category = 'All';


/* =========================
   ESCAPE HTML
========================= */

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[c]));
}


/* =========================
   APP CARD
========================= */

function card(a) {

  const icon =
    a.icon ||
    a.iconUrl ||
    'assets/icon-default.svg';

  return `
    <article class="app-card">

      <img
        src="${esc(icon)}"
        alt="${esc(a.name || '')}"
        onerror="this.onerror=null;this.src='assets/icon-default.svg';"
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


/* =========================
   STORE RENDER
========================= */

function render() {

  // Admin থেকে latest data আবার নেওয়া
  const latestCustomApps = loadCustomApps();

  const latestApps = [
    ...latestCustomApps,
    ...(typeof DEFAULT_APPS !== 'undefined'
      ? DEFAULT_APPS
      : [])
  ];

  const q = (
    document.getElementById('search')?.value || ''
  ).toLowerCase().trim();

  const list = latestApps.filter(a => {

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

    const count =
      document.getElementById('count');

    if (count) {
      count.textContent =
        `${list.length} apps`;
    }
  }
}


/* =========================
   SEARCH
========================= */

function filterApps() {
  render();
}


/* =========================
   CATEGORY
========================= */

function setCategory(c) {
  category = c;
  render();
}


/* =========================
   APP DETAIL
========================= */

function detail() {

  const id =
    new URLSearchParams(location.search).get('id');

  // সর্বশেষ localStorage data
  const latestCustomApps = loadCustomApps();

  const latestApps = [
    ...latestCustomApps,
    ...(typeof DEFAULT_APPS !== 'undefined'
      ? DEFAULT_APPS
      : [])
  ];

  const a =
    latestApps.find(x => String(x.id) === String(id));

  const el =
    document.getElementById('detail');

  if (!el) return;

  if (!a) {

    el.innerHTML =
      '<div class="empty">App not found.</div>';

    return;
  }


  /* =========================
     ICON
  ========================= */

  const icon =
    a.icon ||
    a.iconUrl ||
    'assets/icon-default.svg';


  /* =========================
     APK
  ========================= */

  const apk =
    a.apk ||
    a.apkUrl ||
    '#';


  /* =========================
     DETAIL HTML
  ========================= */

  el.innerHTML = `

    <div class="detail-card">

      <img
        class="detail-icon"
        src="${esc(icon)}"
        alt="${esc(a.name || '')}"
        onerror="this.onerror=null;this.src='assets/icon-default.svg';"
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


/* =========================
   START
========================= */

render();
detail();
