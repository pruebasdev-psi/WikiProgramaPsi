const AdminSecciones = {
  secciones: [],
  editandoId: null,

  async init() {
    await this.cargarSecciones();
  },

  renderFormulario() {
    return `
      <div class="admin-form-card">
        <h3 id="seccion-form-title">Nueva Sección</h3>
        <form id="seccion-form" autocomplete="off">
          <input type="hidden" id="seccion-edit-id" value="">

          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="sec-titulo">Título de la sección *</label>
              <input type="text" id="sec-titulo" required placeholder="Ej: Actualización de Malla Curricular">
            </div>
            <div class="admin-field">
              <label for="sec-icono">Icono (emoji)</label>
              <input type="text" id="sec-icono" placeholder="📋" maxlength="10" style="font-size:1.5rem;text-align:center;">
            </div>
          </div>

          <div class="admin-field">
            <label for="sec-descripcion">Descripción corta *</label>
            <textarea id="sec-descripcion" rows="2" required placeholder="Breve descripción de la sección..."></textarea>
          </div>

          <div class="admin-field">
            <label>Color del banner</label>
            <div class="color-palette" id="color-palette">
              ${COLOR_PALETTES.map((c, i) => `
                <div class="color-option ${i === 0 ? 'selected' : ''}" data-color="${c.id}" style="background: ${c.gradient};" title="${c.nombre}">
                  ${i === 0 ? '✓' : ''}
                </div>
              `).join('')}
            </div>
            <input type="hidden" id="sec-banner-color" value="gradient-1">
          </div>

          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="sec-hero-titulo">Título del Hero</label>
              <input type="text" id="sec-hero-titulo" placeholder="Título grande de la página de la sección">
            </div>
            <div class="admin-field">
              <label for="sec-hero-desc">Descripción del Hero</label>
              <textarea id="sec-hero-desc" rows="2" placeholder="Descripción que aparece en el hero de la página"></textarea>
            </div>
          </div>

          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="sec-banner-titulo">Título del Banner</label>
              <input type="text" id="sec-banner-titulo" placeholder="Título del banner promocional">
            </div>
            <div class="admin-field">
              <label for="sec-banner-desc">Descripción del Banner</label>
              <textarea id="sec-banner-desc" rows="2" placeholder="Descripción del banner promocional"></textarea>
            </div>
          </div>

          <div class="admin-form-actions">
            <button type="submit" id="btn-guardar-seccion" class="btn-recurso">Crear Sección</button>
            <button type="button" id="btn-cancelar-seccion" class="btn-preview" style="display:none;">Cancelar</button>
          </div>
        </form>
      </div>
    `;
  },

  renderLista() {
    return `
      <div class="admin-list-card">
        <h3>Secciones Existentes</h3>
        <div id="lista-secciones-admin">
          <p class="admin-loading">Cargando secciones...</p>
        </div>
      </div>
    `;
  },

  async cargarSecciones() {
    if (!db) {
      document.getElementById('lista-secciones-admin').innerHTML = '<p class="admin-error">Firebase no conectado</p>';
      return;
    }
    try {
      const snapshot = await db.collection('secciones').get();
      this.secciones = [];
      snapshot.forEach(doc => {
        this.secciones.push({ id: doc.id, ...doc.data() });
      });
      this.secciones.sort((a, b) => (a.orden || 999) - (b.orden || 999));
      this.renderListaSecciones();
    } catch (e) {
      document.getElementById('lista-secciones-admin').innerHTML = `<p class="admin-error">Error: ${e.message}</p>`;
    }
  },

  renderListaSecciones() {
    const contenedor = document.getElementById('lista-secciones-admin');
    if (!contenedor) return;

    if (this.secciones.length === 0) {
      contenedor.innerHTML = '<p class="admin-empty">No hay secciones todavía. Crea la primera usando el formulario.</p>';
      return;
    }

    contenedor.innerHTML = '';
    this.secciones.forEach(sec => {
      const div = document.createElement('div');
      div.className = 'admin-item';
      const color = TEMPLATES_COLOR[sec.bannerColor] || TEMPLATES_COLOR['gradient-1'];
      div.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-icon" style="font-size:2rem;">${sec.icono || '📋'}</div>
          <div class="admin-item-data">
            <strong>${sec.titulo}</strong>
            <span class="admin-item-meta">slug: ${sec.slug || '—'} • template: ${sec.template || 'maya'} • orden: ${sec.orden || '—'}</span>
            <div style="display:flex;gap:0.5rem;align-items:center;margin-top:0.3rem;">
              <span style="display:inline-block;width:60px;height:20px;border-radius:4px;background:${color};"></span>
              <span style="font-size:0.8rem;opacity:0.6;">${sec.activo !== false ? '✓ Activo' : '✗ Inactivo'}</span>
            </div>
            <p class="admin-item-desc">${sec.descripcion || ''}</p>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-preview admin-btn-sm" onclick="AdminSecciones.editar('${sec.id}')">✏️</button>
          <button class="btn-recurso admin-btn-sm" onclick="AdminSecciones.eliminar('${sec.id}')">🗑️</button>
        </div>
      `;
      contenedor.appendChild(div);
    });
  },

  llenarFormulario(sec) {
    document.getElementById('seccion-edit-id').value = sec.id;
    document.getElementById('sec-titulo').value = sec.titulo || '';
    document.getElementById('sec-icono').value = sec.icono || '';
    document.getElementById('sec-descripcion').value = sec.descripcion || '';
    document.getElementById('sec-banner-color').value = sec.bannerColor || 'gradient-1';
    document.getElementById('sec-hero-titulo').value = sec.hero?.titulo || '';
    document.getElementById('sec-hero-desc').value = sec.hero?.descripcion || '';
    document.getElementById('sec-banner-titulo').value = sec.banner?.titulo || '';
    document.getElementById('sec-banner-desc').value = sec.banner?.descripcion || '';

    document.querySelectorAll('.color-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.color === (sec.bannerColor || 'gradient-1'));
      el.textContent = el.dataset.color === (sec.bannerColor || 'gradient-1') ? '✓' : '';
    });

    document.getElementById('seccion-form-title').textContent = 'Editar Sección';
    document.getElementById('btn-guardar-seccion').textContent = 'Guardar Cambios';
    document.getElementById('btn-cancelar-seccion').style.display = 'inline-block';
  },

  limpiarFormulario() {
    document.getElementById('seccion-form').reset();
    document.getElementById('seccion-edit-id').value = '';
    document.getElementById('seccion-form-title').textContent = 'Nueva Sección';
    document.getElementById('btn-guardar-seccion').textContent = 'Crear Sección';
    document.getElementById('btn-cancelar-seccion').style.display = 'none';
    document.getElementById('sec-banner-color').value = 'gradient-1';
    document.querySelectorAll('.color-option').forEach((el, i) => {
      el.classList.toggle('selected', i === 0);
      el.textContent = i === 0 ? '✓' : '';
    });
  },

  async guardar(e) {
    e.preventDefault();
    if (!db) { alert('Firebase no conectado'); return; }

    const editId = document.getElementById('seccion-edit-id').value;
    const titulo = document.getElementById('sec-titulo').value.trim();
    const icono = document.getElementById('sec-icono').value.trim() || '📋';
    const descripcion = document.getElementById('sec-descripcion').value.trim();
    const bannerColor = document.getElementById('sec-banner-color').value;
    const heroTitulo = document.getElementById('sec-hero-titulo').value.trim();
    const heroDesc = document.getElementById('sec-hero-desc').value.trim();
    const bannerTitulo = document.getElementById('sec-banner-titulo').value.trim();
    const bannerDesc = document.getElementById('sec-banner-desc').value.trim();

    if (!titulo || !descripcion) {
      alert('Completa título y descripción');
      return;
    }

    const slug = titulo.toLowerCase()
      .replace(/[^\w\sáéíóúñ]/g, '')
      .replace(/[á]/g, 'a').replace(/[é]/g, 'e').replace(/[í]/g, 'i').replace(/[ó]/g, 'o').replace(/[ú]/g, 'u').replace(/[ñ]/g, 'n')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const data = {
      titulo,
      slug,
      icono,
      descripcion,
      bannerColor,
      template: 'maya',
      activo: true,
      hero: {
        titulo: heroTitulo || titulo,
        descripcion: heroDesc || descripcion
      },
      banner: {
        titulo: bannerTitulo || titulo,
        descripcion: bannerDesc || descripcion
      }
    };

    try {
      if (editId) {
        await db.collection('secciones').doc(editId).update(data);
      } else {
        data.orden = this.secciones.length + 1;
        data.creado = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('secciones').add(data);
      }
      this.limpiarFormulario();
      await this.cargarSecciones();
      alert('Sección guardada correctamente ✓');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  async editar(id) {
    const sec = this.secciones.find(s => s.id === id);
    if (!sec) return;
    this.editandoId = id;
    this.llenarFormulario(sec);
    document.getElementById('dashboard-screen').scrollIntoView({ behavior: 'smooth' });
  },

  async eliminar(id) {
    if (!confirm('¿Eliminar esta sección permanentemente?')) return;
    if (!db) return;
    try {
      await db.collection('secciones').doc(id).delete();
      await this.cargarSecciones();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  initEventListeners() {
    document.getElementById('seccion-form')?.addEventListener('submit', (e) => this.guardar(e));
    document.getElementById('btn-cancelar-seccion')?.addEventListener('click', () => this.limpiarFormulario());
    document.getElementById('color-palette')?.addEventListener('click', (e) => {
      const option = e.target.closest('.color-option');
      if (!option) return;
      document.querySelectorAll('.color-option').forEach(el => {
        el.classList.remove('selected');
        el.textContent = '';
      });
      option.classList.add('selected');
      option.textContent = '✓';
      document.getElementById('sec-banner-color').value = option.dataset.color;
    });
  },


};
