/* KISTORE – kuratiertes Verzeichnis für KI-Webapps. UI, Router, Live-Backend (supabase-js) bzw. Demo-Backend (demo.js). Kein Build-Schritt. */
(function () {
  "use strict";
  const C = window.AW_CONFIG || {};
  const DEMO = !C.supabaseUrl;
  const BRAND = C.brand || "KISTORE";
  const PAY = window.KI_PAY || { channel: () => "web", webUrl: () => "", native: false };
  if (C.brandColors) C.brandColors.forEach((c, i) => document.documentElement.style.setProperty("--b" + (i + 1), c));

  // ====================== Hilfen ======================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmtNum = (n) => n >= 1000 ? (n / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " Tsd." : String(n);
  const fmtRating = (r) => Number(r).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmtDate = (d) => new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
  const relDate = (d) => { const days = Math.floor((Date.now() - new Date(d)) / 864e5); return days < 1 ? "Heute" : days < 2 ? "Gestern" : days < 7 ? `vor ${days} Tagen` : days < 30 ? `vor ${Math.floor(days / 7)} Wo.` : fmtDate(d); };
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");

  // ---------- Symbole (eigene Linien-Icons, keine fremden Logos) ----------
  const P = {
    sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15v4M17 17h4M5 3v3M3.5 4.5h3",
    pen: "M4 20l4.2-1L19 8.2 15.8 5 5 15.8zM13.8 7l3.2 3.2",
    doc: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
    feather: "M20 4C12 4 6 9 6 17v3M20 4c0 8-5 12-11 12M10 12h5",
    mail: "M3 6h18v12H3zM3 7l9 6 9-6",
    image: "M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 8.5a1.5 1.5 0 1 0 0 .01",
    camera: "M4 7h4l2-3h4l2 3h4v12H4zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    palette: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8zM7.5 11h.01M10 7h.01M15 7h.01",
    brush: "M18 3l3 3-9 9-3-3zM9 12c-3 0-4 2-4 4 0 1.5-1 2.5-2 3 4 1 8 0 9-4",
    play: "M8 5v14l11-7z",
    film: "M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4.5-6 8-6s7 2 8 6",
    captions: "M3 5h18v14H3zM7 11h3M7 15h6M13 11h4M15 15h2",
    slides: "M3 4h18v12H3zM12 16v4M8 20h8M7 12l3-3 2 2 4-4",
    music: "M9 18V6l11-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
    mic: "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3",
    wave: "M3 12h1M7 8v8M11 5v14M15 9v6M19 11v2",
    note: "M9 17V5l9-2v12M9 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM18 15a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM9 9l9-2",
    code: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
    terminal: "M3 5h18v14H3zM7 10l3 2-3 2M12 15h5",
    db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    bug: "M8 10a4 4 0 0 1 8 0v4a4 4 0 0 1-8 0zM12 10v8M4 13h4M16 13h4M5 7l3 2M19 7l-3 2M5 19l3-2M19 19l-3-2M10 4l1 2M14 4l-1 2",
    calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M9 15l2 2 4-4",
    chat: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
    leaf: "M5 19C5 10 11 5 20 5c0 9-5 15-14 15M5 19l8-8",
    bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z",
    globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
    quiz: "M9.2 9a3 3 0 1 1 3.8 2.9c-.6.2-1 .8-1 1.5V14M12 17.5h.01M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z",
    sigma: "M18 5H6l6 7-6 7h12",
    briefcase: "M3 8h18v11H3zM9 8V5h6v3M3 13h18",
    scale: "M12 4v16M6 20h12M4 8h16M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0z",
    chart: "M4 20V10M10 20V4M16 20v-7M21 20H3",
    target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
    compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
    news: "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7 9h7M7 13h7M7 16h4",
    chef: "M7 14a4 4 0 1 1 2-7.5 4 4 0 0 1 6 0A4 4 0 1 1 17 14v6H7zM7 17h10",
    heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
    moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
    plane: "M3 13l18-8-6 16-3.5-6.5zM11.5 14.5L21 5",
    check: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12.5l2.7 2.7L16 9.5",
    cap: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v5",
    megaphone: "M3 10v4l13 5V5zM16 8a4 4 0 0 1 0 8M6 14l1 5h3l-1-4",
    smile: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 14c1 1.5 2.3 2 4 2s3-.5 4-2M9 9.5h.01M15 9.5h.01",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
    star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
    today: "M5 3h14v18H5zM8.5 7h7M8.5 11h7M8.5 15h4",
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
    person: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zM12 12.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM6.2 18.5c1.3-2.3 3.4-3.5 5.8-3.5s4.5 1.2 5.8 3.5",
    chevL: "M15 4l-8 8 8 8", chevR: "M9 5l7 7-7 7", chevD: "M6 9l6 6 6-6",
    x: "M6 6l12 12M18 6L6 18",
    share: "M12 3v12M8 7l4-4 4 4M5 11v9h14v-9",
    ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5",
    lock: "M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
    crown: "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z",
    plus: "M12 5v14M5 12h14",
    upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
    download: "M12 4v12M7 11l5 5 5-5M4 20h16",
    info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5h.01",
    logout: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11",
    trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
    card: "M3 6h18v12H3zM3 10h18M7 15h4",
    write: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
    rocket: "M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M9 15l-3-3c1-4 4-8 10-9 0 0 .5 6-9 12zM14.5 9.5a1.5 1.5 0 1 0 0 .01",
    sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4",
    bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
    stack: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
    tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    reply: "M10 8L4 13l6 5M4 13h10a6 6 0 0 1 6 6",
    plusc: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v8M8 12h8",
    apple: "M16 3c0 2-1.5 3.5-3.3 3.5C12.5 4.6 14 3 16 3zM12 7.5c1 0 2.3-.9 3.6-.9 1.7 0 3 1 3.8 2.3-3 1.7-2.4 6 .6 7.2-.7 1.8-2 4-3.6 4-1.3 0-1.7-.8-3.3-.8s-2 .8-3.3.8C7.3 20.1 4.5 15.7 4.5 12c0-3.1 2-5.2 4.3-5.2 1.3 0 2.2.7 3.2.7z"
  };
  const verSvg = `<svg class="verb" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l2.4 1.8 3-.2 1 2.8 2.6 1.6-.6 2.9 1.4 2.6-2 2.2-.3 3-2.9.7-1.7 2.5-2.8-1-2.8 1-1.7-2.5-2.9-.7-.3-3-2-2.2 1.4-2.6-.6-2.9 2.6-1.6 1-2.8 3 .2z" fill="currentColor"/><path d="M8 12.3l2.6 2.6L16.2 9.3" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const verBadge = (cr, label = false) => cr && cr.verified !== false ? `<span class="ver" title="Verifizierter Ersteller" aria-label="Verifizierter Ersteller">${verSvg}${label ? "Verifiziert" : ""}</span>` : "";
  const ic = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n] || P.sparkle}"/></svg>`;
  const starSvg = (fill) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${P.star}" fill="${fill === 1 ? "currentColor" : fill === 0.5 ? "url(#half)" : "none"}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const stars = (r, cls = "") => `<span class="stars ${cls}" aria-label="${fmtRating(r)} von 5 Sternen">${[1, 2, 3, 4, 5].map((i) => starSvg(r >= i - 0.25 ? 1 : r >= i - 0.75 ? 0.5 : 0)).join("")}</span>`;
  const A = window.KI_ART;
  // App-Icons: glänzende, geschichtete SVG-Icons (6 Stilfamilien, deterministisch je App)
  const iconSrc = (a) => A.iconURI({ id: a.id, c1: a.icon.c1, c2: a.icon.c2 }, P[a.icon.glyph] || P.sparkle);
  const icon = (a, s = 60) => `<div class="ico" style="--s:${s}px"><img src="${iconSrc(a)}" alt="" decoding="async"></div>`;
  const catIcon = (c, s = 36) => `<div class="ico" style="--s:${s}px"><img src="${A.iconURI({ id: "cat-" + c.id, c1: c.c1, c2: c.c2 }, P[c.glyph] || P.sparkle, 0)}" alt=""></div>`;
  const logo = (s = 84) => `<div class="ico logo" style="--s:${s}px"><img src="icons/logo.svg" alt="${esc(BRAND)}"></div>`;
  const storyArt = (s) => { const ids = [s.app_id, ...(s.apps || [])].filter(Boolean); const pool = ids.map((id) => S.byId.get(id)).filter(Boolean); const extra = S.cat.apps.filter((x) => !ids.includes(x.id)).sort((x, y) => y.popularity - x.popularity).slice(0, 8);
    return `<div class="art">${A.story({ seed: s.id, c1: s.art.c1, c2: s.art.c2, c3: s.art.c3, path: P[s.art.glyph] || P.sparkle, icons: pool.concat(extra).slice(0, 8).map(iconSrc), template: s.art.template })}</div>`; };
  const tileArt = (o, seed, w, h, gx, gy, scale) => `<div class="art">${A.tile({ seed, c1: o.c1, c2: o.c2, path: P[o.glyph] || P.sparkle, w, h, gx, gy, scale })}</div>`;
  const PRICE = { free: "Kostenlos", freemium: "Freemium", subscription: "Abo", one_time: "Einmalkauf" };
  const priceBadge = (a) => `<span class="pb ${a.price_model}">${PRICE[a.price_model]}</span>`;

  // ====================== Live-Backend (Supabase, gemeinsames Projekt, Tabellen aw_*) ======================
  function liveBackend() {
    const sb = window.supabase.createClient(C.supabaseUrl, C.anonKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "aw-auth" } });
    const fn = async (action, body = {}) => {
      const { data, error } = await sb.functions.invoke(C.functionName || "aiwebapps", { body: { action, ...body } });
      if (error) {
        let m = error.message, code;
        try { const j = await error.context.json(); m = j.error || m; code = j.code; } catch {}
        const e = new Error(m); e.code = code; throw e;
      }
      return data;
    };
    const q = async (p) => { const { data, error } = await p; if (error) throw new Error(error.message); return data; };
    const session = async () => (await sb.auth.getSession()).data.session;
    const mail = (u) => `${String(u || "").trim().toLowerCase()}@${C.emailDomain}`;
    return {
      demo: false,
      async catalog() {
        const [categories, creators, apps, placements, collections, stories, updates, deals] = await Promise.all([
          q(sb.from("aw_categories").select("*").order("sort")), q(sb.from("aw_creators").select("id,name,verified,since")), q(sb.from("aw_apps_public").select("*")),
          q(sb.from("aw_placements_active").select("*")), q(sb.from("aw_collections_public").select("*").order("sort")), q(sb.from("aw_stories").select("*").eq("published", true).order("sort")),
          q(sb.from("aw_app_updates_public").select("*").order("created_at", { ascending: false }).limit(300)), q(sb.from("aw_deals_public").select("*"))]);
        return { categories, creators, apps, placements, collections, stories, updates, deals, trending: ["Bilder erstellen", "Untertitel", "E-Mail schreiben", "Präsentation", "Nachhilfe", "Podcast"] };
      },
      reviews: (appId) => q(sb.from("aw_reviews_public").select("*").eq("app_id", appId).order("created_at", { ascending: false }).limit(200)),
      async me() { return (await session()) ? fn("me") : null; },
      async register(f) { await fn("register", f); const { error } = await sb.auth.signInWithPassword({ email: mail(f.username), password: f.password }); if (error) throw new Error(error.message); return fn("me"); },
      async login({ username, password }) { const { error } = await sb.auth.signInWithPassword({ email: mail(username), password }); if (error) throw new Error("Benutzername oder Passwort falsch"); return fn("me"); },
      logout: () => sb.auth.signOut(),
      updateProfile: (f) => fn("profile_update", f),
      async deleteAccount() { await fn("account_delete"); await sb.auth.signOut({ scope: "local" }); return true; },
      exportData: () => fn("export"),
      async favorites() { if (!(await session())) return []; return (await q(sb.from("aw_favorites").select("app_id,created_at").order("created_at", { ascending: false }))).map((r) => r.app_id); },
      toggleFavorite: (app_id) => fn("fav_toggle", { app_id }),
      saveReview: (f) => fn("review_save", f),
      deleteReview: (id) => fn("review_delete", { id }),
      async myReviews() { const s = await session(); if (!s) return []; return q(sb.from("aw_reviews").select("*").eq("user_id", s.user.id)); },
      report: (f) => fn("report", f),
      submitApp: (f) => fn("submit_app", f),
      async mySubmissions() { if (!(await session())) return []; return q(sb.from("aw_submissions").select("*").order("created_at", { ascending: false })); },
      sponsorRequest: (f) => fn("sponsor_request", f),
      async follows() { if (!(await session())) return []; return (await q(sb.from("aw_follows").select("app_id,created_at").order("created_at", { ascending: false }))).map((r) => r.app_id); },
      toggleFollow: (app_id) => fn("follow_toggle", { app_id }),
      track: (app_id, kind) => fn("track", { app_id, kind }).catch(() => null),
      postUpdate: (f) => fn("update_post", f),
      deleteUpdate: (id) => fn("update_delete", { id }),
      replyReview: (f) => fn("review_reply", f),
      saveDeal: (f) => fn("deal_save", f),
      creatorDashboard: () => fn("creator_dashboard"),
      iapVerify: (app_id, jws) => fn("iap_verify", { app_id, jws }),
      admin: (action, body = {}) => fn(action, body),
      resetDemo() {}
    };
  }
  const API = DEMO ? window.AW_DEMO_BACKEND(C) : liveBackend();

  // ====================== Zustand ======================
  const S = { cat: null, me: null, favs: [], follows: [], byId: new Map(), bySlug: new Map(), cats: new Map(), creators: new Map(), myRev: [] };
  const placementsFor = (slot, catId) => (S.cat.placements || []).filter((p) => p.slot === slot && (!catId || p.category_id === catId)).map((p) => ({ ...p, app: S.byId.get(p.app_id) })).filter((p) => p.app);
  const sponsoredIds = () => new Set((S.cat.placements || []).map((p) => p.app_id));
  async function loadCatalog() {
    S.cat = await API.catalog();
    S.byId.clear(); S.bySlug.clear(); S.cats.clear(); S.creators.clear();
    S.cat.apps.forEach((a) => { S.byId.set(a.id, a); S.bySlug.set(a.slug, a); });
    S.cat.categories.forEach((c) => S.cats.set(c.id, c));
    S.cat.creators.forEach((c) => S.creators.set(c.id, c));
  }
  async function loadMe() { S.me = await API.me(); S.favs = S.me ? await API.favorites() : []; S.follows = S.me ? await API.follows() : []; S.myRev = S.me ? await API.myReviews() : []; if ($("#tabbar a")) renderTabs(); }

  // ====================== Router (Stapel wie bei iOS) ======================
  const TABS = [
    { id: "heute", href: "#/", label: "Heute", icon: "today" },
    { id: "kategorien", href: "#/kategorien", label: "Kategorien", icon: "grid" },
    { id: "suche", href: "#/suche", label: "Suche", icon: "search" },
    { id: "meine", href: "#/meine", label: "Meine Apps", icon: "stack" },
    { id: "konto", href: "#/konto", label: "Konto", icon: "person" }
  ];
  const ROOT_TAB = { "": "heute", story: "heute", sammlung: "heute", kategorien: "kategorien", kategorie: "kategorien", suche: "suche", meine: "meine", favoriten: "meine", deals: "heute",
    konto: "konto", anmelden: "konto", registrieren: "konto", einreichen: "konto", featured: "konto", listing: "konto", premium: "konto", "ersteller-bereich": "konto", admin: "konto" };
  const GROUPED = ["konto", "anmelden", "registrieren", "einreichen", "featured", "ersteller-bereich", "admin"];
  let curTab = "heute", lastHash = null, pendingTab = false;
  const stack = [], scrollMem = {};
  function parse() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    return { parts: path.split("/").filter(Boolean).map(decodeURIComponent), q: new URLSearchParams(qs || ""), hash: location.hash || "#/" };
  }
  const go = (h) => { if ((location.hash || "#/") === h) route("restore"); else location.hash = h; };
  const back = () => { if (stack.length > 1) history.back(); else go(TABS.find((t) => t.id === curTab).href); };
  const backLabel = () => { const prev = stack[stack.length - 2]; return prev ? prev.title || "Zurück" : TABS.find((t) => t.id === curTab).label; };
  async function route(dir) {
    const r = parse();
    if (lastHash) scrollMem[lastHash] = window.scrollY;
    const key = r.parts[0] || "";
    if (ROOT_TAB[key]) curTab = ROOT_TAB[key];
    let anim = "";
    if (dir === "tab") stack.length = 0;
    else if (dir === "restore") anim = "";
    else if (stack.length > 1 && stack[stack.length - 2].hash === r.hash) { stack.pop(); anim = "pop"; }
    else if (!(stack.length && stack[stack.length - 1].hash === r.hash)) anim = stack.length ? "push" : "";
    if (!stack.length || stack[stack.length - 1].hash !== r.hash) stack.push({ hash: r.hash, title: "" });
    lastHash = r.hash;
    const view = VIEWS[key] || VIEWS[""];
    const el = document.createElement("div");
    el.className = "page" + (anim ? " " + anim : "");
    closeSheets(true);
    try { await view(el, r); } catch (e) { console.warn(e); el.innerHTML = navBar("Fehler") + `<div class="empty">${ic("info")}<h3>Das hat nicht geklappt</h3><p>${esc(e.message)}</p></div>`; }
    document.body.classList.toggle("grouped", GROUPED.includes(key));
    document.body.classList.remove("scrolled");
    $("#view").replaceChildren(el);
    stack[stack.length - 1].title = el.dataset.title || "";
    document.title = (el.dataset.title ? el.dataset.title + " – " : "") + BRAND;
    renderTabs();
    window.scrollTo(0, anim === "pop" || dir === "restore" ? scrollMem[r.hash] || 0 : 0);
    onScroll();
  }
  function renderTabs() {
    $("#tabbar").innerHTML = TABS.map((t) => `<a href="${t.href}" data-tab="${t.id}" class="${t.id === curTab ? "on" : ""}" aria-label="${t.label}"${t.id === curTab ? ' aria-current="page"' : ""}>${ic(t.icon)}<span>${t.label}</span>${t.id === "meine" && unseen() ? `<span class="badge">${unseen() > 9 ? "9+" : unseen()}</span>` : ""}</a>`).join("");
  }
  // Neuigkeiten gefolgter Apps, die seit dem letzten Öffnen von „Meine Apps → Neuigkeiten“ dazugekommen sind
  const feedSeen = () => localStorage.getItem("aw-feed-seen") || "";
  const feed = () => (S.cat?.updates || []).filter((u) => S.follows.includes(u.app_id));
  const unseen = () => S.me ? feed().filter((u) => u.created_at > feedSeen() && Date.now() - new Date(u.created_at) < 30 * 864e5).length : 0;
  const dealFor = (id) => (S.cat?.deals || []).find((d) => d.app_id === id);
  const ownsApp = (id) => !!S.me?.creator?.apps?.some((x) => x.id === id);
  const onScroll = () => document.body.classList.toggle("scrolled", window.scrollY > 30);

  // ====================== Bausteine ======================
  const navBar = (title, acts = "") => `<header class="nav"><button class="back" data-act="back">${ic("chevL")}<span>${esc(backLabel())}</span></button><div class="ttl">${esc(title)}</div><div class="acts">${acts}</div></header>`;
  const rootNav = (title) => `<header class="nav root"><div class="ttl">${esc(title)}</div></header>`;
  const largeTitle = (title, right = "", eyebrow = "") => `<div class="lt"><div>${eyebrow ? `<div class="date">${esc(eyebrow)}</div>` : ""}<h1>${esc(title)}</h1></div>${right}</div>`;
  const initial = () => esc((S.me.display_name || S.me.username || "?")[0].toUpperCase());
  const avatarBtn = () => S.me ? `<button class="avatar" data-go="#/konto" aria-label="Konto">${initial()}</button>` : `<button class="avatar guest" data-go="#/konto" aria-label="Konto">${ic("person")}</button>`;
  const openBtn = (a, cls = "") => `<span class="getw"><button class="get ${cls}" data-act="open" data-id="${a.id}">Öffnen</button>${a.price_model === "free" ? "" : `<small>${a.price_model === "freemium" ? "Extras beim Anbieter" : "Bezahlung beim Anbieter"}</small>`}</span>`;
  function appRow(a, o = {}) {
    const cat = S.cats.get(a.category_id);
    return `<div class="row" data-go="#/app/${a.slug}">${o.rank ? `<div class="rk">${o.rank}</div>` : ""}${icon(a, o.size || 64)}<div class="meta"><div class="nm">${esc(a.name)}</div><div class="st">${esc(o.sub || a.subtitle)}</div>${o.meta !== false ? `<div class="xtra">${o.ad ? `<span class="ad">${esc(o.ad)}</span>` : ""}${stars(a.rating_avg)}<span>${fmtNum(a.rating_count)}</span>${o.cat ? `<span>· ${esc(cat?.short || "")}</span>` : ""}</div>` : ""}</div>${openBtn(a)}</div>`;
  }
  const shelf = (list, o) => `<div class="shelf">${list.map((a) => appRow(a, o)).join("")}</div>`;
  const sec = (title, inner, more = "", sub = "", nob = false) => `<section class="sec"><div class="sech ${nob ? "nob" : ""}"><div><h2>${esc(title)}</h2>${sub ? `<div class="sub">${esc(sub)}</div>` : ""}</div>${more}</div>${inner}</section>`;
  function storyCard(s) {
    const a = s.app_id && S.byId.get(s.app_id);
    return `<article class="story" data-go="#/story/${s.id}">${storyArt(s)}<div class="top"><div class="eb">${esc(s.eyebrow)}</div><h3>${esc(s.title)}</h3></div>${a ? `<div class="bot">${icon(a, 44)}<div class="meta"><div class="nm">${esc(a.name)}</div><div class="st">${esc(a.subtitle)}</div></div><button class="get" data-act="open" data-id="${a.id}">Öffnen</button></div>` : `<div class="desc">${esc(s.subtitle)}</div>`}</article>`;
  }
  function featCard(a, eyebrow, ad) {
    const sim = S.cat.apps.filter((x) => x.category_id === a.category_id && x.id !== a.id);
    const fart = `<div class="art">${A.feature({ seed: a.id, c1: a.icon.c1, c2: a.icon.c2, c3: A.lt(a.icon.c1, .6), path: P[a.icon.glyph], icon: iconSrc(a), icons: [iconSrc(a), ...sim.slice(0, 1).map(iconSrc)] })}</div>`;
    return `<div class="feat" data-go="#/app/${a.slug}"><div class="eb">${ad ? `<span class="ad">${esc(ad)}</span>` : ""}${esc(eyebrow)}</div><div class="ft">${esc(a.name)}</div><div class="fs">${esc(a.subtitle)}</div><div class="fimg">${fart}<div class="over">${icon(a, 40)}<div class="meta"><div class="nm">${esc(a.name)}</div><div class="st">${esc(S.creators.get(a.creator_id)?.name || "")}</div></div><button class="get" data-act="open" data-id="${a.id}">Öffnen</button></div></div></div>`;
  }
  function collCard(c) {
    const apps = c.apps.map((id) => S.byId.get(id)).filter(Boolean);
    return `<div class="coll" data-go="#/sammlung/${c.id}">${tileArt(c, "coll-" + c.id, 270, 170, 226, 46, 2.6)}<div class="ics">${apps.slice(0, 4).map((a) => icon(a, 38)).join("")}</div><div class="ct">${esc(c.title)}</div><div class="cs">${apps.length} Apps · ${esc(c.subtitle)}</div></div>`;
  }
  // Bildschirmfotos: aus App-Farben erzeugte Mock-ups (keine echten Screenshots fremder Apps)
  const KIND = { text: ["editor", "chat", "list"], bild: ["canvas", "grid", "editor"], video: ["player", "canvas", "list"], audio: ["player", "list", "chat"], code: ["code", "chat", "list"],
    produktivitaet: ["list", "chat", "editor"], lernen: ["chat", "list", "editor"], business: ["editor", "list", "chart"], marketing: ["list", "chart", "canvas"], spass: ["canvas", "chat", "list"] };
  function screenshots(a) {
    const c1 = a.icon.c1, c2 = a.icon.c2, g = `linear-gradient(135deg,${c1},${c2})`;
    const caps = [a.subtitle, "Ergebnis in Sekunden", "Läuft direkt im Browser"];
    const pic = (i, cls = "", st = "") => `<div class="img ${cls}" style="background-image:url('${A.picture(c1, c2, i)}');${st}"></div>`;
    const ln = (w, o = "") => `<i class="ln" style="width:${w}%;${o}"></i>`;
    const sp = `<svg viewBox="0 0 24 24"><path d="${A.spark(12, 12, 10)}" fill="currentColor"/></svg>`;
    const hd = (t, right = "") => `<div class="hd"><span class="hi">${icon(a, 20)}</span><b>${esc(t || a.name)}</b>${right || `<span class="dots">•••</span>`}</div>`;
    const tag = a.tags[0] || "Text";
    const body = {
      editor: () => `${hd("Entwurf")}<div class="doc"><h5>${esc(tag)}: Angebot für Q3</h5><p>Sehr geehrte Frau Weber, vielen Dank für Ihr Interesse an unserer Lösung.</p><div class="ai" style="--c:${c1}"><span class="aic" style="background:${g}">${sp}</span><div><b>KI-Vorschlag</b>Kürzer & freundlicher formulieren?<div class="mini"><span style="background:${g}">Übernehmen</span><span>Andere</span></div></div></div><p>Gern stellen wir Ihnen die Details in einem kurzen Termin vor.</p>${ln(80)}${ln(64)}</div><div class="tbar"><span>B</span><span><i>I</i></span><span>≡</span><span class="pill" style="background:${g}">${sp}Schreiben</span></div>`,
      chat: () => `${hd()}<div class="chat"><div class="bub me" style="background:${g}">Hilf mir bei: ${esc(tag)} – kurz & verständlich?</div><div class="row2"><span class="aic" style="background:${g}">${sp}</span><div class="bub ai">Klar! Hier sind <b>drei Varianten</b>. Variante 2 ist am lockersten formuliert.</div></div><div class="row2"><span class="aic" style="background:${g}">${sp}</span><div class="bub ai card">${pic(0, "thumb")}<div><b>Variante 2</b>Bereit zum Kopieren</div></div></div><div class="bub me" style="background:${g}">Perfekt, danke! 🙌</div></div><div class="inp"><span>Nachricht…</span><i style="background:${g}">↑</i></div>`,
      list: () => `${hd("Projekte", `<span class="plus" style="color:${c1}">＋</span>`)}<div class="seg"><span class="on">Alle</span><span>Zuletzt</span><span>Geteilt</span></div>${a.tags.concat(["Entwurf", "Vorlage", "Ideen"]).slice(0, 5).map((t, i) => `<div class="item">${pic(i, "thumb")}<div><b>${esc(t)}</b><small>vor ${i * 7 + 2} Min. · ${["Fertig", "In Arbeit", "Entwurf"][i % 3]}</small></div><span class="st" style="background:${i % 3 ? "rgba(120,120,128,.16)" : c1 + "26"};color:${i % 3 ? "inherit" : c1}">${["✓", "…", "✎"][i % 3]}</span></div>`).join("")}<div class="fab" style="background:${g}">${sp}Neu erstellen</div>`,
      canvas: () => `${hd("Studio")}${pic(0, "hero")}<div class="prompt">${sp}<span>„${esc(tag)}, warmes Licht, detailreich“</span></div><div class="thumbs">${pic(1)}${pic(2)}${pic(0, "", "filter:hue-rotate(40deg)")}${pic(1, "", "filter:hue-rotate(-30deg)")}</div><div class="fab" style="background:${g}">Generieren</div>`,
      grid: () => `${hd("Galerie", `<span class="dots">⌕</span>`)}<div class="masonry">${[0, 1, 2, 1, 0, 2].map((i, k) => pic(i, "", `height:${[74, 52, 60, 70, 48, 66][k]}px;${k > 2 ? "filter:hue-rotate(" + k * 25 + "deg)" : ""}`)).join("")}</div>`,
      player: () => `${hd("Wiedergabe")}${pic(1, "cover")}<div class="ptitle"><b>${esc(tag)} – Folge 12</b><small>${esc(a.name)}</small></div><div class="wave">${Array.from({ length: 34 }, (_, i) => `<i style="height:${18 + Math.abs(Math.sin(i * 1.3) * Math.cos(i * .45)) * 82}%;background:${i < 14 ? c1 : "rgba(120,120,128,.35)"}"></i>`).join("")}</div><div class="time"><span>1:24</span><span>-2:51</span></div><div class="ctrl"><span>⏮</span><i style="background:${g}">▶</i><span>⏭</span></div>`,
      code: () => `<div class="hd dark"><span class="hi">${icon(a, 20)}</span><b>app.ts</b><span class="dots">•••</span></div><div class="tabs"><span class="on">app.ts</span><span>test.ts</span></div><pre class="code"><span class="k">export function</span> <span class="f">summe</span>(xs<span class="p">:</span> <span class="t">number</span>[]) {\n  <span class="k">return</span> xs.<span class="f">reduce</span>(\n    (a, b) <span class="k">=></span> a + b, <span class="n">0</span>);\n}\n\n<span class="c">// ✓ 3 Tests bestanden</span></pre><div class="row2"><span class="aic" style="background:${g}">${sp}</span><div class="bub ai dk">Für leere Listen gibt die Funktion <b>0</b> zurück. Soll ich Tests ergänzen?</div></div><div class="inp dk"><span>Frag die KI…</span><i style="background:${g}">↑</i></div>`,
      chart: () => `${hd("Übersicht")}<div class="kpis"><div><small>Umsatz</small><b>48,2 Tsd.</b><em style="color:#34C759">+24 %</em></div><div><small>Leads</small><b>1.284</b><em style="color:#34C759">+9 %</em></div></div><div class="chart"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><defs><linearGradient id="cg${a.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity=".45"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></linearGradient></defs><path d="M0 48L14 40 28 44 42 30 56 34 70 20 84 24 100 8V60H0z" fill="url(#cg${a.id})"/><path d="M0 48L14 40 28 44 42 30 56 34 70 20 84 24 100 8" fill="none" stroke="${c1}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg></div><div class="ai" style="--c:${c1}"><span class="aic" style="background:${g}">${sp}</span><div><b>KI-Analyse</b>Juni war dein stärkster Monat.</div></div>`
    };
    return (KIND[a.category_id] || ["list", "chat", "editor"]).map((k, i) => `<div class="shot">${tileArt({ c1, c2, glyph: a.icon.glyph }, "shot-" + a.id + i, 210, 455, -100, -100, 1)}<div class="cap">${esc(caps[i])}</div><div class="dev"><div class="scr ${k === "code" ? "dark" : ""}"><div class="sbar2"><b>9:41</b><svg viewBox="0 0 46 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0.5" width="3" height="11.5" rx="1"/><path d="M21 4.2a8 8 0 0 1 10 0l-1.4 1.6a5.8 5.8 0 0 0-7.2 0zM23.2 6.8a4.6 4.6 0 0 1 5.6 0L26 10z"/><rect x="34.5" y="1" width="10" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-opacity=".45"/><rect x="36" y="2.5" width="7" height="7" rx="1.4"/></svg></div>${body[k]()}</div></div></div>`).join("");
  }
  function distribution(avg) {
    const w = [5, 4, 3, 2, 1].map((s) => Math.exp(-1.7 * Math.abs(s - Math.min(5, avg + 0.35))));
    const sum = w.reduce((x, y) => x + y, 0); return w.map((x) => x / sum);
  }
  function reviewCard(r) {
    return `<div class="rcard"><div class="rt"><b>${esc(r.title || "Bewertung")}</b><span class="rd">${relDate(r.created_at)}</span></div><div class="rt" style="margin-top:2px">${stars(r.stars)}<span class="rd">${esc(r.author)}</span></div><div class="rb">${esc(r.body || "")}</div>${r.reply ? `<div class="rep"><div class="rph">${ic("reply")}<b>Antwort von ${esc(S.creators.get(S.byId.get(r.app_id)?.creator_id)?.name || "Anbieter")}</b>${verBadge(S.creators.get(S.byId.get(r.app_id)?.creator_id))}${r.reply_at ? `<span class="rd">${relDate(r.reply_at)}</span>` : ""}</div>${esc(r.reply)}</div>` : ""}${ownsApp(r.app_id) && !r.mine ? `<div class="ract" style="padding:8px 0 0"><button data-act="reply" data-id="${esc(r.id)}" data-app="${r.app_id}">${ic("reply")}${r.reply ? "Antwort bearbeiten" : "Antworten"}</button></div>` : ""}${r.mine ? `<div class="ract" style="padding:8px 0 0"><button data-act="review" data-id="${r.app_id}">Bearbeiten</button><button data-act="delreview" data-id="${r.id}" style="color:var(--red)">Löschen</button></div>` : `<div style="text-align:right;margin-top:6px"><button class="small muted" data-act="reportreview" data-id="${r.id}" data-app="${r.app_id}">Melden</button></div>`}</div>`;
  }

  // Exklusive KISTORE-Rabattcodes
  function dealCard(d, big = false) {
    const a = S.byId.get(d.app_id); if (!a) return "";
    if (!big) return `<div class="dealc" data-go="#/app/${a.slug}" style="--c1:${a.icon.c1};--c2:${a.icon.c2}"><div class="dtop">${icon(a, 44)}<span class="dpct">${esc(d.discount)}</span></div><div class="dnm">${esc(a.name)}</div><div class="dtt">${esc(d.title)}</div><div class="dfoot">${ic("tag")}KISTORE-Code${d.expires_at ? ` · bis ${new Date(d.expires_at).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}` : ""}</div></div>`;
    const code = S.me && d.code ? `<code class="dcode">${esc(d.code)}</code><button class="copy" data-act="copycode" data-code="${esc(d.code)}" data-id="${a.id}">${ic("copy")}Kopieren</button>`
      : `<span class="dcode masked">••••••</span><button class="copy" data-act="dealLogin">Code zeigen</button>`;
    return `<div class="dealbig" style="--c1:${a.icon.c1};--c2:${a.icon.c2}"><div class="dh"><span class="dbadge">${ic("tag")}Exklusiv bei ${esc(BRAND)}</span><span class="dpct">${esc(d.discount)}</span></div><div class="dtt">${esc(d.title)}</div>${d.terms ? `<div class="dterms">${esc(d.terms)}${d.expires_at ? ` · gültig bis ${fmtDate(d.expires_at)}` : ""}</div>` : ""}<div class="dcodebox">${code}</div><div class="dnote">Code beim Anbieter eingeben. Rabatt gewährt ${esc(S.creators.get(a.creator_id)?.name || "der Anbieter")}; ${esc(BRAND)} verkauft nichts.</div></div>`;
  }
  function updateCard(u, withApp = true) {
    const a = S.byId.get(u.app_id); if (!a) return "";
    return `<div class="upd" ${withApp ? `data-go="#/app/${a.slug}"` : ""}>${withApp ? `<div class="uh">${icon(a, 40)}<div class="meta"><div class="nm">${esc(a.name)}</div><div class="st">${u.kind === "news" ? "Neuigkeit" : "Update"}${u.version ? " · Version " + esc(u.version) : ""} · ${relDate(u.created_at)}</div></div>${u.created_at > feedSeen() && withApp ? '<span class="newdot" aria-label="Neu"></span>' : ""}</div>`
      : `<div class="st small muted">${u.kind === "news" ? "Neuigkeit" : "Update"}${u.version ? " · Version " + esc(u.version) : ""} · ${relDate(u.created_at)}</div>`}<div class="ut">${esc(u.title)}</div>${u.body ? `<div class="ub">${esc(u.body)}</div>` : ""}${ownsApp(u.app_id) && !withApp && !u.demo ? `<button class="small" style="color:var(--red);margin-top:6px" data-act="delupdate" data-id="${esc(u.id)}">Löschen</button>` : ""}</div>`;
  }

  // ====================== Ansichten ======================
  const byPop = (a, b) => b.popularity - a.popularity;
  const byRating = (a, b) => b.rating_avg - a.rating_avg || b.rating_count - a.rating_count;
  const byNew = (a, b) => String(b.released_at).localeCompare(String(a.released_at));
  const pub = () => S.cat.apps.filter((a) => a.status !== "hidden");
  const VIEWS = {};

  VIEWS[""] = async (el) => {
    const apps = pub();
    const today = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
    const ads = placementsFor("today");
    const stories = S.cat.stories;
    const editors = apps.filter((a) => a.editor_choice).sort(byPop);
    const top = [...apps].sort(byPop);
    const free = apps.filter((a) => a.price_model === "free").sort(byRating);
    const fresh = [...apps].sort(byNew);
    const feats = [...ads.map((p) => ({ a: p.app, eb: "Im Rampenlicht", ad: p.label })), ...editors.slice(0, 4).map((a) => ({ a, eb: "Empfehlung der Redaktion" }))];
    el.dataset.title = "Heute";
    el.innerHTML = rootNav("Heute") + largeTitle("Heute", avatarBtn(), today) +
      `<div class="stories">${storyCard(stories[0])}</div>` +
      sec("Im Rampenlicht", `<div class="car">${feats.map((f) => featCard(f.a, f.eb, f.ad)).join("")}</div>`, "", "", true) +
      sec("Beliebt diese Woche", shelf(top.slice(0, 12), { rankStart: 1 }), `<button data-go="#/suche?sort=pop">Alle</button>`) +
      ((S.cat.deals || []).length ? sec("Deals", `<div class="car deals">${S.cat.deals.slice(0, 12).map((d) => dealCard(d)).join("")}</div>`, `<button data-go="#/deals">Alle</button>`, `Exklusive ${BRAND}-Rabattcodes`) : "") +
      (stories[1] ? `<div class="stories" style="margin-top:22px">${storyCard(stories[1])}</div>` : "") +
      sec("Sammlungen", `<div class="car">${S.cat.collections.map(collCard).join("")}</div>`, "", "Von der Redaktion zusammengestellt") +
      sec("Kostenlos & richtig gut", shelf(free.slice(0, 9)), `<button data-go="#/suche?price=free&sort=rating">Alle</button>`) +
      (stories[2] ? `<div class="stories" style="margin-top:22px">${storyCard(stories[2])}</div>` : "") +
      sec("Neu & bemerkenswert", shelf(fresh.slice(0, 9)), `<button data-go="#/suche?sort=new">Alle</button>`) +
      sec("Nach Kategorie stöbern", `<div class="cgrid">${S.cat.categories.slice(0, 4).map(catTile).join("")}</div>`, `<button data-go="#/kategorien">Alle</button>`) +
      `<div class="foot">${esc(BRAND)} verlinkt auf Webapps anderer Anbieter. Bezahlung und Nutzung erfolgen beim jeweiligen Anbieter.<br>Mit „Gesponsert“ oder „Anzeige“ markierte Plätze sind bezahlte Platzierungen. Rabattcodes stellen die Anbieter bereit.</div>`;
  };

  VIEWS.story = async (el, r) => {
    const s = S.cat.stories.find((x) => x.id === r.parts[1]); if (!s) throw new Error("Geschichte nicht gefunden");
    const a = s.app_id && S.byId.get(s.app_id);
    const more = (s.apps || []).map((id) => S.byId.get(id)).filter(Boolean);
    el.dataset.title = s.title;
    el.innerHTML = `<header class="nav over"><button class="back" data-act="back" style="color:#fff">${ic("chevL")}<span>${esc(backLabel())}</span></button><div class="ttl">${esc(s.title)}</div><div class="acts"><button data-act="share" style="color:#fff" aria-label="Teilen">${ic("share")}</button></div></header>` +
      `<div class="sp-hero">${storyArt(s)}<div class="top"><div class="eb">${esc(s.eyebrow)}</div><h1>${esc(s.title)}</h1></div><div class="sub">${esc(s.subtitle)}</div></div>` +
      `<div class="sp-body">${(s.body || []).map((p) => { const ids = typeof p === "string" ? (p.startsWith("@apps:") ? p.slice(6).split(",") : null) : p?.apps;
        if (!ids) return `<p>${esc(p)}</p>`; const list = ids.map((id) => S.byId.get(id)).filter(Boolean); return list.length ? `<div class="sp-apps rows inline">${list.map((x) => appRow(x)).join("")}</div>` : ""; }).join("")}` +
      (a || more.length ? `<div class="sp-apps rows" style="padding:2px 14px">${(a ? [a] : []).concat(more.filter((x) => x !== a)).map((x) => appRow(x)).join("")}</div>` : "") + `</div>`;
  };

  VIEWS.sammlung = async (el, r) => {
    const c = S.cat.collections.find((x) => x.id === r.parts[1]); if (!c) throw new Error("Sammlung nicht gefunden");
    const apps = c.apps.map((id) => S.byId.get(id)).filter(Boolean);
    el.dataset.title = c.title;
    el.innerHTML = navBar(c.title, `<button data-act="share" aria-label="Teilen">${ic("share")}</button>`) +
      `<div class="ch-hero">${tileArt(c, "ch-" + c.id, 360, 210, 306, 56, 2.9)}<h2>${esc(c.title)}</h2><p>${esc(c.intro || c.subtitle)}</p></div>` +
      `<div class="rows">${apps.map((a) => appRow(a, { cat: true })).join("")}</div>`;
  };

  function catTile(c) {
    const n = pub().filter((a) => a.category_id === c.id).length;
    return `<div class="cat" data-go="#/kategorie/${c.id}">${tileArt(c, "cat-" + c.id, 200, 116, 160, 38, 2.2)}<div class="cn">${esc(c.name)}</div><div class="cc">${n} Apps</div></div>`;
  }
  VIEWS.kategorien = async (el) => {
    el.dataset.title = "Kategorien";
    el.innerHTML = rootNav("Kategorien") + largeTitle("Kategorien", avatarBtn()) +
      `<div class="cgrid">${S.cat.categories.map(catTile).join("")}</div>` +
      sec("Alle Kategorien", `<div class="rows clist">${S.cat.categories.map((c) => `<div class="row" data-go="#/kategorie/${c.id}">${catIcon(c)}<div class="meta"><div class="nm">${esc(c.name)}</div></div><span class="muted small">${pub().filter((a) => a.category_id === c.id).length}</span>${ic("chevR", "chev")}</div>`).join("")}</div>`);
  };

  VIEWS.kategorie = async (el, r) => {
    const c = S.cats.get(r.parts[1]); if (!c) throw new Error("Kategorie nicht gefunden");
    const sort = r.q.get("sort") || "pop";
    const apps = pub().filter((a) => a.category_id === c.id).sort(sort === "rating" ? byRating : sort === "new" ? byNew : byPop);
    const ads = placementsFor("category", c.id);
    el.dataset.title = c.name;
    el.innerHTML = navBar(c.name, `<button data-go="#/suche?cat=${c.id}" aria-label="Filtern">${ic("sliders")}</button>`) + largeTitle(c.name, "", "Kategorie").replace('class="lt"', 'class="lt sub"') +
      `<div class="chips">${[["pop", "Beliebt"], ["rating", "Top bewertet"], ["new", "Neu"]].map(([k, l]) => `<button class="chip ${k === sort ? "on" : ""}" data-go="#/kategorie/${c.id}?sort=${k}">${l}</button>`).join("")}<button class="chip" data-go="#/suche?cat=${c.id}&price=free">Kostenlos</button></div>` +
      (ads.length ? `<div class="rows"><div class="adrow">${ads.map((p) => appRow(p.app, { ad: p.label })).join("")}</div></div>` : "") +
      (apps[0] ? `<div class="car" style="margin-top:6px">${apps.filter((a) => a.editor_choice).slice(0, 3).map((a) => featCard(a, "Empfehlung der Redaktion")).join("")}</div>` : "") +
      sec(sort === "rating" ? "Top bewertet" : sort === "new" ? "Neu" : "Beliebt", `<div class="rows">${apps.map((a, i) => appRow(a, { rank: i + 1 })).join("")}</div>`);
  };

  // ---------- Suche & Filter ----------
  const FEAT = { de: "Deutsch", no_login: "Ohne Anmeldung", eu_hosting: "EU-Hosting", api: "Mit API" };
  const SORTS = { relevance: "Relevanz", pop: "Beliebtheit", rating: "Bewertung", new: "Neueste" };
  function readFilters(q) {
    return { q: q.get("q") || "", cat: q.get("cat") || "", price: (q.get("price") || "").split(",").filter(Boolean), min: Number(q.get("min") || 0), sort: q.get("sort") || "", f: (q.get("f") || "").split(",").filter(Boolean) };
  }
  function filterHash(F) {
    const p = new URLSearchParams();
    if (F.q) p.set("q", F.q); if (F.cat) p.set("cat", F.cat); if (F.price.length) p.set("price", F.price.join(","));
    if (F.min) p.set("min", F.min); if (F.sort) p.set("sort", F.sort); if (F.f.length) p.set("f", F.f.join(","));
    const s = p.toString(); return "#/suche" + (s ? "?" + s : "");
  }
  const activeFilters = (F) => (F.cat ? 1 : 0) + F.price.length + (F.min ? 1 : 0) + F.f.length;
  function search(F) {
    const words = norm(F.q).split(/\s+/).filter(Boolean);
    let list = pub().map((a) => {
      if (!words.length) return { a, s: 0 };
      const cat = S.cats.get(a.category_id), cr = S.creators.get(a.creator_id);
      const hay = { name: norm(a.name), sub: norm(a.subtitle), tags: norm(a.tags.join(" ")), rest: norm([a.description, cat?.name, cr?.name].join(" ")) };
      let s = 0;
      for (const w of words) {
        const ws = w.length > 4 ? w.slice(0, -1) : w; // einfache Stammform: „bilder“ ≈ „bild“
        const m = hay.name.startsWith(ws) ? 10 : hay.name.includes(ws) ? 7 : hay.tags.includes(ws) ? 5 : hay.sub.includes(ws) ? 4 : hay.rest.includes(ws) ? 2 : 0;
        if (!m) return null; s += m;
      }
      return { a, s: s + a.popularity / 100 };
    }).filter(Boolean);
    if (F.cat) list = list.filter((x) => x.a.category_id === F.cat);
    if (F.price.length) list = list.filter((x) => F.price.includes(x.a.price_model));
    if (F.min) list = list.filter((x) => x.a.rating_avg >= F.min);
    F.f.forEach((k) => { list = list.filter((x) => x.a.features?.[k]); });
    const sort = F.sort || (words.length ? "relevance" : "pop");
    list.sort((x, y) => sort === "relevance" ? y.s - x.s : sort === "rating" ? byRating(x.a, y.a) : sort === "new" ? byNew(x.a, y.a) : byPop(x.a, y.a));
    return list.map((x) => x.a);
  }
  VIEWS.suche = async (el, r) => {
    const F = readFilters(r.q);
    const n = activeFilters(F);
    const browsing = !F.q && !n && !F.sort;
    el.dataset.title = "Suche";
    const chipsRow = `<div class="chips">` +
      `<button class="chip ${F.cat ? "on" : ""}" data-act="pick" data-k="cat">${esc(F.cat ? S.cats.get(F.cat)?.short : "Kategorie")}${ic("chevD")}</button>` +
      `<button class="chip ${F.price.length ? "on" : ""}" data-act="pick" data-k="price">${F.price.length ? F.price.map((p) => PRICE[p]).join(", ") : "Preis"}${ic("chevD")}</button>` +
      `<button class="chip ${F.min ? "on" : ""}" data-act="pick" data-k="min">${F.min ? `ab ${fmtRating(F.min)} ★` : "Bewertung"}${ic("chevD")}</button>` +
      `<button class="chip ${F.sort ? "on" : ""}" data-act="pick" data-k="sort">${F.sort ? SORTS[F.sort] : "Sortieren"}${ic("chevD")}</button>` +
      Object.entries(FEAT).map(([k, l]) => `<button class="chip ${F.f.includes(k) ? "on" : ""}" data-act="feat" data-k="${k}">${l}</button>`).join("") + `</div>`;
    let body;
    if (browsing) {
      const ad = placementsFor("search")[0];
      body = `<div class="lt sub" style="padding-top:8px"><h1 style="font-size:22px">Beliebte Suchen</h1></div><div class="trend">${S.cat.trending.map((t) => `<button data-act="q" data-q="${esc(t)}">${ic("search")}${esc(t)}</button>`).join("")}</div>` +
        (ad ? sec("Vorgeschlagen", `<div class="rows"><div class="adrow">${appRow(ad.app, { ad: ad.label, cat: true })}</div></div>`) : "") +
        sec("Entdecken", `<div class="rows">${[...pub()].sort(byRating).slice(0, 8).map((a) => appRow(a, { cat: true })).join("")}</div>`);
    } else {
      const res = search(F);
      const ad = !F.q || !placementsFor("search").length ? null : placementsFor("search").find((p) => res.some((a) => a.id === p.app_id) || res.length === 0);
      body = `<div class="rescount">${res.length} ${res.length === 1 ? "Ergebnis" : "Ergebnisse"}${n ? ` · <button class="small" style="color:var(--tint)" data-act="clearf">Filter zurücksetzen</button>` : ""}</div>` +
        (ad ? `<div class="rows"><div class="adrow">${appRow(ad.app, { ad: ad.label })}</div></div>` : "") +
        (res.length ? `<div class="rows">${res.filter((a) => !ad || a.id !== ad.app_id).map((a) => appRow(a, { cat: true })).join("")}</div>`
          : `<div class="empty">${ic("search")}<h3>Keine Treffer</h3><p>Probiere einen anderen Begriff oder lockere die Filter.</p>${n ? `<button class="get blue big" data-act="clearf">Filter zurücksetzen</button>` : ""}</div>`);
    }
    el.innerHTML = (browsing ? largeTitle("Suche") : "") + `<div class="sbar${browsing ? " under" : ""}"><label class="sfield ${F.q ? "has" : ""}">${ic("search")}<input id="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="Apps, Aufgaben, Ersteller" value="${esc(F.q)}" aria-label="Suche"><button class="clr" data-act="qclear" aria-label="Leeren">${ic("x")}</button></label><button class="fbtn" data-act="filters" aria-label="Filter">${ic("sliders")}${n ? '<span class="dot"></span>' : ""}</button></div>` +
      chipsRow + body;
    const inp = $("#q", el);
    let t;
    inp.addEventListener("input", () => { clearTimeout(t); inp.parentElement.classList.toggle("has", !!inp.value); t = setTimeout(() => { F.q = inp.value.trim(); history.replaceState(null, "", filterHash(F)); stack[stack.length - 1].hash = location.hash; lastHash = location.hash; rerenderSearch(); }, 220); });
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") inp.blur(); });
  };
  async function rerenderSearch() {
    const pos = $("#q")?.selectionStart, focused = document.activeElement?.id === "q";
    const el = document.createElement("div"); el.className = "page"; el.style.animation = "none";
    await VIEWS.suche(el, parse());
    $("#view").replaceChildren(el);
    if (focused) { const i = $("#q"); i.focus(); try { i.setSelectionRange(pos, pos); } catch {} }
  }

  // ---------- App-Detail ----------
  VIEWS.app = async (el, r) => {
    const a = S.bySlug.get(r.parts[1]); if (!a) throw new Error("App nicht gefunden");
    const cat = S.cats.get(a.category_id), cr = S.creators.get(a.creator_id);
    const reviews = (await API.reviews(a.id)).map((x) => ({ ...x, app_id: a.id }));
    const fav = S.favs.includes(a.id);
    const dist = distribution(a.rating_avg);
    const mine = reviews.find((x) => x.mine);
    const sponsored = sponsoredIds().has(a.id);
    const fol = S.follows.includes(a.id), deal = dealFor(a.id), ups = (S.cat.updates || []).filter((u) => u.app_id === a.id);
    API.track && API.track(a.id, "view");
    const similar = pub().filter((x) => x.category_id === a.category_id && x.id !== a.id).sort(byPop);
    const more = pub().filter((x) => x.creator_id === a.creator_id && x.id !== a.id);
    const rank = pub().filter((x) => x.category_id === a.category_id).sort(byPop).findIndex((x) => x.id === a.id) + 1;
    el.dataset.title = a.name;
    el.innerHTML = navBar(a.name, `<button data-act="share" aria-label="Teilen">${ic("share")}</button>`) +
      `<div class="dhead">${icon(a, 118)}<div class="info"><h1>${esc(a.name)}</h1><div class="st">${esc(a.subtitle)}</div><a class="by" href="#/ersteller/${esc(a.creator_id)}">${esc(cr?.name || "")}${verBadge(cr)}</a>` +
      `<div class="acts"><button class="get blue big" data-act="open" data-id="${a.id}">Öffnen</button><button class="follow ${fol ? "on" : ""}" data-act="follow" data-id="${a.id}" aria-pressed="${fol}">${fol ? `${ic("check")}Gefolgt` : `${ic("plus")}Folgen`}</button><button class="iconbtn ${fav ? "on" : ""}" data-act="fav" data-id="${a.id}" aria-label="${fav ? "Aus Favoriten entfernen" : "Zu Favoriten"}" aria-pressed="${fav}">${ic("heart")}</button></div></div></div>` +
      (sponsored ? `<div class="spons"><span class="ad">Gesponsert</span>Diese App wird derzeit bezahlt hervorgehoben.</div>` : "") +
      (ownsApp(a.id) ? `<div class="spons own" data-go="#/ersteller-bereich?app=${a.id}">${ic("chart")}Das ist deine App – Statistik, Neuigkeiten & Deal im Ersteller-Bereich ${ic("chevR")}</div>` : "") +
      `<div class="strip">` +
      `<div><div class="k">${fmtNum(a.rating_count)} Bewertungen</div><div class="v">${fmtRating(a.rating_avg)}</div><div class="u">${stars(a.rating_avg)}</div></div>` +
      `<div><div class="k">Preis</div><div class="v s">${PRICE[a.price_model]}</div><div class="u">beim Anbieter</div></div>` +
      `<div><div class="k">Alter</div><div class="v">${esc(String(a.age || "ab 12").replace("ab ", ""))}+</div><div class="u">Jahre</div></div>` +
      `<div><div class="k">Rang</div><div class="v">Nr. ${rank}</div><div class="u">${esc(cat?.short || "")}</div></div>` +
      `<div><div class="k">Ersteller</div><div class="v">${ic("user")}</div><div class="u">${esc(cr?.name || "")}</div></div>` +
      `<div><div class="k">Sprache</div><div class="v s">${esc((a.languages?.[0] || "DE").slice(0, 2).toUpperCase())}</div><div class="u">${a.languages?.length > 1 ? `+ ${a.languages.length - 1} weitere` : "Deutsch"}</div></div></div>` +
      (deal ? sec("Deal", dealCard(deal, true), "", "", true) : "") +
      (ups.length ? sec("Neuigkeiten", `<div class="upds">${ups.slice(0, 2).map((u) => updateCard(u, false)).join("")}</div>`, "", fol ? "Du folgst dieser App" : "Folge der App, um nichts zu verpassen", true) : "") +
      sec("Vorschau", `<div class="shots">${screenshots(a)}</div>`, "", "", true) +
      `<div class="desc clamp" id="desc">${esc(a.description)}</div><button class="more" data-act="more">Mehr</button>` +
      `<div class="tagc" style="margin-top:12px">${a.tags.map((t) => `<button class="chip" data-act="q" data-q="${esc(t)}">${esc(t)}</button>`).join("")}</div>` +
      sec("Preis & Bezahlung", `<div class="payinfo">${ic("card")}<div><b>${PRICE[a.price_model]}</b>${esc(a.price_note || "")}<br><span class="muted small">Bezahlt wird direkt beim Anbieter. ${esc(BRAND)} verkauft keine Abos dieser App und erhält keine Provision.</span></div></div>`) +
      sec("Bewertungen", `<div class="rsum"><div><div class="big">${fmtRating(a.rating_avg)}</div><div class="of">von 5</div></div><div class="dist">${dist.map((p, i) => `<div class="l"><span class="s">${"★".repeat(5 - i)}</span><span class="bar"><i style="width:${Math.round(p * 100)}%"></i></span></div>`).join("")}</div></div><div class="rcount">${fmtNum(a.rating_count)} Bewertungen</div>` +
        `<div class="rcards">${reviews.slice(0, 8).map(reviewCard).join("") || `<div class="muted" style="padding:20px 0">Noch keine Textbewertungen.</div>`}</div>` +
        `<div class="ract"><button data-act="review" data-id="${a.id}">${ic("write")}${mine ? "Bewertung bearbeiten" : "Bewerten"}</button></div>`, reviews.length ? `<button data-go="#/bewertungen/${a.slug}">Alle</button>` : "") +
      sec("Informationen", `<div class="ilist">` +
        [["Anbieter", esc(cr?.name || "") + verBadge(cr, true)], ["Kategorie", `<a href="#/kategorie/${a.category_id}">${esc(cat?.name || "")}</a>`], ["Preismodell", PRICE[a.price_model]], ["Sprachen", esc((a.languages || []).join(", "))], ["Altersfreigabe", esc(a.age || "ab 12")],
          ["Ohne Anmeldung nutzbar", a.features?.no_login ? "Ja" : "Nein"], ["EU-Hosting (Angabe Anbieter)", a.features?.eu_hosting ? "Ja" : "Nein"], ["Im Verzeichnis seit", fmtDate(a.released_at)], ["Zuletzt geprüft", fmtDate(a.checked_at)],
          ["Website", `<a href="${esc(a.url)}" data-act="open" data-id="${a.id}">${esc(a.domain)}${ic("ext")}</a>`]].map(([k, v]) => `<div class="it"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("") + `</div>` +
        `<button class="report" data-act="report" data-id="${a.id}">${ic("flag")}App melden</button>`) +
      (more.length ? sec(`Mehr von ${cr?.name || ""}`, `<div class="rows">${more.map((x) => appRow(x)).join("")}</div>`) : "") +
      (similar.length ? sec("Das könnte dir auch gefallen", shelf(similar.slice(0, 9))) : "") +
      `<div class="foot">Angaben laut Anbieter, redaktionell geprüft am ${fmtDate(a.checked_at)}.</div>`;
  };

  VIEWS.ersteller = async (el, r) => {
    const cr = S.creators.get(r.parts[1]); if (!cr) throw new Error("Ersteller nicht gefunden");
    const apps = pub().filter((a) => a.creator_id === cr.id).sort(byPop);
    el.dataset.title = cr.name;
    el.innerHTML = navBar(cr.name) + largeTitle(cr.name, verBadge(cr), cr.verified ? "Verifizierter Ersteller" : "Ersteller").replace('class="lt"', 'class="lt sub"') +
      `<div class="hint" style="padding-top:0">Im Verzeichnis seit ${esc(cr.since)} · ${apps.length} ${apps.length === 1 ? "App" : "Apps"}</div>` +
      sec("Apps", `<div class="rows">${apps.map((a) => appRow(a, { cat: true })).join("")}</div>`);
  };

  VIEWS.bewertungen = async (el, r) => {
    const a = S.bySlug.get(r.parts[1]); if (!a) throw new Error("App nicht gefunden");
    const sort = r.q.get("sort") || "new";
    const list = (await API.reviews(a.id)).map((x) => ({ ...x, app_id: a.id }));
    if (sort === "best") list.sort((x, y) => y.stars - x.stars); else if (sort === "worst") list.sort((x, y) => x.stars - y.stars);
    el.dataset.title = "Bewertungen";
    el.innerHTML = navBar("Bewertungen", `<button data-act="review" data-id="${a.id}" aria-label="Bewerten">${ic("write")}</button>`) + largeTitle("Bewertungen", "", a.name).replace('class="lt"', 'class="lt sub"') +
      `<div class="seg">${[["new", "Neueste"], ["best", "Positivste"], ["worst", "Kritischste"]].map(([k, l]) => `<button class="${k === sort ? "on" : ""}" data-go="#/bewertungen/${a.slug}?sort=${k}">${l}</button>`).join("")}</div>` +
      `<div class="rlist" style="margin-top:10px">${list.map(reviewCard).join("")}</div>`;
  };

  // ---------- Meine Apps: Neuigkeiten · Gefolgt · Favoriten ----------
  VIEWS.favoriten = async (el) => { location.replace("#/meine?tab=fav"); el.innerHTML = ""; };
  VIEWS.meine = async (el, r) => {
    const tab = r.q.get("tab") || "neu";
    el.dataset.title = "Meine Apps";
    const head = rootNav("Meine Apps") + largeTitle("Meine Apps", avatarBtn());
    if (!S.me) { el.innerHTML = head + `<div class="empty">${ic("stack")}<h3>Deine Apps an einem Ort</h3><p>Folge Apps, um Updates, Neuigkeiten und Deals zu bekommen, und merke dir Favoriten – auf allen Geräten.</p><button class="get blue big" data-go="#/anmelden">Anmelden</button></div>`; return; }
    const n = unseen();
    const segs = [["neu", "Neuigkeiten" + (n ? ` (${n})` : "")], ["gefolgt", `Gefolgt (${S.follows.length})`], ["fav", `Favoriten (${S.favs.length})`]];
    let body;
    if (tab === "neu") {
      const f = feed(), dl = (S.cat.deals || []).filter((d) => S.follows.includes(d.app_id));
      body = !S.follows.length ? `<div class="empty">${ic("bell")}<h3>Noch keine Neuigkeiten</h3><p>Tippe bei einer App auf „Folgen“ – dann erscheinen hier ihre Updates, News und Deals.</p><button class="get blue big" data-go="#/">Apps entdecken</button></div>`
        : (dl.length ? sec("Deals deiner Apps", `<div class="car deals">${dl.map((d) => dealCard(d)).join("")}</div>`, "", "", true) : "") +
          sec("Updates & News", f.length ? `<div class="upds feed">${f.slice(0, 40).map((u) => updateCard(u)).join("")}</div>` : `<div class="hint">Deine gefolgten Apps haben noch nichts gepostet.</div>`, "", "", true);
      setTimeout(() => { localStorage.setItem("aw-feed-seen", new Date().toISOString()); renderTabs(); }, 1500);
    } else {
      const ids = tab === "gefolgt" ? S.follows : S.favs, apps = ids.map((id) => S.byId.get(id)).filter(Boolean);
      body = apps.length ? `<div class="rows" style="margin-top:8px">${apps.map((a) => appRow(a, { cat: true })).join("")}</div>`
        : tab === "gefolgt" ? `<div class="empty">${ic("bell")}<h3>Du folgst noch keiner App</h3><p>Folge Apps, um ihre Updates und exklusiven Deals zu sehen.</p><button class="get blue big" data-go="#/">Apps entdecken</button></div>`
        : `<div class="empty">${ic("heart")}<h3>Noch keine Favoriten</h3><p>Tippe auf das Herz bei einer App, um sie hier zu sammeln.</p><button class="get blue big" data-go="#/">Apps entdecken</button></div>`;
    }
    el.innerHTML = head + `<div class="seg">${segs.map(([k, l]) => `<button class="${k === tab ? "on" : ""}" data-go="#/meine?tab=${k}">${l}</button>`).join("")}</div>` + body;
  };
  VIEWS.deals = async (el) => {
    el.dataset.title = "Deals";
    el.innerHTML = navBar("Deals") + largeTitle("Deals", "", `Exklusiv bei ${BRAND}`).replace('class="lt"', 'class="lt sub"') +
      `<div class="hint" style="padding-top:0">Rabattcodes der Anbieter – ${S.me ? "Code kopieren und beim Anbieter eingeben." : "melde dich an, um die Codes zu sehen."}</div>` +
      `<div class="dlist">${(S.cat.deals || []).map((d) => { const a = S.byId.get(d.app_id); return a ? `<div class="dli">${appRow(a, { meta: false, sub: d.title })}${dealCard(d, true)}</div>` : ""; }).join("")}</div>`;
  };

  // ---------- Konto ----------
  const gi = (o) => `<${o.href ? `a href="${o.href}"` : `button${o.act ? ` data-act="${o.act}"` : ""}${o.go ? ` data-go="${o.go}"` : ""}`} class="gi ${o.cls || ""}">${o.icon ? `<span class="gic" style="background:${o.bg || "var(--tint)"}">${ic(o.icon)}</span>` : ""}<span class="gt">${o.label}</span>${o.value != null ? `<span class="gv">${o.value}</span>` : ""}${o.chev !== false ? ic("chevR", "chev") : ""}</${o.href ? "a" : "button"}>`;
  const themeName = () => ({ auto: "Automatisch", light: "Hell", dark: "Dunkel" })[localStorage.getItem("aw-theme") || "auto"];
  VIEWS.konto = async (el) => {
    el.dataset.title = "Konto";
    const subs = S.me ? await API.mySubmissions() : [];
    el.innerHTML = rootNav("Konto") + largeTitle("Konto") +
      (S.me ? `<div class="glist"><div class="prof"><div class="avatar lg">${initial()}</div><div><div class="pn">${esc(S.me.display_name)}</div><div class="pu">@${esc(S.me.username)}${S.me.creator ? ` · Ersteller ${verBadge(S.me.creator)}` : ""}</div></div></div></div>`
        : `<div class="glist"><div class="prof"><div class="avatar lg guest">${ic("person")}</div><div style="flex:1"><div class="pn">Nicht angemeldet</div><div class="pu">Folgen, Favoriten & Deals auf allen Geräten</div></div></div>${gi({ label: "Anmelden", go: "#/anmelden", cls: "blue noi" })}${gi({ label: "Konto erstellen", go: "#/registrieren", cls: "blue noi" })}</div>`) +
      (S.me?.is_admin ? `<div class="glist">${gi({ icon: "shield", bg: "#1C1C1E", label: "Admin", value: "Verwaltung", go: "#/admin", cls: "adm-entry" })}</div>` : "") +
      `<div class="promo" data-go="#/listing">${tileArt({ c1: "#5B4BFF", c2: "#C13BFF", glyph: "rocket" }, "promo", 360, 170, 318, 40, 2.4)}<h3>Für Ersteller</h3><p>Liste deine KI-Webapp: verifiziert, mit Statistik, Neuigkeiten, Deals und Antworten auf Bewertungen.</p><span class="pbtn">${esc(C.listing?.price || "")} / ${esc(C.listing?.period || "Monat")} · Mehr erfahren</span></div>` +
      `<div class="ghead">Meine Inhalte</div><div class="glist">${gi({ icon: "bell", bg: "var(--tint)", label: "Gefolgte Apps", value: S.follows.length, go: "#/meine?tab=gefolgt" })}${gi({ icon: "heart", bg: "var(--red)", label: "Favoriten", value: S.favs.length, go: "#/meine?tab=fav" })}${gi({ icon: "star", bg: "var(--orange)", label: "Meine Bewertungen", value: S.myRev.length, act: "myreviews" })}</div>` +
      `<div class="ghead">Für Ersteller</div><div class="glist">${S.me?.creator ? gi({ icon: "chart", bg: "#FF9500", label: "Ersteller-Bereich", value: esc(S.me.creator.name), go: "#/ersteller-bereich" }) : ""}${gi({ icon: "card", bg: "#5856D6", label: "Listing-Abo & Preise", go: "#/listing" })}${gi({ icon: "upload", bg: "#34C759", label: "App einreichen", go: "#/einreichen" })}${gi({ icon: "rocket", bg: "#AF52DE", label: "Featured-Platz buchen", go: "#/featured" })}${DEMO && S.me && !S.me.creator ? gi({ icon: "eye", bg: "#8E8E93", label: "Demo: als Ersteller ansehen", act: "democreator" }) : ""}${DEMO && S.me && !S.me.is_admin ? gi({ icon: "shield", bg: "#8E8E93", label: "Demo: als Admin ansehen", act: "demoadmin" }) : ""}</div>` +
      (subs.length ? `<div class="ghead">Meine Einreichungen</div><div class="glist">${subs.map((s) => `<div class="subm"><div class="meta" style="flex:1;min-width:0"><div style="font-weight:500">${esc(s.name)}</div><div class="small muted">${esc(s.url)} · ${relDate(s.created_at)}</div></div><span class="status">${({ pending: "In Prüfung", approved: "Freigegeben", rejected: "Abgelehnt" })[s.status] || esc(s.status)}</span></div>`).join("")}</div>` : "") +
      `<div class="ghead">Einstellungen</div><div class="glist">${gi({ icon: "moon", bg: "#5856D6", label: "Darstellung", value: themeName(), act: "theme" })}${gi({ icon: "globe", bg: "#007AFF", label: "Externe Links bestätigen", value: localStorage.getItem("aw-noconfirm") ? "Aus" : "Ein", act: "confirmext" })}</div>` +
      (S.me ? `<div class="ghead">Konto</div><div class="glist">${gi({ icon: "user", bg: "#8E8E93", label: "Anzeigename ändern", act: "rename" })}${gi({ icon: "download", bg: "#8E8E93", label: "Meine Daten exportieren", act: "export" })}${gi({ icon: "logout", bg: "#8E8E93", label: "Abmelden", act: "logout", chev: false })}${gi({ icon: "trash", bg: "var(--red)", label: "Konto löschen", act: "delete", cls: "red", chev: false })}</div>` : "") +
      `<div class="ghead">Rechtliches & Hilfe</div><div class="glist">${gi({ icon: "info", bg: "#8E8E93", label: "Impressum", href: "impressum.html" })}${gi({ icon: "shield", bg: "#8E8E93", label: "Datenschutz", href: "datenschutz.html" })}${gi({ icon: "doc", bg: "#8E8E93", label: "Nutzungsbedingungen", href: "nutzungsbedingungen.html" })}${gi({ icon: "mail", bg: "#8E8E93", label: "Kontakt", href: `mailto:${C.contactEmail}` })}</div>` +
      `<div class="demo-note">${esc(BRAND)} ${esc(C.version || "")}${DEMO ? `<br>Demo-Daten: Apps, Ersteller, Bewertungen, Neuigkeiten und Rabattcodes sind fiktiv. Konten werden nur in diesem Browser gespeichert. <button class="small" style="color:var(--tint)" data-act="resetdemo">Demo zurücksetzen</button>` : ""}</div>`;
  };

  const authHero = (t, s) => `<div class="auth-hero">${logo(84)}<h2>${t}</h2><p>${s}</p></div>`;
  VIEWS.anmelden = async (el) => {
    el.dataset.title = "Anmelden";
    if (S.me) { el.innerHTML = navBar("Anmelden") + `<div class="empty"><h3>Du bist angemeldet</h3><button class="get blue big" data-go="#/konto">Zum Konto</button></div>`; return; }
    el.innerHTML = navBar("Anmelden") + authHero("Willkommen zurück", "Melde dich mit Benutzername und Passwort an.") +
      `<form class="form" id="f-login" novalidate><div class="fg"><label class="fl"><span>Benutzername</span><input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required></label><label class="fl"><span>Passwort</span><input name="password" type="password" autocomplete="current-password" required></label></div><div class="err" id="err"></div><button class="btn" type="submit">Anmelden</button><a class="lnk" href="#/registrieren">Noch kein Konto? Jetzt registrieren</a></form>`;
    $("#f-login", el).addEventListener("submit", (e) => submit(e, async (f) => { await API.login(f); await refresh(); toast(`Hallo ${S.me.display_name}!`); back(); }));
  };
  VIEWS.registrieren = async (el) => {
    el.dataset.title = "Konto erstellen";
    el.innerHTML = navBar("Konto erstellen") + authHero("Konto erstellen", "Ohne E-Mail-Adresse – nur Benutzername und Passwort.") +
      `<form class="form" id="f-reg" novalidate><div class="fg"><label class="fl"><span>Benutzername</span><input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="z. B. lena_m" required></label><label class="fl"><span>Anzeigename (optional)</span><input name="display_name" autocomplete="nickname" maxlength="40" placeholder="Wird bei Bewertungen gezeigt"></label><label class="fl"><span>Passwort (mind. 8 Zeichen)</span><input name="password" type="password" autocomplete="new-password" minlength="8" required></label></div>` +
      `<label class="check"><input type="checkbox" name="consent" value="1"><span>Ich akzeptiere die <a href="nutzungsbedingungen.html">Nutzungsbedingungen</a> und habe die <a href="datenschutz.html">Datenschutzerklärung</a> gelesen. Ich bin mindestens 16 Jahre alt.</span></label><div class="err" id="err"></div><button class="btn" type="submit">Registrieren</button><a class="lnk" href="#/anmelden">Schon registriert? Anmelden</a></form>`;
    $("#f-reg", el).addEventListener("submit", (e) => submit(e, async (f) => { f.consent = !!f.consent; await API.register(f); await refresh(); toast("Willkommen bei " + BRAND + "!"); go("#/konto"); }));
  };

  // ---------- Listing-Abo für Ersteller (Nutzer zahlen nie) ----------
  // Bezahlweg: Website/PWA → Checkout des Zahlungsdienstes (config.checkout); iOS-App → Apple In-App-Kauf (config.iap). Siehe payments.js.
  function payButton(product, appId, label) {
    const ch = PAY.channel();
    if (ch === "apple") return `<button class="btn ${product === "listing" ? "grad" : "sec"}" data-act="pay" data-product="${product}" data-app="${appId || ""}">${ic("apple")}${esc(label || "Mit Apple kaufen")}</button>`;
    if (ch === "none") return `<div class="paynote">${ic("info")}Buchung über die ${esc(BRAND)}-Website.</div>`;
    const url = PAY.webUrl(product, appId);
    return url ? `<a class="btn ${product === "listing" ? "grad" : "sec"}" href="${esc(url)}" target="_blank" rel="noopener">${ic("card")}${esc(label || "Auf der Website buchen")}${ic("ext")}</a>`
      : `<button class="btn sec" disabled aria-disabled="true">${ic("card")}Bezahlung bald verfügbar</button>`;
  }
  const payHint = () => PAY.channel() === "apple" ? "Kauf über deine Apple-ID (In-App-Kauf). Das Listing-Abo verlängert sich monatlich, sofern du es nicht mindestens 24 Stunden vor Ablauf in den iOS-Einstellungen kündigst."
    : `Buchung und Bezahlung auf der ${esc(BRAND)}-Website (Zahlungsdienst, z. B. Stripe). Monatlich kündbar.`;
  const LISTING_PERKS = [["shield", "#34C759", "Verifiziert-Abzeichen", "Das blaue Siegel an deiner App und deinem Ersteller-Profil"], ["bolt", "#FF9500", "Schnellere Prüfung", "Einreichungen und Änderungen prüfen wir bevorzugt (Ziel: 2 Werktage)"],
    ["chart", "#007AFF", "Statistik je App", "Aufrufe, Öffnungen, Favoriten und Follower – täglich aktualisiert"], ["reply", "#5856D6", "Auf Bewertungen antworten", "Deine Antwort erscheint direkt unter der Bewertung"],
    ["bell", "#FF2D55", "Updates & News posten", "Erreicht alle, die deiner App folgen"], ["tag", "#AF52DE", "Exklusive Deals", "Rabattcodes für die KISTORE-Community – mit eigener Deals-Rubrik"]];
  VIEWS.premium = async (el) => { location.replace("#/listing"); el.innerHTML = ""; };
  VIEWS.listing = async (el) => {
    el.dataset.title = "Listing-Abo";
    const L = C.listing || {};
    el.innerHTML = navBar("Für Ersteller") + `<div class="pw lst"><div class="pw-hero"><div class="logo"><img src="icons/logo.svg" alt=""></div><div class="eyeb">Für Ersteller</div><h1>Dein Listing bei <em>${esc(BRAND)}</em></h1><p>Ein Abo, alles drin. Für Nutzer bleibt ${esc(BRAND)} komplett kostenlos.</p></div>` +
      `<div class="pricecard"><div class="pc-top"><span class="pc-price">${esc(L.price || "")}</span><span class="pc-per">/ ${esc(L.period || "Monat")}</span></div><div class="pc-sub">je gelisteter App · ${esc(L.cancel || "monatlich kündbar")} · zzgl. USt.</div><span class="pc-note">${esc(L.note || "")}</span></div>` +
      `<div class="perks">${LISTING_PERKS.map(([i, c, t, d]) => `<div class="perk"><span class="pi" style="background:${c}">${ic(i)}</span><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>` +
      `<div style="padding:4px 20px 0">${payButton("listing", S.me?.creator?.apps?.[0]?.id, PAY.channel() === "apple" ? `Listing-Abo kaufen · ${L.price} / ${L.period}` : "Listing auf der Website buchen")}</div><div class="pw-legal" style="padding-top:8px">${payHint()}</div>` +
      `<div class="ghead" style="margin-top:22px">Optionale Featured-Plätze</div><div class="addons">${(C.featured || []).map((f) => `<div class="addon"><span class="pi">${ic(f.glyph)}</span><div style="flex:1;min-width:0"><div class="ah"><b>${esc(f.title)}</b><span class="ad">Gesponsert</span></div><p>${esc(f.desc)}</p><div class="pr">${esc(f.price)} <span class="muted">/ 7 Tage · ${esc(L.note || "")}</span></div></div></div>`).join("")}</div>` +
      `<div style="padding:4px 16px 4px;display:grid;gap:10px"><button class="btn sec" data-go="#/featured">${ic("rocket")}Featured-Platz buchen</button><button class="btn" data-go="#/einreichen">${ic("upload")}App einreichen</button></div>` +
      `<div class="pw-legal">Gelistet wird nur, was ein aktives Listing-Abo hat und unsere redaktionelle Prüfung besteht. Bezahlte Plätze sind immer als „Gesponsert“ gekennzeichnet und beeinflussen weder Bewertungen noch Empfehlungen der Redaktion. ${PAY.channel() !== "apple" ? `<a href="ersteller.html">Mehr auf der ${esc(BRAND)}-Website</a> · ` : ""}<a href="nutzungsbedingungen.html#ersteller">Bedingungen für Ersteller</a></div></div>`;
  };

  // ---------- Ersteller-Bereich: Statistik, Neuigkeiten, Deal, Antworten ----------
  function barChart(daily) {
    const max = Math.max(1, ...daily.map((d) => d.views)), w = 300, h = 90, bw = w / daily.length;
    return `<svg class="bars" viewBox="0 0 ${w} ${h + 14}" preserveAspectRatio="none" role="img" aria-label="Aufrufe der letzten 30 Tage">${daily.map((d, i) => { const bh = Math.max(2, (d.views / max) * h); return `<rect x="${(i * bw + 1).toFixed(1)}" y="${(h - bh).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${bh.toFixed(1)}" rx="2"></rect>`; }).join("")}<text x="0" y="${h + 12}">vor 30 Tagen</text><text x="${w}" y="${h + 12}" text-anchor="end">heute</text></svg>`;
  }
  VIEWS["ersteller-bereich"] = async (el, r) => {
    el.dataset.title = "Ersteller-Bereich";
    const head = navBar("Ersteller-Bereich") + largeTitle("Ersteller-Bereich").replace('class="lt"', 'class="lt sub"');
    if (!S.me) { el.innerHTML = head + `<div class="empty">${ic("chart")}<h3>Konto erforderlich</h3><p>Melde dich mit dem Konto an, das deiner App zugeordnet ist.</p><button class="get blue big" data-go="#/anmelden">Anmelden</button></div>`; return; }
    const D = await API.creatorDashboard();
    if (!D.creator) { el.innerHTML = head + `<div class="empty">${ic("chart")}<h3>Noch keine App zugeordnet</h3><p>Reiche deine App ein und buche das Listing-Abo. Nach der Freigabe schalten wir deinen Ersteller-Bereich mit Statistik, Neuigkeiten, Deals und Antworten frei.</p><button class="get blue big" data-go="#/listing">Listing-Abo ansehen</button>${DEMO ? `<p style="margin-top:18px"><button class="small" style="color:var(--tint)" data-act="democreator">Demo: als Ersteller ansehen</button></p>` : ""}</div>`; return; }
    const apps = D.apps.map((x) => ({ ...x, a: S.byId.get(x.id) })).filter((x) => x.a);
    const cur = apps.find((x) => x.id === r.q.get("app")) || apps[0];
    if (!cur) { el.innerHTML = head + `<div class="empty"><h3>Keine aktiven Apps</h3><p>Ohne aktives Listing-Abo ist eine App nicht sichtbar.</p></div>`; return; }
    const a = cur.a, deal = dealFor(a.id), ups = (S.cat.updates || []).filter((u) => u.app_id === a.id);
    const reviews = (await API.reviews(a.id)).map((x) => ({ ...x, app_id: a.id }));
    const active = cur.listing_status === "active" && (!cur.paid_until || new Date(cur.paid_until) > new Date());
    const kpi = (i, l, v, c) => `<div class="kpi"><span class="ki" style="color:${c}">${ic(i)}</span><div class="kv">${Number(v).toLocaleString("de-DE")}</div><div class="kl">${l}</div></div>`;
    el.innerHTML = head +
      `<div class="crhead">${verBadge(D.creator)}<b>${esc(D.creator.name)}</b><span class="muted">· ${apps.length} ${apps.length === 1 ? "App" : "Apps"}</span>${D.demo ? `<span class="demotag">Demo-Zahlen</span>` : ""}</div>` +
      (apps.length > 1 ? `<div class="chips">${apps.map((x) => `<button class="chip ${x.id === a.id ? "on" : ""}" data-go="#/ersteller-bereich?app=${x.id}">${esc(x.a.name)}</button>`).join("")}</div>` : "") +
      `<div class="rows"><div class="row" data-go="#/app/${a.slug}">${icon(a, 56)}<div class="meta"><div class="nm">${esc(a.name)}</div><div class="st">${active ? `<span class="okdot"></span>Listing aktiv${cur.paid_until ? " · bezahlt bis " + fmtDate(cur.paid_until) : ""}` : `<span class="okdot off"></span>Pausiert – nicht sichtbar`}</div></div>${ic("chevR", "chev")}</div></div>` +
      `<div class="paybox">${payButton("listing", a.id, PAY.channel() === "apple" ? "Listing-Abo verlängern" : "Listing-Abo verwalten")}<div class="small muted">${payHint()}</div></div>` +
      sec("Statistik", `<div class="kpis">${kpi("eye", "Aufrufe", cur.views, "#007AFF")}${kpi("ext", "Öffnungen", cur.opens, "#34C759")}${kpi("heart", "Favoriten", cur.favorites, "#FF3B30")}${kpi("bell", "Follower", cur.follows, "#AF52DE")}</div><div class="chartc"><div class="small muted" style="margin-bottom:6px">Aufrufe der Detailseite · letzte 30 Tage</div>${barChart(cur.daily?.length ? cur.daily : [{ views: 0 }])}</div>`, "", "Letzte 30 Tage", true) +
      sec("Neuigkeiten", `<div class="upds">${ups.slice(0, 5).map((u) => updateCard(u, false)).join("") || `<div class="hint" style="padding:6px 0">Noch keine Beiträge. Follower sehen Updates in „Meine Apps“.</div>`}</div><div class="ract"><button data-act="postupdate" data-id="${a.id}">${ic("plusc")}Update oder News posten</button></div>`, "", "", true) +
      sec("Deal", (deal ? dealCard(deal, true) : `<div class="hint" style="padding:6px 0">Kein aktiver Rabattcode.</div>`) + `<div class="ract"><button data-act="editdeal" data-id="${a.id}">${ic("tag")}${deal ? "Deal bearbeiten" : "Deal anlegen"}</button></div>`, "", "Exklusiver Rabattcode für die Community", true) +
      sec("Bewertungen beantworten", `<div class="rcards">${reviews.slice(0, 6).map(reviewCard).join("") || `<div class="muted" style="padding:20px 0">Noch keine Bewertungen.</div>`}</div>`, reviews.length ? `<button data-go="#/bewertungen/${a.slug}">Alle</button>` : "", "", true) +
      `<div class="ghead">Sichtbarkeit</div><div class="glist">${gi({ icon: "rocket", bg: "#AF52DE", label: "Featured-Platz buchen", go: "#/featured?app=" + a.id })}${gi({ icon: "card", bg: "#5856D6", label: "Listing-Abo & Preise", go: "#/listing" })}</div><div style="height:24px"></div>`;
  };

  // ---------- Für Ersteller ----------
  VIEWS.einreichen = async (el) => {
    el.dataset.title = "App einreichen";
    const head = navBar("App einreichen") + largeTitle("App einreichen").replace('class="lt"', 'class="lt sub"');
    if (!S.me) { el.innerHTML = head + `<div class="empty">${ic("upload")}<h3>Konto erforderlich</h3><p>Melde dich an, um deine KI-Webapp für das Verzeichnis vorzuschlagen.</p><button class="get blue big" data-go="#/anmelden">Anmelden</button></div>`; return; }
    el.innerHTML = head + `<div class="feebox">${ic("card")}<div><b>Listing-Abo: ${esc(C.listing?.price || "")} / ${esc(C.listing?.period || "Monat")}</b> <span class="pc-note">${esc(C.listing?.note || "")}</span><br>Jede gelistete App braucht ein aktives Listing-Abo (${esc(C.listing?.cancel || "monatlich kündbar")}). Gebucht wird erst nach der redaktionellen Freigabe – ${PAY.channel() === "apple" ? "per In-App-Kauf in dieser App (Ersteller-Bereich)" : `Buchung und Bezahlung auf der ${esc(BRAND)}-Website`}. Für Nutzer bleibt ${esc(BRAND)} kostenlos.${PAY.channel() !== "apple" ? ` <a href="ersteller.html">Mehr auf der ${esc(BRAND)}-Website</a>` : ` <a href="#/listing">Was ist enthalten?</a>`}</div></div>` +
      `<div class="hint" style="padding:0 32px 14px">Wir prüfen jede Einreichung redaktionell (Funktion, Datenschutzangaben, Inhalte). Ein Anspruch auf Aufnahme besteht nicht.</div>` +
      `<form class="form" id="f-sub" novalidate><div class="fg"><label class="fl"><span>Name der App</span><input name="name" maxlength="40" required></label><label class="fl"><span>Untertitel</span><input name="subtitle" maxlength="60" placeholder="Was macht die App in einem Satz?"></label><label class="fl"><span>Website (https://…)</span><input name="url" type="url" inputmode="url" autocapitalize="none" placeholder="https://" required></label></div>` +
      `<div class="fg"><label class="fl"><span>Kategorie</span><select name="category_id" required><option value="">Bitte wählen</option>${S.cat.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label><label class="fl"><span>Preismodell</span><select name="price_model">${Object.entries(PRICE).map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select></label></div>` +
      `<div class="fg"><label class="fl"><span>Beschreibung</span><textarea name="description" maxlength="4000" placeholder="Funktionen, Zielgruppe, Besonderheiten"></textarea></label></div>` +
      `<div class="fg"><label class="fl"><span>Ersteller / Firma</span><input name="creator_name" maxlength="60"></label><label class="fl"><span>Kontakt-E-Mail (nicht öffentlich)</span><input name="contact_email" type="email" inputmode="email" autocapitalize="none" required></label></div>` +
      `<label class="check"><input type="checkbox" name="rights" value="1"><span>Ich bin berechtigt, diese App anzubieten, und bestätige, dass Angaben zu Preisen und Datenschutz korrekt sind.</span></label><div class="err" id="err"></div><button class="btn" type="submit">Einreichen</button></form><div style="height:20px"></div>`;
    $("#f-sub", el).addEventListener("submit", (e) => submit(e, async (f) => { f.rights = !!f.rights; await API.submitApp(f); toast("Danke! Wir prüfen deine App und melden uns zum Listing-Abo."); go("#/konto"); }));
  };
  const PKGS = () => (C.featured || []).map((f) => [f.id, f.glyph, { app_of_week: "#FF9500", story: "#FF2D55", category: "#5856D6" }[f.id] || "#AF52DE", f.title, f.desc, f.price + " / 7 Tage", f.product]);
  VIEWS.featured = async (el, r) => {
    el.dataset.title = "Featured buchen";
    const appId = r.q.get("app") || S.me?.creator?.apps?.[0]?.id || "";
    el.innerHTML = navBar("Featured buchen") + largeTitle("Featured buchen").replace('class="lt"', 'class="lt sub"') +
      `<div class="hint" style="padding:0 32px 14px">Optionale Zusatzplätze zum Listing-Abo. Bezahlte Plätze sind immer als „Gesponsert“ gekennzeichnet und beeinflussen weder Bewertungen noch redaktionelle Empfehlungen.</div>` +
      PKGS().map(([k, i, c, t, d, p, prod]) => `<div class="pkg"><span class="pi" style="background:${c}">${ic(i)}</span><div style="flex:1"><h3>${t} <span class="ad">Gesponsert</span></h3><p>${d}</p><div class="pr">${p} <span class="muted small">· ${esc(C.listing?.note || "")}</span></div><div class="pkgpay">${payButton(prod, appId, PAY.channel() === "apple" ? "Mit Apple kaufen" : "Buchen")}</div></div></div>`).join("") +
      `<div style="padding:8px 16px 6px"><button class="btn sec" data-act="sponsor">Individuelle Anfrage senden</button></div><div class="hint" style="padding:6px 32px 24px;text-align:center">${payHint()} Preise zzgl. USt.</div>`;
  };

  // ====================== Sheets, Toast, Formulare ======================
  function toast(msg) { $$(".toast").forEach((t) => t.remove()); const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2700); }
  function closeSheets(now) {
    $$(".backdrop,.sheet,.asheet").forEach((n) => { if (now) n.remove(); else { n.classList.add("out"); setTimeout(() => n.remove(), 230); } });
    document.body.style.overflow = "";
  }
  function openSheet(html, { action = false, grouped = false, onMount } = {}) {
    closeSheets(true);
    const bd = document.createElement("div"); bd.className = "backdrop"; bd.dataset.act = "closesheet";
    const sh = document.createElement("div"); sh.className = (action ? "asheet" : "sheet") + (grouped ? " grouped" : ""); sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true");
    sh.innerHTML = action ? html : `<div class="grab"></div>${html}`;
    document.body.append(bd, sh); document.body.style.overflow = "hidden";
    onMount && onMount(sh);
    return sh;
  }
  // Action-Sheet im iOS-Stil; gibt den gewählten Wert zurück (oder null)
  function actionSheet(title, msg, opts) {
    return new Promise((res) => {
      const sh = openSheet(`<div class="grp">${title || msg ? `<div class="msg">${title ? `<b>${esc(title)}</b>` : ""}${esc(msg || "")}</div>` : ""}${opts.map((o, i) => `<button data-i="${i}" class="${o.cls || ""}">${esc(o.label)}</button>`).join("")}</div><div class="grp"><button class="bold" data-i="-1">Abbrechen</button></div>`, { action: true });
      const done = (v) => { closeSheets(); res(v); };
      sh.addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (!b) return; const i = Number(b.dataset.i); done(i < 0 ? null : opts[i].value); });
      $(".backdrop").addEventListener("click", () => done(null), { once: true });
    });
  }
  const formData = (form) => { const o = {}; new FormData(form).forEach((v, k) => { o[k] = typeof v === "string" ? v.trim() : v; }); return o; };
  async function submit(e, fn) {
    e.preventDefault();
    const form = e.target, btn = $("button[type=submit],.btn", form), err = $(".err", form);
    if (err) err.textContent = "";
    btn && (btn.disabled = true);
    try { await fn(formData(form)); } catch (x) { if (err) err.textContent = x.message; else toast(x.message); } finally { btn && (btn.disabled = false); }
  }
  function needLogin(why) {
    return actionSheet("Anmeldung erforderlich", why, [{ label: "Anmelden", value: "#/anmelden" }, { label: "Konto erstellen", value: "#/registrieren" }]).then((h) => { if (h) go(h); });
  }

  function filterSheet(F) {
    const draft = { ...F, price: [...F.price], f: [...F.f] };
    const render = () => `<div class="shh"><button data-x="reset">Zurücksetzen</button><h3>Filter</h3><button data-x="apply">Fertig</button></div><div class="shs">` +
      `<h4>Kategorie</h4><div class="chips"><button class="chip ${!draft.cat ? "on" : ""}" data-cat="">Alle</button>${S.cat.categories.map((c) => `<button class="chip ${draft.cat === c.id ? "on" : ""}" data-cat="${c.id}">${esc(c.short)}</button>`).join("")}</div>` +
      `<h4>Preis</h4><div class="chips">${Object.entries(PRICE).map(([k, l]) => `<button class="chip ${draft.price.includes(k) ? "on" : ""}" data-price="${k}">${l}</button>`).join("")}</div>` +
      `<h4>Bewertung</h4><div class="chips">${[0, 3.5, 4, 4.5].map((m) => `<button class="chip ${draft.min === m ? "on" : ""}" data-min="${m}">${m ? `ab ${fmtRating(m)} ★` : "Alle"}</button>`).join("")}</div>` +
      `<h4>Sortieren</h4><div class="chips">${Object.entries(SORTS).map(([k, l]) => `<button class="chip ${(draft.sort || "") === (k === "relevance" ? "" : k) ? "on" : ""}" data-sort="${k === "relevance" ? "" : k}">${l}</button>`).join("")}</div>` +
      `<h4>Weitere Filter</h4>${Object.entries(FEAT).map(([k, l]) => `<label class="tgl"><span>${l}</span><span class="sw"><input type="checkbox" data-feat="${k}" ${draft.f.includes(k) ? "checked" : ""}><i></i></span></label>`).join("")}` +
      `<div style="padding:18px 0 4px"><button class="btn" data-x="apply">${search(draft).length} Ergebnisse anzeigen</button></div></div>`;
    const sh = openSheet(render());
    sh.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.x === "reset") { draft.cat = ""; draft.price = []; draft.min = 0; draft.sort = ""; draft.f = []; }
      else if (b.dataset.x === "apply") { closeSheets(); go(filterHash(draft)); return; }
      else if ("cat" in b.dataset) draft.cat = b.dataset.cat;
      else if ("price" in b.dataset) { const k = b.dataset.price; draft.price = draft.price.includes(k) ? draft.price.filter((x) => x !== k) : [...draft.price, k]; }
      else if ("min" in b.dataset) draft.min = Number(b.dataset.min);
      else if ("sort" in b.dataset) draft.sort = b.dataset.sort;
      else return;
      sh.innerHTML = `<div class="grab"></div>` + render();
    });
    sh.addEventListener("change", (e) => {
      const k = e.target.dataset.feat; if (!k) return;
      draft.f = e.target.checked ? [...draft.f, k] : draft.f.filter((x) => x !== k);
      sh.innerHTML = `<div class="grab"></div>` + render();
    });
  }
  async function pickSheet(k) {
    const F = readFilters(parse().q);
    let opts;
    if (k === "cat") opts = [{ label: "Alle Kategorien", value: "" }, ...S.cat.categories.map((c) => ({ label: c.name, value: c.id, cls: F.cat === c.id ? "on" : "" }))];
    if (k === "price") opts = [{ label: "Alle Preismodelle", value: [] }, ...Object.entries(PRICE).map(([v, l]) => ({ label: l, value: [v], cls: F.price.includes(v) ? "on" : "" }))];
    if (k === "min") opts = [0, 3.5, 4, 4.5].map((m) => ({ label: m ? `ab ${fmtRating(m)} Sternen` : "Alle Bewertungen", value: m, cls: F.min === m ? "on" : "" }));
    if (k === "sort") opts = Object.entries(SORTS).map(([v, l]) => ({ label: l, value: v === "relevance" ? "" : v, cls: (F.sort || "") === (v === "relevance" ? "" : v) ? "on" : "" }));
    const v = await actionSheet({ cat: "Kategorie", price: "Preis", min: "Bewertung", sort: "Sortieren nach" }[k], "", opts);
    if (v === null) return;
    F[k] = v; go(filterHash(F));
  }
  async function reviewSheet(appId) {
    if (!S.me) return needLogin("Melde dich an, um eine Bewertung zu schreiben.");
    const a = S.byId.get(appId), mine = S.myRev.find((r) => r.app_id === appId);
    let st = mine?.stars || 0;
    const sh = openSheet(`<form id="f-rev"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Bewertung</h3><button type="submit">Senden</button></div><div class="shs" style="text-align:center"><div style="display:flex;justify-content:center;margin:4px 0 8px">${icon(a, 56)}</div><b>${esc(a.name)}</b><div class="small muted">Tippe, um zu bewerten</div><div class="stpick">${[1, 2, 3, 4, 5].map((i) => `<button type="button" data-s="${i}" aria-label="${i} Sterne">${starSvg(i <= st ? 1 : 0)}</button>`).join("")}</div></div>` +
      `<div class="form"><div class="fg"><label class="fl"><span>Titel</span><input name="title" maxlength="80" value="${esc(mine?.title || "")}"></label><label class="fl"><span>Bewertung (optional)</span><textarea name="body" maxlength="2000">${esc(mine?.body || "")}</textarea></label></div><div class="err"></div><div class="small muted" style="padding:0 4px 8px">Bewertungen sind öffentlich und erscheinen mit deinem Anzeigenamen. Bitte sachlich bleiben.</div></div></form>`, { grouped: true });
    const paint = () => $$(".stpick button", sh).forEach((b) => { b.innerHTML = starSvg(Number(b.dataset.s) <= st ? 1 : 0); });
    sh.addEventListener("click", (e) => { const b = e.target.closest("[data-s]"); if (b) { st = Number(b.dataset.s); paint(); } });
    $("#f-rev", sh).addEventListener("submit", (e) => submit(e, async (f) => { await API.saveReview({ app_id: appId, stars: st, ...f }); await refresh(); closeSheets(); toast("Danke für deine Bewertung!"); route("restore"); }));
  }
  const REASONS = [["broken", "Funktioniert nicht / Link defekt"], ["misleading", "Irreführende Angaben (z. B. Preis)"], ["illegal", "Rechtswidrige Inhalte"], ["privacy", "Datenschutzproblem"], ["spam", "Spam oder Betrug"], ["other", "Sonstiges"]];
  function reportSheet(appId, reviewId) {
    let reason = "";
    const render = () => `<form id="f-rep"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>${reviewId ? "Bewertung melden" : "App melden"}</h3><button type="submit">Senden</button></div><div class="shs">${(reviewId ? REASONS.filter((r) => r[0] !== "broken" && r[0] !== "misleading").concat([["offensive", "Beleidigend oder unsachlich"]]) : REASONS).map(([k, l]) => `<button type="button" class="radio ${reason === k ? "on" : ""}" data-r="${k}"><span class="rad"></span>${l}</button>`).join("")}<div class="form" style="padding:14px 0 0"><div class="fg"><label class="fl"><span>Details (optional)</span><textarea name="details" maxlength="1000"></textarea></label></div><div class="err"></div><div class="small muted">Wir prüfen jede Meldung. Bei rechtswidrigen Inhalten gemäß DSA bitte möglichst genau beschreiben.</div></div></div></form>`;
    const sh = openSheet(render());
    sh.addEventListener("click", (e) => { const b = e.target.closest("[data-r]"); if (b) { reason = b.dataset.r; $$(".radio", sh).forEach((x) => x.classList.toggle("on", x.dataset.r === reason)); } });
    sh.addEventListener("submit", (e) => submit(e, async (f) => { await API.report({ app_id: appId, review_id: reviewId || null, reason, details: f.details }); closeSheets(); toast("Danke, wir sehen uns das an."); }));
  }
  function sponsorSheet() {
    const sh = openSheet(`<form id="f-sp"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Featured anfragen</h3><button type="submit">Senden</button></div><div class="form"><div class="fg"><label class="fl"><span>Name deiner App</span><input name="app_name" maxlength="60" required></label><label class="fl"><span>Paket</span><select name="package">${PKGS().map((p) => `<option value="${p[0]}">${p[3]} (${p[5]})</option>`).join("")}<option value="listing">Listing-Abo (${esc(C.listing?.price || "")} / Monat)</option></select></label><label class="fl"><span>E-Mail</span><input name="email" type="email" inputmode="email" autocapitalize="none" required></label><label class="fl"><span>Nachricht (optional)</span><textarea name="message" maxlength="1000" placeholder="Zeitraum, Wünsche …"></textarea></label></div><div class="err"></div><div class="small muted" style="padding:0 4px 10px">Wir melden uns per E-Mail. Bezahlte Plätze werden immer als „Gesponsert“ gekennzeichnet.</div></div></form>`, { grouped: true });
    sh.addEventListener("submit", (e) => submit(e, async (f) => { await API.sponsorRequest(f); closeSheets(); toast("Anfrage gesendet – wir melden uns!"); }));
  }

  // ---- Ersteller-Sheets ----
  function updateSheet(appId) {
    const a = S.byId.get(appId); let kind = "update";
    const sh = openSheet(`<form id="f-up"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Neuigkeit posten</h3><button type="submit">Posten</button></div><div class="shs" style="padding-bottom:0"><div class="seg" style="margin:0 0 6px"><button type="button" class="on" data-k="update">Update</button><button type="button" data-k="news">News</button></div></div><div class="form"><div class="fg"><label class="fl"><span>Titel</span><input name="title" maxlength="80" required placeholder="z. B. Neuer Export als PDF"></label><label class="fl v"><span>Version (optional)</span><input name="version" maxlength="20" placeholder="2.1"></label><label class="fl"><span>Text</span><textarea name="body" maxlength="1000" placeholder="Was ist neu?"></textarea></label></div><div class="err"></div><div class="small muted" style="padding:0 4px 10px">Erscheint auf der Seite von ${esc(a.name)} und bei allen, die der App folgen. Keine Werbung für Drittangebote.</div></div></form>`, { grouped: true });
    sh.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) { kind = b.dataset.k; $$("[data-k]", sh).forEach((x) => x.classList.toggle("on", x === b)); } });
    $("#f-up", sh).addEventListener("submit", (e) => submit(e, async (f) => { await API.postUpdate({ app_id: appId, kind, ...f }); await refresh(); closeSheets(); toast("Veröffentlicht – deine Follower sehen es jetzt."); route("restore"); }));
  }
  function dealSheet(appId) {
    const d = dealFor(appId) || {};
    const exp = d.expires_at ? d.expires_at.slice(0, 10) : "";
    const sh = openSheet(`<form id="f-deal"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Deal</h3><button type="submit">Sichern</button></div><div class="form"><div class="fg"><label class="fl"><span>Titel</span><input name="title" maxlength="80" required value="${esc(d.title || "")}" placeholder="z. B. 20 % auf Pro"></label><label class="fl"><span>Rabatt (kurz)</span><input name="discount" maxlength="20" required value="${esc(d.discount || "")}" placeholder="-20 %"></label><label class="fl"><span>Code</span><input name="code" maxlength="24" required autocapitalize="characters" value="${esc(d.code || "")}" placeholder="KISTORE20"></label><label class="fl"><span>Bedingungen (optional)</span><input name="terms" maxlength="200" value="${esc(d.terms || "")}" placeholder="Für Neukunden, 12 Monate"></label><label class="fl"><span>Gültig bis (optional)</span><input name="expires_at" type="date" value="${exp}"></label></div><div class="err"></div><div class="small muted" style="padding:0 4px 10px">Der Rabatt wird von dir beim Einlösen gewährt. Codes sehen nur angemeldete Nutzer.</div>${d.code ? `<button type="button" class="btn sec" style="color:var(--red)" data-x="off">Deal beenden</button>` : ""}</div></form>`, { grouped: true });
    sh.addEventListener("click", async (e) => { if (e.target.closest("[data-x=off]")) { await API.saveDeal({ app_id: appId, active: false }); await refresh(); closeSheets(); toast("Deal beendet"); route("restore"); } });
    $("#f-deal", sh).addEventListener("submit", (e) => submit(e, async (f) => { await API.saveDeal({ app_id: appId, ...f, expires_at: f.expires_at || null }); await refresh(); closeSheets(); toast("Deal gespeichert"); route("restore"); }));
  }
  async function replySheet(reviewId, appId) {
    const r = (await API.reviews(appId)).find((x) => String(x.id) === String(reviewId)); if (!r) return toast("Bewertung nicht gefunden");
    const sh = openSheet(`<form id="f-rp"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Antworten</h3><button type="submit">Senden</button></div><div class="shs"><div class="rcard" style="margin:0">${stars(r.stars)}<div class="rb"><b>${esc(r.title || "")}</b><br>${esc(r.body || "")}</div></div></div><div class="form"><div class="fg"><label class="fl"><span>Deine Antwort (öffentlich)</span><textarea name="body" maxlength="1000">${esc(r.reply || "")}</textarea></label></div><div class="err"></div><div class="small muted" style="padding:0 4px 10px">Bleib freundlich und sachlich. Leeres Feld = Antwort entfernen.</div></div></form>`, { grouped: true });
    $("#f-rp", sh).addEventListener("submit", (e) => submit(e, async (f) => { await API.replyReview({ review_id: reviewId, app_id: appId, body: f.body }); closeSheets(); toast(f.body ? "Antwort veröffentlicht" : "Antwort entfernt"); route("restore"); }));
  }

  // ====================== Aktionen ======================
  async function refresh() { await loadCatalog(); await loadMe(); }
  async function openApp(id) {
    const a = S.byId.get(id); if (!a) return;
    API.track && API.track(id, "open");
    const go2 = () => { const w = window.open(a.url, "_blank", "noopener,noreferrer"); if (!w) location.href = a.url; };
    if (C.confirmExternal === false || localStorage.getItem("aw-noconfirm")) return go2();
    const v = await actionSheet(`${a.name} öffnen?`, `Du verlässt ${BRAND} und öffnest ${a.domain}. Nutzung und Bezahlung erfolgen beim Anbieter.`, [{ label: "Website öffnen", value: "open", cls: "bold" }, { label: "Nicht mehr fragen", value: "always" }]);
    if (v === "always") localStorage.setItem("aw-noconfirm", "1");
    if (v) go2();
  }
  async function toggleFav(id, btn) {
    if (!S.me) return needLogin("Melde dich an, um Apps als Favoriten zu speichern.");
    try {
      const r = await API.toggleFavorite(id);
      S.favs = r.on ? [id, ...S.favs] : S.favs.filter((x) => x !== id);
      if (btn) { btn.classList.toggle("on", r.on); btn.setAttribute("aria-pressed", r.on); }
      renderTabs(); toast(r.on ? "Zu Favoriten hinzugefügt" : "Aus Favoriten entfernt");
      if (curTab === "meine" && !r.on) route("restore");
    } catch (e) { toast(e.message); }
  }
  async function toggleFollow(id, btn) {
    if (!S.me) return needLogin("Melde dich an, um Apps zu folgen und ihre Updates & Deals zu sehen.");
    const r = await API.toggleFollow(id);
    S.follows = r.on ? [id, ...S.follows] : S.follows.filter((x) => x !== id);
    if (btn) { btn.classList.toggle("on", r.on); btn.setAttribute("aria-pressed", r.on); btn.innerHTML = r.on ? `${ic("check")}Gefolgt` : `${ic("plus")}Folgen`; }
    renderTabs(); toast(r.on ? `Du folgst ${S.byId.get(id)?.name || ""} – Neuigkeiten findest du in „Meine Apps“.` : "Nicht mehr gefolgt");
  }
  function applyTheme() {
    const t = localStorage.getItem("aw-theme") || "auto";
    if (t === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
    const dark = t === "dark" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    $('meta[name="theme-color"]')?.setAttribute("content", dark ? "#000000" : "#ffffff");
  }
  const ACTS = {
    back, closesheet: () => closeSheets(),
    open: (b) => openApp(b.dataset.id),
    fav: (b) => toggleFav(b.dataset.id, b),
    follow: (b) => toggleFollow(b.dataset.id, b),
    copycode: async (b) => { const c = b.dataset.code; try { await navigator.clipboard.writeText(c); } catch { const t = document.createElement("textarea"); t.value = c; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch {} t.remove(); } b.classList.add("done"); b.innerHTML = `${ic("check")}Kopiert`; toast(`Code ${c} kopiert`); },
    dealLogin: () => needLogin("Melde dich kostenlos an, um exklusive Rabattcodes zu sehen."),
    postupdate: (b) => updateSheet(b.dataset.id),
    editdeal: (b) => dealSheet(b.dataset.id),
    reply: (b) => replySheet(b.dataset.id, b.dataset.app),
    delupdate: async (b) => { const v = await actionSheet("Beitrag löschen?", "", [{ label: "Löschen", value: 1, cls: "red" }]); if (!v) return; await API.deleteUpdate(b.dataset.id); await refresh(); toast("Gelöscht"); route("restore"); },
    democreator: async () => { const cs = S.cat.creators.map((c) => ({ c, n: pub().filter((a) => a.creator_id === c.id).length })).filter((x) => x.n).sort((x, y) => y.n - x.n).slice(0, 6);
      const v = await actionSheet("Demo: Ersteller wählen", "Dein Demo-Konto wird diesem Beispiel-Ersteller zugeordnet. Live übernimmt das die Redaktion nach Buchung des Listing-Abos.", cs.map((x) => ({ label: `${x.c.name} (${x.n} ${x.n === 1 ? "App" : "Apps"})`, value: x.c.id })));
      if (!v) return; S.me = await API.demoBecomeCreator(v); go("#/ersteller-bereich"); },
    pay: async (b) => {
      const product = b.dataset.product, appId = b.dataset.app;
      if (!S.me) return needLogin("Melde dich mit deinem Ersteller-Konto an.");
      if (!appId) return actionSheet("Erst einreichen", "Das Listing-Abo buchst du nach der Freigabe deiner App im Ersteller-Bereich.", [{ label: "App einreichen", value: 1, cls: "bold" }]).then((v) => v && go("#/einreichen"));
      try { await PAY.buyApple(product, appId, (id, jws) => API.iapVerify(id, jws)); await refresh(); toast("Danke! Dein Kauf ist aktiv."); route("restore"); }
      catch (e) { toast(e.message); }
    },
    share: async () => { const url = location.href; try { if (navigator.share) await navigator.share({ title: document.title, url }); else { await navigator.clipboard.writeText(url); toast("Link kopiert"); } } catch {} },
    more: (b) => { $("#desc")?.classList.remove("clamp"); b.remove(); },
    q: (b) => go(filterHash({ ...readFilters(new URLSearchParams()), q: b.dataset.q })),
    qclear: (b, e) => { e.preventDefault(); const F = readFilters(parse().q); F.q = ""; go(filterHash(F)); },
    filters: () => filterSheet(readFilters(parse().q)),
    pick: (b) => pickSheet(b.dataset.k),
    feat: (b) => { const F = readFilters(parse().q); const k = b.dataset.k; F.f = F.f.includes(k) ? F.f.filter((x) => x !== k) : [...F.f, k]; go(filterHash(F)); },
    clearf: () => { const F = readFilters(parse().q); go(filterHash({ q: F.q, cat: "", price: [], min: 0, sort: "", f: [] })); },
    review: (b) => reviewSheet(b.dataset.id),
    delreview: async (b) => { const v = await actionSheet("Bewertung löschen?", "", [{ label: "Löschen", value: 1, cls: "red" }]); if (!v) return; await API.deleteReview(b.dataset.id); await refresh(); toast("Bewertung gelöscht"); route("restore"); },
    report: (b) => reportSheet(b.dataset.id),
    reportreview: (b) => reportSheet(b.dataset.app, b.dataset.id),
    sponsor: () => sponsorSheet(),
    theme: async () => { const v = await actionSheet("Darstellung", "", [["auto", "Automatisch"], ["light", "Hell"], ["dark", "Dunkel"]].map(([k, l]) => ({ label: l, value: k, cls: (localStorage.getItem("aw-theme") || "auto") === k ? "on" : "" }))); if (!v) return; if (v === "auto") localStorage.removeItem("aw-theme"); else localStorage.setItem("aw-theme", v); applyTheme(); route("restore"); },
    confirmext: () => { if (localStorage.getItem("aw-noconfirm")) localStorage.removeItem("aw-noconfirm"); else localStorage.setItem("aw-noconfirm", "1"); route("restore"); },
    myreviews: () => {
      if (!S.me) return needLogin("Melde dich an, um deine Bewertungen zu sehen.");
      if (!S.myRev.length) return toast("Du hast noch keine Bewertungen geschrieben");
      actionSheet("Meine Bewertungen", "", S.myRev.map((r) => ({ label: `${"★".repeat(r.stars)} ${S.byId.get(r.app_id)?.name || ""}`, value: S.byId.get(r.app_id)?.slug }))).then((s) => s && go("#/app/" + s));
    },
    rename: () => {
      const sh = openSheet(`<form id="f-name"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Anzeigename</h3><button type="submit">Sichern</button></div><div class="form"><div class="fg"><label class="fl"><span>Anzeigename</span><input name="display_name" maxlength="40" value="${esc(S.me.display_name)}"></label></div><div class="err"></div></div></form>`, { grouped: true });
      sh.addEventListener("submit", (e) => submit(e, async (f) => { S.me = await API.updateProfile(f); closeSheets(); toast("Gespeichert"); route("restore"); }));
    },
    export: async () => { const d = await API.exportData(); const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }); const u = URL.createObjectURL(blob); const l = document.createElement("a"); l.href = u; l.download = `${BRAND.toLowerCase()}-daten.json`; l.click(); setTimeout(() => URL.revokeObjectURL(u), 2000); toast("Export erstellt"); },
    logout: async () => { await API.logout(); await refresh(); toast("Abgemeldet"); route("restore"); },
    delete: async () => {
      const v = await actionSheet("Konto endgültig löschen?", "Favoriten, gefolgte Apps, Bewertungen und Einreichungen werden gelöscht. Das kann nicht rückgängig gemacht werden." + (S.me?.creator ? " Ein laufendes Listing-Abo kündigst du bitte zusätzlich (Website bzw. iOS-Einstellungen → Abonnements)." : ""), [{ label: "Konto löschen", value: 1, cls: "red" }]);
      if (!v) return; await API.deleteAccount(); await refresh(); toast("Konto gelöscht"); go("#/konto");
    },
    resetdemo: async () => { const v = await actionSheet("Demo zurücksetzen?", "Alle Demo-Konten, Favoriten, gefolgten Apps, Bewertungen und Ersteller-Beiträge in diesem Browser werden entfernt.", [{ label: "Zurücksetzen", value: 1, cls: "red" }]); if (!v) return; API.resetDemo(); location.hash = "#/"; location.reload(); }
  };

  // ====================== Admin-Bereich (nur Rolle admin; Prüfung serverseitig in der Edge Function) ======================
  const ADM_TABS = [["uebersicht", "Übersicht"], ["einreichungen", "Einreichungen"], ["meldungen", "Meldungen"], ["ersteller", "Ersteller"], ["apps", "Apps"], ["platzierungen", "Platzierungen"], ["anfragen", "Anfragen"], ["protokoll", "Protokoll"]];
  const REASON_L = Object.fromEntries([...REASONS, ["offensive", "Beleidigend oder unsachlich"]]);
  const SLOT_L = { today: "Heute", category: "Kategorie", search: "Suche" };
  const SPON_L = { new: "Neu", offer_sent: "Angebot gesendet", booked: "Gebucht", declined: "Abgelehnt" };
  const LOG_L = { submission_approve: "Einreichung angenommen", submission_reject: "Einreichung abgelehnt", creator_update: "Ersteller geändert", app_update: "App geändert", report_resolve: "Meldung bearbeitet", review_status: "Bewertung geändert", placement_save: "Platzierung gespeichert", placement_delete: "Platzierung gelöscht", sponsor_status: "Anfrage geändert" };
  let AD = null;
  const admLive = (a) => a.status === "published" && a.listing_status === "active" && (!a.paid_until || new Date(a.paid_until) > new Date());
  const admState = (a) => a.status !== "published" ? ["Ausgeblendet", "red"] : a.listing_status !== "active" ? ["Pausiert", "gray"] : a.paid_until && new Date(a.paid_until) <= new Date() ? ["Abgelaufen", "orange"] : ["Live", "green"];
  const pill = (t, c) => `<span class="pill ${c}">${esc(t)}</span>`;
  const dIn = (d) => (d ? String(d).slice(0, 10) : "");
  const endOfDay = (v) => (v ? new Date(v + "T23:59:59").toISOString() : null);
  const admName = (p) => (p ? `@${esc(p.username)}` : `<span class="muted">Gast/gelöscht</span>`);
  async function admLoad() { AD = await API.admin("admin_data"); AD.appById = new Map(AD.apps.map((a) => [a.id, a])); AD.crById = new Map(AD.creators.map((c) => [c.id, c])); AD._uid = S.me?.id; AD._t = Date.now(); return AD; }
  async function admDo(action, body, msg) { await API.admin(action, body); await refresh(); await admLoad(); closeSheets(); toast(msg || "Gespeichert"); route("restore"); }
  const admIco = (a) => (a?.icon ? icon(a, 44) : `<div class="ico" style="--s:44px"></div>`);

  VIEWS.admin = async (el, r) => {
    el.dataset.title = "Admin";
    const head = navBar("Admin") + largeTitle("Admin", "", BRAND + " · Verwaltung").replace('class="lt"', 'class="lt sub"');
    if (!S.me) { el.innerHTML = head + `<div class="empty">${ic("lock")}<h3>Anmeldung erforderlich</h3><p>Melde dich mit deinem Admin-Konto an.</p><button class="get blue big" data-go="#/anmelden">Anmelden</button></div>`; return; }
    if (!S.me.is_admin) { el.innerHTML = head + `<div class="empty" id="adm-denied">${ic("lock")}<h3>Kein Zugriff</h3><p>Dieser Bereich ist nur für Administratoren.</p><button class="get blue big" data-go="#/konto">Zum Konto</button></div>`; return; }
    const tab = ADM_TABS.some(([k]) => k === r.q.get("tab")) ? r.q.get("tab") : "uebersicht";
    if (!AD || AD._uid !== S.me.id || Date.now() - AD._t > 20000 || r.q.get("reload")) await admLoad();
    const openSubs = AD.submissions.filter((s) => s.status === "pending").length, openReps = AD.reports.filter((x) => x.status === "open").length, newReq = AD.sponsor_requests.filter((x) => x.status === "new").length;
    const cnt = { einreichungen: openSubs, meldungen: openReps, anfragen: newReq };
    const tabs = `<div class="chips admtabs">${ADM_TABS.map(([k, l]) => `<button class="chip ${k === tab ? "on" : ""}" data-go="#/admin?tab=${k}">${l}${cnt[k] ? `<span class="cnt">${cnt[k]}</span>` : ""}</button>`).join("")}</div>`;
    el.innerHTML = head + `<div class="admbar">${ic("shield")}<span>Angemeldet als <b>@${esc(S.me.username)}</b> · Admin</span>${AD.demo ? `<span class="demotag">Demo</span>` : ""}</div>` + tabs + `<div class="adm" id="adm-${tab}">${ADM_RENDER[tab](r)}</div>`;
  };

  const kpiA = (i, l, v, c, sub = "") => `<div class="kpi"><span class="ki" style="color:${c}">${ic(i)}</span><div class="kv">${Number(v).toLocaleString("de-DE")}</div><div class="kl">${l}${sub ? ` <span class="muted">${sub}</span>` : ""}</div></div>`;
  const ADM_RENDER = {
    uebersicht() {
      const live = AD.apps.filter(admLive), byDay = new Map(), per = new Map();
      AD.stats_daily.forEach((d) => { const x = byDay.get(d.day) || { day: d.day, views: 0, opens: 0 }; x.views += d.views; x.opens += d.opens; byDay.set(d.day, x); const p = per.get(d.app_id) || { views: 0, opens: 0 }; p.views += d.views; p.opens += d.opens; per.set(d.app_id, p); });
      const days = []; for (let i = 29; i >= 0; i--) { const k = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10); days.push(byDay.get(k) || { day: k, views: 0, opens: 0 }); }
      const tv = days.reduce((s, d) => s + d.views, 0), to = days.reduce((s, d) => s + d.opens, 0);
      const top = [...per.entries()].map(([id, v]) => ({ a: AD.appById.get(id), ...v })).filter((x) => x.a).sort((x, y) => y.views - x.views).slice(0, 8);
      const todo = [[AD.submissions.filter((s) => s.status === "pending").length, "Einreichungen prüfen", "einreichungen", "upload", "#34C759"], [AD.reports.filter((x) => x.status === "open").length, "Meldungen bearbeiten", "meldungen", "flag", "#FF3B30"], [AD.sponsor_requests.filter((x) => x.status === "new").length, "Featured-Anfragen beantworten", "anfragen", "rocket", "#AF52DE"]];
      return `<div class="glist todo">${todo.map(([n, l, k, i, c]) => gi({ icon: i, bg: c, label: l, value: n ? `<span class="cnt">${n}</span>` : "✓", go: "#/admin?tab=" + k })).join("")}</div>` +
        `<div class="kpis">${kpiA("grid", "Apps live", live.length, "#007AFF", `von ${AD.apps.length}`)}${kpiA("shield", "Ersteller", AD.creators.length, "#34C759", `${AD.creators.filter((c) => c.verified).length} verifiziert`)}${kpiA("person", "Konten", AD.counts.users, "#5856D6")}${kpiA("star", "Bewertungen", AD.counts.reviews, "#FF9500")}${kpiA("heart", "Favoriten", AD.counts.favorites, "#FF3B30")}${kpiA("bell", "Follows", AD.counts.follows, "#AF52DE")}</div>` +
        sec("Aufrufe", `<div class="chartc"><div class="small muted" style="margin-bottom:6px">${tv.toLocaleString("de-DE")} Aufrufe · ${to.toLocaleString("de-DE")} Öffnungen · letzte 30 Tage</div>${barChart(days)}</div>`, "", "Alle Apps", true) +
        sec("Top-Apps", `<div class="rows">${top.map((x, i) => `<div class="row" data-go="#/admin?tab=apps&id=${x.a.id}"><div class="rk">${i + 1}</div>${admIco(x.a)}<div class="meta"><div class="nm">${esc(x.a.name)}</div><div class="st">${x.views.toLocaleString("de-DE")} Aufrufe · ${x.opens.toLocaleString("de-DE")} Öffnungen</div></div>${ic("chevR", "chev")}</div>`).join("") || `<div class="hint">Noch keine Daten.</div>`}</div>`, "", "Nach Aufrufen, 30 Tage", true) +
        (AD.payments.length ? sec("Letzte Zahlungen", `<div class="glist" style="margin:0">${AD.payments.slice(0, 8).map((p) => `<div class="subm"><div style="flex:1;min-width:0"><b>${esc(AD.appById.get(p.app_id)?.name || p.app_id || "–")}</b><div class="small muted">${esc(p.provider)} · ${esc(p.kind)} · ${p.period_end ? "bis " + fmtDate(p.period_end) : ""}</div></div><span class="small muted">${relDate(p.created_at)}</span></div>`).join("")}</div>`, "", "", true) : "");
    },
    einreichungen(r) {
      const done = r.q.get("f") === "done", list = AD.submissions.filter((s) => (s.status === "pending") !== done);
      return `<div class="seg"><button class="${done ? "" : "on"}" data-go="#/admin?tab=einreichungen">Offen (${AD.submissions.filter((s) => s.status === "pending").length})</button><button class="${done ? "on" : ""}" data-go="#/admin?tab=einreichungen&f=done">Entschieden</button></div>` +
        (list.length ? list.map((s) => { const cat = S.cats.get(s.category_id);
          return `<div class="acard" data-sub="${s.id}"><div class="ah"><b>${esc(s.name)}</b>${s.status === "pending" ? pill("Neu", "blue") : s.status === "approved" ? pill("Angenommen", "green") : pill("Abgelehnt", "red")}</div>${s.subtitle ? `<div class="as">${esc(s.subtitle)}</div>` : ""}` +
            `<div class="kv2"><span>Website</span><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.url)}</a><span>Kategorie</span><b>${esc(cat?.name || s.category_id)}</b><span>Preis</span><b>${esc(PRICE[s.price_model] || s.price_model)}</b><span>Ersteller</span><b>${esc(s.creator_name || "–")}</b><span>Eingereicht</span><b>${admName(s.aw_profiles)} · ${relDate(s.created_at)}</b><span>Kontakt</span><a href="mailto:${esc(s.contact_email || "")}">${esc(s.contact_email || "–")}</a></div>` +
            (s.description ? `<p class="ad-desc">${esc(s.description)}</p>` : "") + (s.review_note ? `<div class="small muted">Notiz: ${esc(s.review_note)}</div>` : "") +
            (s.status === "pending" ? `<div class="abtns"><button class="btn" data-act="adm-approve" data-id="${s.id}">${ic("check")}Annehmen …</button><button class="btn sec red" data-act="adm-reject" data-id="${s.id}">${ic("x")}Ablehnen</button></div>` : s.app_id && AD.appById.get(s.app_id) ? `<div class="abtns"><button class="btn sec" data-go="#/admin?tab=apps&id=${s.app_id}">App verwalten</button></div>` : "") + `</div>`; }).join("")
          : `<div class="empty">${ic("check")}<h3>${done ? "Noch nichts entschieden" : "Alles erledigt"}</h3><p>${done ? "" : "Keine offenen Einreichungen."}</p></div>`);
    },
    meldungen(r) {
      const done = r.q.get("f") === "done", list = AD.reports.filter((x) => (x.status === "open") !== done);
      return `<div class="seg"><button class="${done ? "" : "on"}" data-go="#/admin?tab=meldungen">Offen (${AD.reports.filter((x) => x.status === "open").length})</button><button class="${done ? "on" : ""}" data-go="#/admin?tab=meldungen&f=done">Erledigt</button></div>` +
        (list.length ? list.map((x) => { const a = AD.appById.get(x.app_id), rv = x.aw_reviews;
          return `<div class="acard" data-rep="${x.id}"><div class="ah">${ic("flag")}<b>${esc(REASON_L[x.reason] || x.reason)}</b>${x.status === "open" ? pill("Offen", "orange") : x.status === "done" ? pill("Erledigt", "green") : pill("Kein Verstoß", "gray")}</div>` +
            `<div class="arow">${admIco(a)}<div style="flex:1;min-width:0"><b>${esc(a?.name || x.aw_apps?.name || "–")}</b><div class="small muted">${rv ? "Bewertung" : "App"} · ${x.aw_profiles ? "gemeldet von " + admName(x.aw_profiles) : "anonym gemeldet"} · ${relDate(x.created_at)}</div></div>${a ? pill(...admState(a)) : ""}</div>` +
            (rv ? `<div class="rquote">${stars(rv.stars)} <b>${esc(rv.title || "")}</b>${rv.status === "hidden" ? pill("Ausgeblendet", "red") : ""}<div>${esc(rv.body || "")}</div></div>` : "") +
            (x.details ? `<p class="ad-desc">„${esc(x.details)}“</p>` : "") + (x.resolution ? `<div class="small muted">Ergebnis: ${esc(x.resolution)}</div>` : "") +
            (x.status === "open" ? `<div class="abtns wrap"><button class="btn" data-act="adm-rep" data-id="${x.id}" data-s="done">${ic("check")}Erledigt</button><button class="btn sec" data-act="adm-rep" data-id="${x.id}" data-s="rejected">Kein Verstoß</button>${x.review_id ? `<button class="btn sec red" data-act="adm-rep" data-id="${x.id}" data-s="done" data-h="review">${ic("eye")}Bewertung ausblenden</button>` : ""}${x.app_id ? `<button class="btn sec red" data-act="adm-rep" data-id="${x.id}" data-s="done" data-h="app">${ic("lock")}App ausblenden</button>` : ""}</div>`
              : rv && rv.status === "hidden" ? `<div class="abtns"><button class="btn sec" data-act="adm-revshow" data-id="${rv.id}">Bewertung wieder einblenden</button></div>` : "") + `</div>`; }).join("")
          : `<div class="empty">${ic("check")}<h3>${done ? "Noch nichts erledigt" : "Keine offenen Meldungen"}</h3></div>`);
    },
    ersteller() {
      return `<div class="hint" style="padding-top:0">Tippe auf einen Ersteller, um das Verifiziert-Abzeichen zu setzen oder ein Benutzerkonto zuzuordnen. Nach einer Zahlung (Stripe/Apple) wird automatisch verifiziert.</div><div class="glist">${AD.creators.map((c) => { const n = AD.apps.filter((a) => a.creator_id === c.id).length;
        return `<button class="gi adm-cr" data-act="adm-creator" data-id="${c.id}"><span class="gic" style="background:${c.verified ? "#007AFF" : "#8E8E93"}">${ic(c.verified ? "shield" : "person")}</span><span class="gt">${esc(c.name)} ${verBadge(c)}<small class="muted">${n} ${n === 1 ? "App" : "Apps"} · ${c.aw_profiles ? "@" + esc(c.aw_profiles.username) : "kein Konto"}</small></span>${ic("chevR", "chev")}</button>`; }).join("")}</div>`;
    },
    apps(r) {
      const q = (r.q.get("q") || "").toLowerCase(), f = r.q.get("f") || "";
      const list = AD.apps.filter((a) => (!q || a.name.toLowerCase().includes(q) || a.slug.includes(q)) && (!f || admState(a)[0] === f));
      if (r.q.get("id")) setTimeout(() => appSheet(r.q.get("id")), 50);
      return `<form class="admsearch" id="adm-q"><input name="q" type="search" placeholder="App suchen" value="${esc(r.q.get("q") || "")}" autocapitalize="none"></form>` +
        `<div class="chips">${["", "Live", "Pausiert", "Abgelaufen", "Ausgeblendet"].map((k) => `<button class="chip ${f === k ? "on" : ""}" data-go="#/admin?tab=apps${k ? "&f=" + k : ""}${q ? "&q=" + encodeURIComponent(q) : ""}">${k || "Alle"} (${AD.apps.filter((a) => !k || admState(a)[0] === k).length})</button>`).join("")}</div>` +
        `<div class="rows">${list.map((a) => { const [t, c] = admState(a);
          return `<div class="row" data-act="adm-app" data-id="${a.id}">${admIco(a)}<div class="meta"><div class="nm">${esc(a.name)}${a.editor_choice ? ` <span class="small" title="Redaktionstipp">${ic("star")}</span>` : ""}</div><div class="st">${esc(AD.crById.get(a.creator_id)?.name || "–")}${a.paid_until ? ` · bis ${fmtDate(a.paid_until)}` : ""}</div></div>${pill(t, c)}</div>`; }).join("") || `<div class="hint">Keine Treffer.</div>`}</div>`;
    },
    platzierungen() {
      const now = new Date();
      return `<div style="padding:0 16px 12px"><button class="btn" data-act="adm-place">${ic("plusc")}Neue Platzierung</button></div><div class="hint" style="padding-top:0">Bezahlte Plätze werden immer als „Gesponsert“ bzw. „Anzeige“ gekennzeichnet. Sichtbar sind nur Plätze von Apps mit aktivem Listing.</div>` +
        (AD.placements.length ? AD.placements.map((p) => { const a = AD.appById.get(p.app_id); const st = p.ends_at && new Date(p.ends_at) <= now ? ["Beendet", "gray"] : p.starts_at && new Date(p.starts_at) > now ? ["Geplant", "blue"] : a && !admLive(a) ? ["App nicht live", "orange"] : ["Aktiv", "green"];
          return `<div class="acard"><div class="arow">${admIco(a)}<div style="flex:1;min-width:0"><b>${esc(a?.name || p.app_id)}</b><div class="small muted">${SLOT_L[p.slot] || p.slot}${p.slot === "category" && p.category_id ? " · " + esc(S.cats.get(p.category_id)?.short || p.category_id) : ""} · <span class="ad">${esc(p.label || "Gesponsert")}</span> · ${p.starts_at ? fmtDate(p.starts_at) : "sofort"} – ${p.ends_at ? fmtDate(p.ends_at) : "offen"}</div></div>${pill(st[0], st[1])}</div><div class="abtns"><button class="btn sec" data-act="adm-place" data-id="${p.id}">Bearbeiten</button><button class="btn sec red" data-act="adm-placedel" data-id="${p.id}">${ic("trash")}Entfernen</button></div></div>`; }).join("")
          : `<div class="empty">${ic("rocket")}<h3>Keine Platzierungen</h3></div>`);
    },
    anfragen() {
      return AD.sponsor_requests.length ? AD.sponsor_requests.map((x) => `<div class="acard"><div class="ah"><b>${esc(x.app_name)}</b>${pill(SPON_L[x.status] || x.status, { new: "blue", offer_sent: "orange", booked: "green", declined: "gray" }[x.status] || "gray")}</div><div class="kv2"><span>Paket</span><b>${esc((C.featured || []).find((f) => f.id === x.package)?.title || SLOT_L[x.package] || x.package)}</b><span>E-Mail</span><a href="mailto:${esc(x.email)}">${esc(x.email)}</a><span>Eingang</span><b>${relDate(x.created_at)}</b></div>${x.message ? `<p class="ad-desc">${esc(x.message)}</p>` : ""}<div class="abtns"><button class="btn sec" data-act="adm-spon" data-id="${x.id}">Status ändern</button><button class="btn sec" data-act="adm-place" data-name="${esc(x.app_name)}">${ic("plusc")}Platz anlegen</button></div></div>`).join("")
        : `<div class="empty">${ic("mail")}<h3>Keine Anfragen</h3></div>`;
    },
    protokoll() {
      return AD.log.length ? `<div class="glist">${AD.log.map((l) => `<div class="subm"><div style="flex:1;min-width:0"><b>${esc(LOG_L[l.action] || l.action)}</b><div class="small muted">${esc(l.target || "")}${l.details && Object.keys(l.details).length ? " · " + esc(Object.entries(l.details).map(([k, v]) => `${k}: ${v === null ? "–" : v}`).join(", ")).slice(0, 140) : ""}</div></div><span class="small muted" style="text-align:right">${relDate(l.created_at)}<br>@${esc(l.aw_profiles?.username || "?")}</span></div>`).join("")}</div>` : `<div class="empty">${ic("doc")}<h3>Noch keine Einträge</h3><p>Jede Admin-Aktion wird hier protokolliert.</p></div>`;
    }
  };

  // ---- Admin-Sheets ----
  function approveSheet(id) {
    const s = AD.submissions.find((x) => x.id === id); if (!s) return;
    const match = AD.creators.find((c) => s.creator_name && c.name.toLowerCase() === s.creator_name.toLowerCase());
    const in30 = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
    const sh = openSheet(`<form id="f-appr"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Annehmen</h3><button type="submit">Freigeben</button></div><div class="shs" style="padding-bottom:0"><b>${esc(s.name)}</b><div class="small muted">${esc(s.url)}</div></div><div class="form">` +
      `<div class="fg"><label class="fl"><span>Ersteller</span><select name="creator_id"><option value="">Neu anlegen: ${esc(s.creator_name || s.name)}</option>${AD.creators.map((c) => `<option value="${c.id}" ${match?.id === c.id ? "selected" : ""}>${esc(c.name)}${c.aw_profiles ? " (@" + esc(c.aw_profiles.username) + ")" : ""}</option>`).join("")}</select></label><label class="fl" id="cnew"><span>Name neuer Ersteller</span><input name="creator_name" maxlength="60" value="${esc(s.creator_name || "")}"></label><label class="fl"><span>Slug (Adresse, optional)</span><input name="slug" maxlength="50" autocapitalize="none" placeholder="${esc(s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}"></label></div>` +
      (s.user_id ? `<label class="tgl"><span>Konto ${admName(s.aw_profiles)} als Ersteller zuordnen</span><span class="sw"><input type="checkbox" name="assign_owner" value="1" checked><i></i></span></label>` : `<div class="small muted" style="padding:0 4px 10px">Kein Konto hinterlegt – Zuordnung später unter „Ersteller“.</div>`) +
      `<div class="fg"><label class="fl"><span>Listing</span><select name="listing_status"><option value="paused">Pausiert – wartet auf Listing-Abo</option><option value="active">Aktiv – sofort sichtbar</option></select></label><label class="fl"><span>Bezahlt bis (bei manueller Freischaltung)</span><input name="paid_until" type="date" value=""></label><label class="fl"><span>Notiz (intern)</span><input name="note" maxlength="600"></label></div><div class="err"></div><div class="small muted" style="padding:0 4px 10px">Die App wird veröffentlicht, ist aber erst bei aktivem Listing im Store sichtbar. Ohne Datum gilt „aktiv“ unbegrenzt – für Test-/Partner-Listings z. B. ${fmtDate(in30)} setzen.</div></div></form>`, { grouped: true });
    const sel = $("select[name=creator_id]", sh), paint = () => { $("#cnew", sh).style.display = sel.value ? "none" : ""; }; paint(); sel.addEventListener("change", paint);
    $("#f-appr", sh).addEventListener("submit", (e) => submit(e, async (f) => {
      await admDo("admin_submission_decide", { id, decision: "approve", creator_id: f.creator_id || null, creator_name: f.creator_name, slug: f.slug, assign_owner: !!f.assign_owner, listing_status: f.listing_status, paid_until: endOfDay(f.paid_until), note: f.note }, `„${s.name}“ freigegeben`);
    }));
  }
  function rejectSheet(id) {
    const s = AD.submissions.find((x) => x.id === id); if (!s) return;
    const sh = openSheet(`<form id="f-rej"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Ablehnen</h3><button type="submit" class="red">Ablehnen</button></div><div class="shs" style="padding-bottom:0"><b>${esc(s.name)}</b></div><div class="form"><div class="fg"><label class="fl"><span>Begründung (für den Einreicher sichtbar)</span><textarea name="note" maxlength="600" placeholder="z. B. Datenschutzangaben fehlen"></textarea></label></div><div class="err"></div></div></form>`, { grouped: true });
    $("#f-rej", sh).addEventListener("submit", (e) => submit(e, (f) => admDo("admin_submission_decide", { id, decision: "reject", note: f.note }, "Einreichung abgelehnt")));
  }
  function creatorSheet(id) {
    const c = AD.creators.find((x) => x.id === id); if (!c) return;
    const sh = openSheet(`<form id="f-cr"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>Ersteller</h3><button type="submit">Sichern</button></div><div class="form"><div class="fg"><label class="fl"><span>Name</span><input name="name" maxlength="60" required value="${esc(c.name)}"></label></div>` +
      `<label class="tgl"><span>${verBadge({ verified: true })} Verifiziert</span><span class="sw"><input type="checkbox" name="verified" value="1" ${c.verified ? "checked" : ""}><i></i></span></label>` +
      `<div class="fg"><label class="fl"><span>Benutzerkonto (Benutzername, leer = keins)</span><input name="owner_username" autocapitalize="none" spellcheck="false" autocomplete="off" list="adm-users" value="${esc(c.aw_profiles?.username || "")}" placeholder="z. B. lena_m"></label></div><datalist id="adm-users"></datalist><div class="err"></div>` +
      `<div class="small muted" style="padding:0 4px 10px">Das zugeordnete Konto erhält den Ersteller-Bereich (Statistik, Neuigkeiten, Deals, Antworten). Ein Konto kann nur einem Ersteller gehören. ID: ${esc(c.id)}</div></div></form>`, { grouped: true });
    const inp = $("input[name=owner_username]", sh); let t;
    inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(async () => { const q = inp.value.trim().replace(/^@/, ""); if (q.length < 2) return; try { const us = await API.admin("admin_user_search", { q }); $("#adm-users", sh).innerHTML = us.map((u) => `<option value="${esc(u.username)}">${esc(u.display_name || "")}</option>`).join(""); } catch {} }, 250); });
    $("#f-cr", sh).addEventListener("submit", (e) => submit(e, (f) => admDo("admin_creator_update", { id, name: f.name, verified: !!f.verified, owner_username: (f.owner_username || "").replace(/^@/, "") }, "Ersteller gespeichert")));
  }
  function appSheet(id) {
    const a = AD.appById.get(id); if (!a || $(".sheet")) return;
    const cr = AD.crById.get(a.creator_id);
    const sh = openSheet(`<form id="f-app"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>App verwalten</h3><button type="submit">Sichern</button></div><div class="shs" style="padding-bottom:0"><div class="arow" style="margin:0">${admIco(a)}<div style="flex:1;min-width:0"><b>${esc(a.name)}</b><div class="small muted">${esc(cr?.name || "–")} · ${pill(...admState(a))}</div></div></div></div><div class="form">` +
      `<div class="fg"><label class="fl"><span>Listing</span><select name="listing_status"><option value="active" ${a.listing_status === "active" ? "selected" : ""}>Aktiv</option><option value="paused" ${a.listing_status !== "active" ? "selected" : ""}>Pausiert</option></select></label><label class="fl"><span>Bezahlt bis (leer = unbegrenzt)</span><input name="paid_until" type="date" value="${dIn(a.paid_until)}"></label></div>` +
      `<div class="fg"><label class="fl"><span>Sichtbarkeit</span><select name="status"><option value="published" ${a.status === "published" ? "selected" : ""}>Veröffentlicht</option><option value="hidden" ${a.status !== "published" ? "selected" : ""}>Ausgeblendet (z. B. nach Meldung)</option></select></label></div>` +
      `<label class="tgl"><span>Redaktionstipp</span><span class="sw"><input type="checkbox" name="editor_choice" value="1" ${a.editor_choice ? "checked" : ""}><i></i></span></label><div class="err"></div>` +
      `<div class="small muted" style="padding:0 4px 10px">Manuelle Freischaltung, solange Stripe/Apple noch nicht live sind. Aktivieren mit Datum legt eine Zahlung „manuell“ an.</div>${admLive(a) ? `<button type="button" class="btn sec" data-go="#/app/${a.slug}">Im Store ansehen</button>` : ""}</div></form>`, { grouped: true });
    $("#f-app", sh).addEventListener("submit", (e) => submit(e, (f) => admDo("admin_app_update", { id, listing_status: f.listing_status, paid_until: endOfDay(f.paid_until), status: f.status, editor_choice: !!f.editor_choice }, `„${a.name}“ gespeichert`)));
  }
  function placementSheet(id, appName) {
    const p = (id && AD.placements.find((x) => x.id === id)) || {};
    const pre = p.app_id || (appName && AD.apps.find((a) => a.name.toLowerCase() === appName.toLowerCase())?.id) || "";
    const today = new Date().toISOString().slice(0, 10), week = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    const sh = openSheet(`<form id="f-pl"><div class="shh"><button type="button" data-act="closesheet">Abbrechen</button><h3>${id ? "Platzierung" : "Neue Platzierung"}</h3><button type="submit">Sichern</button></div><div class="form">` +
      `<div class="fg"><label class="fl"><span>App</span><select name="app_id" required><option value="">Bitte wählen</option>${AD.apps.filter((a) => a.status === "published").map((a) => `<option value="${a.id}" ${pre === a.id ? "selected" : ""}>${esc(a.name)}${admLive(a) ? "" : " (nicht live)"}</option>`).join("")}</select></label><label class="fl"><span>Platz</span><select name="slot">${Object.entries(SLOT_L).map(([k, l]) => `<option value="${k}" ${p.slot === k ? "selected" : ""}>${l}</option>`).join("")}</select></label><label class="fl" id="plcat"><span>Kategorie</span><select name="category_id"><option value="">Kategorie der App</option>${AD.categories.map((c) => `<option value="${c.id}" ${p.category_id === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></label><label class="fl"><span>Kennzeichnung</span><select name="label"><option ${p.label !== "Anzeige" ? "selected" : ""}>Gesponsert</option><option ${p.label === "Anzeige" ? "selected" : ""}>Anzeige</option></select></label></div>` +
      `<div class="fg"><label class="fl"><span>Start</span><input name="starts_at" type="date" value="${dIn(p.starts_at) || today}"></label><label class="fl"><span>Ende</span><input name="ends_at" type="date" value="${id ? dIn(p.ends_at) : week}"></label></div><div class="err"></div></div></form>`, { grouped: true });
    const slot = $("select[name=slot]", sh), paint = () => { $("#plcat", sh).style.display = slot.value === "category" ? "" : "none"; }; paint(); slot.addEventListener("change", paint);
    $("#f-pl", sh).addEventListener("submit", (e) => submit(e, (f) => admDo("admin_placement_save", { id: id || undefined, app_id: f.app_id, slot: f.slot, category_id: f.category_id || null, label: f.label, starts_at: f.starts_at === today && !id ? new Date().toISOString() : f.starts_at ? new Date(f.starts_at + "T00:00:00").toISOString() : null, ends_at: endOfDay(f.ends_at) }, "Platzierung gespeichert")));
  }
  Object.assign(ACTS, {
    "adm-approve": (b) => approveSheet(b.dataset.id),
    "adm-reject": (b) => rejectSheet(b.dataset.id),
    "adm-creator": (b) => creatorSheet(b.dataset.id),
    "adm-app": (b) => appSheet(b.dataset.id),
    "adm-place": (b) => placementSheet(b.dataset.id, b.dataset.name),
    "adm-placedel": async (b) => { const v = await actionSheet("Platzierung entfernen?", "Der Platz verschwindet sofort aus dem Store.", [{ label: "Entfernen", value: 1, cls: "red" }]); if (v) await admDo("admin_placement_delete", { id: b.dataset.id }, "Platzierung entfernt"); },
    "adm-rep": async (b) => { const h = b.dataset.h; if (h) { const v = await actionSheet(h === "app" ? "App ausblenden?" : "Bewertung ausblenden?", h === "app" ? "Die App verschwindet aus dem Store (umkehrbar unter „Apps“)." : "Die Bewertung ist dann nicht mehr öffentlich sichtbar.", [{ label: "Ausblenden", value: 1, cls: "red" }]); if (!v) return; }
      await admDo("admin_report_resolve", { id: b.dataset.id, status: b.dataset.s, hide: h || null }, h === "app" ? "App ausgeblendet" : h === "review" ? "Bewertung ausgeblendet" : "Meldung erledigt"); },
    "adm-revshow": (b) => admDo("admin_review_status", { id: b.dataset.id, status: "visible" }, "Bewertung wieder sichtbar"),
    "adm-spon": async (b) => { const x = AD.sponsor_requests.find((y) => y.id === b.dataset.id); const v = await actionSheet("Status der Anfrage", x?.app_name || "", Object.entries(SPON_L).map(([k, l]) => ({ label: l, value: k, cls: x?.status === k ? "on" : "" }))); if (v) await admDo("admin_sponsor_status", { id: b.dataset.id, status: v }, "Status gespeichert"); },
    demoadmin: async () => { S.me = await API.demoBecomeAdmin(true); AD = null; toast("Demo: Admin-Rolle aktiv"); go("#/admin"); }
  });
  document.addEventListener("submit", (e) => { if (e.target.id !== "adm-q") return; e.preventDefault(); const q = new FormData(e.target).get("q").trim(); go("#/admin?tab=apps" + (q ? "&q=" + encodeURIComponent(q) : "")); });

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-act]");
    if (a) {
      const f = ACTS[a.dataset.act];
      if (f) { e.preventDefault(); e.stopPropagation(); Promise.resolve(f(a, e)).catch((x) => toast(x.message)); return; }
    }
    const g = e.target.closest("[data-go]");
    if (g && !e.target.closest("a[href]:not([data-go])")) { e.preventDefault(); go(g.dataset.go); return; }
    const t = e.target.closest("#tabbar a");
    if (t) {
      e.preventDefault();
      const tab = t.dataset.tab;
      if (tab === curTab && (location.hash || "#/") === t.getAttribute("href")) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      pendingTab = true; go(t.getAttribute("href"));
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheets(); });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("hashchange", () => { const d = pendingTab ? "tab" : undefined; pendingTab = false; route(d); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);

  // ====================== Start ======================
  async function init() {
    applyTheme();
    renderTabs();
    try { await loadCatalog(); await loadMe(); }
    catch (e) { $("#view").innerHTML = `<div class="empty" style="padding-top:120px">${ic("info")}<h3>Keine Verbindung</h3><p>${esc(e.message)}</p><button class="get blue big" onclick="location.reload()">Erneut versuchen</button></div>`; return; }
    await route();
    $("#boot")?.remove();
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  window.AW_APP = { state: S, api: API, go, route, demo: DEMO, search: (q) => search({ ...readFilters(new URLSearchParams()), q }) };
  init();
})();
