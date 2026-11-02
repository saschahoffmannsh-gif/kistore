/* KISTORE – Demo-Daten + Demo-Backend.
   Gleiche Schnittstelle wie das Live-Backend (Supabase + Edge Function "aiwebapps"), aber alles nur im localStorage dieses Browsers.
   ALLE Apps, Ersteller, Bewertungen und Geschichten sind frei erfunden (demo: true). Links zeigen auf example.com (reservierte Domain). */
(function () {
  "use strict";
  // ---------- Kategorien ----------
  const categories = [
    { id: "text", name: "Text & Schreiben", short: "Text", glyph: "pen", c1: "#4F7CFF", c2: "#7A5CFF" },
    { id: "bild", name: "Bild & Design", short: "Bild", glyph: "image", c1: "#FF7A59", c2: "#FF3D8B" },
    { id: "video", name: "Video", short: "Video", glyph: "film", c1: "#FF4D4D", c2: "#B4236B" },
    { id: "audio", name: "Audio & Musik", short: "Audio", glyph: "wave", c1: "#00B3A6", c2: "#1D6FE0" },
    { id: "code", name: "Code & Entwicklung", short: "Code", glyph: "code", c1: "#2D3142", c2: "#4F5D75" },
    { id: "produktivitaet", name: "Produktivität", short: "Produktivität", glyph: "check", c1: "#34C759", c2: "#0E9F6E" },
    { id: "lernen", name: "Lernen & Bildung", short: "Lernen", glyph: "cap", c1: "#FFB020", c2: "#FF6A3D" },
    { id: "business", name: "Business", short: "Business", glyph: "briefcase", c1: "#3A5BA0", c2: "#1E2F5C" },
    { id: "marketing", name: "Marketing", short: "Marketing", glyph: "megaphone", c1: "#FF2D55", c2: "#FF9F0A" },
    { id: "spass", name: "Spaß & Freizeit", short: "Spaß", glyph: "smile", c1: "#AF52DE", c2: "#5856D6" }
  ];

  // ---------- Ersteller (fiktiv) ----------
  const creatorNames = ["Wortwerk Labs", "Nordlicht Software", "Fabelhaft Digital", "Mira Kessler", "Lunaris Studio", "Helle Pixel", "Brandwerk Kollektiv", "Tom Brandt",
    "Schnittpunkt Media", "Persona Works", "Klartext Labs", "Filmkiste", "Tonwerk Studio", "Vox Nova", "Rauschfrei Audio", "Lea Sommer",
    "Byteküste", "Jonas Weber", "Datenhafen", "Fuchsbau Dev", "Tagwerk Apps", "Sitzungsheld", "Ruhepol Software", "Gartenhaus Labs",
    "Lichtblick Bildung", "Polyglott Studio", "Wissensbude", "Zahlenwerk", "Kontorwerk", "Paragraf Neun", "Folienfabrik", "Echo Analytics",
    "Reichweite & Co.", "Klickgold", "Suchlicht", "Briefkasten Digital", "Küchenzauber", "Versschmiede", "Nachtfalter Studio", "Fernweh Labs"];
  const slugify = (s) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/&/g, "und").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const creators = [...new Set(creatorNames)].map((n, i) => ({ id: "c-" + slugify(n), name: n, verified: true, since: 2023 + (i % 3), demo: true }));

  // ---------- Apps ----------
  // [name, untertitel, kategorie, ersteller, preis, preisnotiz, glyph, farbe1, farbe2, tags, rating, anzahl, beliebtheit, flags(d=Deutsch,n=ohne Anmeldung,e=EU-Hosting,a=API), beschreibung]
  const A = [
    ["Satzbau", "Texte umschreiben, kürzen, glätten", "text", "Wortwerk Labs", "freemium", "Gratis bis 20 Texte/Monat · Pro ab 7 €/Monat", "pen", "#4F7CFF", "#7A5CFF", ["Umschreiben", "Stil", "Rechtschreibung"], 4.7, 3812, 96, "dnea",
      "Satzbau poliert deine Texte, ohne deine Stimme zu verlieren. Markiere einen Absatz und wähle: kürzer, freundlicher, förmlicher oder einfach klarer."],
    ["Briefling", "Briefe & E-Mails in Sekunden", "text", "Nordlicht Software", "free", "Komplett kostenlos, finanziert über eine Business-Version", "mail", "#3AA0FF", "#2563EB", ["E-Mail", "Vorlagen", "Behörden"], 4.5, 1290, 71, "dn",
      "Kündigung, Widerspruch, Bewerbung oder eine nette Absage: Briefling fragt dich drei Dinge und schreibt den Brief – auf Wunsch mit DIN-5008-Layout."],
    ["Lektora", "KI-Lektorat für lange Texte", "text", "Fabelhaft Digital", "subscription", "12 €/Monat · 7 Tage gratis testen", "doc", "#6D5BFF", "#C04CFD", ["Lektorat", "Bücher", "Abschlussarbeit"], 4.8, 642, 58, "dea",
      "Lektora liest Manuskripte bis 400 Seiten, markiert Logiklücken, Wiederholungen und Stilbrüche und erklärt jeden Vorschlag."],
    ["Ghostfeder", "Blogartikel mit deiner Stimme", "text", "Mira Kessler", "freemium", "3 Artikel gratis · danach ab 9 €/Monat", "feather", "#8E7CFF", "#4B3FD8", ["Blog", "Tonalität", "Entwürfe"], 4.3, 518, 49, "d",
      "Füttere Ghostfeder mit zwei, drei deiner alten Texte – danach schreibt sie Entwürfe, die nach dir klingen statt nach Maschine."],
    ["Pixelmond", "Bilder aus Text, in Studioqualität", "bild", "Lunaris Studio", "freemium", "50 Bilder/Monat gratis · Pro 14 €/Monat", "sparkle", "#FF8A4C", "#FF3D8B", ["Bildgenerator", "Illustration", "Fotorealistisch"], 4.8, 9214, 99, "dna",
      "Beschreibe, was du sehen willst, und Pixelmond malt es – als Foto, Aquarell, 3D-Render oder Linienzeichnung. Mit Stilarchiv und Seitenverhältnissen für jedes Format."],
    ["Fotokur", "Fotos retuschieren mit einem Tipp", "bild", "Helle Pixel", "one_time", "29 € einmalig, keine Folgekosten", "camera", "#FFB23F", "#FF6A3D", ["Retusche", "Hintergrund", "Hochskalieren"], 4.6, 2140, 77, "dne",
      "Hintergrund weg, störende Personen weg, Licht korrigiert: Fotokur erledigt die Klassiker der Bildbearbeitung direkt im Browser."],
    ["Logoschmiede", "Logos & Markenfarben generieren", "bild", "Brandwerk Kollektiv", "subscription", "19 €/Monat oder 99 € pro Marken-Paket", "palette", "#FF5E62", "#FF9966", ["Logo", "Branding", "Farbpaletten"], 4.2, 873, 52, "d",
      "Name rein, Branche wählen, Stimmung festlegen – Logoschmiede liefert Logo-Varianten, Farbpalette und Schriftpaarung als Paket."],
    ["Skizzo", "Aus Kritzelei wird Illustration", "bild", "Tom Brandt", "free", "Kostenlos, Spenden willkommen", "brush", "#FF4F9A", "#FF9A44", ["Zeichnen", "Kinder", "Illustration"], 4.4, 1567, 63, "dn",
      "Zeichne mit dem Finger ein Strichmännchen, wähle einen Stil – und Skizzo macht daraus ein fertiges Bild. Großartig mit Kindern."],
    ["Clipfabrik", "Kurzvideos aus langen Clips", "video", "Schnittpunkt Media", "freemium", "Gratis mit Wasserzeichen · Pro 15 €/Monat", "play", "#FF4D4D", "#B4236B", ["Shorts", "Reels", "Schnitt"], 4.6, 4410, 92, "dea",
      "Clipfabrik findet in deinem Video die stärksten Momente, schneidet sie im Hochformat zu und setzt animierte Untertitel."],
    ["Avatarix", "Sprechende Avatare für Erklärvideos", "video", "Persona Works", "subscription", "ab 24 €/Monat", "user", "#E94057", "#8A2387", ["Avatar", "Schulung", "Erklärvideo"], 4.1, 731, 55, "da",
      "Text eintippen, Avatar wählen, fertig: Avatarix erzeugt Schulungs- und Erklärvideos mit natürlicher Mimik in 20 Sprachen."],
    ["Untertitler", "Automatische Untertitel in 30 Sprachen", "video", "Klartext Labs", "freemium", "30 Min./Monat gratis · danach 0,10 €/Min.", "captions", "#F7797D", "#C6426E", ["Untertitel", "Barrierefreiheit", "Übersetzung"], 4.7, 2876, 81, "dnea",
      "Lade ein Video hoch und erhalte präzise Untertitel als SRT, VTT oder direkt eingebrannt – inklusive Übersetzung."],
    ["Storyboard KI", "Vom Skript zum Storyboard", "video", "Filmkiste", "subscription", "11 €/Monat", "slides", "#D7385E", "#5E2A84", ["Storyboard", "Film", "Vorproduktion"], 4.4, 402, 38, "d",
      "Storyboard KI liest dein Drehbuch, schlägt Einstellungen vor und zeichnet Panels mit Kameraangaben."],
    ["Klangraum", "Musik für Videos & Podcasts", "audio", "Tonwerk Studio", "freemium", "Gratis für private Projekte · Lizenz ab 8 €/Monat", "music", "#00C9A7", "#1D6FE0", ["Musik", "Lizenzfrei", "Stimmung"], 4.6, 3305, 85, "dn",
      "Stimmung, Länge und Tempo wählen – Klangraum komponiert passende Hintergrundmusik, die du kommerziell nutzen darfst."],
    ["Stimmwerk", "Natürliche Sprachausgabe auf Deutsch", "audio", "Vox Nova", "subscription", "ab 9 €/Monat · 10 Min. gratis", "mic", "#00B4DB", "#0052D4", ["Text-zu-Sprache", "Hörbuch", "Dialekte"], 4.7, 2051, 74, "dea",
      "Stimmwerk liest deine Texte mit Betonung vor – von Nachrichtensprecher bis Pfälzer Gemütlichkeit."],
    ["Podpolish", "Podcasts säubern & mastern", "audio", "Rauschfrei Audio", "freemium", "2 Std./Monat gratis · Pro 12 €/Monat", "wave", "#11998E", "#38EF7D", ["Podcast", "Rauschen", "Mastering"], 4.5, 988, 57, "de",
      "Hall, Rauschen und Ähms raus, Lautheit auf Sendeniveau: Podpolish macht aus Küchenaufnahmen Studioklang."],
    ["Notenfee", "Melodie summen, Noten bekommen", "audio", "Lea Sommer", "free", "Kostenlos", "note", "#43CEA2", "#185A9D", ["Noten", "Musikschule", "Transkription"], 4.3, 611, 41, "dn",
      "Summ oder spiel eine Melodie ein – Notenfee schreibt sie als Notenblatt auf und spielt sie zum Vergleich ab."],
    ["Codepilot Nord", "Code erklären, testen, refaktorieren", "code", "Byteküste", "freemium", "Gratis für Open Source · Team ab 18 €/Monat", "code", "#232526", "#414345", ["Code-Review", "Tests", "Refactoring"], 4.6, 2733, 88, "ea",
      "Füge eine Funktion ein, und Codepilot Nord erklärt sie, schreibt Tests dazu und schlägt eine lesbarere Fassung vor."],
    ["Regexo", "Reguläre Ausdrücke in Klartext", "code", "Jonas Weber", "free", "Kostenlos & werbefrei", "terminal", "#373B44", "#4286F4", ["Regex", "Entwickler-Tool"], 4.8, 1422, 60, "dn",
      "Beschreibe, was du finden willst („alle deutschen Postleitzahlen“) – Regexo baut den Ausdruck und erklärt jedes Zeichen."],
    ["SQL-Flüsterer", "Fragen stellen, SQL bekommen", "code", "Datenhafen", "freemium", "Gratis mit Beispieldaten · Pro 10 €/Monat", "db", "#1F4037", "#3A7BD5", ["SQL", "Datenbank", "Analyse"], 4.4, 845, 50, "dea",
      "„Welche Kunden haben seit März nichts bestellt?“ – SQL-Flüsterer übersetzt deine Frage in eine geprüfte Abfrage."],
    ["Bugfuchs", "Fehlermeldungen verstehen", "code", "Fuchsbau Dev", "free", "Kostenlos", "bug", "#FF7E5F", "#2C3E50", ["Debugging", "Einsteiger"], 4.2, 503, 36, "dn",
      "Kopiere die Fehlermeldung hinein und Bugfuchs erklärt in einfachen Worten, was schiefging – und wie du es löst."],
    ["Fokusflow", "Dein Tag, von der KI geplant", "produktivitaet", "Tagwerk Apps", "subscription", "6 €/Monat · 14 Tage gratis", "calendar", "#34C759", "#0E9F6E", ["Planung", "Kalender", "Fokus"], 4.5, 3120, 90, "dea",
      "Fokusflow verteilt deine Aufgaben auf freie Kalenderlücken, schützt Fokuszeiten und plant automatisch um, wenn etwas dazwischenkommt."],
    ["Protokollant", "Meetings mitschreiben & zusammenfassen", "produktivitaet", "Sitzungsheld", "freemium", "5 Meetings/Monat gratis · Pro 10 €/Monat", "chat", "#56AB2F", "#1D976C", ["Meetings", "Protokoll", "Aufgaben"], 4.6, 1980, 79, "dea",
      "Protokollant hört im Online-Meeting zu, schreibt mit und liefert danach Zusammenfassung, Entscheidungen und To-dos."],
    ["Postfach Zen", "E-Mails sortieren & beantworten", "produktivitaet", "Ruhepol Software", "subscription", "8 €/Monat", "mail", "#0BA360", "#3CBA92", ["E-Mail", "Inbox Zero"], 4.2, 764, 54, "de",
      "Postfach Zen sortiert eingehende Mails nach Wichtigkeit, fasst lange Threads zusammen und schlägt Antworten vor."],
    ["Notizgarten", "Notizen, die sich selbst verknüpfen", "produktivitaet", "Gartenhaus Labs", "freemium", "Gratis bis 500 Notizen · Pro 5 €/Monat", "leaf", "#7BC67B", "#2E8B57", ["Notizen", "Wissen", "Second Brain"], 4.7, 1388, 66, "dne",
      "Schreib einfach drauflos – Notizgarten erkennt Themen, verknüpft verwandte Notizen und beantwortet Fragen zu deinem Wissen."],
    ["Lernlicht", "Dein persönlicher Nachhilfe-Tutor", "lernen", "Lichtblick Bildung", "freemium", "Gratis 20 Fragen/Tag · Plus 7 €/Monat", "bulb", "#FFB020", "#FF6A3D", ["Nachhilfe", "Schule", "Erklärungen"], 4.7, 4802, 93, "de",
      "Lernlicht erklärt Schulstoff in deinem Tempo, stellt Rückfragen statt Lösungen vorzusagen und passt sich deiner Klassenstufe an."],
    ["Vokabelwolke", "Sprachen lernen im Gespräch", "lernen", "Polyglott Studio", "subscription", "9 €/Monat · Jahresabo 59 €", "globe", "#F7971E", "#FFD200", ["Sprachen", "Konversation", "Aussprache"], 4.5, 2210, 76, "d",
      "Unterhalte dich mit Vokabelwolke über Alltagsthemen in 12 Sprachen – mit sanften Korrekturen und Aussprachetraining."],
    ["Quizzly", "Aus jedem Text ein Quiz", "lernen", "Wissensbude", "free", "Kostenlos für Schüler & Lehrkräfte", "quiz", "#FF9966", "#FF5E62", ["Quiz", "Unterricht", "Karteikarten"], 4.6, 1702, 68, "dn",
      "PDF, Webseite oder Mitschrift hineinziehen – Quizzly macht daraus Multiple-Choice-Fragen und Karteikarten."],
    ["Mathe Mentor", "Rechenwege Schritt für Schritt", "lernen", "Zahlenwerk", "freemium", "Gratis · Plus mit Fotoerkennung 4 €/Monat", "sigma", "#F2994A", "#F2C94C", ["Mathe", "Hausaufgaben"], 4.4, 1155, 61, "dn",
      "Mathe Mentor zeigt nicht nur das Ergebnis, sondern jeden Rechenschritt – mit Tipps, wenn du hängst."],
    ["Angebotsprofi", "Angebote & Rechnungstexte entwerfen", "business", "Kontorwerk", "subscription", "15 €/Monat · 30 Tage gratis", "briefcase", "#3A5BA0", "#1E2F5C", ["Angebote", "Selbstständige", "Handwerk"], 4.5, 932, 64, "dea",
      "Stichpunkte rein, professionelles Angebot raus: Angebotsprofi formuliert Leistungsbeschreibungen und kalkuliert Positionen vor."],
    ["Vertragslupe", "Verträge verständlich zusammengefasst", "business", "Paragraf Neun", "freemium", "1 Vertrag/Monat gratis · Pro 19 €/Monat", "scale", "#4B6CB7", "#182848", ["Verträge", "Zusammenfassung", "Fristen"], 4.3, 688, 47, "de",
      "Vertragslupe fasst Verträge in Klartext zusammen und markiert Fristen, Kündigungsklauseln und Auffälligkeiten. Keine Rechtsberatung."],
    ["Pitchdeck Pro", "Präsentationen aus Stichpunkten", "business", "Folienfabrik", "freemium", "3 Decks gratis · Pro 12 €/Monat", "slides", "#5C6BC0", "#283593", ["Präsentation", "Pitch", "Folien"], 4.4, 1504, 70, "da",
      "Ein paar Stichpunkte genügen: Pitchdeck Pro baut eine Präsentation mit Struktur, Diagrammen und passenden Bildern."],
    ["Kundenecho", "Kundenfeedback automatisch auswerten", "business", "Echo Analytics", "subscription", "ab 29 €/Monat", "chart", "#2B5876", "#4E4376", ["Feedback", "Analyse", "Umfragen"], 4.1, 297, 33, "ea",
      "Kundenecho liest Bewertungen, Umfragen und Support-Tickets und zeigt, worüber sich Kundinnen freuen – und worüber nicht."],
    ["Postplaner", "Social-Media-Posts für eine Woche", "marketing", "Reichweite & Co.", "freemium", "Gratis für 1 Kanal · Pro 13 €/Monat", "calendar", "#FF2D55", "#FF9F0A", ["Social Media", "Redaktionsplan", "Instagram"], 4.5, 2604, 84, "de",
      "Postplaner erstellt einen Redaktionsplan, schreibt Captions mit Hashtags und schlägt die besten Uhrzeiten vor."],
    ["Anzeigenwerk", "Werbetexte, die konvertieren", "marketing", "Klickgold", "subscription", "17 €/Monat", "target", "#F857A6", "#FF5858", ["Werbetexte", "A/B-Test", "Ads"], 4.2, 811, 53, "d",
      "Anzeigenwerk schreibt Varianten für Anzeigen, Betreffzeilen und Landingpages – und sagt dir, welche wohl besser läuft."],
    ["SEO Kompass", "Keywords, Gliederung, Meta-Texte", "marketing", "Suchlicht", "freemium", "5 Analysen gratis · Pro 16 €/Monat", "compass", "#FC4A1A", "#F7B733", ["SEO", "Keywords", "Content"], 4.4, 1032, 59, "dea",
      "SEO Kompass findet Suchbegriffe, baut die Gliederung für deinen Artikel und formuliert Titel und Meta-Beschreibung."],
    ["Newsletterei", "Newsletter schreiben lassen", "marketing", "Briefkasten Digital", "free", "Kostenlos bis 1.000 Abonnenten", "news", "#EE0979", "#FF6A00", ["Newsletter", "E-Mail-Marketing"], 4.3, 455, 40, "dne",
      "Newsletterei sammelt deine Neuigkeiten der Woche und macht daraus einen lesenswerten Newsletter."],
    ["Rezeptomat", "Was koche ich heute?", "spass", "Küchenzauber", "free", "Kostenlos", "chef", "#F09819", "#EDDE5D", ["Kochen", "Resteverwertung", "Familie"], 4.7, 5120, 89, "dn",
      "Sag Rezeptomat, was im Kühlschrank ist – und bekomm drei Rezeptideen samt Einkaufsliste für den Rest."],
    ["Reimreich", "Gedichte & Reime für jeden Anlass", "spass", "Versschmiede", "free", "Kostenlos", "heart", "#DA4453", "#89216B", ["Gedichte", "Geburtstag", "Karten"], 4.5, 1890, 65, "dn",
      "Geburtstag, Hochzeit, Ruhestand: Reimreich dichtet persönliche Verse – gefühlvoll, lustig oder ganz schön schräg."],
    ["Traumdeuter", "Deine Träume als Bildergeschichte", "spass", "Nachtfalter Studio", "freemium", "3 Träume/Woche gratis · Plus 4 €/Monat", "moon", "#7F00FF", "#E100FF", ["Träume", "Tagebuch", "Bilder"], 4.0, 940, 46, "d",
      "Erzähl deinen Traum – Traumdeuter malt ihn als kleine Bildergeschichte und legt ihn in dein Traumtagebuch. Nur zur Unterhaltung."],
    ["Reiseplaner Luna", "Reiserouten in Minuten", "spass", "Fernweh Labs", "freemium", "Gratis · Plus mit Offline-Karten 5 €/Monat", "plane", "#00C6FF", "#0072FF", ["Reisen", "Routen", "Wochenende"], 4.6, 2380, 80, "dn",
      "Ziel, Dauer, Budget – Luna plant Tagesrouten mit Sehenswürdigkeiten, Cafés und Geheimtipps abseits der Massen."]
  ];
  const day = 864e5, NOW = Date.now();
  const apps = A.map((a, i) => {
    const [name, subtitle, category_id, creator, price_model, price_note, glyph, c1, c2, tags, rating_avg, rating_count, popularity, flags, description] = a;
    const slug = slugify(name);
    return {
      id: "a-" + slug, slug, name, subtitle, category_id, creator_id: "c-" + slugify(creator), price_model, price_note,
      icon: { glyph, c1, c2 }, tags, rating_avg, rating_count, popularity,
      features: { de: flags.includes("d"), no_login: flags.includes("n"), eu_hosting: flags.includes("e"), api: flags.includes("a") },
      languages: flags.includes("d") ? ["Deutsch", "Englisch"] : ["Englisch"],
      description, url: "https://example.com/" + slug, domain: "example.com",
      age: ["spass", "lernen"].includes(category_id) ? "ab 6" : "ab 12",
      editor_choice: [0, 4, 8, 12, 20, 24, 36].includes(i),
      released_at: new Date(NOW - ((i * 37) % 400 + 5) * day).toISOString(),
      checked_at: new Date(NOW - ((i * 7) % 28 + 1) * day).toISOString(),
      status: "published", listing_status: "active", paid_until: "2027-12-31T23:59:59Z", demo: true
    };
  });

  // ---------- Gesponserte Plätze (von Erstellern über die Website gebucht) ----------
  const placements = [
    { id: "p1", app_id: "a-fokusflow", slot: "today", label: "Gesponsert", demo: true },
    { id: "p2", app_id: "a-clipfabrik", slot: "search", label: "Anzeige", demo: true },
    { id: "p3", app_id: "a-angebotsprofi", slot: "category", category_id: "business", label: "Anzeige", demo: true },
    { id: "p4", app_id: "a-postplaner", slot: "category", category_id: "marketing", label: "Anzeige", demo: true },
    { id: "p5", app_id: "a-stimmwerk", slot: "today", label: "Gesponsert", demo: true }
  ];

  // ---------- Sammlungen ----------
  const collections = [
    { id: "alltag", title: "Starterpaket: KI im Alltag", subtitle: "Sofort nützlich, ganz ohne Vorwissen", glyph: "sparkle", c1: "#5B5BF7", c2: "#B04CF0", premium: false,
      intro: "Du willst KI ausprobieren, weißt aber nicht, wo anfangen? Diese Webapps helfen ab der ersten Minute – beim Schreiben, Kochen, Planen und Lernen.",
      apps: ["a-briefling", "a-rezeptomat", "a-satzbau", "a-fokusflow", "a-lernlicht", "a-reiseplaner-luna", "a-reimreich"] },
    { id: "kreative", title: "Für Kreative", subtitle: "Bild, Ton und Bewegung", glyph: "palette", c1: "#FF7A59", c2: "#FF3D8B", premium: false,
      intro: "Vom ersten Entwurf bis zum fertigen Reel: Werkzeuge für alle, die gestalten.",
      apps: ["a-pixelmond", "a-skizzo", "a-klangraum", "a-clipfabrik", "a-fotokur", "a-storyboard-ki", "a-logoschmiede"] },
    { id: "ohne-anmeldung", title: "Ohne Anmeldung loslegen", subtitle: "Öffnen und direkt nutzen", glyph: "bolt", c1: "#00B3A6", c2: "#1D6FE0", premium: false,
      intro: "Kein Konto, keine E-Mail, kein Abo: Diese Apps kannst du sofort im Browser ausprobieren.",
      apps: apps.filter((a) => a.features.no_login).slice(0, 10).map((a) => a.id) },
    { id: "eu-dsgvo", title: "Gehostet in der EU", subtitle: "Datenschutz zuerst", glyph: "shield", c1: "#0E9F6E", c2: "#1E2F5C", premium: false,
      intro: "Server in der EU, deutsche Oberfläche, klare Datenschutzangaben: unsere Auswahl für alle, denen Datenschutz besonders wichtig ist.",
      apps: apps.filter((a) => a.features.eu_hosting && a.features.de).map((a) => a.id) },
    { id: "selbststaendige", title: "Werkzeugkiste für Selbstständige", subtitle: "Mehr Zeit fürs Kerngeschäft", glyph: "briefcase", c1: "#3A5BA0", c2: "#8A2387", premium: false,
      intro: "Angebote, Verträge, Social Media und Buchhaltungstexte: Diese Apps sparen Solo-Selbstständigen jede Woche Stunden.",
      apps: ["a-angebotsprofi", "a-vertragslupe", "a-postplaner", "a-protokollant", "a-postfach-zen", "a-seo-kompass", "a-pitchdeck-pro"] }
  ];

  // ---------- Redaktionelle Geschichten (Heute) ----------
  const stories = [
    { id: "pixelmond", eyebrow: "App des Tages", title: "Aus Worten werden Welten", subtitle: "Wie Pixelmond Bilder malt, die du dir nur beschreiben musst.",
      art: { glyph: "sparkle", c1: "#1B1464", c2: "#FF3D8B", c3: "#FF8A4C" }, app_id: "a-pixelmond", demo: true,
      body: [
        "Ein Leuchtturm im Nebel, gemalt in Aquarell. Ein Fuchs mit Lesebrille, der in einer Bibliothek schläft. Bei Pixelmond reicht ein Satz – und Sekunden später liegen vier Varianten vor dir.",
        "Das kleine Team von Lunaris Studio hat besonders viel Mühe in die deutsche Spracheingabe gesteckt: Pixelmond versteht auch „gemütlich“, „verregnet“ oder „wie ein altes Kinderbuch“.",
        { apps: ["a-pixelmond"] },
        "Unser Tipp: Probier das Stilarchiv. Dort kannst du einen Look speichern und für eine ganze Bildserie wiederverwenden – ideal für Präsentationen oder Social Media.",
        "Bezahlt wird übrigens direkt bei Lunaris Studio. 50 Bilder im Monat sind kostenlos, danach gibt es ein Pro-Abo."
      ] },
    { id: "zeit-sparen", eyebrow: "Unsere Favoriten", title: "5 KI-Helfer, die dir jede Woche Stunden sparen", subtitle: "Weniger Kleinkram, mehr Feierabend.",
      art: { glyph: "bolt", c1: "#0E9F6E", c2: "#34C759", c3: "#B8F2E6" }, demo: true,
      body: [
        "E-Mails, Protokolle, Termine: Vieles, was den Tag frisst, lässt sich inzwischen gut delegieren. Wir haben fünf Webapps über mehrere Wochen im Alltag getestet.",
        { apps: ["a-protokollant", "a-postfach-zen", "a-fokusflow"] },
        "Der heimliche Star ist Protokollant: Nach dem Meeting liegen Entscheidungen und Aufgaben sauber sortiert im Postfach – inklusive Verantwortlichen.",
        { apps: ["a-briefling", "a-notizgarten"] },
        "Alle fünf Apps laufen im Browser. Du öffnest sie über KISTORE und meldest dich direkt beim jeweiligen Anbieter an."
      ] },
    { id: "untertitel", eyebrow: "Hinter den Kulissen", title: "Untertitel für alle", subtitle: "Klartext Labs will Videos barrierefrei machen – in 30 Sprachen.",
      art: { glyph: "captions", c1: "#2B1055", c2: "#C6426E", c3: "#F7797D" }, app_id: "a-untertitler", demo: true,
      body: [
        "Rund jedes fünfte Video im Netz wird ohne Ton angesehen. Für gehörlose und schwerhörige Menschen sind Untertitel ohnehin unverzichtbar.",
        "Klartext Labs aus der (fiktiven) Hafenstadt Nordheim hat deshalb einen Untertitler gebaut, der auch Dialekte, Fachbegriffe und Musik erkennt.",
        { apps: ["a-untertitler", "a-clipfabrik"] },
        "„Wir wollten, dass barrierefreie Videos der Normalfall werden und nicht der Sonderaufwand“, sagt das Team. 30 Minuten pro Monat sind deshalb dauerhaft kostenlos."
      ] }
  ];


  // ---------- Neuigkeiten der Ersteller (Updates & News) ----------
  const U = [
    ["a-pixelmond", "update", "2.4", "Neuer Stil: Risographie", "Körnige Zweifarbdrucke wie aus der Siebdruckwerkstatt – jetzt im Stilarchiv. Dazu 30 % schnellere Vorschauen.", 1],
    ["a-pixelmond", "news", null, "Pixelmond knackt 1 Mio. Bilder", "Danke an euch alle! Zur Feier gibt es diesen Monat 20 % auf Pro mit dem KISTORE-Code.", 9],
    ["a-satzbau", "update", "5.1", "Leichte Sprache", "Satzbau kann Texte jetzt in Leichte Sprache übertragen – mit Prüfliste nach den gängigen Regeln.", 2],
    ["a-clipfabrik", "update", "3.0", "Automatische Kapitel", "Lange Videos bekommen jetzt Kapitelmarken und passende Vorschaubilder.", 3],
    ["a-lernlicht", "news", null, "Neu: Abiturtraining Mathe", "Für alle Bundesländer: Übungsklausuren mit Schritt-für-Schritt-Feedback.", 4],
    ["a-fokusflow", "update", "1.9", "Fokuszeiten fürs Team", "Gemeinsame Fokusblöcke planen, ohne dass Meetings dazwischenrutschen.", 5],
    ["a-protokollant", "update", "4.2", "Jetzt auch für Telefonate", "Protokollant schreibt auf Wunsch auch Telefonkonferenzen mit – verarbeitet in der EU.", 6],
    ["a-rezeptomat", "news", null, "Saisonkalender November", "Kürbis, Grünkohl, Rote Bete: 40 neue Rezepte für den Herbst.", 2],
    ["a-stimmwerk", "update", "2.0", "12 neue Dialektstimmen", "Von Kölsch bis Schwäbisch – inklusive Hörproben direkt im Editor.", 7],
    ["a-untertitler", "update", "6.3", "Gebärdensprach-Avatar (Beta)", "Erste Beta für DGS-Einblendungen in kurzen Clips.", 11],
    ["a-codepilot-nord", "update", "2.7", "Tests für Python & Go", "Codepilot Nord schreibt jetzt auch pytest- und Go-Tests.", 8],
    ["a-reiseplaner-luna", "news", null, "Winterrouten sind da", "Weihnachtsmärkte, Thermen und Rodelbahnen – Luna plant dein Winterwochenende.", 3],
    ["a-postplaner", "update", "3.5", "LinkedIn-Karussells", "Mehrseitige Karussell-Posts direkt aus deinen Stichpunkten.", 10],
    ["a-vokabelwolke", "update", "4.0", "Rollenspiele", "Übe Alltagssituationen wie Arztbesuch oder Bewerbungsgespräch im Dialog.", 12],
    ["a-notizgarten", "update", "1.6", "Offline-Modus", "Notizen gehen jetzt auch ohne Netz – Sync, sobald du wieder online bist.", 13],
    ["a-klangraum", "news", null, "Weihnachtsmusik lizenzfrei", "Neue Stimmungen für Festtags-Reels, kommerziell nutzbar.", 1]
  ];
  const updates = U.map(([app_id, kind, version, title, body, d], i) => ({ id: "u" + (i + 1), app_id, kind, version, title, body, created_at: new Date(NOW - d * day - i * 3600e3).toISOString(), demo: true }));

  // ---------- Exklusive KISTORE-Rabattcodes ----------
  const D = [
    ["a-pixelmond", "20 % auf Pro", "-20 %", "KISTORE20", "Für Neukunden, 12 Monate", 30],
    ["a-satzbau", "Pro 3 Monate günstiger", "-30 %", "SATZ-KI30", "Gilt für Monats- und Jahresabo", 45],
    ["a-clipfabrik", "Erster Monat gratis", "1 Monat", "CLIPKISTORE", "Danach 15 €/Monat, monatlich kündbar", 21],
    ["a-lektora", "Lektorat zum Kennenlernen", "-25 %", "LEKTORA25", "Auf das erste Manuskript", 60],
    ["a-fokusflow", "Zwei Monate geschenkt", "2 Monate", "FOKUS2", "Beim Jahresabo", 40],
    ["a-stimmwerk", "Mehr Minuten", "+60 Min.", "STIMME60", "Einmalig zusätzlich zum Gratiskontingent", 25],
    ["a-angebotsprofi", "Für Selbstständige", "-40 %", "ANGEBOT40", "Die ersten 6 Monate", 50],
    ["a-vokabelwolke", "Jahresabo zum Sparpreis", "-35 %", "VOKABEL35", "Nur über KISTORE", 35],
    ["a-podpolish", "Pro testen", "-50 %", "PODHALB", "Erster Monat", 14],
    ["a-logoschmiede", "Marken-Paket günstiger", "-15 €", "LOGO15", "Auf das 99-€-Paket", 28],
    ["a-seo-kompass", "Analysen satt", "-30 %", "SEOKI30", "3 Monate Pro", 33]
  ];
  const deals = D.map(([app_id, title, discount, code, terms, d], i) => ({ id: "d" + (i + 1), app_id, title, discount, code, terms, expires_at: new Date(NOW + d * day).toISOString(), demo: true }));

  // ---------- Bewertungen (deterministisch erzeugt) ----------
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const reviewers = ["Julia K.", "Mehmet_83", "Anna aus Köln", "Lukas", "S. Bauer", "Frau Schröder", "Tim B.", "Nele", "Kai_dev", "Marie L.", "Ömer", "Hanna", "Felix R.", "Jana P.", "Lehrerin_Sabine", "Ben", "Paulina", "Chris W.", "Oma Gerda", "Niklas"];
  const good = [
    ["Spart mir jeden Tag Zeit", (n) => `${n} nutze ich inzwischen fast täglich. Die Ergebnisse sind sauber und die Oberfläche ist angenehm aufgeräumt.`],
    ["Genau, was ich gesucht habe", (n) => `Ich habe einige Alternativen ausprobiert, aber ${n} ist mit Abstand am einfachsten. Nach zwei Minuten war ich drin.`],
    ["Überraschend gut", (n) => `Ehrlich gesagt war ich skeptisch. Aber ${n} liefert wirklich brauchbare Ergebnisse, auch auf Deutsch.`],
    ["Klare Empfehlung", (n) => `Für meine Arbeit unverzichtbar geworden. Dass ${n} direkt im Browser läuft, ist super praktisch.`],
    ["Macht richtig Spaß", (n) => `Wir haben ${n} am Wochenende zu dritt ausprobiert und viel gelacht. Gerne mehr davon!`],
    ["Fair bepreist", (n) => `Die Gratis-Version reicht für den Einstieg, das Upgrade bei ${n} ist für das Gebotene fair.`]
  ];
  const mid = [
    ["Gut, aber ausbaufähig", (n) => `${n} macht vieles richtig. Manchmal dauert es aber etwas, bis ein Ergebnis kommt.`],
    ["Solide mit kleinen Macken", (n) => `Grundsätzlich top, auf dem Handy ist ${n} aber noch etwas fummelig.`],
    ["Für den Preis okay", (n) => `Funktioniert zuverlässig. Ein günstigerer Tarif für Gelegenheitsnutzer wäre schön.`]
  ];
  const bad = [["Hat mich nicht überzeugt", (n) => `Die Ergebnisse von ${n} waren bei mir eher durchwachsen. Vielleicht passt es für andere besser.`]];
  const seedReviews = [];
  apps.forEach((a, ai) => {
    const r = rng(ai * 977 + 13), n = 3 + Math.floor(r() * 4);
    for (let k = 0; k < n; k++) {
      const x = r(), hi = (a.rating_avg - 3.6) / 1.4;
      const stars = x < hi ? 5 : x < hi + 0.3 ? 4 : x < 0.95 ? 3 : 2;
      const pool = stars >= 4 ? good : stars === 3 ? mid : bad, t = pool[Math.floor(r() * pool.length)];
      seedReviews.push({ id: `r-${a.slug}-${k}`, app_id: a.id, author: reviewers[Math.floor(r() * reviewers.length)], stars, title: t[0], body: t[1](a.name),
        created_at: new Date(NOW - Math.floor(r() * 120 + 1) * day).toISOString(), demo: true,
        reply: k === 0 && r() < 0.35 ? (stars >= 4 ? "Danke für dein Feedback! Wir freuen uns sehr, dass dir die App gefällt. – Das Team" : "Danke für die ehrliche Rückmeldung! Genau daran arbeiten wir gerade – das nächste Update bringt spürbare Verbesserungen. – Das Team") : null });
    }
  });

  const trending = ["Bilder erstellen", "Untertitel", "E-Mail schreiben", "Präsentation", "Nachhilfe", "Podcast", "Logo", "Rezepte"];
  window.AW_SEED = { categories, creators, apps, placements, collections, stories, reviews: seedReviews, updates, deals, trending, demo: true };

  // ====================== Demo-Backend ======================
  window.AW_DEMO_BACKEND = function (C) {
    const KEY = "aw-demo-db", SKEY = "aw-demo-session";
    const blank = () => ({ v: 2, users: [], favorites: [], follows: [], reviews: [], reports: [], submissions: [], sponsor_requests: [], updates: [], deals: {}, replies: {}, stats: {} });
    let db; try { db = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch { db = blank(); }
    if (db.v !== 2) db = blank();
    // Admin-Änderungen im Demo-Modus (live: Tabellen in Supabase)
    db.adm = Object.assign({ apps: {}, creators: {}, newApps: [], newCreators: [], placements: [], delPlacements: [], reviews: {}, log: [] }, db.adm || {});
    const save = () => localStorage.setItem(KEY, JSON.stringify(db));
    const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)));
    const now = () => new Date().toISOString();
    const fail = (m, code) => { const e = new Error(m); e.code = code; throw e; };
    const hash = (s) => [...String(s)].reduce((a, c) => ((a * 31 + c.charCodeAt(0)) | 0), 7).toString(36);
    const sess = () => { try { return JSON.parse(localStorage.getItem(SKEY)); } catch { return null; } };
    const meRow = () => { const s = sess(); return s ? db.users.find((u) => u.id === s.uid) || null : null; };
    const need = () => meRow() || fail("Bitte melde dich zuerst an", "auth");
    const allApps = () => [...window.AW_SEED.apps, ...db.adm.newApps].map((a) => (db.adm.apps[a.id] ? { ...a, ...db.adm.apps[a.id] } : a));
    const allCreators = () => [...window.AW_SEED.creators, ...db.adm.newCreators].map((c) => (db.adm.creators[c.id] ? { ...c, ...db.adm.creators[c.id] } : c));
    const listed = (a) => a.status === "published" && a.listing_status === "active" && (!a.paid_until || a.paid_until > now());
    const seedApps = allApps;
    const creatorOf = (u) => { const c = u?.creator_id && allCreators().find((x) => x.id === u.creator_id); return c ? { id: c.id, name: c.name, verified: c.verified, apps: seedApps().filter((a) => a.creator_id === c.id).map((a) => ({ id: a.id, listing_status: a.listing_status, paid_until: a.paid_until })) } : null; };
    const pub = (u) => u && { id: u.id, username: u.username, display_name: u.display_name, created_at: u.created_at, is_admin: u.role === "admin", creator: creatorOf(u) };
    const own = (u, appId) => { const a = seedApps().find((x) => x.id === appId); if (!a || a.creator_id !== u.creator_id) fail("Nur der Ersteller dieser App kann das ändern", "owner"); return a; };
    // Demo-Statistik: aus Beliebtheit abgeleitete, deterministische Beispielzahlen (+ echte Klicks in diesem Browser)
    const demoDaily = (a) => { let x = [...a.id].reduce((s, c) => s + c.charCodeAt(0), 0); const base = Math.max(8, Math.round(a.popularity / 9));
      return Array.from({ length: 30 }, (_, i) => { x = (x * 9301 + 49297) % 233280; const v = Math.round(base * (0.7 + (x / 233280) * 0.6) * (1 + i / 60)); return { day: new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10), views: v, opens: Math.round(v * 0.31) }; }); };
    const str = (v, max) => { const s = String(v ?? "").trim().slice(0, max); return s || null; };
    const delay = (v) => new Promise((r) => setTimeout(() => r(v), 60));
    const wrap = (f) => (...a) => { try { return delay(f(...a)); } catch (e) { return Promise.reject(e); } };
    const seed = window.AW_SEED;
    const appIds = { has: (id) => allApps().some((a) => a.id === id && listed(a)) };
    const hiddenReview = (id) => db.adm.reviews[id] === "hidden";
    // Beispiel-Vorgänge, damit der Admin-Bereich im Demo-Modus nicht leer ist (einmalig)
    const demoInbox = () => {
      if (db.adm.inbox) return; db.adm.inbox = true;
      const t = (h) => new Date(Date.now() - h * 3600e3).toISOString();
      db.submissions.push(
        { id: uuid(), user_id: null, name: "Folienfuchs", subtitle: "Präsentationen aus Stichpunkten", url: "https://example.com/folienfuchs", category_id: "business", price_model: "freemium", description: "Folienfuchs macht aus deinen Notizen eine fertige Präsentation – mit passenden Bildern und Sprechernotizen.", creator_name: "Fuchsbau Digital", contact_email: "hallo@example.com", status: "pending", created_at: t(5), demo: true },
        { id: uuid(), user_id: null, name: "Gratis-Follower 3000", subtitle: "Mehr Reichweite sofort", url: "https://example.com/follower", category_id: "marketing", price_model: "subscription", description: "Kaufe Follower für alle Netzwerke.", creator_name: "Growth Inc.", contact_email: "x@example.com", status: "pending", created_at: t(26), demo: true });
      const rv = seed.reviews.find((r) => r.app_id === "a-traumdeuter") || seed.reviews[0];
      db.reports.push(
        { id: uuid(), app_id: "a-regexo", review_id: null, user_id: null, reason: "broken", details: "Die Website lädt seit gestern nicht mehr (Fehler 502).", status: "open", created_at: t(3), demo: true },
        { id: uuid(), app_id: rv.app_id, review_id: rv.id, user_id: null, reason: "spam", details: "Sieht nach Werbung aus.", status: "open", created_at: t(9), demo: true });
      db.sponsor_requests.push({ id: uuid(), user_id: null, app_name: "Klangraum", package: "story", email: "team@example.com", message: "Wir würden gern im Dezember eine Heute-Story buchen.", status: "new", created_at: t(30), demo: true });
    };
    const alog = (u, action, target, details = {}) => { db.adm.log.unshift({ id: Date.now(), action, target, details, created_at: now(), aw_profiles: { username: u.username } }); db.adm.log = db.adm.log.slice(0, 60); };
    const slugify = (x) => String(x || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "app";
    const free = (base, taken) => { for (let i = 0; ; i++) { const v = i ? `${base}-${i + 1}` : base; if (!taken(v)) return v; } };
    const iso = (v) => { if (v === null || v === undefined || v === "") return null; const d = new Date(v); if (isNaN(+d)) fail("Ungültiges Datum"); return d.toISOString(); };
    const patchApp = (id, p) => { const isNew = db.adm.newApps.find((a) => a.id === id); if (isNew) Object.assign(isNew, p); else db.adm.apps[id] = { ...(db.adm.apps[id] || {}), ...p }; };
    const patchCreator = (id, p) => { const isNew = db.adm.newCreators.find((c) => c.id === id); if (isNew) Object.assign(isNew, p); else db.adm.creators[id] = { ...(db.adm.creators[id] || {}), ...p }; };
    const ownerOf = (cid) => db.users.find((u) => u.creator_id === cid) || null;
    const setOwner = (cid, user) => {
      if (user && user.creator_id && user.creator_id !== cid) fail(`Dieses Konto ist schon Ersteller „${allCreators().find((c) => c.id === user.creator_id)?.name || user.creator_id}“`);
      db.users.forEach((u) => { if (u.creator_id === cid) u.creator_id = null; }); if (user) user.creator_id = cid;
    };
    function adminAction(a, b) {
      const me = need(); if (me.role !== "admin") fail("Nur für Admins", "admin");
      const prof = (id) => { const u = db.users.find((x) => x.id === id); return u ? { username: u.username, display_name: u.display_name } : null; };
      const appsAll = allApps(), byId = new Map(appsAll.map((x) => [x.id, x]));
      switch (a) {
        case "admin_data": {
          const allRev = [...seed.reviews, ...db.reviews];
          return {
            submissions: [...db.submissions].sort((x, y) => y.created_at.localeCompare(x.created_at)).map((x) => ({ ...x, aw_profiles: prof(x.user_id) })),
            reports: [...db.reports].sort((x, y) => y.created_at.localeCompare(x.created_at)).map((x) => { const ap = byId.get(x.app_id); const rv = x.review_id && allRev.find((r) => r.id === x.review_id);
              return { ...x, aw_profiles: prof(x.user_id), aw_apps: ap ? { name: ap.name, slug: ap.slug, status: ap.status } : null, aw_reviews: rv ? { id: rv.id, title: rv.title, body: rv.body, stars: rv.stars, status: hiddenReview(rv.id) ? "hidden" : "visible", author_name: rv.author || null } : null }; }),
            creators: allCreators().map((c) => { const o = ownerOf(c.id); return { ...c, owner_id: o?.id || null, aw_profiles: o ? { username: o.username, display_name: o.display_name } : null }; }).sort((x, y) => x.name.localeCompare(y.name)),
            apps: appsAll.map(({ id, slug, name, creator_id, category_id, status, listing_status, paid_until, editor_choice, demo, icon }) => ({ id, slug, name, creator_id, category_id, status, listing_status, paid_until, editor_choice, demo, icon })).sort((x, y) => x.name.localeCompare(y.name)),
            placements: [...seed.placements.filter((p) => !db.adm.delPlacements.includes(p.id)).map((p) => ({ ...p, id: "demo-" + p.id, _seed: p.id })), ...db.adm.placements],
            sponsor_requests: [...db.sponsor_requests].map((x) => ({ status: "new", ...x })).sort((x, y) => y.created_at.localeCompare(x.created_at)),
            categories: seed.categories.map(({ id, name }) => ({ id, name })),
            stats_daily: appsAll.filter(listed).flatMap((x) => demoDaily(x).map((d) => ({ app_id: x.id, ...d }))),
            log: db.adm.log, payments: [],
            counts: { users: db.users.length, favorites: db.favorites.length, follows: db.follows.length, reviews: db.reviews.length },
            demo: true
          };
        }
        case "admin_user_search": { const q = String(b.q || "").trim().toLowerCase(); if (q.length < 2) return []; return db.users.filter((u) => u.username.startsWith(q)).slice(0, 20).map((u) => ({ id: u.id, username: u.username, display_name: u.display_name, role: u.role || "user", created_at: u.created_at })); }
        case "admin_submission_decide": {
          const s = db.submissions.find((x) => x.id === b.id) || fail("Einreichung nicht gefunden");
          if (s.status !== "pending") fail("Diese Einreichung wurde schon entschieden");
          const note = str(b.note, 600);
          if (b.decision === "reject") { Object.assign(s, { status: "rejected", review_note: note, decided_at: now() }); alog(me, "submission_reject", s.id, { name: s.name }); save(); return { ok: true, status: "rejected" }; }
          if (b.decision !== "approve") fail("Bitte annehmen oder ablehnen");
          let creator_id = b.creator_id;
          if (creator_id) { if (!allCreators().some((c) => c.id === creator_id)) fail("Ersteller nicht gefunden"); }
          else { const name = str(b.creator_name, 60) || s.creator_name || s.name; creator_id = free("c-" + slugify(name), (v) => allCreators().some((c) => c.id === v)); db.adm.newCreators.push({ id: creator_id, name, verified: false, since: new Date().getFullYear() }); }
          if (b.assign_owner !== false && s.user_id) { const o = ownerOf(creator_id); if (o && o.id !== s.user_id) fail("Dieser Ersteller gehört schon zu einem anderen Konto"); if (!o) setOwner(creator_id, db.users.find((u) => u.id === s.user_id)); }
          const cat = seed.categories.find((c) => c.id === s.category_id) || {};
          const slug = free(slugify(str(b.slug, 50) || s.name), (v) => appsAll.some((x) => x.slug === v)); const id = free("a-" + slug, (v) => appsAll.some((x) => x.id === v));
          const listing_status = b.listing_status === "active" ? "active" : "paused";
          db.adm.newApps.push({ id, slug, name: s.name, subtitle: s.subtitle || "", category_id: s.category_id, creator_id, price_model: s.price_model, price_note: null, icon: { glyph: cat.glyph || "sparkle", c1: cat.c1 || "#5B5BF7", c2: cat.c2 || "#B04CF0" }, tags: [], rating_avg: 0, rating_count: 0, popularity: 0, features: {}, languages: ["Deutsch"], description: s.description || "", url: s.url, domain: (() => { try { return new URL(s.url).hostname.replace(/^www\./, ""); } catch { return ""; } })(), age: "ab 12", editor_choice: false, released_at: now(), checked_at: now(), status: "published", listing_status, paid_until: iso(b.paid_until), demo: false });
          Object.assign(s, { status: "approved", review_note: note, app_id: id, decided_at: now() });
          alog(me, "submission_approve", s.id, { app_id: id, creator_id, listing_status }); save(); return { ok: true, status: "approved", app_id: id, slug, creator_id };
        }
        case "admin_creator_update": {
          const c = allCreators().find((x) => x.id === b.id) || fail("Ersteller nicht gefunden"); const p = {};
          if (typeof b.verified === "boolean") p.verified = b.verified; if (b.name !== undefined) p.name = str(b.name, 60) || fail("Name fehlt");
          if (Object.keys(p).length) patchCreator(c.id, p);
          if (b.owner_username !== undefined) { const un = String(b.owner_username || "").trim().toLowerCase().replace(/^@/, ""); const u = un ? db.users.find((x) => x.username === un) || fail(`Kein Konto „${un}“ gefunden`) : null; setOwner(c.id, u); p.owner = un || null; }
          alog(me, "creator_update", c.id, p); save(); return { ok: true };
        }
        case "admin_app_update": {
          const x = byId.get(b.id) || fail("App nicht gefunden"); const p = {};
          if (b.listing_status !== undefined) { if (!["active", "paused"].includes(b.listing_status)) fail("Status: aktiv oder pausiert"); p.listing_status = b.listing_status; }
          if (b.paid_until !== undefined) p.paid_until = iso(b.paid_until);
          if (b.status !== undefined) { if (!["published", "hidden"].includes(b.status)) fail("Sichtbarkeit: veröffentlicht oder ausgeblendet"); p.status = b.status; }
          if (typeof b.editor_choice === "boolean") p.editor_choice = b.editor_choice;
          if (!Object.keys(p).length) fail("Nichts zu ändern");
          patchApp(x.id, p); alog(me, "app_update", x.id, p); save(); return { ok: true };
        }
        case "admin_report_resolve": {
          const r = db.reports.find((x) => x.id === b.id) || fail("Meldung nicht gefunden");
          const status = b.status === "rejected" ? "rejected" : "done"; const hide = ["app", "review"].includes(b.hide) ? b.hide : null;
          if (hide === "review") { if (!r.review_id) fail("Die Meldung betrifft keine Bewertung"); db.adm.reviews[r.review_id] = "hidden"; }
          if (hide === "app") { if (!r.app_id) fail("Die Meldung betrifft keine App"); patchApp(r.app_id, { status: "hidden" }); }
          Object.assign(r, { status, resolution: str(b.note, 300) || (hide === "app" ? "App ausgeblendet" : hide === "review" ? "Bewertung ausgeblendet" : status === "rejected" ? "Kein Verstoß" : "Erledigt"), resolved_at: now() });
          alog(me, "report_resolve", r.id, { status, hide }); save(); return { ok: true };
        }
        case "admin_review_status": { if (!["visible", "hidden"].includes(b.status)) fail("Ungültige Angabe"); if (b.status === "hidden") db.adm.reviews[b.id] = "hidden"; else delete db.adm.reviews[b.id]; alog(me, "review_status", b.id, { status: b.status }); save(); return { ok: true }; }
        case "admin_placement_save": {
          const x = byId.get(b.app_id) || fail("Bitte wähle eine App"); if (!["today", "category", "search"].includes(b.slot)) fail("Platz: Heute, Kategorie oder Suche");
          const row = { app_id: x.id, slot: b.slot, category_id: b.slot === "category" ? b.category_id || x.category_id : null, label: b.label === "Anzeige" ? "Anzeige" : "Gesponsert", starts_at: iso(b.starts_at) || now(), ends_at: iso(b.ends_at) };
          if (row.ends_at && row.ends_at <= row.starts_at) fail("Das Ende muss nach dem Start liegen");
          let id = b.id;
          if (id && id.startsWith("demo-")) { db.adm.delPlacements.push(id.slice(5)); id = null; }
          const ex = id && db.adm.placements.find((p) => p.id === id);
          if (ex) Object.assign(ex, row); else { id = "adm-" + uuid(); db.adm.placements.push({ id, ...row, created_at: now() }); }
          alog(me, "placement_save", id, row); save(); return { ok: true, id };
        }
        case "admin_placement_delete": { const id = String(b.id || ""); if (id.startsWith("demo-")) db.adm.delPlacements.push(id.slice(5)); db.adm.placements = db.adm.placements.filter((p) => p.id !== id); alog(me, "placement_delete", id); save(); return { ok: true }; }
        case "admin_sponsor_status": { const r = db.sponsor_requests.find((x) => x.id === b.id) || fail("Anfrage nicht gefunden"); if (!["new", "offer_sent", "booked", "declined"].includes(b.status)) fail("Ungültige Angabe"); r.status = b.status; alog(me, "sponsor_status", r.id, { status: b.status }); save(); return { ok: true }; }
        default: fail("Unbekannte Admin-Aktion");
      }
    }
    return {
      demo: true,
      catalog: wrap(() => {
        // Nutzerbewertungen in die Durchschnitte einrechnen (wie die View aw_app_stats)
        const apps = allApps().filter(listed).map((a) => {
          const own = db.reviews.filter((r) => r.app_id === a.id && !hiddenReview(r.id));
          if (!own.length) return a;
          const cnt = a.rating_count + own.length, sum = a.rating_avg * a.rating_count + own.reduce((s, r) => s + r.stars, 0);
          return { ...a, rating_count: cnt, rating_avg: Math.round((sum / cnt) * 10) / 10 };
        });
        const updates = [...db.updates, ...seed.updates].sort((a, b) => b.created_at.localeCompare(a.created_at));
        const deals = seed.deals.filter((d) => !(d.app_id in db.deals)).concat(Object.values(db.deals).filter(Boolean)).filter((d) => !d.expires_at || d.expires_at > now());
        const live = new Set(apps.map((a) => a.id)), t = now();
        const placements = [...seed.placements.filter((p) => !db.adm.delPlacements.includes(p.id)), ...db.adm.placements]
          .filter((p) => live.has(p.app_id) && (!p.starts_at || p.starts_at <= t) && (!p.ends_at || p.ends_at > t));
        return { ...seed, apps, creators: allCreators(), placements, updates: updates.filter((u) => live.has(u.app_id)), deals: deals.filter((d) => live.has(d.app_id)) };
      }),
      reviews: wrap((appId) => {
        const own = db.reviews.filter((r) => r.app_id === appId).map((r) => ({ ...r, author: db.users.find((u) => u.id === r.user_id)?.display_name || "Gelöschtes Konto", mine: r.user_id === sess()?.uid }));
        return [...own, ...seed.reviews.filter((r) => r.app_id === appId)].filter((r) => !hiddenReview(r.id)).map((r) => (r.id in db.replies ? { ...r, reply: db.replies[r.id]?.body || null, reply_at: db.replies[r.id]?.at || null } : r)).sort((a, b) => b.created_at.localeCompare(a.created_at));
      }),
      me: wrap(() => pub(meRow())),
      register: wrap(({ username, display_name, password, consent }) => {
        username = String(username || "").trim().toLowerCase();
        if (!/^[a-z0-9_.-]{3,24}$/.test(username)) fail("Benutzername: 3–24 Zeichen, nur a–z, 0–9, _ . -");
        if (String(password || "").length < 8) fail("Passwort: mindestens 8 Zeichen");
        if (!consent) fail("Bitte stimme den Nutzungsbedingungen und der Datenschutzerklärung zu");
        if (db.users.some((u) => u.username === username)) fail("Dieser Benutzername ist schon vergeben");
        const u = { id: uuid(), role: "user", username, display_name: str(display_name, 40) || username, pw: hash(password), created_at: now(), consent_at: now(), email: `${username}@${C.emailDomain}` };
        db.users.push(u); save(); localStorage.setItem(SKEY, JSON.stringify({ uid: u.id })); return pub(u);
      }),
      login: wrap(({ username, password }) => {
        const u = db.users.find((x) => x.username === String(username || "").trim().toLowerCase());
        if (!u || u.pw !== hash(password)) fail("Benutzername oder Passwort falsch");
        localStorage.setItem(SKEY, JSON.stringify({ uid: u.id })); return pub(u);
      }),
      logout: wrap(() => { localStorage.removeItem(SKEY); return true; }),
      updateProfile: wrap(({ display_name }) => { const u = need(); u.display_name = str(display_name, 40) || u.display_name; save(); return pub(u); }),
      deleteAccount: wrap(() => {
        const u = need(); const id = u.id;
        db.users = db.users.filter((x) => x.id !== id); db.favorites = db.favorites.filter((f) => f.user_id !== id); db.follows = db.follows.filter((f) => f.user_id !== id);
        db.reviews = db.reviews.filter((r) => r.user_id !== id); db.submissions = db.submissions.filter((s) => s.user_id !== id);
        db.reports.forEach((r) => { if (r.user_id === id) r.user_id = null; });
        save(); localStorage.removeItem(SKEY); return true;
      }),
      exportData: wrap(() => { const u = need(); const id = u.id; const { pw, ...profile } = u;
        return { exportiert_am: now(), profil: profile, favoriten: db.favorites.filter((f) => f.user_id === id), gefolgt: db.follows.filter((f) => f.user_id === id), bewertungen: db.reviews.filter((r) => r.user_id === id), einreichungen: db.submissions.filter((s) => s.user_id === id), meldungen: db.reports.filter((r) => r.user_id === id) }; }),
      favorites: wrap(() => { const s = sess(); return s ? db.favorites.filter((f) => f.user_id === s.uid).sort((a, b) => b.created_at.localeCompare(a.created_at)).map((f) => f.app_id) : []; }),
      toggleFavorite: wrap((appId) => {
        const u = need(); if (!appIds.has(appId)) fail("App nicht gefunden");
        const i = db.favorites.findIndex((f) => f.user_id === u.id && f.app_id === appId);
        if (i >= 0) { db.favorites.splice(i, 1); save(); return { on: false }; }
        db.favorites.push({ user_id: u.id, app_id: appId, created_at: now() }); save(); return { on: true };
      }),
      saveReview: wrap(({ app_id, stars, title, body }) => {
        const u = need(); if (!appIds.has(app_id)) fail("App nicht gefunden");
        stars = Math.round(Number(stars)); if (!(stars >= 1 && stars <= 5)) fail("Bitte wähle 1 bis 5 Sterne");
        const row = db.reviews.find((r) => r.user_id === u.id && r.app_id === app_id);
        const data = { stars, title: str(title, 80), body: str(body, 2000), updated_at: now() };
        if (row) Object.assign(row, data); else db.reviews.push({ id: uuid(), app_id, user_id: u.id, created_at: now(), ...data });
        save(); return true;
      }),
      deleteReview: wrap((id) => { const u = need(); db.reviews = db.reviews.filter((r) => !(r.id === id && r.user_id === u.id)); save(); return true; }),
      myReviews: wrap(() => { const s = sess(); return s ? db.reviews.filter((r) => r.user_id === s.uid) : []; }),
      report: wrap(({ app_id, review_id, reason, details }) => {
        if (!reason) fail("Bitte wähle einen Grund");
        db.reports.push({ id: uuid(), app_id, review_id: review_id || null, user_id: sess()?.uid || null, reason, details: str(details, 1000), status: "open", created_at: now() }); save(); return true;
      }),
      submitApp: wrap((f) => {
        const u = need();
        const name = str(f.name, 40), url = str(f.url, 300);
        if (!name) fail("Bitte gib den Namen der App an");
        if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(url || "")) fail("Bitte gib eine gültige https-Adresse an");
        if (!f.category_id) fail("Bitte wähle eine Kategorie");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.contact_email || "")) fail("Bitte gib eine gültige Kontakt-E-Mail an");
        if (!f.rights) fail("Bitte bestätige, dass du die App anbieten darfst");
        const row = { id: uuid(), user_id: u.id, name, url, category_id: f.category_id, price_model: f.price_model || "free", subtitle: str(f.subtitle, 60), description: str(f.description, 4000), creator_name: str(f.creator_name, 60), contact_email: str(f.contact_email, 120), status: "pending", created_at: now() };
        db.submissions.push(row); save(); return row;
      }),
      mySubmissions: wrap(() => { const s = sess(); return s ? db.submissions.filter((x) => x.user_id === s.uid).sort((a, b) => b.created_at.localeCompare(a.created_at)) : []; }),
      sponsorRequest: wrap((f) => {
        if (!str(f.app_name, 60)) fail("Bitte gib den Namen deiner App an");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email || "")) fail("Bitte gib eine gültige E-Mail an");
        db.sponsor_requests.push({ id: uuid(), user_id: sess()?.uid || null, app_name: str(f.app_name, 60), package: f.package, email: f.email, message: str(f.message, 1000), created_at: now() }); save(); return true;
      }),
      follows: wrap(() => { const s = sess(); return s ? db.follows.filter((f) => f.user_id === s.uid).sort((a, b) => b.created_at.localeCompare(a.created_at)).map((f) => f.app_id) : []; }),
      toggleFollow: wrap((appId) => {
        const u = need(); if (!appIds.has(appId)) fail("App nicht gefunden");
        const i = db.follows.findIndex((f) => f.user_id === u.id && f.app_id === appId);
        if (i >= 0) { db.follows.splice(i, 1); save(); return { on: false }; }
        db.follows.push({ user_id: u.id, app_id: appId, created_at: now() }); save(); return { on: true };
      }),
      track: (appId, kind) => { if (appIds.has(appId) && (kind === "view" || kind === "open")) { const k = appId + ":" + kind; db.stats[k] = (db.stats[k] || 0) + 1; save(); } return Promise.resolve(true); },
      // ---- Ersteller ----
      postUpdate: wrap(({ app_id, kind, title, version, body }) => {
        const u = need(); own(u, app_id); if (!str(title, 80)) fail("Bitte gib einen Titel an");
        const row = { id: uuid(), app_id, kind: kind === "news" ? "news" : "update", title: str(title, 80), version: str(version, 20), body: str(body, 1000) || "", created_at: now() };
        db.updates.unshift(row); save(); return row;
      }),
      deleteUpdate: wrap((id) => { const u = need(); const r = db.updates.find((x) => x.id === id); if (!r) fail("Beitrag nicht gefunden"); own(u, r.app_id); db.updates = db.updates.filter((x) => x.id !== id); save(); return true; }),
      replyReview: wrap(({ review_id, app_id, body }) => { const u = need(); own(u, app_id); const t = str(body, 1000); db.replies[review_id] = t ? { body: t, at: now() } : null; save(); return { reply: t }; }),
      saveDeal: wrap((f) => {
        const u = need(); own(u, f.app_id);
        if (f.active === false) { db.deals[f.app_id] = null; save(); return { active: false }; }
        const code = String(f.code || "").trim().toUpperCase();
        if (!/^[A-Z0-9-]{3,24}$/.test(code)) fail("Code: 3–24 Zeichen, nur A–Z, 0–9 und -");
        if (!str(f.title, 80)) fail("Bitte gib einen Titel an"); if (!str(f.discount, 20)) fail("Bitte gib den Rabatt an (z. B. -20 %)");
        if (f.expires_at && new Date(f.expires_at) < new Date()) fail("Das Ablaufdatum muss in der Zukunft liegen");
        db.deals[f.app_id] = { id: "dd-" + f.app_id, app_id: f.app_id, title: str(f.title, 80), discount: str(f.discount, 20), code, terms: str(f.terms, 200), expires_at: f.expires_at ? new Date(f.expires_at).toISOString() : null };
        save(); return { active: true };
      }),
      creatorDashboard: wrap(() => {
        const u = need(); const c = creatorOf(u); if (!c) return { creator: null, apps: [] };
        const apps = c.apps.map((x) => { const a = seedApps().find((y) => y.id === x.id); const daily = demoDaily(a);
          return { ...x, daily, views: daily.reduce((s, d) => s + d.views, 0) + (db.stats[a.id + ":view"] || 0), opens: daily.reduce((s, d) => s + d.opens, 0) + (db.stats[a.id + ":open"] || 0),
            favorites: Math.round(a.popularity * 1.7) + db.favorites.filter((f) => f.app_id === a.id).length, follows: Math.round(a.popularity * 0.9) + db.follows.filter((f) => f.app_id === a.id).length }; });
        return { creator: { id: c.id, name: c.name, verified: c.verified }, apps, demo: true };
      }),
      // Nur Demo: dein Konto einem Beispiel-Ersteller zuordnen (live setzt das die Redaktion nach Buchung des Listing-Abos)
      demoBecomeCreator: wrap((creatorId) => { const u = need(); u.creator_id = creatorId || null; save(); return pub(u); }),
      // ---- Admin (gleiche Aktionen wie die Edge Function: admin_*) ----
      admin: wrap((action, b = {}) => adminAction(action, b || {})),
      // Nur Demo: Admin-Rolle für dein Demo-Konto (live NUR per SQL: update aw_profiles set role='admin' …)
      demoBecomeAdmin: wrap((on) => { const u = need(); u.role = on === false ? "user" : "admin"; if (u.role === "admin") demoInbox(); save(); return pub(u); }),
      resetDemo: () => { localStorage.removeItem(KEY); localStorage.removeItem(SKEY); }
    };
  };
})();
