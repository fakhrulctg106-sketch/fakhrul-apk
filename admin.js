const key = 'fakhrulapk_apps';

let custom = [];
let editingId = null;


// =========================
// LOAD APPS
// =========================

function loadApps() {
  try {
    const saved = localStorage.getItem(key);

    custom = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(custom)) {
      custom = [];
    }

    // পুরোনো ও নতুন icon field একসাথে ঠিক করা
    custom = custom.map(app => ({
      ...app,

      iconUrl:
        app.iconUrl ||
        app.icon ||
        '',

      apkUrl:
        app.apkUrl ||
        app.apk ||
        ''
    }));

  } catch (error) {
    console.error('Could not load apps:', error);
    custom = [];
  }
}


// =========================
// SAVE APPS
// =========================

function saveApps() {
  try {

    // Save করার আগে icon/apk field ঠিক করা
    custom = custom.map(app => ({
      ...app,

      iconUrl:
        app.iconUrl ||
        app.icon ||
        '',

      apkUrl:
        app.apkUrl ||
        app.apk ||
        ''
    }));

    localStorage.setItem(
      key,
      JSON.stringify(custom)
    );

    // আবার পড়ে নিশ্চিত হওয়া
    const check = JSON.parse(
      localStorage.getItem(key) || '[]'
    );

    if (!Array.isArray(check)) {
      throw new Error('Saved data is not an array');
    }

    return true;

  } catch (error) {

    console.error(
      'Could not save apps:',
      error
    );

    alert(
      'App data could not be saved.'
    );

    return false;
  }
}


// =========================
// ESCAPE HTML
// =========================

function esc(s) {

  return String(s ?? '').replace(
    /[&<>"']/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[c])
  );
}


// =========================
// DRAW APP LIST
// =========================

function draw() {

  const el =
    document.getElementById('appsList');

  if (!el) return;


  if (!custom.length) {

    el.innerHTML =
      '<p class="empty">No custom apps yet.</p>';

    return;
  }


  el.innerHTML = custom.map(a => `

    <div class="app-item ${
      editingId === a.id
        ? 'editing'
        : ''
    }">

      <div class="app-name">
        ${esc(a.name || '')}
      </div>

      <div class="app-info">

        ${esc(a.developer || '')}

        •

        ${esc(a.category || '')}

        •

        Version
        ${esc(a.version || '')}

      </div>

      <div class="app-actions">

        <button
          type="button"
          class="edit-btn"
          onclick="editApp('${esc(a.id)}')"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-btn"
          onclick="removeApp('${esc(a.id)}')"
        >
          Delete
        </button>

      </div>

    </div>

  `).join('');
}


// =========================
// GET FORM VALUE
// =========================

function getValue(id) {

  const el =
    document.getElementById(id);

  if (!el) return '';

  return el.value.trim();
}


// =========================
// SET FORM VALUE
// =========================

function setValue(id, value) {

  const el =
    document.getElementById(id);

  if (el) {

    el.value =
      value ?? '';
  }
}


// =========================
// EDIT APP
// =========================

function editApp(id) {

  const app =
    custom.find(a => a.id === id);

  if (!app) {

    alert('App not found.');

    return;
  }


  editingId = id;


  setValue(
    'appName',
    app.name
  );

  setValue(
    'developer',
    app.developer
  );

  setValue(
    'category',
    app.category || 'Tools'
  );

  setValue(
    'version',
    app.version
  );

  setValue(
    'size',
    app.size
  );

  setValue(
    'android',
    app.android
  );


  // =========================
  // ICON URL
  // =========================

  setValue(
    'iconUrl',
    app.iconUrl || app.icon || ''
  );


  setValue(
    'description',
    app.description
  );


  // =========================
  // APK URL
  // =========================

  setValue(
    'apkUrl',
    app.apkUrl || app.apk || ''
  );


  const title =
    document.getElementById(
      'formTitle'
    );

  if (title) {

    title.textContent =
      'Edit App';
  }


  const submitBtn =
    document.getElementById(
      'submitBtn'
    );

  if (submitBtn) {

    submitBtn.textContent =
      'Update App';

    submitBtn.classList.remove(
      'add-btn'
    );

    submitBtn.classList.add(
      'update-btn'
    );
  }


  const cancelBtn =
    document.getElementById(
      'cancelBtn'
    );

  if (cancelBtn) {

    cancelBtn.style.display =
      'block';
  }


  draw();


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


// =========================
// CANCEL EDIT
// =========================

function cancelEdit() {

  editingId = null;


  const form =
    document.getElementById(
      'appForm'
    );

  if (form) {

    form.reset();
  }


  const title =
    document.getElementById(
      'formTitle'
    );

  if (title) {

    title.textContent =
      'Add App';
  }


  const submitBtn =
    document.getElementById(
      'submitBtn'
    );

  if (submitBtn) {

    submitBtn.textContent =
      'Add app to store';

    submitBtn.classList.remove(
      'update-btn'
    );

    submitBtn.classList.add(
      'add-btn'
    );
  }


  const cancelBtn =
    document.getElementById(
      'cancelBtn'
    );

  if (cancelBtn) {

    cancelBtn.style.display =
      'none';
  }


  draw();
}


// =========================
// DELETE APP
// =========================

function removeApp(id) {

  const app =
    custom.find(a => a.id === id);

  if (!app) return;


  if (
    !confirm(
      `Delete "${app.name}"?`
    )
  ) {

    return;
  }


  custom =
    custom.filter(
      a => a.id !== id
    );


  saveApps();


  if (editingId === id) {

    cancelEdit();

  } else {

    draw();
  }
}


// =========================
// ADD / UPDATE
// =========================

function handleSubmit(e) {

  e.preventDefault();


  // =========================
  // UPDATE EXISTING APP
  // =========================

  if (editingId) {

    const index =
      custom.findIndex(
        a => a.id === editingId
      );


    if (index === -1) {

      alert(
        'App not found.'
      );

      return;
    }


    const oldApp =
      custom[index];


    // =========================
    // GET ICON URL
    // =========================

    const iconInput =
      getValue('iconUrl');


    // যদি নতুন Icon URL দেওয়া হয়
    // তাহলে নতুনটাই থাকবে।
    // খালি থাকলে আগেরটা থাকবে।
    const finalIcon =
      iconInput ||
      oldApp.iconUrl ||
      oldApp.icon ||
      '';


    // =========================
    // GET APK URL
    // =========================

    const apkInput =
      getValue('apkUrl');


    const finalApk =
      apkInput ||
      oldApp.apkUrl ||
      oldApp.apk ||
      '';


    // =========================
    // UPDATED APP
    // =========================

    const updatedApp = {

      ...oldApp,

      name:
        getValue('appName'),

      developer:
        getValue('developer'),

      category:
        getValue('category') ||
        'Tools',

      version:
        getValue('version'),

      size:
        getValue('size'),

      android:
        getValue('android'),

      // দুই field-এই একই URL রাখা হচ্ছে
      iconUrl:
        finalIcon,

      icon:
        finalIcon,

      description:
        getValue('description'),

      apkUrl:
        finalApk,

      apk:
        finalApk,

      id:
        editingId
    };


    custom[index] =
      updatedApp;


    // =========================
    // SAVE
    // =========================

    const saved =
      saveApps();


    if (!saved) {

      return;
    }


    // =========================
    // VERIFY
    // =========================

    loadApps();


    const verify =
      custom.find(
        a => a.id === editingId
      );


    if (!verify) {

      alert(
        'Update could not be verified.'
      );

      return;
    }


    if (
      verify.name !==
      updatedApp.name
    ) {

      alert(
        'Name update could not be verified.'
      );

      return;
    }


    if (
      verify.iconUrl !==
      updatedApp.iconUrl
    ) {

      alert(
        'Icon URL could not be saved.'
      );

      return;
    }


    alert(
      'App updated successfully.'
    );


    cancelEdit();

    return;
  }


  // =========================
  // ADD NEW APP
  // =========================

  const iconInput =
    getValue('iconUrl');


  const apkInput =
    getValue('apkUrl');


  const newApp = {

    name:
      getValue('appName'),

    developer:
      getValue('developer'),

    category:
      getValue('category') ||
      'Tools',

    version:
      getValue('version'),

    size:
      getValue('size'),

    android:
      getValue('android'),

    // Icon দুই জায়গায় রাখা
    iconUrl:
      iconInput,

    icon:
      iconInput,

    description:
      getValue('description'),

    // APK দুই জায়গায় রাখা
    apkUrl:
      apkInput,

    apk:
      apkInput,

    id:
      'custom-' + Date.now()
  };


  custom.unshift(
    newApp
  );


  const saved =
    saveApps();


  if (!saved) {

    return;
  }


  const form =
    document.getElementById(
      'appForm'
    );

  if (form) {

    form.reset();
  }


  alert(
    'App added. Open the store to see it.'
  );


  draw();
}


// =========================
// INITIALIZE
// =========================

function initAdmin() {

  loadApps();


  const form =
    document.getElementById(
      'appForm'
    );


  if (form) {

    form.addEventListener(
      'submit',
      handleSubmit
    );
  }


  const cancelBtn =
    document.getElementById(
      'cancelBtn'
    );


  if (cancelBtn) {

    cancelBtn.addEventListener(
      'click',
      cancelEdit
    );
  }


  // Inline button-এর জন্য
  window.editApp =
    editApp;

  window.removeApp =
    removeApp;

  window.cancelEdit =
    cancelEdit;


  draw();
}


// =========================
// START
// =========================

if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initAdmin
  );

} else {

  initAdmin();
      }
