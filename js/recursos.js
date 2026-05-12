// Datos locales (fallback por defecto)
let recursosData = [
    {
        id: 1,
        titulo: "Guía Formulación Implementación Evaluación RA",
        descripcion: "Guía para la formulación, implementación y evaluación de resultados de aprendizaje.",
        categoria: "pedagogia",
        tipo: "PDF",
        tamaño: "927 KB",
        fecha: "2024-03-27",
        enlace: "../Docs/Guia_Formulación_Implemetación_Evaluación_RA.pdf",
        destacado: true
    },
    {
        id: 2,
        titulo: "Instructivo Diseño Programa Analítico Curso Pregrado",
        descripcion: "Instructivo para el diseño del programa analítico de cursos de pregrado.",
        categoria: "administrativo",
        tipo: "PDF",
        tamaño: "634 KB",
        fecha: "2024-03-27",
        enlace: "../Docs/Instructivo_diseño_programa_analitico_curso_pregrado.pdf",
        destacado: false
    },
    {
        id: 3,
        titulo: "Lineamientos de Gestión Curricular",
        descripcion: "Lineamientos institucionales para la gestión curricular (Versión 4).",
        categoria: "institucional",
        tipo: "PDF",
        tamaño: "1.3 MB",
        fecha: "2024-03-27",
        enlace: "../Docs/LINEAMIENTOS_GESTIÓN_CURRICULAR_4.pdf",
        destacado: true
    },
    {
        id: 4,
        titulo: "PEI - Proyecto Educativo Institucional",
        descripcion: "Documento oficial del Proyecto Educativo Institucional.",
        categoria: "institucional",
        tipo: "PDF",
        tamaño: "2.3 MB",
        fecha: "2024-03-27",
        enlace: "../Docs/PEI.pdf",
        destacado: true
    },
    {
        id: 5,
        titulo: "Implementación y Evaluación de Resultados de Aprendizaje",
        descripcion: "Documento de apoyo para la implementación y evaluación de resultados de aprendizaje.",
        categoria: "pedagogia",
        tipo: "PDF",
        tamaño: "1.2 MB",
        fecha: "2024-03-27",
        enlace: "../Docs/implem_eval_Resultados_Aprendizaje.pdf",
        destacado: false
    }
];

// Función para el modo oscuro
function inicializarModoOscuro() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
        if (html.getAttribute('data-theme') === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggle.textContent = '🌙';
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggle.textContent = '☀️';
        }
    });
}

// Función para formatear la fecha
async function descargarArchivo(url, nombre, tipo) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error al descargar');
        const blob = await res.blob();
        const link = document.createElement('a');
        const ext = tipo?.toLowerCase() || url.split('.').pop() || 'pdf';
        link.href = URL.createObjectURL(blob);
        link.download = nombre + '.' + ext;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (e) {
        window.open(url, '_blank');
    }
}

function formatearFecha(fechaISO) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

// Función para obtener el icono según el tipo de archivo
function obtenerIconoTipo(tipo) {
    const iconos = {
        'PDF': '📄',
        'DOCX': '📝',
        'ZIP': '📦',
        'XLSX': '📊',
        'PPTX': '📊'
    };
    return iconos[tipo] || '📎';
}

function abrirPreview(ruta, titulo, tipo) {
    const modal = document.getElementById('modal-preview');
    const modalTitulo = document.getElementById('modal-titulo-preview');
    const modalCuerpo = document.getElementById('modal-cuerpo-preview');

    modalTitulo.textContent = titulo;
    modalCuerpo.innerHTML = '';

    if (tipo === 'PDF') {
        const embed = document.createElement('embed');
        embed.src = ruta;
        embed.type = 'application/pdf';
        embed.style.width = '100%';
        embed.style.height = '100%';
        modalCuerpo.appendChild(embed);
    } else {
        const noPreview = document.createElement('div');
        noPreview.className = 'no-preview-msg';
        noPreview.innerHTML = `
            <span class="no-preview-icon">📄</span>
            <h3>Vista previa no disponible</h3>
            <p>Este formato (${tipo}) no permite vista previa en el navegador.</p>
            <p>Por favor descarga el archivo para visualizarlo.</p>
            <button class="btn-recurso" onclick='descargarArchivo("${ruta}", "${titulo}", "${tipo}")' style="margin-top:1rem;">Descargar ${tipo}</button>
        `;
        modalCuerpo.appendChild(noPreview);
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarPreview() {
    const modal = document.getElementById('modal-preview');
    const modalCuerpo = document.getElementById('modal-cuerpo-preview');
    modalCuerpo.innerHTML = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Función para mostrar los recursos en el grid
function mostrarRecursos(recursos) {
    const contenedor = document.getElementById('lista-recursos');
    const sinResultados = document.getElementById('sin-resultados');
    const contador = document.getElementById('contador');
    
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    // Actualizar contador
    if (recursos.length === recursosData.length) {
        contador.textContent = `Mostrando todos los recursos (${recursos.length})`;
    } else {
        contador.textContent = `${recursos.length} recursos encontrados`;
    }
    
    if (recursos.length === 0) {
        sinResultados.style.display = 'block';
        contador.textContent = 'No se encontraron recursos';
        return;
    }
    
    sinResultados.style.display = 'none';
    
    recursos.forEach(recurso => {
        const recursoElement = document.createElement('div');
        recursoElement.className = `recurso-card ${recurso.destacado ? 'destacado' : ''}`;
        recursoElement.setAttribute('data-categoria', recurso.categoria);
        
        recursoElement.innerHTML = `
            <div class="recurso-header">
                <span class="recurso-categoria">${recurso.categoria}</span>
                ${recurso.destacado ? '<span class="recurso-destacado">Destacado</span>' : ''}
            </div>
            <div class="recurso-body">
                <h3 class="recurso-titulo">${recurso.titulo}</h3>
                <p class="recurso-descripcion">${recurso.descripcion}</p>
                <div class="recurso-meta">
                    <span class="recurso-tipo">${obtenerIconoTipo(recurso.tipo)} ${recurso.tipo}</span>
                    <span class="recurso-tamaño">• ${recurso.tamaño}</span>
                    <span class="recurso-fecha">• ${formatearFecha(recurso.fecha)}</span>
                </div>
            </div>
            <div class="recurso-footer">
                <div class="recurso-acciones">
                    <button class="btn-preview" onclick='abrirPreview("${recurso.enlace}", "${recurso.titulo}", "${recurso.tipo}")'>Vista Previa</button>
                    <button class="btn-recurso" onclick='descargarArchivo("${recurso.enlace}", "${recurso.titulo}", "${recurso.tipo}")'>Descargar</button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(recursoElement);
    });
}

// Función para buscar recursos
function buscarRecursos(terminoBusqueda = '') {
    let recursosFiltrados = recursosData;
    
    // Filtrar por término de búsqueda
    if (terminoBusqueda) {
        const termino = terminoBusqueda.toLowerCase();
        recursosFiltrados = recursosFiltrados.filter(recurso => 
            recurso.titulo.toLowerCase().includes(termino) ||
            recurso.descripcion.toLowerCase().includes(termino) ||
            recurso.categoria.toLowerCase().includes(termino)
        );
    }
    
    mostrarRecursos(recursosFiltrados);
}

// Función para inicializar el buscador
function inicializarBuscador() {
    const buscador = document.getElementById('buscador');
    const btnBuscar = document.getElementById('btn-buscar');
    
    const realizarBusqueda = () => {
        const termino = buscador.value;
        buscarRecursos(termino);
    };
    
    btnBuscar.addEventListener('click', realizarBusqueda);
    
    buscador.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarBusqueda();
        }
    });
    
    // Búsqueda en tiempo real (opcional)
    buscador.addEventListener('input', realizarBusqueda);
    
    // Limpiar búsqueda cuando el campo esté vacío
    buscador.addEventListener('input', function() {
        if (this.value === '') {
            buscarRecursos('');
        }
    });
}

// Función para inicializar el menú móvil
function inicializarMenuMobile() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-preview');
    if (e.target === modal) cerrarPreview();
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    // Intentar cargar desde Firestore
    if (typeof db !== 'undefined' && db) {
        try {
            const snapshot = await db.collection('recursos').orderBy('fecha', 'desc').get();
            if (!snapshot.empty) {
                const firestoreData = [];
                snapshot.forEach(doc => {
                    const r = doc.data();
                    firestoreData.push({
                        id: doc.id,
                        titulo: r.titulo,
                        descripcion: r.descripcion,
                        categoria: r.categoria,
                        tipo: r.tipo || 'PDF',
                        tamaño: r.tamaño || '',
                        fecha: r.fecha?.toDate ? r.fecha.toDate().toISOString().split('T')[0] : (typeof r.fecha === 'string' ? r.fecha.split('T')[0] : new Date().toISOString().split('T')[0]),
                        enlace: r.enlace,
                        destacado: r.destacado || false
                    });
                });
                const idsExistentes = new Set(recursosData.map(r => String(r.id)));
                const nuevos = firestoreData.filter(r => !idsExistentes.has(String(r.id)));
                recursosData = [...recursosData, ...nuevos];
                console.log('Recursos fusionados: ' + recursosData.length + ' total (' + nuevos.length + ' desde Firestore)');
            }
        } catch (e) {
            console.log('Usando datos locales (Firestore no disponible)');
        }
    }

    mostrarRecursos(recursosData);
    inicializarBuscador();
    inicializarMenuMobile();
    inicializarModoOscuro();
    
    console.log('Página de recursos cargada correctamente');
});