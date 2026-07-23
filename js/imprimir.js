// ============================================
// imprimir.js - Funcionalidad de impresión
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const btnPrint = document.getElementById('btnPrint');
        const btnPrintFooter = document.getElementById('btnPrintFooter');

        function imprimirPagina() {
            // Forzar que todos los acordeones estén abiertos para impresión
            const cards = document.querySelectorAll('.oficio-card');
            cards.forEach(function(card) {
                const body = card.querySelector('.oficio-body');
                const header = card.querySelector('.oficio-header');
                if (body && header) {
                    // Si no está abierto, lo abrimos y cargamos contenido
                    if (!card.classList.contains('open')) {
                        card.classList.add('open');
                        body.style.display = 'block';
                        header.setAttribute('aria-expanded', 'true');
                        if (!body.dataset.cargado) {
                            const oficioKey = card.dataset.oficio;
                            if (window.datosOficios && window.datosOficios[oficioKey]) {
                                const contentDiv = body.querySelector('.oficio-content');
                                if (contentDiv) {
                                    contentDiv.innerHTML = window.generarContenidoOficio(window.datosOficios[oficioKey]);
                                    body.dataset.cargado = 'true';
                                }
                            }
                        }
                    }
                }
            });

            // Esperar un momento para que los estilos de impresión se apliquen
            setTimeout(function() {
                window.print();
            }, 300);
        }

        if (btnPrint) {
            btnPrint.addEventListener('click', imprimirPagina);
        }

        if (btnPrintFooter) {
            btnPrintFooter.addEventListener('click', imprimirPagina);
        }

        // Atajo de teclado: Ctrl+P
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                // Dejar que el navegador maneje la impresión normal, pero podemos intervenir
                // Para mantener compatibilidad, no prevenimos el comportamiento por defecto
                // pero forzamos la apertura de acordeones antes de imprimir
                const cards = document.querySelectorAll('.oficio-card');
                cards.forEach(function(card) {
                    const body = card.querySelector('.oficio-body');
                    const header = card.querySelector('.oficio-header');
                    if (body && header && !card.classList.contains('open')) {
                        card.classList.add('open');
                        body.style.display = 'block';
                        header.setAttribute('aria-expanded', 'true');
                        if (!body.dataset.cargado) {
                            const oficioKey = card.dataset.oficio;
                            if (window.datosOficios && window.datosOficios[oficioKey]) {
                                const contentDiv = body.querySelector('.oficio-content');
                                if (contentDiv) {
                                    contentDiv.innerHTML = window.generarContenidoOficio(window.datosOficios[oficioKey]);
                                    body.dataset.cargado = 'true';
                                }
                            }
                        }
                    }
                });
            }
        });

        // Botón de volver arriba en impresión? no, pero lo añadimos en animaciones.js
    });

})();