const TEMPLATES_COLOR = {
  'gradient-1': 'linear-gradient(135deg, #0b1d21, #2c6b74)',
  'gradient-2': 'linear-gradient(135deg, #2c6b74, #00988d)',
  'gradient-3': 'linear-gradient(135deg, #4a1a5e, #7b2d8e)',
  'gradient-4': 'linear-gradient(135deg, #e67e22, #f39c12)',
  'gradient-5': 'linear-gradient(135deg, #1a365d, #2b6cb0)',
  'gradient-6': 'linear-gradient(135deg, #742a2a, #9b2c2c)'
};

const COLOR_PALETTES = [
  { id: 'gradient-1', nombre: 'Verde Petróleo', gradient: 'linear-gradient(135deg, #0b1d21, #2c6b74)' },
  { id: 'gradient-2', nombre: 'Teal', gradient: 'linear-gradient(135deg, #2c6b74, #00988d)' },
  { id: 'gradient-3', nombre: 'Púrpura', gradient: 'linear-gradient(135deg, #4a1a5e, #7b2d8e)' },
  { id: 'gradient-4', nombre: 'Naranja', gradient: 'linear-gradient(135deg, #e67e22, #f39c12)' },
  { id: 'gradient-5', nombre: 'Azul Marino', gradient: 'linear-gradient(135deg, #1a365d, #2b6cb0)' },
  { id: 'gradient-6', nombre: 'Rojo Vino', gradient: 'linear-gradient(135deg, #742a2a, #9b2c2c)' }
];

const Engine = {
  iconosTipo: {
    'PDF': '\u{1F4C4}',
    'Word': '\u{1F4DD}',
    'DOCX': '\u{1F4DD}',
    'DOC': '\u{1F4DD}',
    'Excel': '\u{1F4CA}',
    'XLSX': '\u{1F4CA}',
    'XLS': '\u{1F4CA}',
    'PowerPoint': '\u{1F4D1}',
    'PPT': '\u{1F4D1}',
    'PPTX': '\u{1F4D1}',
    'JPG': '\u{1F5BC}',
    'JPEG': '\u{1F5BC}',
    'PNG': '\u{1F5BC}',
    'TXT': '\u{1F4C3}',
    'ZIP': '\u{1F4E6}',
    'Enlace': '\u{1F517}',
    'URL': '\u{1F517}'
  },

  obtenerIcono(tipo) {
    return this.iconosTipo[tipo] || '\u{1F4CE}';
  },

  formatearFecha(fechaISO) {
    if (!fechaISO) return '\u2014';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
  },

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },

  SectionHero(data) {
    const color = TEMPLATES_COLOR[data.bannerColor] || TEMPLATES_COLOR['gradient-1'];
    return `
      <section class="hero hero-maya" style="background: ${color};">
        <div class="container">
          <div class="hero-content">
            <h2>${this.escapeHTML(data.hero?.titulo || data.titulo)}</h2>
            <p>${this.escapeHTML(data.hero?.descripcion || data.descripcion)}</p>
          </div>
        </div>
      </section>
    `;
  },

  BannerCard(data) {
    const color = TEMPLATES_COLOR[data.bannerColor] || TEMPLATES_COLOR['gradient-1'];
    const slug = this.escapeHTML(data.slug || '');
    return `
      <div class="maya-banner seccion-banner" data-slug="${slug}" style="background: ${color}; cursor: pointer;">
        <div class="maya-banner-content">
          <div class="maya-banner-icono">${data.icono || '\u{1F4CB}'}</div>
          <div class="maya-banner-texto">
            <h3>${this.escapeHTML(data.banner?.titulo || data.titulo)}</h3>
            <p>${this.escapeHTML(data.banner?.descripcion || data.descripcion)}</p>
          </div>
          <a href="#/seccion/${slug}" class="maya-banner-btn" onclick="event.stopPropagation();">Ir a Recursos \u2192</a>
        </div>
      </div>
    `;
  },

  NovedadCard(data) {
    const color = TEMPLATES_COLOR[data.bannerColor] || TEMPLATES_COLOR['gradient-1'];
    return `
      <div class="novedad-card" style="background: ${color};">
        <div class="novedad-icono">${data.icono || '\u{1F4CB}'}</div>
        <h3>${this.escapeHTML(data.titulo)}</h3>
        <p>${this.escapeHTML(data.descripcion)}</p>
        <a href="html/documentos.html" class="btn" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.4);">
          Ver en Recursos \u2192
        </a>
      </div>
    `;
  },

  SearchBar() {
    return `
      <div class="buscador-recursos" style="margin-top: 2rem;">
        <input type="text" id="buscador-seccion" placeholder="Buscar por t\u00edtulo, grupo o tipo de archivo...">
        <button type="button" id="btn-buscar-seccion">Buscar</button>
      </div>
    `;
  },

  Contador(actual, total) {
    if (actual === total) {
      return `Mostrando todos los recursos (${actual})`;
    }
    return `${actual} recursos encontrados`;
  },

  ResourceCard(item) {
    const icono = this.obtenerIcono(item.tipo);
    const fecha = this.formatearFecha(item.fecha);
    const tituloEscaped = this.escapeHTML(item.titulo);
    const descEscaped = this.escapeHTML(item.descripcion);
    const rutaEscaped = item.enlace ? item.enlace.replace(/"/g, '\\"') : '';
    const tipoEscaped = this.escapeHTML(item.tipo);

    let footerHtml;
    if (item.esEnlace || item.tipo === 'URL') {
      footerHtml = `<a href="${item.enlace}" class="btn-recurso" target="_blank">Abrir Enlace \u{1F517}</a>`;
    } else {
      footerHtml = `
        <div class="recurso-acciones">
          <button class="btn-preview" onclick='Engine.abrirPreview("${rutaEscaped}", "${tituloEscaped.replace(/"/g, '&quot;')}", "${tipoEscaped}")'>Vista Previa</button>
          <button class="btn-recurso" onclick='Engine.descargarArchivo("${rutaEscaped}", "${tituloEscaped.replace(/"/g, '&quot;')}", "${tipoEscaped}")'>Descargar</button>
        </div>
      `;
    }

    return `
      <div class="recurso-card">
        <div class="recurso-header">
          <span class="recurso-categoria">${this.escapeHTML(item.grupo)}</span>
          <span class="recurso-tipo-badge tipo-${item.tipo?.toLowerCase()}">${tipoEscaped}</span>
        </div>
        <div class="recurso-body">
          <h3 class="recurso-titulo">${tituloEscaped}</h3>
          <p class="recurso-descripcion">${descEscaped}</p>
          <div class="recurso-meta">
            <span class="recurso-tipo">${icono} ${tipoEscaped}</span>
            ${item.tamaño ? `<span class="recurso-tama\u00f1o">\u2022 ${this.escapeHTML(item.tamaño)}</span>` : ''}
            <span class="recurso-fecha">\u2022 ${fecha}</span>
          </div>
        </div>
        <div class="recurso-footer">
          ${footerHtml}
        </div>
      </div>
    `;
  },

  GroupedResources(recursos) {
    if (!recursos || recursos.length === 0) {
      return `
        <div id="sin-resultados" class="sin-resultados" style="display: block;">
          <h3>No se encontraron recursos</h3>
          <p>Intenta con otros t\u00e9rminos de b\u00fasqueda</p>
        </div>
      `;
    }

    const grupos = {};
    const ordenGrupos = [];

    recursos.forEach(r => {
      const g = r.grupo || 'Sin grupo';
      if (!grupos[g]) {
        grupos[g] = {};
        ordenGrupos.push(g);
      }
      const t = r.tipo || 'Otro';
      if (!grupos[g][t]) grupos[g][t] = [];
      grupos[g][t].push(r);
    });

    const tiposOrden = ['PDF', 'Word', 'Excel', 'PowerPoint', 'JPG', 'JPEG', 'PNG', 'TXT', 'Enlace', 'URL'];

    let html = '';
    ordenGrupos.forEach(nombreGrupo => {
      html += `
        <div class="maya-grupo" data-grupo="${this.escapeHTML(nombreGrupo)}">
          <div class="maya-grupo-header">
            <h3 class="maya-grupo-titulo">${this.escapeHTML(nombreGrupo)}</h3>
          </div>
      `;

      const tiposEnGrupo = Object.keys(grupos[nombreGrupo]);
      tiposEnGrupo.sort((a, b) => {
        const ia = tiposOrden.indexOf(a);
        const ib = tiposOrden.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });

      tiposEnGrupo.forEach(tipo => {
        const items = grupos[nombreGrupo][tipo];

        html += `
          <div class="maya-subtipo">
            <div class="maya-subtipo-header">
              <span class="maya-subtipo-icono">${this.obtenerIcono(tipo)}</span>
              <span class="maya-subtipo-nombre">${this.escapeHTML(tipo)}</span>
            </div>
            <div class="recursos-grid">
        `;

        items.forEach(item => {
          html += this.ResourceCard(item);
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    return html;
  },

  ModalPreview() {
    return `
      <div id="modal-preview" class="modal-overlay" style="display: none;">
        <div class="modal-contenido">
          <div class="modal-header">
            <h3 id="modal-titulo-preview">Vista Previa</h3>
            <button class="modal-cerrar" onclick="Engine.cerrarPreview()">&times;</button>
          </div>
          <div class="modal-cuerpo" id="modal-cuerpo-preview">
          </div>
        </div>
      </div>
    `;
  },

  NoResults(term) {
    return `
      <div id="sin-resultados" class="sin-resultados" style="display: block;">
        <h3>No se encontraron recursos</h3>
        <p>${term ? `No hay resultados para "${this.escapeHTML(term)}"` : 'Intenta con otros t\u00e9rminos de b\u00fasqueda'}</p>
      </div>
    `;
  },

  BackButton() {
    return `<button id="btn-volver-recursos" class="btn-preview" style="margin-bottom: 1.5rem;">\u2190 Volver a Recursos</button>`;
  },

  // --- Funciones utilitarias (copiadas de maya.js para mantener compatibilidad) ---

  async descargarArchivo(url, nombre, tipo) {
    const urlConAttach = url + (url.includes('?') ? '&' : '?') + 'fl_attachment=1';
    try {
      const res = await fetch(urlConAttach);
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
      const win = window.open(urlConAttach, '_blank');
      if (win) win.focus();
    }
  },

  abrirPreview(ruta, titulo, tipo) {
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
        <span class="no-preview-icon">\u{1F4C4}</span>
        <h3>Vista previa no disponible</h3>
        <p>Este formato (${tipo}) no permite vista previa en el navegador.</p>
        <p>Por favor descarga el archivo para visualizarlo.</p>
        <button class="btn-recurso" onclick='Engine.descargarArchivo("${ruta}", "${titulo}", "${tipo}")' style="margin-top:1rem;">Descargar ${tipo}</button>
      `;
      modalCuerpo.appendChild(noPreview);
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  cerrarPreview() {
    const modal = document.getElementById('modal-preview');
    const modalCuerpo = document.getElementById('modal-cuerpo-preview');
    if (!modal) return;
    modalCuerpo.innerHTML = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
  },

  initModalCloseOnOutsideClick() {
    window.addEventListener('click', function(e) {
      const modal = document.getElementById('modal-preview');
      if (e.target === modal) Engine.cerrarPreview();
    });
  }
};
