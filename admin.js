/* =========================================================
   FAKHRUL APK STORE
   Firebase Firestore + Google Admin Login
========================================================= */


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD1eUCBB6vkFIUPQnFtNM1Tgrywze_LMbQ",
  authDomain: "fakhrul-apk-store.firebaseapp.com",
  databaseURL: "https://fakhrul-apk-store-default-rtdb.firebaseio.com",
  projectId: "fakhrul-apk-store",
  storageBucket: "fakhrul-apk-store.firebasestorage.app",
  messagingSenderId: "931246639573",
  appId: "1:931246639573:web:bb957d8e3ed4f77dfa555c"
};


/* =========================================================
   ADMIN EMAIL
========================================================= */

const ADMIN_EMAIL = "fakhrulctg106@gmail.com";


/* =========================================================
   OLD LOCAL STORAGE KEY
========================================================= */

const OLD_STORAGE_KEY = "fakhrulapk_apps";


/* =========================================================
   FIREBASE INITIALIZE
========================================================= */

if (
  typeof firebase !== "undefined" &&
  !firebase.apps.length
) {
  firebase.initializeApp(FIREBASE_CONFIG);
}


const db =
  typeof firebase !== "undefined"
    ? firebase.firestore()
    : null;


const auth =
  typeof firebase !== "undefined"
    ? firebase.auth()
    : null;


let custom = [];
let editingId = null;
let currentUser = null;


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(s) {

  return String(s ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c])
  );

}


/* =========================================================
   GET FORM VALUE
========================================================= */

function getValue(id) {

  const el =
    document.getElementById(id);

  if (!el) return "";

  return el.value.trim();

}


/* =========================================================
   SET FORM VALUE
========================================================= */

function setValue(id, value) {

  const el =
    document.getElementById(id);

  if (el) {
    el.value = value ?? "";
  }

}


/* =========================================================
   NORMALIZE APP
========================================================= */

function normalizeApp(app) {

  return {

    ...app,

    iconUrl:
      app.iconUrl ||
      app.icon ||
      "",

    icon:
      app.iconUrl ||
      app.icon ||
      "",

    apkUrl:
      app.apkUrl ||
      app.apk ||
      "",

    apk:
      app.apkUrl ||
      app.apk ||
      ""

  };

}


/* =========================================================
   LOAD APPS FROM FIRESTORE
========================================================= */

async function loadApps() {

  if (!db) {

    console.error(
      "Firebase Firestore is not available."
    );

    return;

  }


  try {

    const snapshot =
      await db
        .collection("apps")
        .get();


    custom =
      snapshot.docs.map(doc => {

        const data =
          doc.data();

        return normalizeApp({

          ...data,

          id:
            data.id ||
            doc.id

        });

      });


    console.log(
      "Firebase apps loaded:",
      custom
    );


    draw();

  } catch (error) {

    console.error(
      "Could not load apps from Firebase:",
      error
    );


    alert(
      "Firebase থেকে App লোড করা যায়নি। Firestore Rules পরীক্ষা করুন।"
    );

  }

}


/* =========================================================
   REAL-TIME FIRESTORE LISTENER
========================================================= */

function listenForApps() {

  if (!db) return;


  db.collection("apps")
    .onSnapshot(

      snapshot => {

        custom =
          snapshot.docs.map(doc => {

            const data =
              doc.data();

            return normalizeApp({

              ...data,

              id:
                data.id ||
                doc.id

            });

          });


        console.log(
          "Firebase apps updated:",
          custom
        );


        draw();

      },

      error => {

        console.error(
          "Firebase listener error:",
          error
        );

      }

    );

}


/* =========================================================
   DRAW APP LIST
========================================================= */

function draw() {

  const el =
    document.getElementById(
      "appsList"
    );


  if (!el) return;


  if (!custom.length) {

    el.innerHTML =
      '<p class="empty">No apps yet.</p>';

    return;

  }


  el.innerHTML =
    custom.map(a => `

      <div class="app-item ${
        editingId === a.id
          ? "editing"
          : ""
      }">

        <div class="app-name">
          ${esc(a.name || "")}
        </div>


        <div class="app-info">

          ${esc(a.developer || "")}

          •

          ${esc(a.category || "")}

          •

          Version
          ${esc(a.version || "")}

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

    `).join("");

}


/* =========================================================
   EDIT APP
========================================================= */

function editApp(id) {

  const app =
    custom.find(
      a =>
        String(a.id) ===
        String(id)
    );


  if (!app) {

    alert(
      "App not found."
    );

    return;

  }


  editingId =
    app.id;


  setValue(
    "appName",
    app.name
  );


  setValue(
    "developer",
    app.developer
  );


  setValue(
    "category",
    app.category ||
    "Tools"
  );


  setValue(
    "version",
    app.version
  );


  setValue(
    "size",
    app.size
  );


  setValue(
    "android",
    app.android
  );


  setValue(
    "iconUrl",
    app.iconUrl ||
    app.icon ||
    ""
  );


  setValue(
    "description",
    app.description
  );


  setValue(
    "apkUrl",
    app.apkUrl ||
    app.apk ||
    ""
  );


  const title =
    document.getElementById(
      "formTitle"
    );


  if (title) {

    title.textContent =
      "Edit App";

  }


  const submitBtn =
    document.getElementById(
      "submitBtn"
    );


  if (submitBtn) {

    submitBtn.textContent =
      "Update App";


    submitBtn.classList.remove(
      "add-btn"
    );


    submitBtn.classList.add(
      "update-btn"
    );

  }


  const cancelBtn =
    document.getElementById(
      "cancelBtn"
    );


  if (cancelBtn) {

    cancelBtn.style.display =
      "block";

  }


  draw();


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =========================================================
   CANCEL EDIT
========================================================= */

function cancelEdit() {

  editingId =
    null;


  const form =
    document.getElementById(
      "appForm"
    );


  if (form) {

    form.reset();

  }


  const title =
    document.getElementById(
      "formTitle"
    );


  if (title) {

    title.textContent =
      "Add App";

  }


  const submitBtn =
    document.getElementById(
      "submitBtn"
    );


  if (submitBtn) {

    submitBtn.textContent =
      "Add app to store";


    submitBtn.classList.remove(
      "update-btn"
    );


    submitBtn.classList.add(
      "add-btn"
    );

  }


  const cancelBtn =
    document.getElementById(
      "cancelBtn"
    );


  if (cancelBtn) {

    cancelBtn.style.display =
      "none";

  }


  draw();

}


/* =========================================================
   DELETE APP
========================================================= */

async function removeApp(id) {

  const app =
    custom.find(
      a =>
        String(a.id) ===
        String(id)
    );


  if (!app) return;


  if (
    !confirm(
      `Delete "${app.name}"?`
    )
  ) {

    return;

  }


  if (!db) {

    alert(
      "Firebase is not available."
    );

    return;

  }


  try {

    await db
      .collection("apps")
      .doc(String(id))
      .delete();


    if (
      String(editingId) ===
      String(id)
    ) {

      cancelEdit();

    }


    alert(
      "App deleted successfully."
    );


  } catch (error) {

    console.error(
      "Delete error:",
      error
    );


    alert(
      "App delete করা যায়নি। Firebase Rules পরীক্ষা করুন।"
    );

  }

}


/* =========================================================
   ADD / UPDATE APP
========================================================= */

async function handleSubmit(e) {

  e.preventDefault();


  if (!currentUser) {

    alert(
      "প্রথমে Admin Google Login করুন।"
    );

    return;

  }


  if (!db) {

    alert(
      "Firebase Firestore পাওয়া যাচ্ছে না।"
    );

    return;

  }


  /* =====================================================
     UPDATE EXISTING APP
  ===================================================== */

  if (editingId) {

    const oldApp =
      custom.find(
        a =>
          String(a.id) ===
          String(editingId)
      );


    if (!oldApp) {

      alert(
        "App not found."
      );

      return;

    }


    const iconInput =
      getValue("iconUrl");


    const apkInput =
      getValue("apkUrl");


    const finalIcon =
      iconInput ||
      oldApp.iconUrl ||
      oldApp.icon ||
      "";


    const finalApk =
      apkInput ||
      oldApp.apkUrl ||
      oldApp.apk ||
      "";


    const updatedApp = {

      ...oldApp,

      id:
        String(editingId),

      name:
        getValue("appName"),

      developer:
        getValue("developer"),

      category:
        getValue("category") ||
        "Tools",

      version:
        getValue("version"),

      size:
        getValue("size"),

      android:
        getValue("android"),

      iconUrl:
        finalIcon,

      icon:
        finalIcon,

      description:
        getValue("description"),

      apkUrl:
        finalApk,

      apk:
        finalApk,

      updatedAt:
        firebase.firestore
          .FieldValue
          .serverTimestamp()

    };


    try {

      await db
        .collection("apps")
        .doc(
          String(editingId)
        )
        .set(
          updatedApp,
          {
            merge: true
          }
        );


      alert(
        "App updated successfully."
      );


      cancelEdit();


    } catch (error) {

      console.error(
        "Update error:",
        error
      );


      alert(
        "App update করা যায়নি। Firebase Rules পরীক্ষা করুন।"
      );

    }


    return;

  }


  /* =====================================================
     ADD NEW APP
  ===================================================== */

  const iconInput =
    getValue("iconUrl");


  const apkInput =
    getValue("apkUrl");


  const newId =
    "custom-" +
    Date.now();


  const newApp = {

    id:
      newId,

    name:
      getValue("appName"),

    developer:
      getValue("developer"),

    category:
      getValue("category") ||
      "Tools",

    version:
      getValue("version"),

    size:
      getValue("size"),

    android:
      getValue("android"),

    iconUrl:
      iconInput,

    icon:
      iconInput,

    description:
      getValue("description"),

    apkUrl:
      apkInput,

    apk:
      apkInput,

    createdAt:
      firebase.firestore
        .FieldValue
        .serverTimestamp(),

    updatedAt:
      firebase.firestore
        .FieldValue
        .serverTimestamp()

  };


  try {

    await db
      .collection("apps")
      .doc(newId)
      .set(newApp);


    const form =
      document.getElementById(
        "appForm"
      );


    if (form) {

      form.reset();

    }


    alert(
      "App added successfully. এখন অন্য ফোন থেকেও দেখা যাবে।"
    );


    draw();


  } catch (error) {

    console.error(
      "Add app error:",
      error
    );


    alert(
      "App যোগ করা যায়নি। Firebase Rules এবং Admin Login পরীক্ষা করুন।"
    );

  }

}


/* =========================================================
   MIGRATE OLD LOCAL STORAGE APPS
========================================================= */

async function migrateOldApps() {

  if (!db) return;


  try {

    const oldData =
      localStorage.getItem(
        OLD_STORAGE_KEY
      );


    if (!oldData) {

      return;

    }


    const oldApps =
      JSON.parse(oldData);


    if (
      !Array.isArray(oldApps) ||
      !oldApps.length
    ) {

      return;

    }


    console.log(
      "Old localStorage apps found:",
      oldApps.length
    );


    let migratedCount =
      0;


    for (const oldApp of oldApps) {

      const app =
        normalizeApp(oldApp);


      const id =
        String(
          app.id ||
          (
            "custom-" +
            Date.now() +
            "-" +
            Math.random()
              .toString(36)
              .slice(2, 8)
          )
        );


      const firebaseApp = {

        ...app,

        id,

        createdAt:
          firebase.firestore
            .FieldValue
            .serverTimestamp(),

        updatedAt:
          firebase.firestore
            .FieldValue
            .serverTimestamp()

      };


      await db
        .collection("apps")
        .doc(id)
        .set(
          firebaseApp,
          {
            merge: true
          }
        );


      migratedCount++;

    }


    if (migratedCount > 0) {

      alert(
        `${migratedCount}টি পুরোনো App Firebase-এ সংরক্ষণ করা হয়েছে।`
      );

    }


  } catch (error) {

    console.error(
      "Migration error:",
      error
    );

  }

}


/* =========================================================
   GOOGLE ADMIN LOGIN
========================================================= */

async function adminLogin() {

  if (!auth) {

    alert(
      "Firebase Authentication পাওয়া যাচ্ছে না।"
    );

    return;

  }


  try {

    const provider =
      new firebase.auth.GoogleAuthProvider();


    const result =
      await auth.signInWithPopup(
        provider
      );


    const user =
      result.user;


    if (!user) {

      return;

    }


    if (
      user.email.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      await auth.signOut();


      alert(
        "এই Google account Admin হিসেবে অনুমোদিত নয়।"
      );


      return;

    }


    currentUser =
      user;


    updateLoginUI();


    await migrateOldApps();


    await loadApps();


  } catch (error) {

    console.error(
      "Google login error:",
      error
    );


    alert(
      "Google Login করা যায়নি। Firebase Authentication পরীক্ষা করুন।"
    );

  }

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

async function adminLogout() {

  if (!auth) return;


  try {

    await auth.signOut();

    currentUser =
      null;


    updateLoginUI();


  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

  }

}


/* =========================================================
   UPDATE LOGIN UI
========================================================= */

function updateLoginUI() {

  const loginBtn =
    document.getElementById(
      "googleLoginBtn"
    );


  const logoutBtn =
    document.getElementById(
      "logoutBtn"
    );


  const adminPanel =
    document.getElementById(
      "adminPanel"
    );


  const loginBox =
    document.getElementById(
      "loginBox"
    );


  const userInfo =
    document.getElementById(
      "userInfo"
    );


  if (currentUser) {

    if (loginBtn) {

      loginBtn.style.display =
        "none";

    }


    if (logoutBtn) {

      logoutBtn.style.display =
        "block";

    }


    if (adminPanel) {

      adminPanel.style.display =
        "block";

    }


    if (loginBox) {

      loginBox.style.display =
        "none";

    }


    if (userInfo) {

      userInfo.textContent =
        currentUser.email || "";

    }

  } else {

    if (loginBtn) {

      loginBtn.style.display =
        "block";

    }


    if (logoutBtn) {

      logoutBtn.style.display =
        "none";

    }


    if (adminPanel) {

      adminPanel.style.display =
        "none";

    }


    if (loginBox) {

      loginBox.style.display =
        "block";

    }


    if (userInfo) {

      userInfo.textContent =
        "";

    }

  }

}


/* =========================================================
   AUTH STATE
========================================================= */

function listenForAuth() {

  if (!auth) {

    console.error(
      "Firebase Auth is not available."
    );

    return;

  }


  auth.onAuthStateChanged(
    async user => {

      if (!user) {

        currentUser =
          null;


        updateLoginUI();


        return;

      }


      if (
        user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
      ) {

        await auth.signOut();


        currentUser =
          null;


        updateLoginUI();


        return;

      }


      currentUser =
        user;


      updateLoginUI();


      await migrateOldApps();


      await loadApps();


      listenForApps();

    }
  );

}


/* =========================================================
   INITIALIZE ADMIN
========================================================= */

function initAdmin() {

  updateLoginUI();


  const form =
    document.getElementById(
      "appForm"
    );


  if (form) {

    form.addEventListener(
      "submit",
      handleSubmit
    );

  }


  const cancelBtn =
    document.getElementById(
      "cancelBtn"
    );


  if (cancelBtn) {

    cancelBtn.addEventListener(
      "click",
      cancelEdit
    );

  }


  const loginBtn =
    document.getElementById(
      "googleLoginBtn"
    );


  if (loginBtn) {

    loginBtn.addEventListener(
      "click",
      adminLogin
    );

  }


  const logoutBtn =
    document.getElementById(
      "logoutBtn"
    );


  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      adminLogout
    );

  }


  window.editApp =
    editApp;


  window.removeApp =
    removeApp;


  window.cancelEdit =
    cancelEdit;


  window.adminLogin =
    adminLogin;


  window.adminLogout =
    adminLogout;


  draw();


  listenForAuth();

}


/* =========================================================
   START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initAdmin
  );

} else {

  initAdmin();

}
