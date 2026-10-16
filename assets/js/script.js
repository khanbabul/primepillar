const pdfUrl = new URL(
    './assets/pdf/Primepillar-Profile.pdf',
    window.location.href
).href;

const desktopContainer =
    document.getElementById('desktop-pdf-container');

const mobileContainer =
    document.getElementById('mobile-pdf-container');

const desktopEmbed =
    document.getElementById('desktop-embed');

const mobileIframe =
    document.getElementById('mobile-iframe');

const loadingScreen =
    document.getElementById('loading-screen');

let isInitialLoad = true;
let loadingFinished = false;
let fallbackTimer;

// Hide the loading screen once the viewer has loaded.
function hideLoadingScreen() {
    if (loadingFinished) return;

    loadingFinished = true;
    clearTimeout(fallbackTimer);

    loadingScreen.classList.add('hide');

    // Remove it from interaction and accessibility flow.
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 650);
}

// Avoid leaving the loading screen visible indefinitely
// if the browser does not fire a load event.
fallbackTimer = setTimeout(() => {
    hideLoadingScreen();
}, 15000);


function loadPdfViewer() {
    const isMobile =
        window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        desktopContainer.style.display = 'none';
        mobileContainer.style.display = 'block';

        // Use your LOCAL PDF.js viewer.
        const viewerUrl = new URL(
            './assets/pdfjs/web/viewer.html',
            window.location.href
        );

        viewerUrl.searchParams.set('file', pdfUrl);

        if (mobileIframe.src !== viewerUrl.href) {
            mobileIframe.src = viewerUrl.href;
        } else if (isInitialLoad) {
            // The iframe is already assigned its URL.
            hideLoadingScreen();
        }

    } else {
        mobileContainer.style.display = 'none';
        desktopContainer.style.display = 'block';

        if (desktopEmbed.src !== pdfUrl) {
            desktopEmbed.src = pdfUrl;
        } else if (isInitialLoad) {
            hideLoadingScreen();
        }
    }

    isInitialLoad = false;
}


// Desktop PDF loading event.
desktopEmbed.addEventListener('load', () => {
    hideLoadingScreen();
});

// Mobile PDF.js viewer loading event.
mobileIframe.addEventListener('load', () => {
    // Allow the PDF.js viewer a moment to initialize.
    setTimeout(() => {
        hideLoadingScreen();
    }, 500);
});


// Start the viewer.
loadPdfViewer();


// Preserve responsive desktop/mobile switching.
let resizeTimer;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        loadPdfViewer();
    }, 250);
});
