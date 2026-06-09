// DOM Elements
const startScreen = document.getElementById('start-screen');
const logoContainer = document.getElementById('logo-container');
const startLogo = document.getElementById('start-logo');
const startFallback = document.getElementById('start-fallback');
const windowsContainer = document.getElementById('windows-container');
const skipBtn = document.getElementById('skip-btn');

// Create Audio elements dynamically (VR compatible)
// Expose to window so other scripts can access
window.audio1 = new Audio('Audio 1.mp3');
window.audio2 = new Audio('audio 2.mp3');
window.audio3 = new Audio('Audio 3.mp3');

console.log('Audio objects created:', {
    audio1: window.audio1,
    audio2: window.audio2,
    audio3: window.audio3
});

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

// Test button - toggle visibility of elements
let testState = 0;
document.getElementById('test-btn').addEventListener('click', () => {
    testState = (testState + 1) % 4;

    const toggleVisibility = window.toggleVisibility || ((id, show) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = show ? 'block' : 'none';
            el.style.opacity = show ? '1' : '0';
        }
    });

    if (testState === 0) {
        console.log('Test: Hide all');
        toggleVisibility('Presentation_Product', false);
        toggleVisibility('Context', false);
        toggleVisibility('Content', false);
    } else if (testState === 1) {
        console.log('Test: Show Presentation_Product');
        toggleVisibility('Presentation_Product', true);
    } else if (testState === 2) {
        console.log('Test: Show Context');
        toggleVisibility('Context', true);
    } else if (testState === 3) {
        console.log('Test: Show Content');
        toggleVisibility('Content', true);
    }
});

// Toggle visibility function for 3D actors
window.toggleVisibility = function(actorName, visible) {
    window.parent.postMessage(JSON.stringify({
        action: "toggleVisibility",
        actor: actorName,
        visible: visible
    }), "*");
};
