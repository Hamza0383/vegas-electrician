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
    const dropdownParent = document.querySelector('.has-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

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

      // Close dropdown when closing menu
      if (isExpanded && dropdownParent) {
        dropdownParent.classList.remove('active');
      }
    });

    // ========================================
    // MOBILE DROPDOWN TOGGLE
    // ========================================
    if (dropdownToggle && dropdownParent) {
      dropdownToggle.addEventListener('click', function(e) {
        // Only work on mobile
        if (window.innerWidth > 768) {
          e.preventDefault(); // Still prevent # navigation on desktop
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Toggle dropdown - explicit check
        if (dropdownParent.classList.contains('active')) {
          dropdownParent.classList.remove('active');
        } else {
          dropdownParent.classList.add('active');
        }
      });
    }

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

        // Close dropdown
        if (dropdownParent) {
          dropdownParent.classList.remove('active');
        }
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

        // Close dropdown
        if (dropdownParent) {
          dropdownParent.classList.remove('active');
        }
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

        // Close dropdown
        if (dropdownParent) {
          dropdownParent.classList.remove('active');
        }
      });
    });

    // ========================================
    // HIGHLIGHT ACTIVE PAGE
    // ========================================
    highlightActivePage();

    function highlightActivePage() {
      const currentPath = window.location.pathname;
      const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

      navLinks.forEach(function(link) {
        const linkPath = link.getAttribute('href');
        link.classList.remove('active');

        if (linkPath === currentPage ||
            (currentPage === '' && linkPath === 'index.html') ||
            (currentPage === '/' && linkPath === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  }

})();
