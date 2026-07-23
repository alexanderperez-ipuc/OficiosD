// ============================================
// acordeon.js - Funcionalidad de acordeón
// ============================================

(function() {
    'use strict';

    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.oficio-card');
        const primerOficio = document.querySelector('.oficio-card[data-oficio="supervisor"]');

        // Configurar: el primer oficio (Supervisor) puede venir abierto
        if (primerOficio) {
            const body = primerOficio.querySelector('.oficio-body');
            const header = primerOficio.querySelector('.oficio-header');
            if (body && header) {
                body.style.display = 'block';
                primerOficio.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
            }
        }

        // Función para alternar acordeón
        function toggleAcordeon(card) {
            const body = card.querySelector('.oficio-body');
            const header = card.querySelector('.oficio-header');
            const isOpen = card.classList.contains('open');

            // Cerrar todos los demás (opcional: mantener solo uno abierto)
            // Si quieres que solo uno esté abierto a la vez, descomenta esto:
            /*
            document.querySelectorAll('.oficio-card.open').forEach(function(c) {
                if (c !== card) {
                    c.classList.remove('open');
                    c.querySelector('.oficio-body').style.display = 'none';
                    c.querySelector('.oficio-header').setAttribute('aria-expanded', 'false');
                }
            });
            */

            if (isOpen) {
                // Cerrar
                card.classList.remove('open');
                body.style.display = 'none';
                header.setAttribute('aria-expanded', 'false');
            } else {
                // Abrir
                card.classList.add('open');
                body.style.display = 'block';
                header.setAttribute('aria-expanded', 'true');
                // Inyectar contenido si no se ha hecho
                if (!body.dataset.cargado) {
                    const oficioKey = card.dataset.oficio;
                    if (window.datosOficios && window.datosOficios[oficioKey]) {
                        const contenido = generarContenidoOficio(window.datosOficios[oficioKey]);
                        const contentDiv = body.querySelector('.oficio-content');
                        if (contentDiv) {
                            contentDiv.innerHTML = contenido;
                        }
                        body.dataset.cargado = 'true';
                    }
                }
            }
        }

        // Event listeners en los headers
        cards.forEach(function(card) {
            const header = card.querySelector('.oficio-header');
            if (header) {
                header.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleAcordeon(card);
                });

                // Accesibilidad: tecla Enter y Espacio
                header.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAcordeon(card);
                    }
                });
            }
        });

        // Función para generar el HTML del contenido del oficio
        function generarContenidoOficio(data) {
            let html = '';

            // Meta datos
            html += `<div class="meta-grid">`;
            if (data.codigo) html += `<div class="meta-item"><strong>Código</strong> ${data.codigo}</div>`;
            if (data.ciuo) html += `<div class="meta-item"><strong>CIUO</strong> ${data.ciuo}</div>`;
            if (data.reporta) html += `<div class="meta-item"><strong>Reporta a</strong> ${data.reporta}</div>`;
            if (data.preside) html += `<div class="meta-item"><strong>Preside</strong> ${data.preside}</div>`;
            if (data.administra) html += `<div class="meta-item"><strong>Administra</strong> ${data.administra}</div>`;
            if (data.relacion) html += `<div class="meta-item"><strong>Relación funcional</strong> ${data.relacion}</div>`;
            if (data.dirige) html += `<div class="meta-item"><strong>Dirige</strong> ${data.dirige}</div>`;
            if (data.direcciona) html += `<div class="meta-item"><strong>Direcciona</strong> ${data.direcciona}</div>`;
            if (data.revisa) html += `<div class="meta-item"><strong>Revisa y controla</strong> ${data.revisa}</div>`;
            if (data.coordina) html += `<div class="meta-item"><strong>Coordina</strong> ${data.coordina}</div>`;
            if (data.subalternos) html += `<div class="meta-item"><strong>Subalternos</strong> ${data.subalternos}</div>`;
            if (data.subalternos_directos) html += `<div class="meta-item"><strong>Subalternos directos</strong> ${data.subalternos_directos}</div>`;
            if (data.subalternos_indirectos) html += `<div class="meta-item"><strong>Subalternos indirectos</strong> ${data.subalternos_indirectos}</div>`;
            html += `</div>`;

            // Objetivo
            if (data.objetivo) {
                html += `<div class="objetivo"><h4><i class="fas fa-bullseye"></i> Objetivo del Oficio</h4><p>${data.objetivo}</p></div>`;
            }

            // Funciones
            if (data.funciones && data.funciones.length) {
                html += `<div class="seccion"><h4><i class="fas fa-tasks"></i> Descripción General del Oficio</h4><ul>`;
                data.funciones.forEach(function(f) {
                    html += `<li>${f}</li>`;
                });
                html += `</ul></div>`;
            }

            // Perfil
            if (data.perfil) {
                html += `<div class="seccion"><h4><i class="fas fa-user-check"></i> Perfil del Oficio</h4>`;

                // Formación académica
                if (data.perfil.formacion) {
                    html += `<p><strong>Formación académica:</strong> ${data.perfil.formacion}</p>`;
                }

                // Requisitos mínimos
                if (data.perfil.requisitos && data.perfil.requisitos.length) {
                    html += `<div class="requisitos-grid">`;
                    html += `<div class="req-col"><h5><i class="fas fa-list"></i> Requisitos Mínimos</h5><ul>`;
                    data.perfil.requisitos.forEach(function(r) {
                        html += `<li>${r}</li>`;
                    });
                    html += `</ul></div>`;

                    // Experiencia
                    if (data.perfil.experiencia) {
                        html += `<div class="req-col"><h5><i class="fas fa-briefcase"></i> Experiencia</h5><p>${data.perfil.experiencia}</p></div>`;
                    }
                    html += `</div>`;
                }

                // Habilidades duras
                if (data.perfil.habilidades && data.perfil.habilidades.length) {
                    html += `<p><strong>Habilidades de desempeño:</strong> ${data.perfil.habilidades.join(', ')}</p>`;
                }

                // Habilidades blandas
                if (data.perfil.personalidad && data.perfil.personalidad.length) {
                    html += `<p><strong>Aspectos de la personalidad:</strong> ${data.perfil.personalidad.join(', ')}</p>`;
                }

                // Requisitos espirituales
                if (data.perfil.espirituales && data.perfil.espirituales.length) {
                    html += `<p><strong>Requisitos espirituales y morales:</strong></p><ul>`;
                    data.perfil.espirituales.forEach(function(e) {
                        html += `<li>${e}</li>`;
                    });
                    html += `</ul>`;
                }

                html += `</div>`;
            }

            // Recursos
            if (data.recursos && data.recursos.length) {
                html += `<div class="seccion"><h4><i class="fas fa-boxes"></i> Recursos Necesarios</h4><ul>`;
                data.recursos.forEach(function(r) {
                    html += `<li>${r}</li>`;
                });
                html += `</ul></div>`;
            }

            return html;
        }

        // Cargar el contenido del primer oficio (Supervisor) al inicio
        const primerCard = document.querySelector('.oficio-card[data-oficio="supervisor"]');
        if (primerCard) {
            const body = primerCard.querySelector('.oficio-body');
            if (body && !body.dataset.cargado) {
                const oficioKey = primerCard.dataset.oficio;
                if (window.datosOficios && window.datosOficios[oficioKey]) {
                    const contenido = generarContenidoOficio(window.datosOficios[oficioKey]);
                    const contentDiv = body.querySelector('.oficio-content');
                    if (contentDiv) {
                        contentDiv.innerHTML = contenido;
                    }
                    body.dataset.cargado = 'true';
                }
            }
        }

        // Exponer la función para otros scripts
        window.generarContenidoOficio = generarContenidoOficio;
    });

})();