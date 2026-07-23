// ============================================
// pdf.js - Funcionalidad de exportación a PDF
// ============================================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ===== Crear botón de PDF en el header =====
        function crearBotonPDF() {
            const headerActions = document.querySelector('.header-actions');
            if (!headerActions) {
                console.warn('No se encontró .header-actions para el botón PDF');
                return;
            }

            // Verificar si ya existe el botón
            if (document.getElementById('btnPDF')) {
                return;
            }

            const btnPDF = document.createElement('button');
            btnPDF.id = 'btnPDF';
            btnPDF.className = 'btn-pdf';
            btnPDF.setAttribute('aria-label', 'Exportar a PDF');
            btnPDF.title = 'Exportar a PDF';
            btnPDF.innerHTML = '<i class="fas fa-file-pdf"></i>';
            
            // Insertar antes del botón de imprimir
            const btnPrint = document.getElementById('btnPrint');
            if (btnPrint) {
                headerActions.insertBefore(btnPDF, btnPrint);
            } else {
                headerActions.appendChild(btnPDF);
            }

            // Event listener
            btnPDF.addEventListener('click', exportarPDF);
        }

        // ===== Función principal para exportar a PDF =====
        function exportarPDF() {
            const btnPDF = document.getElementById('btnPDF');
            
            // Mostrar indicador de carga
            if (btnPDF) {
                btnPDF.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
                btnPDF.disabled = true;
            }

            try {
                // 1. Abrir todos los acordeones
                const cards = document.querySelectorAll('.oficio-card');
                cards.forEach(function(card) {
                    const body = card.querySelector('.oficio-body');
                    const header = card.querySelector('.oficio-header');
                    if (body && header) {
                        if (!card.classList.contains('open')) {
                            card.classList.add('open');
                            body.style.display = 'block';
                            header.setAttribute('aria-expanded', 'true');
                            
                            // Cargar contenido si no está cargado
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

                // 2. Esperar un momento para que el DOM se actualice
                setTimeout(function() {
                    try {
                        // Verificar si la librería html2pdf está disponible
                        if (typeof html2pdf !== 'undefined' && html2pdf) {
                            exportarConLibreria();
                        } else {
                            // Fallback: usar el método de impresión
                            exportarConPrint();
                        }
                    } catch (error) {
                        console.error('Error en exportación:', error);
                        alert('Ocurrió un error al exportar el PDF. Por favor, intenta de nuevo.');
                        restaurarBotonPDF();
                    }
                }, 600);

            } catch (error) {
                console.error('Error preparando la exportación:', error);
                alert('Ocurrió un error al preparar la exportación.');
                restaurarBotonPDF();
            }
        }

        // ===== Exportar usando html2pdf.js (método principal) =====
        function exportarConLibreria() {
            const btnPDF = document.getElementById('btnPDF');
            
            try {
                // Obtener el contenido a exportar
                const elemento = document.querySelector('#main-content');
                if (!elemento) {
                    alert('No se encontró el contenido para exportar.');
                    restaurarBotonPDF();
                    return;
                }

                // Clonar el elemento para no afectar la página original
                const clon = elemento.cloneNode(true);
                
                // Eliminar elementos no deseados del clon
                const elementosEliminar = clon.querySelectorAll('.btn-primary, .oficio-toggle, .back-to-top, .btn-print, .btn-pdf, .btn-search-toggle, .search-container');
                elementosEliminar.forEach(function(el) { 
                    if (el) el.remove(); 
                });

                // Ocultar buscador en el clon
                const searchContainer = clon.querySelector('.search-container');
                if (searchContainer) searchContainer.style.display = 'none';

                // Crear un contenedor temporal
                const container = document.createElement('div');
                container.style.cssText = `
                    padding: 30px;
                    background: white;
                    font-family: 'Inter', Arial, sans-serif;
                    max-width: 1000px;
                    margin: 0 auto;
                `;
                container.appendChild(clon);

                // Agregar estilos adicionales para el PDF
                const style = document.createElement('style');
                style.textContent = `
                    * { box-sizing: border-box; }
                    body { font-family: 'Inter', Arial, sans-serif; }
                    .oficio-card {
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        margin-bottom: 16px;
                        page-break-inside: avoid;
                        background: white;
                    }
                    .oficio-header {
                        padding: 16px 20px;
                        background: #f8fafc;
                        border-bottom: 2px solid #1a3c6e;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .oficio-header .oficio-title {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .oficio-header .oficio-icon {
                        background: #1a3c6e;
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .oficio-header h3 {
                        margin: 0;
                        color: #1a3c6e;
                    }
                    .oficio-header .oficio-subtitle {
                        color: #64748b;
                        font-size: 0.85rem;
                    }
                    .oficio-badge {
                        background: #c9a84c;
                        color: #1a3c6e;
                        padding: 2px 12px;
                        border-radius: 20px;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }
                    .oficio-body {
                        display: block !important;
                        padding: 20px;
                    }
                    .meta-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                        background: #f1f5f9;
                        padding: 12px 16px;
                        border-radius: 6px;
                        margin-bottom: 16px;
                    }
                    .meta-item { font-size: 0.9rem; }
                    .meta-item strong { 
                        display: block;
                        font-size: 0.7rem;
                        text-transform: uppercase;
                        color: #64748b;
                    }
                    .objetivo {
                        background: #1a3c6e;
                        color: white;
                        padding: 16px 20px;
                        border-radius: 6px;
                        margin-bottom: 16px;
                    }
                    .objetivo h4 { 
                        color: #c9a84c;
                        margin: 0 0 8px 0;
                    }
                    .objetivo p { margin: 0; }
                    .seccion { margin-bottom: 16px; }
                    .seccion h4 { 
                        border-bottom: 2px solid #c9a84c;
                        padding-bottom: 6px;
                        margin-bottom: 10px;
                        color: #1a3c6e;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .seccion ul { 
                        padding-left: 20px;
                        list-style: none;
                    }
                    .seccion ul li {
                        padding: 4px 0;
                        padding-left: 20px;
                        position: relative;
                    }
                    .seccion ul li::before {
                        content: "▸";
                        position: absolute;
                        left: 0;
                        color: #c9a84c;
                        font-weight: bold;
                    }
                    .requisitos-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                    }
                    .req-col {
                        background: #f8fafc;
                        padding: 12px 16px;
                        border-radius: 6px;
                    }
                    .req-col h5 {
                        margin: 0 0 8px 0;
                        color: #1a3c6e;
                    }
                    .hero-section { 
                        background: #1a3c6e;
                        color: white;
                        padding: 30px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    }
                    .hero-section h2 { 
                        color: white;
                        margin: 0 0 8px 0;
                    }
                    .hero-subtitle { 
                        color: #c9a84c;
                        font-size: 1.1rem;
                    }
                    .hero-description { 
                        opacity: 0.9;
                        margin: 12px 0;
                    }
                    .hero-stats { 
                        display: flex; 
                        gap: 30px;
                        margin: 16px 0;
                    }
                    .stat-item { 
                        display: flex;
                        flex-direction: column;
                    }
                    .stat-number { 
                        color: #c9a84c; 
                        font-size: 24px; 
                        font-weight: bold; 
                    }
                    .stat-label { 
                        font-size: 0.8rem;
                        opacity: 0.8;
                    }
                    .section-header { 
                        text-align: center; 
                        margin: 30px 0 20px;
                    }
                    .section-header h2 { 
                        color: #1a3c6e;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .organigrama-container {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                    }
                    .organigrama-texto {
                        text-align: center;
                    }
                    .org-nivel { 
                        display: flex; 
                        justify-content: center; 
                        flex-wrap: wrap; 
                        gap: 12px; 
                        margin: 8px 0; 
                    }
                    .org-item {
                        background: #1a3c6e;
                        color: white;
                        padding: 8px 18px;
                        border-radius: 6px;
                        font-weight: 600;
                        font-size: 0.9rem;
                    }
                    .org-control { 
                        background: #c9a84c; 
                        color: #1a3c6e; 
                    }
                    .org-flecha { 
                        font-size: 24px; 
                        color: #64748b; 
                        margin: 4px 0; 
                    }
                    .org-linea-control { 
                        display: flex; 
                        justify-content: center; 
                        gap: 20px; 
                        margin-top: 12px; 
                        padding-top: 12px; 
                        border-top: 2px dashed #e2e8f0; 
                    }
                    .acerca-content {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: 20px;
                    }
                    .acerca-card {
                        background: #f8fafc;
                        padding: 16px 20px;
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                    }
                    .acerca-card h3 {
                        color: #1a3c6e;
                        margin: 0 0 8px 0;
                    }
                    .acerca-card p, .acerca-card li {
                        color: #475569;
                        font-size: 0.9rem;
                    }
                    .acerca-card ul { padding-left: 18px; }
                    .acerca-card ul li { padding: 2px 0; }
                    .footer-pdf {
                        margin-top: 30px;
                        padding-top: 16px;
                        border-top: 2px solid #c9a84c;
                        text-align: center;
                        font-size: 0.75rem;
                        color: #64748b;
                    }
                    .footer-pdf p { margin: 2px 0; }
                    @page { 
                        margin: 10mm;
                        size: A4 portrait;
                    }
                    .no-print { display: none !important; }
                `;
                container.appendChild(style);

                // Agregar pie de página
                const footer = document.createElement('div');
                footer.className = 'footer-pdf';
                footer.innerHTML = `
                    <p><strong>Manual de Descripción y Perfil de Oficios Distritales - IPUC</strong></p>
                    <p>Versión 01 · Vigencia 2025-2028</p>
                    <p>© ${new Date().getFullYear()} Iglesia Pentecostal Unida de Colombia</p>
                `;
                container.appendChild(footer);

                // Agregar al body temporalmente
                const tempDiv = document.createElement('div');
                tempDiv.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 100%; background: white; z-index: 9999;';
                tempDiv.appendChild(container);
                document.body.appendChild(tempDiv);

                // Configurar opciones de html2pdf
                const opt = {
                    margin:        8,
                    filename:      'Manual_Oficios_Distritales_IPUC.pdf',
                    image:         { type: 'jpeg', quality: 0.98 },
                    html2canvas:   { 
                        scale: 2, 
                        useCORS: true, 
                        logging: false,
                        allowTaint: true
                    },
                    jsPDF:         { 
                        unit: 'mm', 
                        format: 'a4', 
                        orientation: 'portrait' 
                    },
                    pagebreak:     { mode: ['avoid-all', 'css', 'legacy'] }
                };

                // Generar PDF
                html2pdf()
                    .set(opt)
                    .from(tempDiv)
                    .save()
                    .then(function() {
                        // Limpiar
                        document.body.removeChild(tempDiv);
                        restaurarBotonPDF();
                    })
                    .catch(function(error) {
                        console.error('Error generando PDF:', error);
                        document.body.removeChild(tempDiv);
                        restaurarBotonPDF();
                        alert('Error al generar el PDF. Por favor, intenta de nuevo.');
                    });

            } catch (error) {
                console.error('Error en exportarConLibreria:', error);
                restaurarBotonPDF();
                alert('Error al exportar el PDF. Usando método alternativo...');
                exportarConPrint();
            }
        }

        // ===== Exportar usando print() (fallback) =====
        function exportarConPrint() {
            try {
                // Usar window.print() que ya tiene estilos definidos en print.css
                const usarPrint = confirm(
                    'La exportación directa a PDF no está disponible.\n\n' +
                    'Se abrirá el diálogo de impresión.\n' +
                    '1. Selecciona "Guardar como PDF" en el destino.\n' +
                    '2. Ajusta las opciones de página según prefieras.\n\n' +
                    '¿Deseas continuar?'
                );

                if (usarPrint) {
                    window.print();
                }
                restaurarBotonPDF();
            } catch (error) {
                console.error('Error en exportarConPrint:', error);
                restaurarBotonPDF();
            }
        }

        // ===== Restaurar botón PDF =====
        function restaurarBotonPDF() {
            const btnPDF = document.getElementById('btnPDF');
            if (btnPDF) {
                btnPDF.innerHTML = '<i class="fas fa-file-pdf"></i>';
                btnPDF.disabled = false;
            }
        }

        // ===== Atajo de teclado: Ctrl+Shift+P =====
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                exportarPDF();
            }
        });

        // ===== Verificar si la librería está cargada =====
        function verificarLibreria() {
            if (typeof html2pdf === 'undefined' || !html2pdf) {
                console.warn('⚠️ html2pdf.js no está cargado. Usando método de impresión como fallback.');
            } else {
                console.log('✅ html2pdf.js cargado correctamente.');
            }
        }

        // ===== Inicializar =====
        crearBotonPDF();
        verificarLibreria();

        console.log('✅ pdf.js cargado - Usa Ctrl+Shift+P para exportar a PDF');

    });

})();