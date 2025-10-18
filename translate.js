async function loadLanguage() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const forcedLang = urlParams.get("lang");

    const userLang = navigator.language?.slice(0, 2) || "nl";

    const supported = ["nl", "en", "de", "fr", "es"];

    const lang = supported.includes(forcedLang)
      ? forcedLang
      : supported.includes(userLang)
      ? userLang
      : "nl";

    localStorage.setItem("klascal-lang", lang);

    document.documentElement.lang = lang;

    const res = await fetch("lang.json");
    if (!res.ok) throw new Error("Kan lang.json niet laden");
    const translations = await res.json();

    document.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    console.log(`Taal ingesteld op: ${lang}`);
  } catch (err) {
    console.error("Fout bij laden van taal:", err);
  }
}

loadLanguage();
