/* KISTORE – generative Grafik: App-Icons, Story-/Karten-Artwork und Mock-up-Bilder.
   Alles deterministisch aus Farben + ID berechnet (keine fremden Logos, keine externen Bilder). */
(function () {
  "use strict";
  const H = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; };
  const rgb = (h) => { h = String(h || "#888").replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); const n = parseInt(h.slice(0, 6), 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const hex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
  const lt = (c, t) => mix(c, "#ffffff", t), dk = (c, t) => mix(c, "#000000", t);
  const uri = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const f1 = (n) => Math.round(n * 10) / 10;
  // 4-zackiges KI-Funkeln
  const spark = (x, y, r) => `M${f1(x)} ${f1(y - r)}Q${f1(x)} ${f1(y)} ${f1(x + r)} ${f1(y)}Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y + r)}Q${f1(x)} ${f1(y)} ${f1(x - r)} ${f1(y)}Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y - r)}Z`;
  const glyph = (path, sc, attrs, cx = 50, cy = 50) => `<g transform="translate(${cx} ${cy}) scale(${sc}) translate(-12 -12)"><path d="${path}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${attrs}/></g>`;

  // ---------------- App-Icons (6 Stilfamilien) ----------------
  const iconCache = new Map();
  function iconSVG(o, path, style) {
    const c1 = o.c1, c2 = o.c2, h = H(o.id || path), r = rng(h);
    const st = style ?? h % 6;
    const d = [
      `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lt(c1, .1)}"/><stop offset="1" stop-color="${dk(c2, .14)}"/></linearGradient>`,
      `<radialGradient id="hl" cx=".22" cy="0" r="1.05"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>`,
      `<linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${lt(c1, .8)}"/></linearGradient>`,
      `<linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`,
      `<filter id="ds" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2.2" stdDeviation="2.2" flood-color="${dk(c2, .6)}" flood-opacity=".38"/></filter>`,
      `<filter id="bl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>`
    ];
    let b = "";
    const sp = r() > .45 ? `<path d="${spark(76, 24, 7)}" fill="#fff" opacity=".95"/><path d="${spark(84, 36, 3.2)}" fill="#fff" opacity=".7"/>` : "";
    if (st === 0) { // klassisch: Verlauf, weißes Symbol mit Tiefe
      b = `<rect width="100" height="100" fill="url(#bg)"/><circle cx="${20 + r() * 60}" cy="${70 + r() * 30}" r="40" fill="${lt(c2, .25)}" opacity=".55" filter="url(#bl)"/><rect width="100" height="100" fill="url(#hl)"/>${glyph(path, 2.25, `stroke="url(#gw)" stroke-width="2.05" filter="url(#ds)"`)}${sp}`;
    } else if (st === 1) { // Glas-Kachel
      b = `<rect width="100" height="100" fill="url(#bg)"/><circle cx="80" cy="16" r="34" fill="${lt(c1, .45)}" opacity=".7" filter="url(#bl)"/><circle cx="12" cy="92" r="30" fill="${dk(c2, .2)}" opacity=".8" filter="url(#bl)"/><rect width="100" height="100" fill="url(#hl)" opacity=".7"/>` +
        `<rect x="20" y="20" width="60" height="60" rx="17" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/><rect x="21" y="21" width="58" height="26" rx="16" fill="#fff" fill-opacity=".14"/>${glyph(path, 1.85, `stroke="#fff" stroke-width="2.2" filter="url(#ds)"`)}`;
    } else if (st === 2) { // hell: weißer Grund, Verlaufs-Symbol
      b = `<linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${lt(c1, .9)}"/></linearGradient><rect width="100" height="100" fill="url(#lb)"/><circle cx="50" cy="56" r="26" fill="${c1}" opacity=".18" filter="url(#bl)"/>${glyph(path, 2.3, `stroke="url(#gc)" stroke-width="2.4"`)}${r() > .5 ? `<path d="${spark(78, 22, 6.5)}" fill="${c2}"/>` : ""}`;
    } else if (st === 3) { // dunkel mit Neon-Glühen
      b = `<linearGradient id="nb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(c2, "#14141c", .82)}"/><stop offset="1" stop-color="#05050a"/></linearGradient><linearGradient id="ng" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lt(c1, .45)}"/><stop offset="1" stop-color="${lt(c2, .25)}"/></linearGradient>` +
        `<rect width="100" height="100" fill="url(#nb)"/><circle cx="50" cy="52" r="30" fill="${c1}" opacity=".55" filter="url(#bl)"/>${glyph(path, 2.25, `stroke="${lt(c2, .2)}" stroke-width="4.5" opacity=".55" filter="url(#bl)"`)}${glyph(path, 2.25, `stroke="url(#ng)" stroke-width="2.1"`)}<rect width="100" height="100" fill="url(#hl)" opacity=".35"/>${sp}`;
    } else if (st === 4) { // glänzende Kugel
      b = `<radialGradient id="orb" cx=".36" cy=".3" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${lt(c1, .6)}"/><stop offset="1" stop-color="${c1}"/></radialGradient>` +
        `<rect width="100" height="100" fill="url(#bg)"/><rect width="100" height="100" fill="url(#hl)" opacity=".6"/><ellipse cx="52" cy="84" rx="26" ry="5" fill="#000" opacity=".28" filter="url(#bl)"/><circle cx="50" cy="49" r="31" fill="url(#orb)"/><ellipse cx="42" cy="30" rx="15" ry="7" fill="#fff" opacity=".55"/>${glyph(path, 1.75, `stroke="${dk(c2, .2)}" stroke-width="2.3"`, 50, 51)}`;
    } else { // geschichtete Karten
      b = `<rect width="100" height="100" fill="url(#bg)"/><rect width="100" height="100" fill="url(#hl)" opacity=".8"/><g transform="rotate(-12 50 50)"><rect x="24" y="22" width="52" height="56" rx="14" fill="#fff" opacity=".28"/></g>` +
        `<g filter="url(#ds)"><rect x="25" y="25" width="50" height="52" rx="14" fill="url(#gw)"/></g>${glyph(path, 1.6, `stroke="url(#gc)" stroke-width="2.5"`, 50, 51)}`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${d.join("")}</defs>${b}</svg>`;
  }
  function iconURI(o, path, style) {
    const k = (o.id || "") + "|" + o.c1 + o.c2 + path + "|" + style;
    if (!iconCache.has(k)) iconCache.set(k, uri(iconSVG(o, path, style)));
    return iconCache.get(k);
  }

  // ---------------- Artwork (inline-SVG, eindeutige IDs) ----------------
  let uid = 0;
  function mesh(u, W, Hh, c1, c2, c3, r, opt = {}) {
    const ang = r() * 360;
    const cols = [c3 || lt(c2, .35), lt(c1, .3), dk(c2, .3), opt.dark ? dk(c1, .6) : "#ffffff"];
    let s = `<linearGradient id="${u}b" gradientTransform="rotate(${f1(ang)} .5 .5)"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>` +
      `<filter id="${u}n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;
    let body = `<rect width="${W}" height="${Hh}" fill="url(#${u}b)"/>`;
    // weiche Farbwolken als Radialverläufe (statt teurer Blur-Filter)
    cols.forEach((c, i) => { s += `<radialGradient id="${u}m${i}"><stop offset="0" stop-color="${c}" stop-opacity="${i === 3 ? .3 : .85}"/><stop offset=".55" stop-color="${c}" stop-opacity="${i === 3 ? .1 : .35}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
      body += `<circle cx="${f1(r() * W)}" cy="${f1(r() * Hh)}" r="${f1((.4 + r() * .35) * Math.max(W, Hh))}" fill="url(#${u}m${i})"/>`; });
    return { defs: s, body, grain: `<rect width="${W}" height="${Hh}" filter="url(#${u}n)" opacity="${opt.grain ?? .09}" style="mix-blend-mode:overlay"/>` };
  }
  function floatIcon(u, src, x, y, s, rot, blur = 0, op = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})" opacity="${op}"${blur ? ` filter="url(#${u}d)"` : ""}>` +
      `<rect x="${f1(-s / 2)}" y="${f1(-s / 2 + s * .1)}" width="${s}" height="${s}" rx="${f1(s * .225)}" fill="#000" opacity=".32" filter="url(#${u}s)"/>` +
      `<image href="${src}" x="${f1(-s / 2)}" y="${f1(-s / 2)}" width="${s}" height="${s}" clip-path="url(#${u}c)" preserveAspectRatio="none"/>` +
      `<rect x="${f1(-s / 2 + .5)}" y="${f1(-s / 2 + .5)}" width="${s - 1}" height="${s - 1}" rx="${f1(s * .225)}" fill="none" stroke="#fff" stroke-opacity=".35"/></g>`;
  }
  const commonDefs = (u) => `<clipPath id="${u}c" clipPathUnits="objectBoundingBox"><rect width="1" height="1" rx=".225"/></clipPath><filter id="${u}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter><filter id="${u}d"><feGaussianBlur stdDeviation="1.6"/></filter><radialGradient id="${u}g"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  // Als <img> (data-URI) ausgeben: wird einmal gerastert, scrollt flüssig
  const wrap = (W, Hh, defs, body, cls = "") => { const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;
    return `<img class="artsvg ${cls}" src="${uri(svg)}" alt="" decoding="async">`; };
  const sparks = (r, W, Hh, n, y0 = 0) => Array.from({ length: n }, () => `<path d="${spark(r() * W, y0 + r() * (Hh - y0), 4 + r() * 9)}" fill="#fff" opacity="${f1(.55 + r() * .45)}"/>`).join("");

  // Story-Karte (400×500): drei Motivfamilien
  function story(o) {
    const u = "a" + (++uid), r = rng(H(o.seed)), W = 400, Hh = 500;
    const m = mesh(u, W, Hh, o.c1, o.c2, o.c3, r);
    let defs = commonDefs(u) + m.defs, b = m.body;
    const t = o.template ?? H(o.seed) % 3, icons = o.icons || [];
    if (t === 0 && icons.length) { // schwebende App-Icons
      const L = [[200, 300, 150, -5], [72, 236, 82, -13], [330, 222, 92, 11], [96, 398, 96, 8], [318, 392, 80, -9], [206, 168, 58, 7], [26, 332, 58, 15], [384, 318, 62, -14]];
      b += `<circle cx="200" cy="300" r="120" fill="url(#${u}g)" opacity=".5"/>`;
      const order = L.map((p, i) => [p, icons[i % icons.length], i]).reverse();
      b += order.map(([p, src, i]) => floatIcon(u, src, p[0], p[1], p[2], p[3], i >= 5 ? 1 : 0, i >= 5 ? .8 : 1)).join("");
      b += sparks(r, W, Hh, 5, 150);
    } else if (t === 1) { // Glaskugel mit Orbit
      defs += `<radialGradient id="${u}o" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${lt(o.c3 || o.c2, .4)}"/><stop offset=".75" stop-color="${o.c1}"/><stop offset="1" stop-color="${dk(o.c1, .35)}"/></radialGradient>` +
        `<linearGradient id="${u}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>`;
      b += `<ellipse cx="226" cy="462" rx="120" ry="20" fill="#000" opacity=".3" filter="url(#${u}s)"/><g transform="rotate(-18 226 315)"><ellipse cx="226" cy="315" rx="190" ry="52" fill="none" stroke="url(#${u}r)" stroke-width="3" opacity=".7"/></g>` +
        `<circle cx="226" cy="315" r="128" fill="url(#${u}o)"/><ellipse cx="186" cy="246" rx="58" ry="26" fill="#fff" opacity=".45" transform="rotate(-24 186 246)"/>` +
        `<g transform="rotate(-18 226 315)"><path d="M36 315a190 52 0 0 0 380 0" fill="none" stroke="url(#${u}r)" stroke-width="5"/></g>` +
        `<circle cx="82" cy="214" r="26" fill="url(#${u}o)"/><circle cx="356" cy="430" r="16" fill="url(#${u}o)"/>` +
        (o.path ? glyph(o.path, 4.2, `stroke="#fff" stroke-width="1.6" opacity=".95"`, 226, 318) : "") +
        (icons[0] ? floatIcon(u, icons[0], 330, 196, 70, 10) : "") + sparks(r, W, Hh, 6, 160);
    } else { // Gerät mit KI-Oberfläche
      const sc = `<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt(o.c1, .15)}"/><stop offset="1" stop-color="${o.c2}"/></linearGradient>`;
      defs += sc;
      const rows = [0, 1, 2, 3].map((i) => `<rect x="18" y="${150 + i * 44}" width="134" height="34" rx="10" fill="#fff" opacity="${i === 1 ? .95 : .28}"/><rect x="28" y="${159 + i * 44}" width="16" height="16" rx="4" fill="${i === 1 ? o.c1 : "#fff"}" opacity=".9"/><rect x="52" y="${161 + i * 44}" width="${60 + (i * 23) % 40}" height="5" rx="2.5" fill="${i === 1 ? "#333" : "#fff"}" opacity=".75"/><rect x="52" y="${170 + i * 44}" width="${40 + (i * 17) % 30}" height="4" rx="2" fill="${i === 1 ? "#888" : "#fff"}" opacity=".5"/>`).join("");
      b += `<ellipse cx="210" cy="470" rx="110" ry="16" fill="#000" opacity=".35" filter="url(#${u}s)"/>` +
        `<g transform="translate(125 128) rotate(-9 85 170)"><rect width="170" height="340" rx="34" fill="#0d0d12"/><rect x="5" y="5" width="160" height="330" rx="30" fill="url(#${u}p)"/><rect x="60" y="14" width="50" height="14" rx="7" fill="#0d0d12"/>` +
        `<rect x="18" y="44" width="70" height="8" rx="4" fill="#fff" opacity=".9"/><rect x="18" y="58" width="110" height="14" rx="5" fill="#fff"/><rect x="18" y="84" width="134" height="52" rx="12" fill="#fff" opacity=".22"/>` +
        (o.path ? glyph(o.path, 1.4, `stroke="#fff" stroke-width="2"`, 44, 110) : "") + `<rect x="66" y="100" width="70" height="6" rx="3" fill="#fff" opacity=".8"/><rect x="66" y="112" width="48" height="5" rx="2.5" fill="#fff" opacity=".55"/>` + rows +
        `<rect x="18" y="300" width="134" height="24" rx="12" fill="#fff" opacity=".95"/><rect x="5" y="5" width="160" height="150" rx="30" fill="#fff" opacity=".07"/></g>` +
        `<g transform="translate(36 210) rotate(6)"><rect width="120" height="64" rx="18" fill="#fff" opacity=".9"/><path d="${spark(24, 32, 10)}" fill="${o.c1}"/><rect x="42" y="20" width="62" height="7" rx="3.5" fill="#333" opacity=".7"/><rect x="42" y="34" width="44" height="6" rx="3" fill="#999" opacity=".7"/></g>` +
        (icons[0] ? floatIcon(u, icons[0], 334, 392, 84, 12) : "") + sparks(r, W, Hh, 5, 150);
    }
    return wrap(W, Hh, defs, b + m.grain);
  }

  // Karten-Bild (400×220) für „Im Rampenlicht“: großes App-Icon im Scheinwerferlicht
  function feature(o) {
    const u = "a" + (++uid), r = rng(H(o.seed)), W = 400, Hh = 220;
    const m = mesh(u, W, Hh, o.c1, o.c2, o.c3, r);
    let b = m.body + (o.path ? glyph(o.path, 9, `stroke="#fff" stroke-width=".7" opacity=".16"`, 90, 90) : "") +
      `<circle cx="292" cy="92" r="70" fill="url(#${u}g)" opacity=".55"/>` +
      (o.icon ? floatIcon(u, o.icon, 292, 92, 104, -7) : "") +
      (o.icons?.[1] ? floatIcon(u, o.icons[1], 176, 70, 46, 12, 1, .85) : "") + sparks(r, W, 150, 4);
    return wrap(W, Hh, commonDefs(u) + m.defs, b + m.grain);
  }
  // Flächen für Sammlungen & Kategorien: Verlaufsnetz + plastisches Symbol
  function tile(o) {
    const u = "a" + (++uid), r = rng(H(o.seed)), W = o.w || 200, Hh = o.h || 110;
    const m = mesh(u, W, Hh, o.c1, o.c2, o.c3, r, { grain: .07 });
    const sc = o.scale || 3.4, gx = o.gx ?? W - 46, gy = o.gy ?? 40;
    let g = "";
    if (o.path) {
      for (let i = 4; i >= 1; i--) g += glyph(o.path, sc, `stroke="${dk(o.c2, .35)}" stroke-width="2.4" opacity="${f1(.5 - i * .08)}"`, gx + i * .9, gy + i * 1.1);
      g += glyph(o.path, sc, `stroke="#fff" stroke-width="2.2"`, gx, gy);
    }
    return wrap(W, Hh, commonDefs(u) + m.defs, m.body + `<g transform="rotate(-12 ${gx} ${gy})">${g}</g>` + m.grain);
  }
  // Mock-up-Bild (Landschaft/Abstrakt) für Bildschirmfotos
  const picCache = new Map();
  function picture(c1, c2, i) {
    const k = c1 + c2 + i; if (picCache.has(k)) return picCache.get(k);
    const r = rng(H(k)), kind = i % 3;
    let d, s;
    if (kind === 0) {
      d = `<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt(c1, .25)}"/><stop offset="1" stop-color="${lt(c2, .55)}"/></linearGradient>`;
      s = `<rect width="100" height="100" fill="url(#s)"/><circle cx="${f1(30 + r() * 40)}" cy="38" r="13" fill="#fff" opacity=".85"/><path d="M0 70L22 48 38 62 58 40 80 60 100 46V100H0z" fill="${dk(c2, .1)}" opacity=".75"/><path d="M0 82L28 64 52 78 74 66 100 76V100H0z" fill="${dk(c1, .35)}"/>`;
    } else if (kind === 1) {
      d = `<radialGradient id="s" cx=".3" cy=".3" r="1"><stop offset="0" stop-color="${lt(c2, .3)}"/><stop offset="1" stop-color="${dk(c1, .3)}"/></radialGradient>`;
      s = `<rect width="100" height="100" fill="url(#s)"/><circle cx="62" cy="58" r="28" fill="${lt(c1, .5)}" opacity=".9"/><circle cx="54" cy="50" r="10" fill="#fff" opacity=".6"/><rect x="10" y="14" width="30" height="30" rx="8" fill="#fff" opacity=".25" transform="rotate(14 25 29)"/>`;
    } else {
      d = `<linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dk(c1, .15)}"/><stop offset="1" stop-color="${lt(c2, .2)}"/></linearGradient>`;
      s = `<rect width="100" height="100" fill="url(#s)"/><circle cx="50" cy="44" r="16" fill="${lt(c2, .6)}"/><path d="M18 100c4-22 18-32 32-32s28 10 32 32z" fill="${lt(c1, .55)}"/><path d="${spark(80, 20, 7)}" fill="#fff"/>`;
    }
    const v = uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs>${d}</defs>${s}</svg>`);
    picCache.set(k, v); return v;
  }
  window.KI_ART = { iconURI, story, feature, tile, picture, lt, dk, mix, spark };
})();
