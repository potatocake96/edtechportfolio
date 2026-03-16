/* ============================================
   ED TECH CONSULTANCY - MAIN JAVASCRIPT
   Handles interactions, parallax, and animations
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const menuLinks = navbarMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
      });
    });
  }

  // ============================================
  // PARALLAX SCROLLING
  // ============================================
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  const parallaxImages = document.querySelectorAll('.parallax-image');
  
  let ticking = false;
  
  function updateParallax() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax background elements
    parallaxElements.forEach(element => {
      const parent = element.closest('.parallax-section');
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementHeight = rect.height;
        
        if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
          const scrolled = scrollTop - elementTop;
          const rate = scrolled * 0.3;
          element.style.transform = `translateY(${rate}px)`;
        }
      }
    });
    
    // Parallax hero image
    parallaxImages.forEach(image => {
      const rect = image.getBoundingClientRect();
      const imageTop = rect.top + scrollTop;
      const imageHeight = rect.height;
      
      if (scrollTop + windowHeight > imageTop && scrollTop < imageTop + imageHeight) {
        const scrolled = scrollTop - imageTop;
        const rate = scrolled * 0.4;
        image.style.transform = `translateY(${rate}px)`;
      }
    });
    
    ticking = false;
  }
  
  if (parallaxElements.length > 0 || parallaxImages.length > 0) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
    
    // Initial call
    updateParallax();
  }

  // ============================================
  // CURSOR HALO ON INTERACTIVE ELEMENTS
  // ============================================
  (function initCursorHalo() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion && prefersReducedMotion.matches) return;

    const halo = document.createElement('div');
    halo.className = 'cursor-halo';
    document.body.appendChild(halo);

    let isActive = false;

    function setActive(active) {
      if (active === isActive) return;
      isActive = active;
      halo.classList.toggle('cursor-halo--active', isActive);
    }

    // Track pointer position
    document.addEventListener('pointermove', (event) => {
      halo.style.left = `${event.clientX}px`;
      halo.style.top = `${event.clientY}px`;
    });

    const interactiveSelector = '.btn, .card, .tool-card, .impact-card, .accordion-trigger';

    // Activate halo when hovering interactive elements
    document.addEventListener('pointerover', (event) => {
      const target = event.target.closest(interactiveSelector);
      setActive(Boolean(target));
    });

    document.addEventListener('pointerout', (event) => {
      const related = event.relatedTarget && event.relatedTarget.closest
        ? event.relatedTarget.closest(interactiveSelector)
        : null;
      if (!related) {
        setActive(false);
      }
    });
  })();

  // ============================================
  // SCROLL ANIMATIONS (Fade in on scroll)
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        // Ensure opacity stays at 1 after animation completes
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with data-animate attribute
  document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('[data-animate]');
    animateElements.forEach(el => {
      // Set initial state
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      observer.observe(el);
    });
  });

  // ============================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // FORM VALIDATION
  // ============================================
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      
      let isValid = true;
      
      if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
      } else {
        clearError(name);
      }
      
      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'Valid email is required');
        isValid = false;
      } else {
        clearError(email);
      }
      
      if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
      } else {
        clearError(message);
      }
      
      if (isValid) {
        // In a real implementation, this would submit to a backend
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
      }
    });
  }

  function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--color-accent-red)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = 'var(--color-accent-red)';
  }

  function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.form-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    input.style.borderColor = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============================================
  // ACTIVE NAVIGATION LINK HIGHLIGHTING
  // ============================================
  function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath.includes('index.html')) ||
          (currentPath.includes(linkPath.replace('.html', '')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Update on page load
  document.addEventListener('DOMContentLoaded', updateActiveNavLink);

  // ============================================
  // HERO HEADLINE: STAGGERED WORD REVEAL (index only)
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    const heroHeadline = document.querySelector('[data-hero-headline]');
    if (!heroHeadline || heroHeadline.querySelector('.hero-headline-word')) return;
    const text = heroHeadline.textContent.trim();
    heroHeadline.textContent = '';
    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'hero-headline-word';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word;
      span.style.animationDelay = `${i * 0.12}s`;
      heroHeadline.appendChild(span);
    });
  });

  // ============================================
  // NAVBAR BRAND TYPEWRITER (Simon Dass)
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    const brand = document.querySelector('.navbar-brand');
    if (!brand || brand.querySelector('.navbar-brand-typed')) return;
    const text = brand.textContent.trim();
    brand.textContent = '';
    const typedSpan = document.createElement('span');
    typedSpan.className = 'navbar-brand-typed';
    typedSpan.setAttribute('aria-hidden', 'true');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'navbar-brand-cursor';
    cursorSpan.setAttribute('aria-hidden', 'true');
    brand.appendChild(typedSpan);
    brand.appendChild(cursorSpan);
    let i = 0;
    function type() {
      if (i < text.length) {
        typedSpan.textContent += text[i];
        i++;
        setTimeout(type, 90);
      } else {
        cursorSpan.classList.add('visible');
      }
    }
    type();
  });

  // ============================================
  // SCROLL-TRIGGERED TYPEWRITER FOR SUBHEADINGS
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    const typewriterHeadings = document.querySelectorAll('[data-typewriter]');
    if (typewriterHeadings.length === 0) return;

    const typewriterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.typewriterDone === 'true') return;
        entry.target.dataset.typewriterDone = 'true';
        runHeadingTypewriter(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    typewriterHeadings.forEach((el) => typewriterObserver.observe(el));

    function runHeadingTypewriter(heading) {
      const text = heading.textContent.trim();
      heading.textContent = '';

      const typedSpan = document.createElement('span');
      typedSpan.className = 'typewriter-typed';
      typedSpan.setAttribute('aria-hidden', 'true');

      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'typewriter-cursor';
      cursorSpan.setAttribute('aria-hidden', 'true');

      heading.appendChild(typedSpan);
      heading.appendChild(cursorSpan);

      let i = 0;
      const charDelay = 45;

      function type() {
        if (i < text.length) {
          typedSpan.textContent += text[i];
          i++;
          setTimeout(type, charDelay);
        } else {
          cursorSpan.classList.add('visible');
          setTimeout(() => {
            cursorSpan.style.animation = 'none';
            cursorSpan.style.opacity = '0';
            cursorSpan.style.width = '0';
            cursorSpan.style.marginLeft = '0';
          }, 2200);
        }
      }
      type();
    }
  });

  // ============================================
  // ROLE / AUDIENCE VIEW — central logic
  // ============================================
  const ROLE_LABELS = { all: 'Everyone', principal: 'Principal', teacher: 'Teacher', it: 'IT / Data lead' };
  const AUDIENCE_KEY = 'audienceView';

  // Role-specific emojis (dry humor: paperwork, coffee, firewalls…)
  const ROLE_EMOJIS = {
    all: ['📚', '✨', '🤝', '📋', '☕', '🔒'],
    principal: ['📊', '📋', '👔', '📈', '📑', '🔍'],
    teacher: ['📝', '☕', '✏️', '📚', '🌱', '📄'],
    it: ['🔒', '🛡️', '⚙️', '💾', '🔐', '📁']
  };

  function spawnRoleConfetti(audience, originX, originY) {
    const emojis = ROLE_EMOJIS[audience] || ROLE_EMOJIS.all;
    const container = document.createElement('div');
    container.className = 'role-confetti';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    const origin = { x: originX ?? window.innerWidth / 2, y: originY ?? window.innerHeight / 2 };
    const count = 42;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'role-confetti-emoji';
      el.textContent = emojis[i % emojis.length];
      el.style.left = origin.x + (Math.random() - 0.5) * 40 + 'px';
      el.style.top = origin.y + (Math.random() - 0.5) * 40 + 'px';
      const angle = Math.random() * Math.PI * 2;
      const force = 220 + Math.random() * 380;
      const dx = Math.cos(angle) * force;
      const dy = Math.sin(angle) * force - 120;
      const rot = (Math.random() - 0.5) * 1800;
      el.style.setProperty('--confetti-dx', dx + 'px');
      el.style.setProperty('--confetti-dy', dy + 'px');
      el.style.setProperty('--confetti-rot', rot + 'deg');
      el.style.animationDelay = (Math.random() * 0.08) + 's';
      el.style.animationDuration = (2.0 + Math.random() * 0.6) + 's';
      container.appendChild(el);
    }

    setTimeout(() => container.remove(), 3200);
  }

  function setRole(audience, options) {
    const fromUser = options?.fromUser === true;
    if (fromUser) {
      if (audience === 'all') {
        document.body.removeAttribute('data-audience-view');
        sessionStorage.removeItem(AUDIENCE_KEY);
      } else {
        document.body.setAttribute('data-audience-view', audience);
        sessionStorage.setItem(AUDIENCE_KEY, audience);
      }
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (!prefersReducedMotion) {
        const overlay = document.createElement('div');
        overlay.className = 'role-switch-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 650);
        spawnRoleConfetti(audience, options?.clickX, options?.clickY);
      }
    }

    if (!fromUser) {
      if (audience === 'all') {
        document.body.removeAttribute('data-audience-view');
        sessionStorage.removeItem(AUDIENCE_KEY);
      } else {
        document.body.setAttribute('data-audience-view', audience);
        sessionStorage.setItem(AUDIENCE_KEY, audience);
      }
    }
    updateNavbarRoleIndicator();
    // Sync audience cards if present
    document.querySelectorAll('.audience-btn, .audience-card').forEach(b => {
      b.classList.toggle('active', b.dataset.audience === audience);
    });
    // Close navbar dropdown if open
    const menu = document.getElementById('navbar-role-menu');
    if (menu) {
      menu.hidden = true;
      const btn = document.getElementById('navbar-role-indicator');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    // Update contact form if present
    const audienceInput = document.getElementById('audience_view');
    const contactLabel = document.getElementById('contact-viewing-as');
    if (audienceInput) audienceInput.value = audience === 'all' ? '' : audience;
    if (contactLabel) {
      if (audience !== 'all') {
        contactLabel.textContent = 'Contacting as: ' + (ROLE_LABELS[audience] || audience);
        contactLabel.style.display = 'block';
      } else {
        contactLabel.style.display = 'none';
      }
    }
  }

  function updateNavbarRoleIndicator() {
    const el = document.getElementById('navbar-role-indicator');
    if (!el) return;
    const view = sessionStorage.getItem(AUDIENCE_KEY) || 'all';
    el.textContent = 'Viewing as: ' + (ROLE_LABELS[view] || ROLE_LABELS.all);
  }

  // ============================================
  // AUDIENCE FILTER + THEME SWITCHER
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Check URL param ?role=principal (etc.)
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam && ['principal', 'teacher', 'it', 'all'].includes(roleParam)) {
      setRole(roleParam);
      // Replace URL without reload (optional, keeps URL clean)
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.delete('role');
        window.history.replaceState({}, '', url.pathname + (url.search || ''));
      }
    } else {
      // 2. Restore persisted theme on load
      const saved = sessionStorage.getItem(AUDIENCE_KEY);
      if (saved && saved !== 'all') {
        setRole(saved); // Syncs body, cards, navbar, contact form
      } else {
        updateNavbarRoleIndicator();
        // Sync cards to 'all' and contact form
        document.querySelectorAll('.audience-btn, .audience-card').forEach(b => {
          b.classList.toggle('active', b.dataset.audience === 'all');
        });
        const audienceInput = document.getElementById('audience_view');
        const contactLabel = document.getElementById('contact-viewing-as');
        if (audienceInput) audienceInput.value = '';
        if (contactLabel) contactLabel.style.display = 'none';
      }
    }


    // 3. Audience cards (index, contact)
    const filterBtns = document.querySelectorAll('.audience-btn, .audience-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setRole(btn.dataset.audience || 'all', { fromUser: true, clickX: e.clientX, clickY: e.clientY });
        // Close role prompt overlay if open
        const overlay = document.getElementById('role-prompt-overlay');
        if (overlay?.classList.contains('is-visible')) {
          overlay.classList.remove('is-visible');
          overlay.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // 3b. Role prompt overlay — appears 2s after load on index
    const roleOverlay = document.getElementById('role-prompt-overlay');
    const isIndexPage = /\/$|\/index\.html$/i.test(window.location.pathname);
    if (roleOverlay && isIndexPage) {
      const showOverlay = () => {
        const view = sessionStorage.getItem(AUDIENCE_KEY) || 'all';
        roleOverlay.querySelectorAll('.audience-card').forEach(c => {
          c.classList.toggle('active', c.dataset.audience === view);
        });
        roleOverlay.classList.add('is-visible');
        roleOverlay.setAttribute('aria-hidden', 'false');
      };
      const hideOverlay = () => {
        roleOverlay.classList.remove('is-visible');
        roleOverlay.setAttribute('aria-hidden', 'true');
      };
      setTimeout(showOverlay, 2000);
      roleOverlay.querySelector('.role-prompt-overlay-backdrop')?.addEventListener('click', hideOverlay);
    }

    // 4. Navbar role dropdown
    const roleIndicator = document.getElementById('navbar-role-indicator');
    const roleMenu = document.getElementById('navbar-role-menu');
    const roleDropdown = roleIndicator?.closest('.navbar-role-dropdown');
    if (roleIndicator && roleMenu && roleDropdown) {
      function closeRoleMenu() {
        roleMenu.hidden = true;
        roleIndicator.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', outsideClickHandler);
      }
      function outsideClickHandler(e) {
        if (!roleDropdown.contains(e.target)) {
          closeRoleMenu();
        }
      }
      roleIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = roleMenu.hidden;
        roleMenu.hidden = !willOpen;
        roleIndicator.setAttribute('aria-expanded', willOpen);
        if (willOpen) {
          setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);
        } else {
          document.removeEventListener('click', outsideClickHandler);
        }
      });
      roleMenu.querySelectorAll('[role="menuitem"]').forEach(item => {
        item.addEventListener('click', (e) => {
          setRole(item.dataset.audience || 'all', { fromUser: true, clickX: e.clientX, clickY: e.clientY });
          closeRoleMenu();
        });
      });
    }
  });

  // ============================================
  // TABS
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    if (tabBtns.length === 0 || tabPanels.length === 0) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        tabPanels.forEach(panel => {
          const isActive = panel.id === targetId;
          panel.classList.toggle('active', isActive);
          panel.hidden = !isActive;
        });
      });
    });
  });

  // ============================================
  // ACCORDION
  // ============================================
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const item = trigger.closest('.accordion-item');
      const panel = item ? item.querySelector('.accordion-panel') : trigger.nextElementSibling;
      if (!panel) return;

      trigger.setAttribute('aria-expanded', !expanded);
      panel.setAttribute('aria-hidden', expanded);
    });
  });

  // ============================================
  // CAROUSEL
  // ============================================
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');

    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    goTo(0);
  });

  // ============================================
  // EXPAND ACCORDION ON HASH NAVIGATION (case studies)
  // ============================================
  function expandAccordionFromHash() {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const trigger = target.querySelector('.accordion-trigger');
    const panel = target.querySelector('.accordion-panel');
    if (trigger && panel && trigger.getAttribute('aria-expanded') === 'false') {
      trigger.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
    }
  }
  window.addEventListener('hashchange', expandAccordionFromHash);
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
      setTimeout(expandAccordionFromHash, 100);
    }
  });

})();

