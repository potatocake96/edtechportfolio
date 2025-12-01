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

})();

