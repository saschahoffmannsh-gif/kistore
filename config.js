// Konfiguration. deploy.sh setzt in dist/config.js supabaseUrl + anonKey auf die Produktivwerte (public/ bleibt im Demo-Modus).
// Ist supabaseUrl leer, startet die App im Demo-Modus (Beispieldaten + Konten nur im localStorage dieses Browsers, kein Server).
window.AW_CONFIG = {
  // Marke – hier zentral änderbar (Name, Untertitel, Farben). Alles in der App liest diese Werte.
  brand: "KISTORE",
  tagline: "Die besten KI-Webapps, kuratiert.",
  brandColors: ["#5B4BFF", "#9B3BFF", "#FF3D8B"],

  supabaseUrl: "https://wlujgkbtpjxuekwsgnmg.supabase.co",            // Produktion: "https://wlujgkbtpjxuekwsgnmg.supabase.co" (gemeinsames Projekt, Tabellen aw_*)
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsdWpna2J0cGp4dWVrd3Nnbm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5Nzk0MjIsImV4cCI6MjEwNzU1NTQyMn0.IPX_Vco2kJurtnZUAcNFYcZ4hs2nT6n6e8apIhZfhTk",                // öffentlicher anon/publishable key (kein Geheimnis)
  functionName: "aiwebapps",  // Edge Function für alle Schreibzugriffe
  emailDomain: "aiwebapps.local", // Benutzername → Pseudo-E-Mail benutzername@aiwebapps.local (keine echte E-Mail nötig)

  // Nutzer zahlen nie. Ersteller zahlen ein monatliches Listing-Abo (Pflicht für jede gelistete App) + optionale Featured-Plätze.
  // Alle Preise sind PREISVORSCHLÄGE (Demo) – hier zentral änderbar.
  listing: { price: "19 €", period: "Monat", note: "Preisvorschlag (Demo)", cancel: "monatlich kündbar" },
  featured: [
    { id: "app_of_week", product: "featured.week", title: "App der Woche", desc: "Rampenlicht ganz oben auf „Heute“ – 7 Tage.", price: "149 €", glyph: "star" },
    { id: "story", product: "featured.story", title: "Heute-Story", desc: "Eine redaktionell gestaltete Story über deine App – 7 Tage auf „Heute“.", price: "249 €", glyph: "news" },
    { id: "category", product: "featured.category", title: "Kategorie-Banner", desc: "Banner oben in deiner Kategorie – 7 Tage.", price: "79 €", glyph: "grid" }
  ],
  // (a) Website/PWA: Bezahlung über einen Zahlungsdienst (z. B. Stripe Checkout / Payment Links). Leer = „Bezahlung bald verfügbar“.
  //     An die URL wird ?client_reference_id=<app_id>&product=<produkt> angehängt; Stripe-Metadaten: app_id + product.
  checkout: { listing: "", "featured.week": "", "featured.story": "", "featured.category": "" },
  // (b) Native iOS-App (Capacitor): Apple In-App-Kauf. Produkt-IDs wie in App Store Connect.
  iap: {
    listing: "de.spoostudio.kistore.listing.monthly",      // automatisch verlängerndes Abo (1 Monat)
    "featured.week": "de.spoostudio.kistore.featured.week", // Verbrauchsartikel (7 Tage App der Woche)
    "featured.story": "de.spoostudio.kistore.featured.story",
    "featured.category": "de.spoostudio.kistore.featured.category"
  },
  // Apple-Regel: In der iOS-App laufen digitale Käufe über In-App-Kauf. Externe Bezahl-Links bleiben in der iOS-App AUS.
  // (EU/US-Link-out-Berechtigungen nur nach eigener Prüfung + Apple-Entitlement einschalten.)
  allowExternalCheckoutInNative: false,
  confirmExternal: true,      // vor dem Öffnen einer fremden Website kurz nachfragen
  creatorPortalUrl: "",       // Infoseite für Ersteller auf der Website. Leer = ersteller.html (liegt mit im Projekt)
  contactEmail: "saschahoffmann.sh@icloud.com",
  version: "0.4.0"
};
