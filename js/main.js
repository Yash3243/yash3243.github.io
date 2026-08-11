document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('cursor-dot');
    const aura = document.getElementById('cursor-aura');
    
    if (dot) {
        dot.style.display = 'block'; // Show dot for click precision
        dot.style.backgroundColor = 'var(--color-accent-pink)';
    }

    // Inject avatar container dynamically
    let avatar = null;
    if (aura) {
        avatar = document.createElement('div');
        avatar.className = 'cursor-avatar';
        aura.appendChild(avatar);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let auraX = 0;
    let auraY = 0;
    
    // Lerp factor (0 to 1). Lower = more inertia/lag/smoothness.
    const lerpFactor = 0.10;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) {
            dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }
    });

    // Animation loop for Aura (Inertia effect)
    function animateCursor() {
        auraX += (mouseX - auraX) * lerpFactor;
        auraY += (mouseY - auraY) * lerpFactor;
        
        if (aura) {
            aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate(-50%, -50%)`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover Scaling and tilting logic
    const interactables = document.querySelectorAll('a, button, .peek-card, .ig-card, .view-link, .brand-box, .ip, .tk, .qf, .stat');
    
    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (avatar) {
                gsap.to(avatar, {
                    scale: 1.25,
                    rotation: 12, // Playful head-tilt
                    duration: 0.25,
                    ease: "power2.out"
                });
            }
        });
        item.addEventListener('mouseleave', () => {
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

    // Click Squash & Stretch
    document.addEventListener('mousedown', () => {
        if (avatar) {
            gsap.to(avatar, {
                scaleY: 0.8,
                scaleX: 1.2,
                duration: 0.1,
                ease: "power2.out"
            });
        }
    });
    document.addEventListener('mouseup', () => {
        if (avatar) {
            gsap.to(avatar, {
                scaleY: 1.0,
                scaleX: 1.0,
                duration: 0.25,
                ease: "back.out(2)"
            });
        }
    });

    // Brand "Sticker" Interactivity
    const brandBoxes = document.querySelectorAll('.brand-box');
    brandBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 8;
            const tiltY = (centerX - x) / 8;
            
            box.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // Handle initial cursor position
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    auraX = mouseX;
    auraY = mouseY;

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth Scroll Animations for Sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Select all main sections and custom reveal classes (excluding GrowthSchool sections to prevent animation conflicts)
    document.querySelectorAll('section:not(.growthschool-internship-details section), .contact-main, .resume-hero, .resume-content, .work-grid').forEach(el => {
        el.classList.add('pre-reveal');
        observer.observe(el);
    });
});
