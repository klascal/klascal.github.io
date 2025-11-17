(function () {
  const defaultOptions = {
    snowflakeCount: 50,
    snowflakeColor: 'white',
    zIndex: 9999,
  };

  let stopAddingNew = false; // Nieuw: tracker voor graceful stop

  const createOverlay = (options) => {
    const { snowflakeCount, snowflakeColor, zIndex } = options;

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'christmas-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = zIndex;
    overlay.style.overflow = 'hidden';

    // Voeg vallende sneeuwvlokjes toe
    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.position = 'absolute';
      snowflake.style.top = `${Math.random() * 100}%`;
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.width = '10px';
      snowflake.style.height = '10px';
      snowflake.style.background = snowflakeColor;
      snowflake.style.borderRadius = '50%';
      snowflake.style.opacity = `${Math.random()}`;
      snowflake.style.animation = `falling ${5 + Math.random() * 5}s linear`;
      overlay.appendChild(snowflake);

      // verwijder snowflake na animatie einde
      snowflake.addEventListener('animationend', () => {
        snowflake.remove();
      });
    }

    document.body.appendChild(overlay);

    // Als we niet willen dat nieuwe vlokjes toegevoegd worden, stop
    if (!stopAddingNew) {
      const interval = setInterval(() => {
        if (stopAddingNew) {
          clearInterval(interval);
          return;
        }
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.position = 'absolute';
        snowflake.style.top = `-10px`;
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.width = '10px';
        snowflake.style.height = '10px';
        snowflake.style.background = snowflakeColor;
        snowflake.style.borderRadius = '50%';
        snowflake.style.opacity = `${Math.random()}`;
        snowflake.style.animation = `falling ${5 + Math.random() * 5}s linear`;
        snowflake.addEventListener('animationend', () => snowflake.remove());
        overlay.appendChild(snowflake);
      }, 200); // elke 0.2s een nieuwe sneeuwvlok
    }
  };

  const injectStyles = () => {
    if (document.getElementById('christmas-overlay-styles')) return;
    const style = document.createElement('style');
    style.id = 'christmas-overlay-styles';
    style.textContent = `
      @keyframes falling {
        0% { transform: translateY(-100vh); }
        100% { transform: translateY(100vh); }
      }
    `;
    document.head.appendChild(style);
  };

  // Public API
  window.christmasOverlaySnow = {
    enable: (userOptions = {}) => {
      if (!document.getElementById('christmas-overlay')) {
        stopAddingNew = false; // reset stop flag
        const options = { ...defaultOptions, ...userOptions };
        injectStyles();
        createOverlay(options);
      }
    },
    disable: () => {
      // Graceful stop: geen nieuwe sneeuwvlokjes meer, bestaande vallen af
      stopAddingNew = true;

      const overlay = document.getElementById('christmas-overlay');
      if (overlay) {
        // verwijder overlay pas als alle snowflakes weg zijn
        const checkEmpty = setInterval(() => {
          if (overlay.children.length === 0) {
            overlay.remove();
            clearInterval(checkEmpty);
          }
        }, 100);
      }
    }
  };
})();
