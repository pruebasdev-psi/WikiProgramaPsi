const RecursosApp = {
  secciones: [],
  recursosSeccion: {},
  currentView: 'list',
  currentSlug: null,

  async init() {
    Engine.initModalCloseOnOutsideClick();
    try {
      await this.cargarSecciones();
    } catch (e) {
      this.mostrarEstado('Error al cargar secciones: ' + e.message);
    }
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  mostrarEstado(msg) {
    const contenedor = document.getElementById('banners-secciones');
    if (!contenedor) return;
    contenedor.style.display = 'block';
    contenedor.innerHTML = `<p style="padding:1rem;background:var(--color5);border-radius:8px;text-align:center;color:var(--text-dark);">${msg}</p>`;
  },

  async cargarSecciones() {
    if (typeof db === 'undefined' || !db) {
      this.mostrarEstado('Firebase no está conectado. Verifica firebase-config.js');
      return;
    }
    try {
      const snapshot = await db.collection('secciones').get();
      this.secciones = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.activo !== false) {
          this.secciones.push({ id: doc.id, ...data });
        }
      });
      this.secciones.sort((a, b) => (a.orden || 999) - (b.orden || 999));
      if (this.secciones.length === 0) {
        this.mostrarEstado('No hay secciones disponibles. Crea una desde el panel de administración.');
        return;
      }
      this.renderBanners();
    } catch (e) {
      console.log('Error cargando secciones:', e.message);
      this.mostrarEstado('Error al conectar con Firestore: ' + e.message + '. Verifica la consola (F12) para más detalles.');
    }
  },

  renderBanners() {
    const contenedor = document.getElementById('banners-secciones');
    if (!contenedor) return;
    if (this.secciones.length === 0) {
      contenedor.style.display = 'none';
      return;
    }
    contenedor.style.display = 'block';
    contenedor.innerHTML = '<h2 style="margin-bottom:1.5rem; color: var(--color1);">Secciones disponibles</h2>';
    this.secciones.forEach(sec => {
      contenedor.insertAdjacentHTML('beforeend', Engine.BannerCard(sec));
    });
    contenedor.querySelectorAll('.seccion-banner').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const slug = el.dataset.slug;
        if (slug) {
          window.location.hash = `#/seccion/${slug}`;
        }
      });
    });
  },

  renderBannersDesdeLocal() {
    const contenedor = document.getElementById('banners-secciones');
    if (!contenedor) return;
    contenedor.style.display = 'none';
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || '';
    const match = hash.match(/^\/seccion\/(.+)/);

    if (match) {
      const slug = decodeURIComponent(match[1]);
      this.mostrarSeccion(slug);
    } else {
      this.mostrarLista();
    }
  },

  mostrarError(msg) {
    const contenedor = document.getElementById('seccion-contenido') ||
      document.getElementById('seccion-view');
    if (contenedor) {
      contenedor.innerHTML = `<p class="admin-error" style="text-align:center;padding:2rem;">${msg}</p>`;
    }
  },

  mostrarLista() {
    this.currentView = 'list';
    this.currentSlug = null;

    const seccionView = document.getElementById('seccion-view');
    const listaView = document.getElementById('lista-view');
    const banners = document.getElementById('banners-secciones');
    if (seccionView) seccionView.style.display = 'none';
    if (listaView) listaView.style.display = 'block';
    if (banners) banners.style.display = '';

    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
  },

  async mostrarSeccion(slug) {
    this.currentView = 'section';
    this.currentSlug = slug;

    const seccion = this.secciones.find(s => s.slug === slug);
    if (!seccion) {
      this.mostrarError(`Sección "${slug}" no encontrada. Verifica que exista en Firestore.`);
      return;
    }

    const listaView = document.getElementById('lista-view');
    const seccionView = document.getElementById('seccion-view');
    const banners = document.getElementById('banners-secciones');
    if (!seccionView) {
      this.mostrarError('Error: #seccion-view no existe en el DOM');
      return;
    }
    if (listaView) listaView.style.display = 'none';
    if (banners) banners.style.display = 'none';
    seccionView.style.display = 'block';

    seccionView.innerHTML = Engine.BackButton();
    seccionView.insertAdjacentHTML('beforeend', Engine.SectionHero(seccion));
    seccionView.insertAdjacentHTML('beforeend', `<div class="container" id="seccion-contenido"></div>`);

    const volverBtn = document.getElementById('btn-volver-recursos');
    if (volverBtn) {
      volverBtn.addEventListener('click', () => {
        window.location.hash = '#/';
      });
    }

    const contenedor = document.getElementById('seccion-contenido');
    if (!contenedor) {
      this.mostrarError('Error al crear contenedor de sección');
      return;
    }
    contenedor.innerHTML = '<p class="admin-loading">Cargando recursos...</p>';

    await this.cargarRecursosSeccion(slug);
    this.renderVistaSeccion(seccion, slug);

    seccionView.scrollIntoView({ behavior: 'smooth' });
  },

  async cargarRecursosSeccion(slug) {
    if (typeof db === 'undefined' || !db) {
      this.recursosSeccion[slug] = [];
      return;
    }

    try {
      const snapshot = await db.collection('seccion_recursos')
        .where('seccionSlug', '==', slug)
        .get();
      this.recursosSeccion[slug] = [];
      snapshot.forEach(doc => {
        this.recursosSeccion[slug].push({ id: doc.id, ...doc.data() });
      });
      this.recursosSeccion[slug].sort((a, b) => (a.orden || 999) - (b.orden || 999));
    } catch (e) {
      console.log('Error cargando recursos de sección:', e.message);
      this.recursosSeccion[slug] = [];
    }
  },

  renderVistaSeccion(seccion, slug) {
    const contenedor = document.getElementById('seccion-contenido');
    if (!contenedor) return;

    const recursos = this.recursosSeccion[slug] || [];
    const total = recursos.length;

    contenedor.innerHTML = '';
    contenedor.insertAdjacentHTML('beforeend', Engine.SearchBar());
    contenedor.insertAdjacentHTML('beforeend', `
      <div class="contador-resultados">
        <span id="contador-seccion">${Engine.Contador(total, total)}</span>
      </div>
    `);
    contenedor.insertAdjacentHTML('beforeend', `<div id="lista-recursos-seccion"></div>`);

    const listaRecursos = document.getElementById('lista-recursos-seccion');
    this._renderRecursosFiltrados(recursos, listaRecursos);

    const buscador = document.getElementById('buscador-seccion');
    const btnBuscar = document.getElementById('btn-buscar-seccion');

    const filtrar = () => {
      const termino = buscador.value.toLowerCase().trim();
      let filtrados = recursos;
      if (termino) {
        filtrados = recursos.filter(r =>
          (r.titulo || '').toLowerCase().includes(termino) ||
          (r.descripcion || '').toLowerCase().includes(termino) ||
          (r.grupo || '').toLowerCase().includes(termino) ||
          (r.tipo || '').toLowerCase().includes(termino)
        );
      }
      this._renderRecursosFiltrados(filtrados, listaRecursos);
      document.getElementById('contador-seccion').textContent = Engine.Contador(filtrados.length, total);
    };

    btnBuscar.addEventListener('click', filtrar);
    buscador.addEventListener('keypress', (e) => { if (e.key === 'Enter') filtrar(); });
    buscador.addEventListener('input', () => {
      if (buscador.value === '') filtrar();
    });
  },

  _renderRecursosFiltrados(recursos, contenedor) {
    contenedor.innerHTML = '';
    if (recursos.length === 0) {
      contenedor.innerHTML = Engine.NoResults();
      return;
    }
    contenedor.innerHTML = Engine.GroupedResources(recursos);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  RecursosApp.init();
});
