window.startMainSequence = function(windowsContainer) {
    const startScreen = document.getElementById('start-screen');
    const analysisZone = document.getElementById('analysis-zone');
    const agendaContainer = document.getElementById('agenda-container');
    const computationDisplay = document.getElementById('computation-display');

    console.log('startMainSequence called');

    // Hide start screen
    startScreen.classList.add('hidden');
    windowsContainer.style.display = 'block';
    windowsContainer.style.opacity = '1';

    // Show windows one by one with animation
    const windows = document.querySelectorAll('.app-window');
    windows.forEach((win, index) => {
        setTimeout(() => {
            win.classList.add('show');
            gsap.from(win, {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                ease: 'back.out(1.2)'
            });
        }, index * 150); // Stagger: 150ms between each
    });

    console.log('Start screen hidden, windows showing', windowsContainer);

    const tl = gsap.timeline();

    // === OUTLOOK CHAOS PHASE: 7 seconds with scroll and flash ===
    const outlookList = document.getElementById('outlook-email-list');
    const welcomeEmails = document.querySelectorAll('.welcome-email');

    tl.add(() => {
        console.log('Starting chaos effect - 7 seconds');
        const outlookWin = document.querySelector('#win-outlook');

        welcomeEmails.forEach(email => email.style.display = 'block');

        // Flash effect
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            outlookWin.style.boxShadow = flashCount % 2 === 0
                ? '0 8px 32px rgba(0,0,0,0.3)'
                : '0 0 20px rgba(255, 100, 100, 0.8)';
            flashCount++;
        }, 80);

        // Scroll effect - continuous scrolling
        let scrollPos = 0;
        const maxScroll = outlookList.scrollHeight - outlookList.clientHeight;
        let scrollDirection = 1;

        const scrollInterval = setInterval(() => {
            scrollPos += scrollDirection * 15;

            if (scrollPos >= maxScroll) {
                scrollPos = maxScroll;
                scrollDirection = -1;
            } else if (scrollPos <= 0) {
                scrollPos = 0;
                scrollDirection = 1;
            }

            outlookList.scrollTop = scrollPos;
        }, 60);

        window.chaosIntervals = { flashInterval, scrollInterval };
    }, '<0.3');

    // === After 7 seconds: Stop chaos and show priority emails ===
    tl.add(() => {
        console.log('Chaos ended - showing priority emails');
        clearInterval(window.chaosIntervals?.flashInterval);
        clearInterval(window.chaosIntervals?.scrollInterval);

        const outlookWin = document.querySelector('#win-outlook');
        outlookWin.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';

        welcomeEmails.forEach(email => email.style.display = 'none');

        // Reset scroll
        outlookList.scrollTop = 0;

        document.querySelector('#email-1').style.display = 'block';
        document.querySelector('#email-2').style.display = 'block';
        document.querySelector('#email-3').style.display = 'block';
        console.log('Priority emails now visible');
    }, '+=7');

    // === POPUP 1 (THREAT) - at 0:11.76 when speaker mentions "sales director" ===
    tl.add(() => {
        console.log('Showing THREAT popup at 0:11.76');
        tl.to('#email-1', { opacity: 1, duration: 0.3 }, '<');
        tl.to('#email-1', { backgroundColor: 'rgba(231, 76, 60, 0.2)', duration: 0.2 }, '<');

        const overlay = document.getElementById('popup-overlay');
        const popup = document.getElementById('email-popup-1');
        overlay.classList.add('show');
        popup.classList.add('show');
    }, '+=4.76'); // 7 + 4.76 = 11.76

    // === POPUP 2 (FACTORY) - at 0:21.92 when speaker mentions "VP of production / Beijing" ===
    tl.add(() => {
        console.log('Showing FACTORY popup at 0:21.92');

        // First, close previous popup
        document.getElementById('email-popup-1').classList.remove('show');

        tl.to('#email-2', { opacity: 1, duration: 0.3 }, '<');
        tl.to('#email-2', { backgroundColor: 'rgba(52, 152, 219, 0.2)', duration: 0.2 }, '<');

        const popup = document.getElementById('email-popup-2');
        popup.classList.add('show');
    }, '+=10.16'); // 11.76 + 10.16 = 21.92

    // === POPUP 3 (PERF REVIEW) - at 0:28.00 when speaker mentions "business performance review" ===
    tl.add(() => {
        console.log('Showing PERF REVIEW popup at 0:28.00');

        // First, close previous popup
        document.getElementById('email-popup-2').classList.remove('show');

        tl.to('#email-3', { opacity: 1, duration: 0.3 }, '<');
        tl.to('#email-3', { backgroundColor: 'rgba(142, 68, 173, 0.2)', duration: 0.2 }, '<');

        const popup = document.getElementById('email-popup-3');
        popup.classList.add('show');
    }, '+=6.08'); // 21.92 + 6.08 = 28.00

    // === PHASE 2: Highlights (windows stay in place) ===
    const hl = (selector, color, delay) => {
        tl.add(() => { document.querySelector(selector).classList.add('hl-' + color); }, delay);
    };

    const showLabel = (labelId, targetSelector, delay) => {
        tl.add(() => {
            const target = document.querySelector(targetSelector);
            const label = document.getElementById(labelId);
            const rect = target.getBoundingClientRect();
            label.style.left = (rect.right + 4) + 'px';
            label.style.top = (rect.top + rect.height / 2 - 10) + 'px';
        }, delay);
        tl.to('#' + labelId, { opacity: 1, duration: 0.25 }, '<');
    };

    // Outlook highlights
    hl('#email-1', 'red', '+=0.8');
    tl.to('#email-1', { scale: 1.02, duration: 0.3, yoyo: true, repeat: 1 }, '<');
    showLabel('dl-1', '#email-1', '<');

    // Show popup for email-1 (THREAT)
    tl.add(() => {
        const overlay = document.getElementById('popup-overlay');
        const popup = document.getElementById('email-popup-1');
        overlay.classList.add('show');
        popup.classList.add('show');
    }, '<');

    hl('#email-2', 'blue', '+=0.3');
    showLabel('dl-2', '#email-2', '<');

    // Show popup for email-2 (Factory)
    tl.add(() => {
        const popup = document.getElementById('email-popup-2');
        popup.classList.add('show');
    }, '<');

    hl('#email-3', 'purple', '+=0.25');
    showLabel('dl-3', '#email-3', '<');

    // Show popup for email-3 (Perf Review)
    tl.add(() => {
        const popup = document.getElementById('email-popup-3');
        popup.classList.add('show');
    }, '<');

    // Excel highlights
    hl('#excel-r2a', 'yellow', '+=0.3');
    hl('#excel-r2d', 'red', '+=0.05');
    hl('#excel-r2e', 'red', '+=0.05');
    showLabel('dl-4', '#excel-r2d', '<');

    hl('#excel-r3a', 'purple', '+=0.25');
    hl('#excel-r3d', 'yellow', '+=0.05');
    showLabel('dl-5', '#excel-r3a', '<');

    hl('#excel-r5a', 'blue', '+=0.2');
    showLabel('dl-10', '#excel-r5a', '<');

    // Teams highlights
    hl('#meeting-2', 'blue', '+=0.3');
    tl.to('#meeting-2', { scale: 1.02, duration: 0.25, yoyo: true, repeat: 1 }, '<');
    showLabel('dl-6', '#meeting-2', '<');

    hl('#meeting-4', 'yellow', '+=0.25');
    showLabel('dl-7', '#meeting-4', '<');

    hl('#meeting-1', 'green', '+=0.2');
    showLabel('dl-11', '#meeting-1', '<');

    // OneDrive highlights
    hl('#file-1', 'blue', '+=0.3');
    hl('#file-2', 'yellow', '+=0.2');
    showLabel('dl-8', '#file-2', '<');
    hl('#file-4', 'purple', '+=0.2');

    // Planner highlights
    hl('#task-1', 'red', '+=0.3');
    tl.to('#task-1', { scale: 1.02, duration: 0.25, yoyo: true, repeat: 1 }, '<');
    showLabel('dl-9', '#task-1', '<');

    hl('#task-2', 'red', '+=0.2');
    hl('#task-5', 'blue', '+=0.2');

    // === PHASE 3: Logo appears below, lines connect ===
    tl.to(analysisZone, { opacity: 1, duration: 0.5 }, '+=0.6');

    // Calculate line positions AFTER windows are stable
    tl.add(() => {
        const zone = analysisZone.getBoundingClientRect();
        const targetX = zone.left + zone.width / 2;
        const targetY = zone.top + 35;

        const windows = document.querySelectorAll('.app-window');
        const winCenters = [];
        windows.forEach(w => {
            const r = w.getBoundingClientRect();
            winCenters.push({ x: r.left + r.width / 2, y: r.bottom - 20 });
        });

        // Primary lines: each window → logo
        for (let i = 0; i < 5; i++) {
            const line = document.getElementById(`line-${i + 1}`);
            line.setAttribute('x1', winCenters[i].x);
            line.setAttribute('y1', winCenters[i].y);
            line.setAttribute('x2', targetX);
            line.setAttribute('y2', targetY);
        }

        // Cross-links between windows
        const crossPairs = [
            [0, 2], [0, 3], [1, 4], [2, 1], [3, 4],
            [0, 1], [2, 3], [1, 3], [4, 0]
        ];
        for (let i = 0; i < crossPairs.length; i++) {
            const line = document.getElementById(`line-${i + 6}`);
            if (line) {
                line.setAttribute('x1', winCenters[crossPairs[i][0]].x);
                line.setAttribute('y1', winCenters[crossPairs[i][0]].y);
                line.setAttribute('x2', winCenters[crossPairs[i][1]].x);
                line.setAttribute('y2', winCenters[crossPairs[i][1]].y);
            }
        }
    });

    // Primary lines appear
    tl.to('#line-1, #line-2, #line-3, #line-4, #line-5', {
        opacity: 1, duration: 0.4, stagger: 0.12
    }, '+=0.3');

    // Cross-links appear
    tl.to('#line-6, #line-7, #line-8, #line-9, #line-10', {
        opacity: 0.6, duration: 0.3, stagger: 0.1
    }, '+=0.3');

    tl.to('#line-11, #line-12, #line-13, #line-14', {
        opacity: 0.4, duration: 0.25, stagger: 0.08
    }, '+=0.2');

    // Computation text
    tl.to(computationDisplay, { opacity: 1, duration: 0.3 }, '-=0.8');
    tl.to('.computation-line', { opacity: 1, duration: 0.1, stagger: 0.35 }, '<0.2');

    // Pulse rings
    tl.to('#pulse-1', { opacity: 0.6, scale: 1.8, duration: 0.7, repeat: 3, yoyo: true, ease: 'sine.inOut' }, '-=2');
    tl.to('#pulse-2', { opacity: 0.4, scale: 2.3, duration: 0.9, repeat: 3, yoyo: true, ease: 'sine.inOut' }, '<0.1');
    tl.to('#pulse-3', { opacity: 0.3, scale: 2.8, duration: 1.1, repeat: 2, yoyo: true, ease: 'sine.inOut' }, '<0.1');

    // Lines flash/pulse
    tl.to('#lines-svg line', {
        opacity: 0.15, duration: 0.2, stagger: { each: 0.04, repeat: 3, yoyo: true }
    }, '-=2');

    // === PHASE 4: Analysis done → fade analysis, shrink windows, show agenda ===
    tl.to('.analysis-text', {
        duration: 0.01,
        onComplete: () => { document.querySelector('.analysis-text').textContent = 'Agenda optimisé'; }
    }, '+=0.3');

    // Fade out analysis + labels
    tl.to(analysisZone, { opacity: 0, duration: 0.5 }, '+=0.6');
    tl.to('#lines-svg line', { opacity: 0, duration: 0.4 }, '<');
    tl.to(computationDisplay, { opacity: 0, duration: 0.3 }, '<');
    tl.to('.data-label', { opacity: 0, duration: 0.3 }, '<');

    // Windows shrink up
    tl.to(windowsContainer, {
        scale: 0.3,
        y: -280,
        opacity: 0.4,
        duration: 1,
        ease: 'power2.inOut'
    }, '-=0.2');

    // Show agenda
    tl.to(agendaContainer, { opacity: 1, duration: 0.5 }, '-=0.3');
    tl.to('.agenda-block', {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.2, ease: 'power2.out'
    }, '+=0.1');
    tl.to('.agenda-more', { opacity: 1, duration: 0.5 }, '+=0.2');

    // === After Audio 2 ends: Wait 2 seconds then launch Audio 3 ===
    // Don't use timeline for this - register directly on audio element
    const audio2 = window.audio2;
    const audio3 = window.audio3;

    console.log('🎵 Registering Audio 2 ended listener...');
    audio2.addEventListener('ended', () => {
        console.log('🎵 Audio 2 ENDED! Waiting 2 seconds before Audio 3...');
        setTimeout(() => {
            console.log('🎵 NOW launching Audio 3...');
            // Close all popups
            document.querySelectorAll('.email-popup.show').forEach(popup => {
                popup.classList.remove('show');
            });
            document.getElementById('popup-overlay').classList.remove('show');

            // Launch Audio 3
            audio3.play().then(() => {
                console.log('✅ Audio 3 is PLAYING');
            }).catch(e => {
                console.log('❌ Audio 3 play error:', e);
            });

            // === AUDIO 3 SEQUENCES ===

                // Define toggleVisibility function for showing elements
                window.toggleVisibility = (elementId, show) => {
                    const el = document.getElementById(elementId);
                    if (el) {
                        el.style.display = show ? 'block' : 'none';
                        el.style.opacity = show ? '1' : '0';
                        console.log(`${show ? 'Showing' : 'Hiding'}: ${elementId}`);
                    } else {
                        console.warn(`Element not found: ${elementId}`);
                    }
                };

                // Sequence 1: [0:00.00 -> 0:07.00] "Here is the type of product" → SHOW Presentation Product
                setTimeout(() => {
                    console.log('Audio 3 - 0:00: Show Presentation Product');
                    window.toggleVisibility('Presentation_Product', true);
                }, 2000); // 2 seconds into audio 3

                // Sequence 2: [0:11.00 -> 0:15.00] "Our portfolio consists" → SHOW Context
                setTimeout(() => {
                    console.log('Audio 3 - 0:11: Show Context');
                    window.toggleVisibility('Context', true);
                }, 13000); // 11 seconds into audio 3

                // Sequence 3: [0:26.00 -> 0:31.20] "Here is the current location" → SHOW Content hide for gemba
                setTimeout(() => {
                    console.log('Audio 3 - 0:26: Show Content hide for gemba');
                    window.toggleVisibility('Content hide for gemba', true);
                }, 28000); // 26 seconds into audio 3
        }, 2000);
    }, { once: true });
};
