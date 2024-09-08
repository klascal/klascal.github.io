// Function to get URL parameters
        function getURLParameter(param) {
            const params = new URLSearchParams(window.location.search);
            return params.get(param);
        }

        // Function to remove a URL parameter
        function removeURLParameter(param) {
            const url = new URL(window.location.href);
            url.searchParams.delete(param);
            window.history.replaceState({}, document.title, url.pathname + url.search); // Update URL without reloading
        }

        // Check if 'splash' is true in the URL
        const showSplash = getURLParameter('splash') === 'true';

        // DOM elements
        const splashScreen = document.getElementById('splash-screen');
        const mainContent = document.getElementById('main-content');

        // If splash=true, show splash screen; otherwise, skip to main content
        if (showSplash) {
            // Remove 'splash' parameter from the URL
            removeURLParameter('splash');

            // Show splash screen for 2 seconds
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.style.visibility = 'hidden';
                mainContent.style.display = 'block';
                mainContent.style.opacity = '1';
            }, 3000);  // 2 seconds
        } else {
            // Skip splash and directly show main content
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        }
