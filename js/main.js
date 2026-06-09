// DOM Elements
const startScreen = document.getElementById('start-screen');
const logoContainer = document.getElementById('logo-container');
const startLogo = document.getElementById('start-logo');
const startFallback = document.getElementById('start-fallback');
const windowsContainer = document.getElementById('windows-container');
const skipBtn = document.getElementById('skip-btn');

// Create Audio elements dynamically (VR compatible)
const audio1 = new Audio('assets/Audio/Audio 1.mp3');
const audio2 = new Audio('assets/Audio/audio 2.mp3');
const audio3 = new Audio('assets/Audio/Audio 3.mp3');

// Logo error fallback
startLogo.onerror = () => {
    startLogo.style.display = 'none';
    startFallback.style.display = 'flex';
};

// Logo click handlers
startLogo.addEventListener('click', () => {
    console.log('Logo clicked, starting audio sequence...');
    window.autoStartSequence();
});

startFallback.addEventListener('click', () => {
    console.log('Fallback clicked, starting audio sequence...');
    window.autoStartSequence();
});

// Logo hover effect
[startLogo, startFallback].forEach(el => {
    el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.1)');
    el.addEventListener('mouseleave', () => el.style.transform = 'scale(1)');
});

// Skip button handler
skipBtn.addEventListener('click', () => {
    console.log('Skipping to Audio 2 and animations...');
    startScreen.classList.add('hidden');
    audio2.play().catch(e => console.log('Audio 2 play error:', e));
    window.startMainSequence(windowsContainer);
});

// Close popup handlers
document.querySelectorAll('.popup-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const popup = e.target.closest('.email-popup');
        const overlay = document.getElementById('popup-overlay');
        popup.classList.remove('show');
        // Check if any other popup is still open
        const anyOpen = document.querySelectorAll('.email-popup.show').length > 0;
        if (!anyOpen) {
            overlay.classList.remove('show');
        }
    });
});

// Close popup when clicking overlay
document.getElementById('popup-overlay').addEventListener('click', () => {
    const overlay = document.getElementById('popup-overlay');
    document.querySelectorAll('.email-popup.show').forEach(popup => {
        popup.classList.remove('show');
    });
    overlay.classList.remove('show');
});

// Toggle visibility function for 3D actors
window.toggleVisibility = function(actorName, visible) {
    window.parent.postMessage(JSON.stringify({
        action: "toggleVisibility",
        actor: actorName,
        visible: visible
    }), "*");
};
