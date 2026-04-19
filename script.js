/* ============================================
   Vegas Electrician - script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     HAMBURGER MENU TOGGLE
     ============================================ */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  function openMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Close all dropdowns
    document.querySelectorAll('.nav-item.dropdown-open').forEach(function (item) {
      item.classList.remove('dropdown-open');
    });
  }

  /* ============================================
     CLOSE MENU WHEN NAV LINK CLICKED
     ============================================ */
  document.querySelectorAll('.nav-link:not([data-dropdown]), .dropdown-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 1024) {
        closeMenu();
      }
    });
  });

  /* ============================================
     DROPDOWN TOGGLE (MOBILE + DESKTOP CLICK)
     ============================================ */
  document.querySelectorAll('.nav-link[data-dropdown]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const parentItem = this.closest('.nav-item');
      const isOpen = parentItem.classList.contains('dropdown-open');

      // Close all dropdowns
      document.querySelectorAll('.nav-item.dropdown-open').forEach(function (item) {
        item.classList.remove('dropdown-open');
      });

      if (!isOpen) {
        parentItem.classList.add('dropdown-open');
      }
    });
  });

  /* ============================================
     CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
     ============================================ */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.site-header') && navMenu && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ============================================
     STICKY HEADER (ADD .scrolled CLASS)
     ============================================ */
  const header = document.querySelector('.site-header');

  if (header) {
    function handleScroll() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load
  }

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const faqItem = this.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQs
      document.querySelectorAll('.faq-item.active').forEach(function (item) {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked FAQ
      if (!isActive) {
        faqItem.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================
     INTERSECTIONOBSERVER - ANIMATE ON SCROLL
     ============================================ */
  const animateElements = document.querySelectorAll('.animate-fade');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: make all visible immediately
    animateElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        if (navMenu && navMenu.classList.contains('open')) {
          closeMenu();
        }
      }
    });
  });

  /* ============================================
     CLOSE DROPDOWNS ON OUTSIDE CLICK (DESKTOP)
     ============================================ */
  document.addEventListener('click', function (e) {
    if (window.innerWidth >= 1024) {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-item.dropdown-open').forEach(function (item) {
          item.classList.remove('dropdown-open');
        });
      }
    }
  });

  /* ============================================
     RESIZE: RESET MENU STATE
     ============================================ */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= 1024) {
        if (navMenu) {
          navMenu.classList.remove('open');
        }
        if (hamburger) {
          hamburger.classList.remove('active');
        }
        document.body.style.overflow = '';
      }
    }, 150);
  });

  /* ============================================
     STICKY CALL BUTTON – JS POSITION ENFORCER
     Inline styles override every CSS rule so
     nothing in the cascade can hide the button.
     ============================================ */
  var callBtn = document.querySelector('.sticky-call-btn');
  if (callBtn) {
    function positionCallBtn() {
      var isMobile = window.innerWidth < 768;
      if (isMobile) {
        callBtn.style.cssText = [
          'position:fixed',
          'bottom:0',
          'left:0',
          'right:0',
          'width:100%',
          'z-index:9999',
          'display:flex',
          'align-items:center',
          'justify-content:center',
          'gap:10px',
          'min-height:64px',
          'padding:16px 20px',
          'background:#c2410c',
          'color:#fff',
          'font-weight:700',
          'font-size:1.1rem',
          'font-family:inherit',
          'text-decoration:none',
          'border-radius:0',
          'box-shadow:0 -4px 20px rgba(0,0,0,0.5)',
          'cursor:pointer'
        ].join(';');
        document.body.style.paddingBottom = '90px';
      } else {
        callBtn.style.cssText = [
          'position:fixed',
          'bottom:32px',
          'right:32px',
          'left:auto',
          'width:auto',
          'z-index:9999',
          'display:flex',
          'align-items:center',
          'justify-content:center',
          'gap:10px',
          'padding:14px 26px',
          'background:#c2410c',
          'color:#fff',
          'font-weight:700',
          'font-size:0.95rem',
          'font-family:inherit',
          'text-decoration:none',
          'border-radius:50px',
          'box-shadow:0 6px 28px rgba(194,65,12,0.45)',
          'cursor:pointer'
        ].join(';');
        document.body.style.paddingBottom = '';
      }
    }

    positionCallBtn();

    // Re-run after first paint and after full load (catches mobile browser timing issues)
    requestAnimationFrame(positionCallBtn);
    window.addEventListener('load', positionCallBtn);

    // Re-run on first scroll (iOS Safari fix: position:fixed can misfire until interaction)
    var scrollFixApplied = false;
    window.addEventListener('scroll', function () {
      if (!scrollFixApplied) {
        scrollFixApplied = true;
        positionCallBtn();
      }
    }, { passive: true });

    var resizeDebounce;
    window.addEventListener('resize', function () {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(positionCallBtn, 100);
    });
  }

  /* ============================================
     CONTACT FORM - BASIC VALIDATION FEEDBACK
     ============================================ */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ef4444';
          setTimeout(function () {
            field.style.borderColor = '';
          }, 3000);
        }
      });

      if (isValid) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Message Sent!';
          submitBtn.disabled = true;
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 4000);
        }
      }
    });
  }

});
