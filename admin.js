const key = 'fakhrulapk_apps';

let custom = JSON.parse(localStorage.getItem(key) || '[]');
let editingId = null;

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[c]));
}

function draw() {
  const el = document.getElementById('appsList');

  if (!el) return;

  if (!custom.length) {
    el.innerHTML = '<p class="empty">No custom apps yet.</p>';
    return;
  }

  el.innerHTML = custom.map(a => `
    <div class="app-item ${editingId === a.id ? 'editing' : ''}">
      <div class="app-name">${esc(a.name || '')}</div>

      <div class="app-info">
        ${esc(a.developer || '')} •
        ${esc(a.category || '')} •
        Version ${esc(a.version || '')}
      </div>

      <div class="app-actions">
        <button
          class="edit-btn"
          onclick="editApp('${esc(a.id)}')">
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="removeApp('${esc(a.id)}')">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}


function saveApps() {
  localStorage.setItem(key, JSON.stringify(custom));
}


function editApp(id) {
  const app = custom.find(a => a.id === id);

  if (!app) return;

  editingId = id;

  document.getElementById('appName').value = app.name || '';
  document.getElementById('developer').value = app.developer || '';
  document.getElementById('category').value = app.category || 'Tools';
  document.getElementById('version').value = app.version || '';
  document.getElementById('size').value = app.size || '';
  document.getElementById('android').value = app.android || '';
  document.getElementById('iconUrl').value = app.iconUrl || '';
  document.getElementById('description').value = app.description || '';
  document.getElementById('apkUrl').value = app.apkUrl || '';

  document.getElementById('formTitle').textContent = 'Edit App';

  const submitBtn = document.getElementById('submitBtn');

  submitBtn.textContent = 'Update App';
  submitBtn.classList.remove('add-btn');
  submitBtn.classList.add('update-btn');

  document.getElementById('cancelBtn').style.display = 'block';

  draw();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


function cancelEdit() {
  editingId = null;

  document.getElementById('appForm').reset();

  document.getElementById('formTitle').textContent = 'Add App';

  const submitBtn = document.getElementById('submitBtn');

  submitBtn.textContent = 'Add app to store';
  submitBtn.classList.remove('update-btn');
  submitBtn.classList.add('add-btn');

  document.getElementById('cancelBtn').style.display = 'none';

  draw();
}


function removeApp(id) {
  const app = custom.find(a => a.id === id);

  if (!app) return;

  if (!confirm(`Delete "${app.name}"?`)) {
    return;
  }

  custom = custom.filter(a => a.id !== id);

  saveApps();

  if (editingId === id) {
    cancelEdit();
  } else {
    draw();
  }
}


document.getElementById('appForm').addEventListener('submit', e => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);
  const values = Object.fromEntries(data);

  if (editingId) {

    const index = custom.findIndex(a => a.id === editingId);

    if (index !== -1) {
      custom[index] = {
        ...custom[index],
        ...values,
        id: editingId
      };
    }

    saveApps();

    alert('App updated successfully.');

    cancelEdit();

  } else {

    const app = {
      ...values,
      id: 'custom-' + Date.now()
    };

    custom.unshift(app);

    saveApps();

    form.reset();

    alert('App added. Open the store to see it.');

    draw();
  }
});


document.getElementById('cancelBtn').addEventListener(
  'click',
  cancelEdit
);


draw();
