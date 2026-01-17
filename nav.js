/**
 * Mobile Navigation - Complete Rewrite
 * Handles hamburger menu toggle and dropdown functionality
 */

(function() {
  'use strict';

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Get elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownParents = document.querySelectorAll('.has-dropdown');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Exit if elements don't exist
    if (!navToggle || !navMenu) return;

    // ========================================
    // HAMBURGER MENU TOGGLE
    // ========================================
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

      // Toggle menu
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');

      // Update button text
      const buttonText = navToggle.querySelector('.visually-hidden');
      if (buttonText) {
        buttonText.textContent = isExpanded ? 'Open menu' : 'Close menu';
      }

      // Close all dropdowns when closing menu
      if (isExpanded) {
        dropdownParents.forEach(function(dropdown) {
          dropdown.classList.remove('active');
        });
      }
    });

    // ========================================
    // MOBILE DROPDOWN TOGGLE
    // ========================================
    dropdownToggles.forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        const parentDropdown = toggle.closest('.has-dropdown');

        // Only work on mobile
        if (window.innerWidth > 768) {
          e.preventDefault(); // Still prevent # navigation on desktop
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns first
        dropdownParents.forEach(function(dropdown) {
          if (dropdown !== parentDropdown) {
            dropdown.classList.remove('active');
          }
        });

        // Toggle this dropdown
        if (parentDropdown.classList.contains('active')) {
          parentDropdown.classList.remove('active');
        } else {
          parentDropdown.classList.add('active');
        }
      });
    });

    // ========================================
    // CLOSE MENU ON OUTSIDE CLICK
    // ========================================
    document.addEventListener('click', function(e) {
      // Check if click is outside nav
      const clickedInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);

      if (!clickedInsideNav && navMenu.classList.contains('active')) {
        // Close menu
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');

        // Update button text
        const buttonText = navToggle.querySelector('.visually-hidden');
        if (buttonText) {
          buttonText.textContent = 'Open menu';
        }

        // Close all dropdowns
        dropdownParents.forEach(function(dropdown) {
          dropdown.classList.remove('active');
        });
      }
    });

    // ========================================
    // CLOSE MENU ON ESC KEY
    // ========================================
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();

        // Update button text
        const buttonText = navToggle.querySelector('.visually-hidden');
        if (buttonText) {
          buttonText.textContent = 'Open menu';
        }

        // Close all dropdowns
        dropdownParents.forEach(function(dropdown) {
          dropdown.classList.remove('active');
        });
      }
    });

    // ========================================
    // CLOSE MENU WHEN CLICKING NAV LINKS
    // ========================================
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function(link) {
      // Skip dropdown toggle
      if (link.classList.contains('dropdown-toggle')) return;

      link.addEventListener('click', function() {
        // Only close on mobile
        if (window.innerWidth > 768) return;

        // Close menu
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');

        // Update button text
        const buttonText = navToggle.querySelector('.visually-hidden');
        if (buttonText) {
          buttonText.textContent = 'Open menu';
        }

        // Close all dropdowns
        dropdownParents.forEach(function(dropdown) {
          dropdown.classList.remove('active');
        });
      });
    });

    // ========================================
    // HIGHLIGHT ACTIVE PAGE
    // ========================================
    highlightActivePage();

    function highlightActivePage() {
      const currentPath = window.location.pathname;
      // Normalize path: remove trailing slash and .html extension for comparison
      const normalizedPath = currentPath.replace(/\/$/, '').replace(/\.html$/, '') || '/';

      navLinks.forEach(function(link) {
        const linkHref = link.getAttribute('href');
        // Normalize link href the same way
        const normalizedLink = linkHref.replace(/\/$/, '').replace(/\.html$/, '') || '/';

        link.classList.remove('active');

        // Compare normalized paths
        if (normalizedPath === normalizedLink ||
            (normalizedPath === '' && normalizedLink === '/') ||
            (normalizedPath === '/' && normalizedLink === '')) {
          link.classList.add('active');
        }
      });
    }
  }

})();
