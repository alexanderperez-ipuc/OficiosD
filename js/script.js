// ============================================
// script.js - Control principal
// ============================================

(function() {
    'use strict';

    // Función para inicializar todo cuando el DOM esté listo
    function init() {
        console.log('Supervisor-IPUC v1.0 cargado correctamente.');
        
        // Verificar que datos de oficios estén disponibles
        if (typeof window.datosOficios !== 'undefined' && window.datosOficios) {
            console.log('Oficios disponibles:', Object.keys(window.datosOficios).length);
        } else {
            console.warn('⚠️ datosOficios no encontrado. Verifica que datos-oficios.js esté cargado.');
        }

        // ===== Ajustes de accesibilidad =====
        configurarAccesibilidad();

        // ===== Prevenir comportamiento por defecto en enlaces vacíos =====
        configurarEnlaces();

        // ===== Actualizar año en el footer =====
        actualizarFooter();

        // ===== Cargar contenido de oficios abiertos =====
        cargarOficiosAbiertos();

        // ===== Detectar error en imagen del organigrama =====
        configurarOrganigrama();

        // ===== Inicializar tooltips =====
        configurarTooltips();

        // ===== Prevenir cierre del buscador al hacer clic dentro =====
        configurarBuscador();

        console.log('✅ Supervisor-IPUC listo.');
    }

    // ===== Configurar accesibilidad =====
    function configurarAccesibilidad() {
        document.querySelectorAll('.oficio-header').forEach(function(el) {
            if (!el.getAttribute('role')) {
                el.setAttribute('role', 'button');
            }
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    }

    // ===== Configurar enlaces =====
    function configurarEnlaces() {
        document.querySelectorAll('a[href="#"]').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
            });
        });

        // Scroll suave para enlaces internos
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(anchor) {
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
    }

    // ===== Actualizar footer con año actual =====
    function actualizarFooter() {
        const footerCopy = document.querySelector('.footer-copy');
        if (footerCopy) {
            const year = new Date().getFullYear();
            footerCopy.textContent = `© ${year} · Todos los derechos reservados`;
        }
    }

    // ===== Cargar contenido de oficios que ya están abiertos =====
    function cargarOficiosAbiertos() {
        document.querySelectorAll('.oficio-card.open').forEach(function(card) {
            const body = card.querySelector('.oficio-body');
            if (body && !body.dataset.cargado) {
                const oficioKey = card.dataset.oficio;
                if (window.datosOficios && window.datosOficios[oficioKey]) {
                    const contentDiv = body.querySelector('.oficio-content');
                    if (contentDiv && typeof window.generarContenidoOficio === 'function') {
                        try {
                            contentDiv.innerHTML = window.generarContenidoOficio(window.datosOficios[oficioKey]);
                            body.dataset.cargado = 'true';
                        } catch (error) {
                            console.error('Error cargando oficio:', oficioKey, error);
                        }
                    }
                }
            }
        });
    }

    // ===== Configurar organigrama (fallback de imagen) =====
    function configurarOrganigrama() {
        const organigramaImg = document.querySelector('.organigrama-img');
        const organigramaTexto = document.querySelector('.organigrama-texto');
        
        if (organigramaImg && organigramaTexto) {
            // Si la imagen no carga, mostrar texto
            organigramaImg.addEventListener('error', function() {
                this.style.display = 'none';
                organigramaTexto.style.display = 'block';
            });
            
            // Verificar si la imagen ya falló
            if (!organigramaImg.complete || organigramaImg.naturalWidth === 0) {
                organigramaImg.style.display = 'none';
                organigramaTexto.style.display = 'block';
            }
        }
    }

    // ===== Configurar tooltips =====
    function configurarTooltips() {
        document.querySelectorAll('[data-tip]').forEach(function(el) {
            el.classList.add('tooltip');
        });
    }

    // ===== Configurar buscador =====
    function configurarBuscador() {
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            searchContainer.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // ===== Función para reinicializar después de cambios dinámicos =====
    function reinicializar() {
        configurarAccesibilidad();
        cargarOficiosAbiertos();
        configurarTooltips();
        console.log('🔄 Supervisor-IPUC reinicializado.');
    }

    // ===== Ejecutar cuando el DOM esté listo =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM ya está listo
        init();
    }

    // ===== Si hay cambios dinámicos, reinicializar =====
    // Observar cambios en el DOM para cargar contenido de oficios dinámicamente
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Elemento
                            // Si se añadió un oficio-card que está abierto, cargar su contenido
                            if (node.classList && node.classList.contains('oficio-card') && node.classList.contains('open')) {
                                const body = node.querySelector('.oficio-body');
                                if (body && !body.dataset.cargado) {
                                    const oficioKey = node.dataset.oficio;
                                    if (window.datosOficios && window.datosOficios[oficioKey]) {
                                        const contentDiv = body.querySelector('.oficio-content');
                                        if (contentDiv && typeof window.generarContenidoOficio === 'function') {
                                            try {
                                                contentDiv.innerHTML = window.generarContenidoOficio(window.datosOficios[oficioKey]);
                                                body.dataset.cargado = 'true';
                                            } catch (error) {
                                                console.error('Error cargando oficio dinámico:', oficioKey, error);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
        });

        // Observar cambios en el grid de oficios
        const oficiosGrid = document.getElementById('oficiosGrid');
        if (oficiosGrid) {
            observer.observe(oficiosGrid, { childList: true, subtree: true });
        }
    }

    // ===== Exponer función de reinicialización globalmente =====
    window.reinicializarIPUC = reinicializar;

})();