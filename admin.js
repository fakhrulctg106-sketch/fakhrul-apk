const key='fakhrulapk_apps'; let custom=JSON.parse(localStorage.getItem(key)||'[]');
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function draw(){const el=document.getElementById('adminList'); el.innerHTML=custom.length?custom.map(a=>`<div class="admin-row"><b>${esc(a.name)}</b><span>${esc(a.category)}</span><button onclick="removeApp('${a.id}')">Delete</button></div>`).join(''):'<p class="muted">No custom apps yet.</p>'}
function removeApp(id){custom=custom.filter(a=>a.id!==id);localStorage.setItem(key,JSON.stringify(custom));draw()}
document.getElementById('appForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const a=Object.fromEntries(f);a.id='custom-'+Date.now();custom.unshift(a);localStorage.setItem(key,JSON.stringify(custom));e.target.reset();draw();alert('App added. Open the store to see it.');});
draw();