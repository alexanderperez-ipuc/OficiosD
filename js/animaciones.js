// ============================================
// animaciones.js - Efectos visuales y UI
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===== Botón "Volver arriba" =====
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ===== Efecto de fade-in al hacer scroll (opcional) =====
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Aplicar a las secciones
        document.querySelectorAll('.section-header, .oficio-card, .acerca-card').forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Añadir clase fade-in
        document.addEventListener('fade-in', function(e) {
            // Esta clase se activa cuando el elemento es visible
        });

        // Sobrescribir el observer con una función manual
        const origObserve = observer.observe.bind(observer);
        observer.observe = function(el) {
            // Si ya está visible, aplicamos inmediatamente
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
            origObserve(el);
        };

        // Re-evaluar elementos ya observados
        document.querySelectorAll('.section-header, .oficio-card, .acerca-card').forEach(function(el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });

        // ===== Efecto de resaltado en enlaces del menú (ya en menu.js) =====

        // ===== Mejora: Scroll suave para enlaces internos =====
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.length > 1) {
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const offset = 80; // altura del header sticky
                        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            });
        });

        // ===== Contador de oficios visible en el hero (ya estático) =====
        // Podría ser dinámico pero ya está en HTML

    });

    // Añadir clase fade-in cuando el elemento es visible (para IntersectionObserver)
    const styleFade = document.createElement('style');
    styleFade.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleFade);

})();