/* KISTORE – Zahlungen der ERSTELLER (Listing-Abo + Featured-Plätze). Nutzer zahlen in KISTORE nie.
   Zwei Wege, gleiches Ergebnis (Edge Function setzt aw_apps.paid_until / listing_status bzw. legt den Featured-Platz an):
   (a) Website/PWA  → Zahlungsdienst-Checkout (z. B. Stripe Payment Link / Checkout), URLs in config.js → checkout. Bestätigung per Webhook (Aktion stripe_webhook).
   (b) iOS-App      → Apple In-App-Kauf (StoreKit). Vorbereitet für cordova-plugin-purchase (CdvPurchase) bzw. RevenueCat (window.Purchases).
                      Der Kaufbeleg (JWS) geht an die Edge Function (Aktion iap_verify); Verlängerungen/Kündigungen kommen per App Store Server Notifications.
   Apple-Regel: In der iOS-App werden keine externen Bezahl-Links gezeigt (config.allowExternalCheckoutInNative = false). */
(function () {
  "use strict";
  const C = window.AW_CONFIG || {};
  const cap = window.Capacitor;
  const native = !!cap?.isNativePlatform?.();
  const platform = native ? cap.getPlatform?.() || "native" : "web";
  // appAccountToken: stabile UUID je App-Eintrag (Apple verlangt UUID-Format) – verknüpft Apple-Transaktionen mit aw_apps.id
  async function tokenFor(appId) {
    const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("kistore:" + appId))).slice(0, 16);
    h[6] = (h[6] & 0x0f) | 0x50; h[8] = (h[8] & 0x3f) | 0x80;
    const x = [...h].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
  }
  function webUrl(product, appId) {
    const u = (C.checkout || {})[product];
    if (!u) return "";
    const url = new URL(u, location.href);
    if (appId) url.searchParams.set("client_reference_id", appId);
    url.searchParams.set("product", (C.iap || {})[product] || product);
    return url.toString();
  }
  // Welcher Weg wird angezeigt?
  //  "web"   → Website-Checkout (oder „Bezahlung bald verfügbar“, wenn keine URL hinterlegt)
  //  "apple" → In-App-Kauf in der iOS-App
  //  "none"  → andere native Plattformen: nur Hinweis
  function channel() {
    if (!native) return "web";
    if (platform === "ios") return "apple";
    return C.allowExternalCheckoutInNative ? "web" : "none";
  }
  // StoreKit über cordova-plugin-purchase v13 (window.CdvPurchase) – wird erst in der nativen Hülle eingebunden
  let ready = null;
  function storeInit() {
    if (ready) return ready;
    ready = (async () => {
      const CP = window.CdvPurchase;
      if (!CP) return null;
      const { store, ProductType, Platform } = CP;
      const ids = C.iap || {};
      store.register(Object.entries(ids).map(([k, id]) => ({ id, platform: Platform.APPLE_APPSTORE, type: k === "listing" ? ProductType.PAID_SUBSCRIPTION : ProductType.CONSUMABLE })));
      await store.initialize([Platform.APPLE_APPSTORE]);
      return store;
    })();
    return ready;
  }
  // verify(appId, jws) wird von app.js gesetzt (ruft Edge Function iap_verify)
  async function buyApple(product, appId, verify) {
    const id = (C.iap || {})[product];
    if (!id) throw new Error("Produkt nicht konfiguriert");
    if (!appId) throw new Error("Bitte wähle zuerst deine App im Ersteller-Bereich");
    const store = await storeInit();
    if (!store) throw Object.assign(new Error("In-App-Kauf ist in dieser Version noch nicht verfügbar."), { code: "iap_unavailable" });
    const offer = store.get(id)?.getOffer();
    if (!offer) throw new Error("Produkt im App Store nicht gefunden");
    const token = await tokenFor(appId);
    return new Promise((resolve, reject) => {
      store.when().approved(async (tx) => {
        try { const r = await verify(appId, tx.parentReceipt?.nativeData?.jwsRepresentation || tx.nativeData?.jwsRepresentation || ""); await tx.finish(); resolve(r); }
        catch (e) { reject(e); }
      });
      offer.order({ applicationUsername: token }).then((err) => { if (err) reject(new Error(err.message || "Kauf abgebrochen")); });
    });
  }
  window.KI_PAY = { native, platform, channel, webUrl, buyApple, tokenFor };
})();
