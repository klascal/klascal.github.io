(function () {
    const defaultOptions = {
      snowflakeCount: 50,
      snowflakeColor: 'white',
      zIndex: 9999,
    };
  
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
  
      // Add falling snowflakes
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
        snowflake.style.animation = `falling ${5 + Math.random() * 5}s linear infinite`;
        overlay.appendChild(snowflake);
      }
  
      document.body.appendChild(overlay);
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
        .snowflake {
          animation-delay: calc(-1s * var(--i));
        }
      `;
      document.head.appendChild(style);
    };
  
    // Public API
    window.christmasOverlaySnow = {
      enable: (userOptions = {}) => {
        if (!document.getElementById('christmas-overlay')) {
          const options = { ...defaultOptions, ...userOptions };
          injectStyles();
          createOverlay(options);
        }
      },
      disable: () => {
        const overlay = document.getElementById('christmas-overlay');
        if (overlay) overlay.remove();
      }
    };
  })();
  