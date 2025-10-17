async function loadLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const forcedLang = urlParams.get('lang');

  const userLang = navigator.language.slice(0, 2);
  const supported = ['nl', 'en', 'de', 'fr', 'es'];
  const lang = supported.includes(forcedLang)
    ? forcedLang
    : (supported.includes(userLang) ? userLang : 'en');

  const res = await fetch('lang.json');
  const translations = await res.json();

  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  console.log(`Taal ingesteld op: ${lang}`);
}

loadLanguage();
