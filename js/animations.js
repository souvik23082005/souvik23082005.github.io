/* ==========================================
   ANIMATIONS – GSAP for Hero, IntersectionObserver for scroll sections
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // HERO ANIMATIONS (GSAP Timeline)
    // ==========================================
    const heroTl = gsap.timeline({ delay: 2.8 });

    heroTl
        .from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
        .from('.hero-greeting', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.hero-name-text', { opacity: 0, y: 40, scale: 0.9, duration: 1, ease: 'power3.out' }, '-=0.3')
        .from('.hero-title-wrapper', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.hero-description', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.hero-cta .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.stat-item', { opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.hero-scroll', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.2');

    // ==========================================
    // SCROLL REVEAL using IntersectionObserver
    // ==========================================

    // Add reveal classes to elements
    const revealElements = [
        { selector: '.section-header', animation: 'reveal-up' },
        { selector: '.about-card', animation: 'reveal-up', stagger: true },
        { selector: '.info-item', animation: 'reveal-up', stagger: true },
        { selector: '.skill-card', animation: 'reveal-scale', stagger: true },
        { selector: '.skill-tag', animation: 'reveal-up', stagger: true },
        { selector: '.timeline-item', animation: 'reveal-left' },
        { selector: '.cert-card', animation: 'reveal-up', stagger: true },
        { selector: '.contact-info', animation: 'reveal-left' },
        { selector: '.contact-form-wrapper', animation: 'reveal-right' },
        { selector: '.contact-item', animation: 'reveal-up', stagger: true },
        { selector: '.category-title', animation: 'reveal-up' },
        { selector: '.skills-category', animation: 'reveal-up' },
        { selector: '.social-links', animation: 'reveal-up' },
    ];

    revealElements.forEach(({ selector, animation, stagger }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('reveal', animation);
            if (stagger) {
                el.style.transitionDelay = `${index * 0.08}s`;
            }
        });
    });

    // IntersectionObserver for reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ==========================================
    // SKILL BAR FILL ANIMATION
    // ==========================================
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 300);
                skillBarObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        skillBarObserver.observe(bar);
    });

    // ==========================================
    // PARALLAX on section headers (GSAP ScrollTrigger)
    // ==========================================
    gsap.utils.toArray('.section').forEach(section => {
        const header = section.querySelector('.section-header');
        if (header) {
            gsap.to(header, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5
                },
                y: -30,
                ease: 'none'
            });
        }
    });
});
