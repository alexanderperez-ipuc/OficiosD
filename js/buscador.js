// ============================================
// buscador.js - Funcionalidad de búsqueda
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const searchToggle = document.getElementById('btnSearchToggle');
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        const searchResults = document.getElementById('searchResults');

        // Abrir/cerrar buscador
        if (searchToggle && searchContainer) {
            searchToggle.addEventListener('click', function() {
                searchContainer.classList.toggle('open');
                if (searchContainer.classList.contains('open')) {
                    searchInput.focus();
                } else {
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                }
            });
        }

        // Limpiar búsqueda
        if (searchClear && searchInput) {
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                searchClear.classList.remove('visible');
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                searchInput.focus();
                // Remover highlights
                document.querySelectorAll('.oficio-card.highlight').forEach(function(el) {
                    el.classList.remove('highlight');
                });
            });
        }

        // Evento input para búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.trim();
                if (query.length > 0) {
                    searchClear.classList.add('visible');
                    realizarBusqueda(query);
                } else {
                    searchClear.classList.remove('visible');
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                    document.querySelectorAll('.oficio-card.highlight').forEach(function(el) {
                        el.classList.remove('highlight');
                    });
                }
            });

            // Cerrar con Escape
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    searchContainer.classList.remove('open');
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                    this.blur();
                }
            });
        }

        function realizarBusqueda(query) {
            const resultados = [];
            const queryLower = query.toLowerCase();

            // Buscar en todos los oficios
            for (const [key, data] of Object.entries(window.datosOficios || {})) {
                let puntaje = 0;
                let coincidencias = [];

                // Título
                if (data.titulo && data.titulo.toLowerCase().includes(queryLower)) {
                    puntaje += 10;
                    coincidencias.push(`Título: ${data.titulo}`);
                }

                // Funciones
                if (data.funciones) {
                    data.funciones.forEach(function(f) {
                        if (f.toLowerCase().includes(queryLower)) {
                            puntaje += 3;
                            coincidencias.push(f.substring(0, 80) + '...');
                        }
                    });
                }

                // Objetivo
                if (data.objetivo && data.objetivo.toLowerCase().includes(queryLower)) {
                    puntaje += 5;
                    coincidencias.push(`Objetivo: ${data.objetivo.substring(0, 80)}...`);
                }

                // Requisitos
                if (data.perfil && data.perfil.requisitos) {
                    data.perfil.requisitos.forEach(function(r) {
                        if (r.toLowerCase().includes(queryLower)) {
                            puntaje += 2;
                            coincidencias.push(r.substring(0, 80) + '...');
                        }
                    });
                }

                // Recursos
                if (data.recursos) {
                    data.recursos.forEach(function(r) {
                        if (r.toLowerCase().includes(queryLower)) {
                            puntaje += 2;
                            coincidencias.push(r.substring(0, 80) + '...');
                        }
                    });
                }

                if (puntaje > 0) {
                    resultados.push({
                        key: key,
                        titulo: data.titulo || key,
                        puntaje: puntaje,
                        coincidencias: coincidencias.slice(0, 3)
                    });
                }
            }

            // Ordenar por puntaje
            resultados.sort(function(a, b) {
                return b.puntaje - a.puntaje;
            });

            // Mostrar resultados
            mostrarResultados(resultados, query);
        }

        function mostrarResultados(resultados, query) {
            if (!searchResults) return;

            if (resultados.length === 0) {
                searchResults.innerHTML = `<div class="no-results">No se encontraron resultados para "<strong>${query}</strong>"</div>`;
                searchResults.classList.add('active');
                return;
            }

            let html = '';
            resultados.forEach(function(r) {
                html += `
                    <div class="result-item" data-oficio="${r.key}">
                        <span class="result-title">${r.titulo}</span>
                        <span class="result-snippet">${r.coincidencias.join(' · ')}</span>
                    </div>
                `;
            });
            searchResults.innerHTML = html;
            searchResults.classList.add('active');

            // Evento click en resultados
            searchResults.querySelectorAll('.result-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    const oficioKey = this.dataset.oficio;
                    const card = document.querySelector(`.oficio-card[data-oficio="${oficioKey}"]`);
                    if (card) {
                        // Cerrar buscador
                        searchContainer.classList.remove('open');
                        searchResults.classList.remove('active');
                        searchResults.innerHTML = '';
                        searchInput.value = '';
                        searchClear.classList.remove('visible');

                        // Abrir el oficio
                        const body = card.querySelector('.oficio-body');
                        const header = card.querySelector('.oficio-header');
                        if (body && header) {
                            // Cerrar todos primero
                            document.querySelectorAll('.oficio-card.open').forEach(function(c) {
                                if (c !== card) {
                                    c.classList.remove('open');
                                    c.querySelector('.oficio-body').style.display = 'none';
                                    c.querySelector('.oficio-header').setAttribute('aria-expanded', 'false');
                                }
                            });
                            // Abrir el seleccionado
                            card.classList.add('open');
                            body.style.display = 'block';
                            header.setAttribute('aria-expanded', 'true');
                            // Cargar contenido si no está
                            if (!body.dataset.cargado) {
                                const contentDiv = body.querySelector('.oficio-content');
                                if (contentDiv && window.datosOficios && window.datosOficios[oficioKey]) {
                                    contentDiv.innerHTML = window.generarContenidoOficio(window.datosOficios[oficioKey]);
                                    body.dataset.cargado = 'true';
                                }
                            }
                            // Scroll al oficio
                            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            card.classList.add('highlight');
                            setTimeout(function() {
                                card.classList.remove('highlight');
                            }, 3000);
                        }
                    }
                });
            });
        }
    });

})();