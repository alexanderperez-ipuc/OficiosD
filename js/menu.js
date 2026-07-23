// ============================================
// menu.js - Menú responsivo
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.nav-menu a');

        // Alternar menú
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function() {
                const isOpen = mainNav.classList.toggle('open');
                this.setAttribute('aria-expanded', isOpen);
                this.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });
        }

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (mainNav && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                // Marcar enlace activo
                navLinks.forEach(function(l) { l.classList.remove('active'); });
                this.classList.add('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (mainNav && mainNav.classList.contains('open')) {
                const target = e.target;
                if (!mainNav.contains(target) && !menuToggle.contains(target)) {
                    mainNav.classList.remove('open');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });

        // Marcar enlace activo según scroll (opcional)
        const sections = document.querySelectorAll('section[id]');
        if (sections.length > 0) {
            window.addEventListener('scroll', function() {
                let current = '';
                sections.forEach(function(section) {
                    const sectionTop = section.offsetTop - 120;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            });
        }
    });

})();