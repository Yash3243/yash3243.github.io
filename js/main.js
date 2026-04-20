document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('cursor-dot');
    const aura = document.getElementById('cursor-aura');
    
    let mouseX = 0;
    let mouseY = 0;
    let auraX = 0;
    let auraY = 0;
    
    // Lerp factor (0 to 1). Lower = more inertia/lag.
    const lerpFactor = 0.15;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Animation loop for Aura (Inertia effect)
    function animateCursor() {
        // Linear Interpolation: Current + (Target - Current) * Factor
        auraX += (mouseX - auraX) * lerpFactor;
        auraY += (mouseY - auraY) * lerpFactor;
        
        aura.style.left = `${auraX}px`;
        aura.style.top = `${auraY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover Scaling logic
    const interactables = document.querySelectorAll('a, button, .peek-card, .ig-card, .view-link');
    
    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // Click Animation
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
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
});
