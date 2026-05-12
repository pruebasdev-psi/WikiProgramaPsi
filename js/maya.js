const mayaData = [
    {
        id: 1,
        titulo: "Manual PAC 2026",
        descripcion: "Guía completa del Programa Analítico de Curso para el año 2026. Documento de referencia principal para la actualización curricular.",
        grupo: "Guías y Manuales",
        tipo: "PDF",
        tamaño: "2.5 MB",
        fecha: "2026-01-15",
        ruta: "../maya/Manual PAC2026.pdf"
    },
    {
        id: 2,
        titulo: "Guía para la Formulación, Implementación y Evaluación de Resultados de Aprendizaje",
        descripcion: "Guía metodológica para formular, implementar y evaluar los Resultados de Aprendizaje en el diseño curricular.",
        grupo: "Guías y Manuales",
        tipo: "PDF",
        tamaño: "727 KB",
        fecha: "2022-09-01",
        ruta: "../maya/GUIA PARA LA FORMULACIÓN IMPLEMENTACIÓN Y EVALUACION DE RESULTADOS DE APRENDIZAJE (1).pdf"
    },
    {
        id: 3,
        titulo: "Instructivo del Programa Analítico de Curso",
        descripcion: "Instructivo oficial I-GD-07-GP para el diseño del Programa Analítico de Curso de pregrado.",
        grupo: "Guías y Manuales",
        tipo: "PDF",
        tamaño: "723 KB",
        fecha: "2022-09-01",
        ruta: "../maya/I-GD-07-GP Instructivo del Programa Analítico de Curso.pdf"
    },
    {
        id: 4,
        titulo: "Lineamientos Curriculares V 4.0",
        descripcion: "Lineamientos curriculares versión 4.0 aprobados por Consejo de Gobierno en septiembre de 2022. Marco institucional para el diseño curricular.",
        grupo: "Lineamientos Curriculares",
        tipo: "PDF",
        tamaño: "1.8 MB",
        fecha: "2022-09-01",
        ruta: "../maya/LINEAMIENTOS CURRICULARES V 4.0- Consejo de Gobierno- SEPTIEMBRE 2022 (2).pdf"
    },
    {
        id: 5,
        titulo: "Formato Programa Analítico de Curso",
        descripcion: "Formato oficial del Programa Analítico de Curso para diligenciar. Documento base para la actualización de la malla curricular.",
        grupo: "Formatos y Plantillas",
        tipo: "DOCX",
        tamaño: "55 KB",
        fecha: "2026-01-01",
        ruta: "../maya/Formato Programa  Analítico de Curso.docx"
    },
    {
        id: 6,
        titulo: "Prompt para PAC 2026-1",
        descripcion: "Prompt o guía estructurada de apoyo para la elaboración del Programa Analítico de Curso 2026-1.",
        grupo: "Formatos y Plantillas",
        tipo: "DOCX",
        tamaño: "395 KB",
        fecha: "2026-01-01",
        ruta: "../maya/Promt para PAC 2026-1.docx"
    },
    {
        id: 7,
        titulo: "Aprendizaje y Metodologías Activas",
        descripcion: "Recurso interactivo sobre aprendizaje y metodologías activas para la práctica docente.",
        grupo: "Enlaces de Interés",
        tipo: "URL",
        enlace: "https://view.genially.com/67e75437288952f13773438e",
        fecha: "2025-01-01"
    },
    {
        id: 8,
        titulo: "Drive para Cargar PAC",
        descripcion: "Repositorio en SharePoint para la carga y almacenamiento de los Programas Analíticos de Curso.",
        grupo: "Enlaces de Interés",
        tipo: "URL",
        enlace: "https://unisimonedu-my.sharepoint.com/:f:/g/personal/laura_rojasp_unisimon_edu_co/IgAuhf--3Qq9R7ec6gTj-410AaiPtPQJsMcxU7k3w4R50p8?e=PD3DM0",
        fecha: "2026-01-01"
    },
    {
        id: 9,
        titulo: "PAC - Alineación RA, Metodología y Evaluación",
        descripcion: "Presentación interactiva sobre los componentes del PAC: alineación de Resultados de Aprendizaje, metodología y evaluación.",
        grupo: "Enlaces de Interés",
        tipo: "URL",
        enlace: "https://view.genially.com/645d7d6aee2aa50012c33fab/presentation-componentes-del-pac-azlaura",
        fecha: "2023-01-01"
    },
    {
        id: 10,
        titulo: "Asignación Actualización PAC 2026-1 - Malla 15",
        descripcion: "Planilla de asignación para la actualización del PAC 2026-1 correspondiente a la malla curricular 15.",
        grupo: "Mallas Curriculares",
        tipo: "XLSX",
        tamaño: "19 KB",
        fecha: "2026-01-01",
        ruta: "../maya/Malla 15/Asignación actualización PAC 2026-1 malla 15.xlsx"
    },
    {
        id: 11,
        titulo: "Matriz de Secuenciación - Malla 15",
        descripcion: "Matriz de secuenciación curricular para la malla 15. Organización y secuencia de cursos.",
        grupo: "Mallas Curriculares",
        tipo: "XLSX",
        tamaño: "186 KB",
        fecha: "2026-01-01",
        ruta: "../maya/Malla 15/Matriz secuenciacion malla 15.xlsx"
    },
    {
        id: 12,
        titulo: "Asignación Actualización PAC 2026-1 - Malla 16",
        descripcion: "Planilla de asignación para la actualización del PAC 2026-1 correspondiente a la malla curricular 16.",
        grupo: "Mallas Curriculares",
        tipo: "XLSX",
        tamaño: "17 KB",
        fecha: "2026-01-01",
        ruta: "../maya/Malla 16/Asignación actualización PAC 2026-1 Malla 16.xlsx"
    },
    {
        id: 13,
        titulo: "Matrices - Psicología Malla 16",
        descripcion: "Matrices curriculares de Psicología para la malla 16, revisión octubre 2025.",
        grupo: "Mallas Curriculares",
        tipo: "XLSX",
        tamaño: "420 KB",
        fecha: "2025-10-02",
        ruta: "../maya/Malla 16/Matrices - Psicología rv_02_oct malla 16.xlsx"
    }
];

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

function formatearFecha(fechaISO) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
}

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

function obtenerIconoTipo(tipo) {
    const iconos = {
        'PDF': '📄',
        'DOCX': '📝',
        'XLSX': '📊',
        'URL': '🔗'
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

function mostrarMaya(recursos) {
    const contenedor = document.getElementById('lista-maya');
    const sinResultados = document.getElementById('sin-resultados');
    const contador = document.getElementById('contador');

    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (recursos.length === mayaData.length) {
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

    const grupos = {};
    const ordenGrupos = ['Guías y Manuales', 'Lineamientos Curriculares', 'Formatos y Plantillas', 'Enlaces de Interés', 'Mallas Curriculares'];

    recursos.forEach(r => {
        if (!grupos[r.grupo]) grupos[r.grupo] = {};
        if (!grupos[r.grupo][r.tipo]) grupos[r.grupo][r.tipo] = [];
        grupos[r.grupo][r.tipo].push(r);
    });

    ordenGrupos.forEach(nombreGrupo => {
        if (!grupos[nombreGrupo]) return;

        const grupoDiv = document.createElement('div');
        grupoDiv.className = 'maya-grupo';
        grupoDiv.setAttribute('data-grupo', nombreGrupo);

        const grupoHeader = document.createElement('div');
        grupoHeader.className = 'maya-grupo-header';
        grupoHeader.innerHTML = `<h3 class="maya-grupo-titulo">${nombreGrupo}</h3>`;
        grupoDiv.appendChild(grupoHeader);

        const tiposOrden = ['PDF', 'DOCX', 'XLSX', 'URL'];
        tiposOrden.forEach(tipo => {
            if (!grupos[nombreGrupo][tipo]) return;

            const subtipoDiv = document.createElement('div');
            subtipoDiv.className = 'maya-subtipo';

            const subtipoHeader = document.createElement('div');
            subtipoHeader.className = 'maya-subtipo-header';
            subtipoHeader.innerHTML = `<span class="maya-subtipo-icono">${obtenerIconoTipo(tipo)}</span><span class="maya-subtipo-nombre">${tipo}</span>`;
            subtipoDiv.appendChild(subtipoHeader);

            const grid = document.createElement('div');
            grid.className = 'recursos-grid';

            grupos[nombreGrupo][tipo].forEach(item => {
                const card = document.createElement('div');
                card.className = 'recurso-card';
                card.innerHTML = `
                    <div class="recurso-header">
                        <span class="recurso-categoria">${item.grupo}</span>
                        <span class="recurso-tipo-badge tipo-${item.tipo.toLowerCase()}">${item.tipo}</span>
                    </div>
                    <div class="recurso-body">
                        <h3 class="recurso-titulo">${item.titulo}</h3>
                        <p class="recurso-descripcion">${item.descripcion}</p>
                        <div class="recurso-meta">
                            <span class="recurso-tipo">${obtenerIconoTipo(item.tipo)} ${item.tipo}</span>
                            ${item.tamaño ? `<span class="recurso-tamaño">• ${item.tamaño}</span>` : ''}
                            <span class="recurso-fecha">• ${formatearFecha(item.fecha)}</span>
                        </div>
                    </div>
                    <div class="recurso-footer">
                        ${item.tipo === 'URL'
                            ? `<a href="${item.enlace}" class="btn-recurso" target="_blank">Abrir Enlace 🔗</a>`
                            : `
                            <div class="recurso-acciones">
                                <button class="btn-preview" onclick='abrirPreview("${item.ruta.replace(/"/g, '\\"')}", "${item.titulo.replace(/"/g, '&quot;')}", "${item.tipo}")'>Vista Previa</button>
                                <button class="btn-recurso" onclick='descargarArchivo("${item.ruta.replace(/"/g, '\\"')}", "${item.titulo.replace(/"/g, '&quot;')}", "${item.tipo}")'>Descargar</button>
                            </div>
                        `}
                    </div>
                `;
                grid.appendChild(card);
            });

            subtipoDiv.appendChild(grid);
            grupoDiv.appendChild(subtipoDiv);
        });

        contenedor.appendChild(grupoDiv);
    });
}

function buscarMaya(terminoBusqueda = '') {
    let recursosFiltrados = mayaData;

    if (terminoBusqueda) {
        const termino = terminoBusqueda.toLowerCase();
        recursosFiltrados = recursosFiltrados.filter(item =>
            item.titulo.toLowerCase().includes(termino) ||
            item.descripcion.toLowerCase().includes(termino) ||
            item.grupo.toLowerCase().includes(termino) ||
            item.tipo.toLowerCase().includes(termino)
        );
    }

    mostrarMaya(recursosFiltrados);
}

function inicializarBuscadorMaya() {
    const buscador = document.getElementById('buscador');
    const btnBuscar = document.getElementById('btn-buscar');

    const realizarBusqueda = () => {
        const termino = buscador.value;
        buscarMaya(termino);
    };

    btnBuscar.addEventListener('click', realizarBusqueda);

    buscador.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusqueda();
    });

    buscador.addEventListener('input', realizarBusqueda);

    buscador.addEventListener('input', function() {
        if (this.value === '') buscarMaya('');
    });
}

function inicializarMenuMobile() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}

window.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-preview');
    if (e.target === modal) cerrarPreview();
});

document.addEventListener('DOMContentLoaded', function() {
    mostrarMaya(mayaData);
    inicializarBuscadorMaya();
    inicializarMenuMobile();
    inicializarModoOscuro();
    console.log('Página maya cargada correctamente');
});
