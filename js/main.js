/* ==========================================
   MAIN APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PAGE LOADER
    // ==========================================
    const loader = document.getElementById('pageLoader');
    const loaderBar = document.getElementById('loaderBar');
    let progress = 0;

    const loaderInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loaderInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }
        loaderBar.style.width = progress + '%';
    }, 200);

    // Prevent scrolling during load
    document.body.style.overflow = 'hidden';

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });

    // Smooth cursor outline follow
    function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.12;
        outlineY += (cursorY - outlineY) * 0.12;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .skill-tag, .social-link, .nav-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('active');
            cursorOutline.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
            cursorOutline.classList.remove('active');
        });
    });

    // ==========================================
    // NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active nav link on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // ==========================================
    // TITLE ROTATOR
    // ==========================================
    const titles = document.querySelectorAll('.hero-title');
    let currentTitle = 0;

    function rotateTitle() {
        titles[currentTitle].classList.remove('active');
        currentTitle = (currentTitle + 1) % titles.length;
        titles[currentTitle].classList.add('active');
    }

    setInterval(rotateTitle, 2500);

    // ==========================================
    // STAT COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 40;
            const duration = 1500;
            const stepTime = duration / 40;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, stepTime);
        });

        statsCounted = true;
    }

    // Trigger counter when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 3000); // After loader + hero animation
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    heroObserver.observe(document.getElementById('hero'));

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('btnSubmit');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        
        // Simulate send (replace with actual backend integration)
        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #22d3ee)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                contactForm.reset();
            }, 2500);
        }, 1500);
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // RIPPLE EFFECT ON BUTTONS
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const wave = document.createElement('span');
            wave.classList.add('ripple-wave');
            wave.style.left = (e.clientX - rect.left) + 'px';
            wave.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(wave);
            setTimeout(() => wave.remove(), 600);
        });
    });

    // ==========================================
    // PARTICLE TRAIL ON MOUSE
    // ==========================================
    let trailThrottle = 0;
    document.addEventListener('mousemove', (e) => {
        trailThrottle++;
        if (trailThrottle % 4 !== 0) return; // Reduce frequency

        const trail = document.createElement('div');
        trail.className = 'particle-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        
        // Random color
        const colors = ['rgba(0, 212, 255, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.5)'];
        trail.style.background = colors[Math.floor(Math.random() * colors.length)];
        trail.style.width = Math.random() * 4 + 2 + 'px';
        trail.style.height = trail.style.width;

        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 800);
    });

    // ==========================================
    // TILT EFFECT ON GLASS CARDS
    // ==========================================
    const tiltCards = document.querySelectorAll('.about-card, .cert-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // ==========================================
    // ADD GRID BACKGROUND TO BODY
    // ==========================================
    document.body.classList.add('grid-bg');

    // ==========================================
    // VISIBILITY CHECK – PAUSE ANIMATIONS WHEN TAB IS HIDDEN
    // ==========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Could pause heavy animations here
        }
    });

    console.log('%c🚀 Souvik Kundu Portfolio Loaded!', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
});
