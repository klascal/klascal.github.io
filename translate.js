async function loadLanguage() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const forcedLang = urlParams.get("lang");

    const injectedLang = window?.KLASCAL_LANG || null;

    const storedLang = localStorage.getItem("klascal-lang");

    const navLangs = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages.map(l => (typeof l === "string" ? l.slice(0,2) : null)).filter(Boolean)
      : [];

    const intlLang = (typeof Intl === "object" && Intl?.DateTimeFormat)
      ? (Intl.DateTimeFormat().resolvedOptions().locale || "").slice(0,2)
      : null;

    const navLang = (navigator.language || navigator.userLanguage || "").slice(0,2);

    const supported = ["nl", "en", "de", "fr", "es"];

    const candidates = [
      forcedLang,
      injectedLang,
      storedLang,
      ...navLangs,
      intlLang,
      navLang
    ].filter(Boolean);

    let lang = candidates.find(c => supported.includes(c)) || "nl";

    if (!forcedLang) localStorage.setItem("klascal-lang", lang);

    document.documentElement.lang = lang;

    const res = await fetch("/lang.json");
    if (!res.ok) throw new Error("Kan lang.json niet laden");
    const translations = await res.json();

    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    console.log(`Taal ingesteld op: ${lang} (herkomst: ${candidates.join(", ")})`);
  } catch (err) {
    console.error("Fout bij laden van taal:", err);
  }
}

loadLanguage();
