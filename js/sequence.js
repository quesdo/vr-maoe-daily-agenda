window.autoStartSequence = function() {
    const startScreen = document.getElementById('start-screen');
    const logoContainer = document.getElementById('logo-container');
    const startLogo = document.getElementById('start-logo');
    const startFallback = document.getElementById('start-fallback');
    const windowsContainer = document.getElementById('windows-container');

    // Get audio elements created in main.js
    const audio1 = window.audio1;
    const audio2 = window.audio2;
    const tl = gsap.timeline();

    // === PHASE 1: Logo moves to bottom-right and starts pulsing ===
    tl.to(logoContainer, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        top: 'auto',
        left: 'auto',
        transform: 'none',
        duration: 0.6,
        ease: 'power2.inOut'
    });

    // === PHASE 2: Logo pulses continuously while audio plays ===
    tl.to([startLogo, startFallback], {
        scale: 1.15,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    }, '<');

    // === PHASE 3: Play Audio 1 ===
    tl.add(() => {
        console.log('Starting Audio 1...');
        audio1.play().catch(e => console.log('Audio 1 play error:', e));
    }, '+=0.3');

    // === PHASE 4: Wait for Audio 1 to finish + 2 seconds, then start Audio 2 and animations ===
    tl.add(() => {
        return new Promise((resolve) => {
            const onEnded = () => {
                console.log('Audio 1 finished, waiting 2 seconds...');
                audio1.removeEventListener('ended', onEnded);
                setTimeout(() => {
                    console.log('Starting Audio 2 and main sequence...');
                    audio2.play().catch(e => console.log('Audio 2 play error:', e));

                    window.startMainSequence(windowsContainer);
                    resolve();
                }, 2000);
            };
            audio1.addEventListener('ended', onEnded);
        });
    });
};
