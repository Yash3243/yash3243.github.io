// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initMagneticButtons();
});

/**
 * Reveal animations as user scrolls down the page
 */
function initScrollReveals() {
    // Reveal headers and text sections
    const revealElements = document.querySelectorAll('.hero-name, .hero-tagline, .hero-buttons, .who-content, .brag-box, .peek-card, .section-title, .work-block, .contact-left, .contact-right');
    
    revealElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Special staggered reveal for pills
    const pillContainers = document.querySelectorAll('.hero-pills, .peek-tags, .skill-group');
    pillContainers.forEach(container => {
        gsap.from(container.children, {
            scrollTrigger: {
                trigger: container,
                start: 'top 90%'
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    });
}

/**
 * Magnetic button effect for high-end interaction
 */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly towards mouse
            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            // Snap back to center
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}
