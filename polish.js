/* ==========================================================================
   POLISH.JS — Modern scroll, typography, cursor and page orchestration
   ========================================================================== */

let lenis;
let polishCursor;
let xTo, yTo;

document.addEventListener('DOMContentLoaded', () => {
    // 1. INJECT FIXED ASSETS (Cursor & Grain)
    injectFixedAssets();

    // 2. INITIALIZE PERSISTENT MODULES (Cursor & Smooth Scroll)
    initCursor();
    initLenis();

    // 3. INITIALIZE PAGE ANIMATIONS
    initPageAnimations();

    // 4. INITIALIZE BARBA.JS PAGE TRANSITIONS
    initBarba();
});

/* ==========================================
   PERSISTENT FIXED ASSETS
   ========================================== */
function injectFixedAssets() {
    // Inject Custom Cursor
    if (!document.getElementById('polish-cursor')) {
        const cursor = document.createElement('div');
        cursor.id = 'polish-cursor';
        
        // Add child container to animate the avatar separately from GSAP coordinates
        const avatar = document.createElement('div');
        avatar.className = 'cursor-avatar';
        cursor.appendChild(avatar);
        
        document.body.appendChild(cursor);
    }

    // Inject Grain Overlay
    if (!document.getElementById('polish-grain-container')) {
        const grainContainer = document.createElement('div');
        grainContainer.id = 'polish-grain-container';
        grainContainer.className = 'polish-grain';
        grainContainer.innerHTML = `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
            </svg>
        `;
        document.body.appendChild(grainContainer);
    }

    // Inject Barba Transition Screen
    if (!document.getElementById('barba-transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'barba-transition-overlay';
        overlay.className = 'barba-transition-overlay';
        document.body.appendChild(overlay);
    }
}

/* ==========================================
   LENIS SMOOTH SCROLL
   ========================================== */
function initLenis() {
    if (lenis) lenis.destroy();

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // power4.out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.0
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

/* ==========================================
   CUSTOM CURSOR LOGIC
   ========================================== */
function initCursor() {
    polishCursor = document.getElementById('polish-cursor');
    if (!polishCursor || window.matchMedia('(hover: none)').matches) return;

    gsap.set(polishCursor, { xPercent: -50, yPercent: -50 });

    xTo = gsap.quickTo(polishCursor, "x", { duration: 0.12, ease: "power3" });
    yTo = gsap.quickTo(polishCursor, "y", { duration: 0.12, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    // Squash on mousedown, stretch/snap on mouseup
    window.addEventListener('mousedown', () => {
        const avatar = polishCursor.querySelector('.cursor-avatar');
        if (avatar) {
            gsap.to(avatar, {
                scaleY: 0.8,
                scaleX: 1.2,
                duration: 0.1,
                ease: "power2.out"
            });
        }
    });

    window.addEventListener('mouseup', () => {
        const avatar = polishCursor.querySelector('.cursor-avatar');
        if (avatar) {
            gsap.to(avatar, {
                scaleY: 1.0,
                scaleX: 1.0,
                duration: 0.25,
                ease: "back.out(2)"
            });
        }
    });

    setupCursorHoverEvents();
}

function setupCursorHoverEvents() {
    if (!polishCursor) return;

    const hoverTargets = document.querySelectorAll('a, button, .peek-card, .ig-card, .brand-box, .qf, .tk, .ip, .nav-logo');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            const avatar = polishCursor.querySelector('.cursor-avatar');
            if (avatar) {
                gsap.to(avatar, {
                    scale: 1.2,
                    rotation: 12, // Head tilt on hover
                    duration: 0.25,
                    ease: "power2.out"
                });
            }
        });

        target.addEventListener('mouseleave', () => {
            const avatar = polishCursor.querySelector('.cursor-avatar');
            if (avatar) {
                gsap.to(avatar, {
                    scale: 1.0,
                    rotation: 0,
                    duration: 0.25,
                    ease: "power2.out"
                });
            }
        });
    });
}

/* ==========================================
   PAGE ANIMATIONS INITIALIZATION
   ========================================== */
function initPageAnimations() {
    // Clean old ScrollTriggers
    ScrollTrigger.getAll().forEach(t => t.kill());

    const activeNamespace = document.querySelector('[data-barba="container"]')?.getAttribute('data-barba-namespace') || 'home';

    // 1. SPLITTYPE HEADINGS
    initHeadingTypography();

    // 2. VIEWPORT ENTRANCES
    initScrollEntrances();

    // 3. HOME SPECIFIC: HERO PHOTO 3D TILT & PARALLAX
    if (activeNamespace === 'home') {
        initHomeHeroParallax();
    }

    // 4. SEAMLESS MARQUEES
    initMarquees();

    // 5. HOVER SCALING TARGETS
    initHoverScales();
}

/* ==========================================
   SPLITTYPE HEADINGS
   ========================================== */
function initHeadingTypography() {
    // Split H1 into characters for loading stagger
    const h1s = document.querySelectorAll('h1');
    h1s.forEach(h1 => {
        const split = new SplitType(h1, { types: 'chars,lines' });
        
        // Wrap chars/lines to hide overflow
        split.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.className = 'line-wrapper';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        gsap.from(split.chars, {
            y: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.03,
            delay: 0.2
        });
    });

    // Split H2 into words for scroll-trigger animations
    const h2s = document.querySelectorAll('h2');
    h2s.forEach(h2 => {
        const split = new SplitType(h2, { types: 'words,lines' });
        
        split.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.className = 'line-wrapper';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        gsap.from(split.words, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.04,
            scrollTrigger: {
                trigger: h2,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
}

/* ==========================================
   SCROLL-TRIGGER ENTRANCE ANIMATIONS
   ========================================== */
function initScrollEntrances() {
    // Main Body Paragraphs
    const paragraphs = document.querySelectorAll('main p, section p, .resume-hero-about, .contact-tagline');
    paragraphs.forEach(p => {
        gsap.fromTo(p, 
            { opacity: 0, y: 15 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: p,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Content Images (ignoring logo)
    const images = document.querySelectorAll('img:not(.nav-logo img)');
    images.forEach(img => {
        gsap.fromTo(img, 
            { opacity: 0, scale: 0.96 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.7, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: img,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Cards / Timeline items / Groupings
    const cardGroups = [
        '.peek-grid .peek-card',
        '.new-skills-grid .new-skill-card',
        '.resume-timeline-item',
        '.resume-edu-item',
        '.resume-skill-group',
        '.project-block',
        '.stats .stat',
        '.owned .row',
        '.ip-grid .ip',
        '.take-grid .tk'
    ];

    cardGroups.forEach(groupSelector => {
        const cards = document.querySelectorAll(groupSelector);
        if (cards.length > 0) {
            ScrollTrigger.batch(cards, {
                onEnter: batch => gsap.fromTo(batch, 
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1, overwrite: "auto" }
                ),
                start: "top 85%"
            });
        }
    });
}

/* ==========================================
   HOME HERO: 3D PHOTO PARALLAX & TILT
   ========================================== */
function initHomeHeroParallax() {
    const heroPhotoContainer = document.querySelector('.hero-right');
    const heroPhoto = document.querySelector('.hero-right img');
    if (!heroPhotoContainer || !heroPhoto) return;

    // 1. 3D cursor-follow tilt
    heroPhotoContainer.addEventListener('mousemove', (e) => {
        const rect = heroPhotoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees tilt
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(heroPhoto, {
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    heroPhotoContainer.addEventListener('mouseleave', () => {
        gsap.to(heroPhoto, {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
            duration: 0.5,
            ease: "power2.out"
        });
    });

    // 2. Slow scale scroll parallax
    gsap.to(heroPhoto, {
        scale: 1.05,
        scrollTrigger: {
            trigger: heroPhotoContainer,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

/* ==========================================
   LOOPING MARQUEES
   ========================================== */
function initMarquees() {
    const marquees = document.querySelectorAll('.marquee-container, .brands-marquee-container');
    marquees.forEach(marquee => {
        const track = marquee.querySelector('.marquee-content, .marquee-track');
        if (!track) return;

        // Clone elements for infinite seamless illusion if needed
        const clone = track.cloneNode(true);
        marquee.appendChild(clone);

        gsap.set(marquee, { display: 'flex', overflow: 'hidden' });
        
        const direction = track.classList.contains('marquee-right') ? 1 : -1;
        const distance = track.offsetWidth;

        gsap.to([track, clone], {
            x: (i) => direction * distance + 'px',
            duration: 25,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % distance)
            }
        });
    });
}

/* ==========================================
   HOVER TARGET SCALING
   ========================================== */
function initHoverScales() {
    const scaleTargets = document.querySelectorAll('.peek-card, .ig-card, .brand-box, .stat, .tk, .ip, .sr-pill:not(.ghost)');
    scaleTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            gsap.to(target, {
                scale: 1.03,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        target.addEventListener('mouseleave', () => {
            gsap.to(target, {
                scale: 1.0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });
}

/* ==========================================
   BARBA.JS TRANSITIONS
   ========================================== */
function initBarba() {
    if (typeof barba === 'undefined') return;

    const overlay = document.getElementById('barba-transition-overlay');

    barba.init({
        transitions: [{
            name: 'fade-transition',
            async leave(data) {
                // Fade out current page content via overlay
                await gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            },
            async enter(data) {
                // Scroll window to top instantly before showing new page
                window.scrollTo(0, 0);
                if (lenis) lenis.scrollTo(0, { immediate: true });

                // Fade in new page content
                await gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            },
            async after(data) {
                // 1. Re-initialize page specific animations
                initPageAnimations();

                // 2. Re-attach cursor hover trigger bindings
                setupCursorHoverEvents();
            }
        }]
    });
}
