/* =========================================================
   FAKHRUL APK STORE
   Firebase Firestore powered apps.js
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
   FIREBASE INITIALIZATION
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


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

let category = "All";

let firestoreApps = [];

let appsLoaded = false;


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}


/* =========================================================
   NORMALIZE APP DATA
========================================================= */

function normalizeApp(a) {

  return {
    ...a,

    icon:
      a.iconUrl ||
      a.icon ||
      "assets/icon-default.svg",

    apk:
      a.apkUrl ||
      a.apk ||
      "#"
  };
}


/* =========================================================
   LOAD APPS FROM FIRESTORE
========================================================= */

async function loadFirestoreApps() {

  if (!db) {
    console.error("Firebase Firestore is not available.");
    return [];
  }

  try {

    const snapshot =
      await db.collection("apps").get();

    firestoreApps =
      snapshot.docs.map(doc => {

        const data = doc.data();

        return normalizeApp({
          ...data,

          id:
            data.id ||
            doc.id
        });

      });

    appsLoaded = true;

    console.log(
      "Firebase apps loaded:",
      firestoreApps
    );

    return firestoreApps;

  } catch (error) {

    console.error(
      "Could not load apps from Firebase:",
      error
    );

    return [];

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

        firestoreApps =
          snapshot.docs.map(doc => {

            const data = doc.data();

            return normalizeApp({
              ...data,

              id:
                data.id ||
                doc.id
            });

          });

        appsLoaded = true;

        console.log(
          "Firebase apps updated:",
          firestoreApps
        );

        render();

        detail();

      },

      error => {

        console.error(
          "Firebase real-time listener error:",
          error
        );

      }

    );
}


/* =========================================================
   GET ALL APPS
========================================================= */

function getAllApps() {

  const defaultApps =
    typeof DEFAULT_APPS !== "undefined"
      ? DEFAULT_APPS
      : [];

  return [
    ...firestoreApps,
    ...defaultApps
  ];
}


/* =========================================================
   APP CARD
========================================================= */

function card(a) {

  const icon =
    a.icon ||
    a.iconUrl ||
    "assets/icon-default.svg";

  return `
    <article class="app-card">

      <img
        src="${esc(icon)}"
        alt="${esc(a.name || "")}"
        onerror="this.onerror=null;this.src='assets/icon-default.svg';"
      >

      <div class="app-info">

        <span class="tag">
          ${esc(a.category || "")}
        </span>

        <h3>
          ${esc(a.name || "")}
        </h3>

        <p>
          ${esc(a.developer || "")}
        </p>

        <div class="meta">
          ${esc(a.version || "")}
          ·
          ${esc(a.size || "")}
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


/* =========================================================
   STORE RENDER
========================================================= */

function render() {

  const latestApps =
    getAllApps();

  const q =
    (
      document.getElementById("search")?.value ||
      ""
    )
      .toLowerCase()
      .trim();


  const list =
    latestApps.filter(a => {

      const text = `
        ${a.name || ""}
        ${a.developer || ""}
        ${a.category || ""}
      `.toLowerCase();

      return (
        (
          category === "All" ||
          a.category === category
        ) &&
        text.includes(q)
      );

    });


  const el =
    document.getElementById("apps");


  if (el) {

    el.innerHTML =
      list.map(card).join("") ||
      '<div class="empty">No apps found.</div>';


    const count =
      document.getElementById("count");


    if (count) {

      count.textContent =
        `${list.length} apps`;

    }

  }

}


/* =========================================================
   SEARCH
========================================================= */

function filterApps() {

  render();

}


/* =========================================================
   CATEGORY
========================================================= */

function setCategory(c) {

  category = c;

  render();

}


/* =========================================================
   FIND APP
========================================================= */

function findAppById(id) {

  const latestApps =
    getAllApps();

  return latestApps.find(
    x =>
      String(x.id) ===
      String(id)
  );

}


/* =========================================================
   APP DETAIL
========================================================= */

function detail() {

  const id =
    new URLSearchParams(
      location.search
    ).get("id");


  const el =
    document.getElementById("detail");


  if (!el) return;


  const a =
    findAppById(id);


  if (!a) {

    if (!appsLoaded) {

      el.innerHTML =
        '<div class="empty">Loading app...</div>';

      return;

    }

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
    "assets/icon-default.svg";


  /* =========================
     APK
  ========================= */

  const apk =
    a.apk ||
    a.apkUrl ||
    "#";


  /* =========================
     DETAIL HTML
  ========================= */

  el.innerHTML = `

    <div class="detail-card">

      <img
        class="detail-icon"
        src="${esc(icon)}"
        alt="${esc(a.name || "")}"
        onerror="this.onerror=null;this.src='assets/icon-default.svg';"
      >

      <div>

        <span class="tag">
          ${esc(a.category || "")}
        </span>

        <h1>
          ${esc(a.name || "")}
        </h1>

        <p class="developer">
          By ${esc(a.developer || "")}
        </p>

        <p>
          ${esc(a.description || "")}
        </p>

        <div class="facts">

          <span>
            <b>Version</b>
            ${esc(a.version || "")}
          </span>

          <span>
            <b>Size</b>
            ${esc(a.size || "")}
          </span>

          <span>
            <b>Android</b>
            ${esc(a.android || "")}
          </span>

        </div>

        <a
          class="primary download-big"
          href="${esc(apk)}"
          ${
            apk === "#"
              ? `onclick="alert('Add your real APK URL from the Admin page.');return false;"`
              : ""
          }
        >
          Download APK
        </a>

      </div>

    </div>

  `;

}


/* =========================================================
   START FIREBASE
========================================================= */

async function startStore() {

  try {

    /*
      প্রথমে Firestore থেকে apps load করি
    */

    await loadFirestoreApps();


    /*
      তারপর real-time listener চালু করি।
      Admin থেকে নতুন app যোগ/পরিবর্তন/delete করলে
      Store নিজে থেকেই update হবে।
    */

    listenForApps();


    /*
      প্রথম render
    */

    render();

    detail();

  } catch (error) {

    console.error(
      "Store initialization error:",
      error
    );

    render();

    detail();

  }

}


/* =========================================================
   START
========================================================= */

startStore();
