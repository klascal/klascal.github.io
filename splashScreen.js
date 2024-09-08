function checkSplashInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('splash') !== 'false';  // Show splash screen unless 'splash=false'
}

// Function to hide splash screen
function hideSplashScreen() {
    document.querySelector('.splash-screen').classList.remove('show');
    document.querySelector('.splash-screen').classList.add('hide');
    document.querySelector('.main-content').classList.add('show');
}

// Wait for page to load, then check splash screen logic
window.addEventListener('load', function() {
    if (checkSplashInURL()) {
        setTimeout(hideSplashScreen, 2000);  // Splash screen remains visible for 2 seconds
    } else {
        document.querySelector('.splash-screen').style.display = 'none';  // Skip splash screen
        document.querySelector('.main-content').classList.add('show');  // Show main content immediately
    }
});
