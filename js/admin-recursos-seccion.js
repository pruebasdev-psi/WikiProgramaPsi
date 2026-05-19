const AdminRecursosSeccion = {
  secciones: [],
  recursos: [],
  editandoId: null,
  archivoSeleccionado: null,
  seccionSeleccionada: null,

  async init() {
    await this.cargarSecciones();
  },

  renderFormulario() {
    return `
      <div class="admin-form-card">
        <h3>Gestión de Recursos por Sección</h3>

        <div class="admin-field">
          <label for="rs-seccion">Seleccionar Sección *</label>
          <select id="rs-seccion" required>
            <option value="">— Seleccionar sección —</option>
          </select>
        </div>

        <hr style="margin:1.5rem 0;border-color:var(--color5);">

        <h4 id="rs-form-title" style="margin-bottom:1rem;color:var(--color1);">Nuevo Recurso en Sección</h4>
        <form id="rs-form" autocomplete="off">
          <input type="hidden" id="rs-edit-id" value="">

          <div class="admin-field">
            <label for="rs-titulo">Título del recurso *</label>
            <input type="text" id="rs-titulo" required placeholder="Ej: Manual PAC 2026">
          </div>

          <div class="admin-field">
            <label for="rs-descripcion">Descripción *</label>
            <textarea id="rs-descripcion" rows="2" required placeholder="Descripción del recurso..."></textarea>
          </div>

          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="rs-grupo">Grupo *</label>
              <input type="text" id="rs-grupo" required placeholder="Ej: Guías y Manuales">
              <span class="admin-field-hint">Escribe el nombre del grupo. Los recursos se agruparán automáticamente.</span>
            </div>
            <div class="admin-field">
              <label for="rs-tipo">Tipo *</label>
              <select id="rs-tipo" required>
                <option value="">— Seleccionar tipo —</option>
                <option value="PDF">PDF</option>
                <option value="Word">Word</option>
                <option value="Excel">Excel</option>
                <option value="PowerPoint">PowerPoint</option>
                <option value="JPG">JPG</option>
                <option value="JPEG">JPEG</option>
                <option value="PNG">PNG</option>
                <option value="TXT">TXT</option>
                <option value="Enlace">Enlace</option>
              </select>
              <span class="admin-field-hint">Selecciona el tipo de archivo o recurso.</span>
            </div>
          </div>

          <div class="admin-form-grid">
            <div class="admin-field">
              <label for="rs-tamaño">Tamaño (opcional)</label>
              <input type="text" id="rs-tamaño" placeholder="Ej: 2.5 MB">
            </div>
            <div class="admin-field">
              <label for="rs-fecha">Fecha (opcional)</label>
              <input type="date" id="rs-fecha">
            </div>
          </div>

          <div class="admin-field">
            <label for="rs-enlace">Archivo o URL *</label>
            <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
              <button type="button" id="rs-tipo-enlace-btn" class="btn-preview" style="flex:0;padding:0.4rem 1rem;">Subir archivo</button>
              <span id="rs-tipo-enlace-label" style="font-size:0.85rem;opacity:0.7;">Modo: archivo</span>
            </div>
            <input type="file" id="rs-archivo" accept=".pdf,.docx,.xlsx,.doc,.xls,.pptx,.txt,.zip,.png,.jpg">
            <input type="url" id="rs-url" style="display:none;" placeholder="https://...">
            <input type="hidden" id="rs-es-enlace" value="false">
            <span class="admin-field-hint" id="rs-file-hint">Sube el archivo desde tu computadora o pega una URL externa</span>
          </div>

          <div id="rs-upload-progress" class="admin-progress" style="display:none;">
            <div class="admin-progress-bar" id="rs-progress-bar"></div>
            <span id="rs-progress-text">Subiendo...</span>
          </div>

          <div class="admin-form-actions">
            <button type="submit" id="btn-guardar-rs" class="btn-recurso">Agregar Recurso</button>
            <button type="button" id="btn-cancelar-rs" class="btn-preview" style="display:none;">Cancelar</button>
          </div>
        </form>
      </div>
    `;
  },

  renderLista() {
    return `
      <div class="admin-list-card">
        <h3>Recursos de la Sección</h3>
        <p id="rs-sin-seccion" class="admin-empty">Selecciona una sección para ver sus recursos</p>
        <div id="lista-rs-admin" style="display:none;">
          <p class="admin-loading">Cargando recursos...</p>
        </div>
      </div>
    `;
  },

  async cargarSecciones() {
    if (!db) return;
    try {
      const snapshot = await db.collection('secciones').get();
      this.secciones = [];
      snapshot.forEach(doc => {
        this.secciones.push({ id: doc.id, ...doc.data() });
      });
      this.secciones.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
      this.llenarSelectorSecciones();
    } catch (e) {
      console.log('Error cargando secciones:', e.message);
    }
  },

  llenarSelectorSecciones() {
    const select = document.getElementById('rs-seccion');
    if (!select) return;
    select.innerHTML = '<option value="">— Seleccionar sección —</option>';
    this.secciones.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.slug;
      opt.textContent = `${sec.icono || '📋'} ${sec.titulo}`;
      select.appendChild(opt);
    });
  },

  async cargarRecursos(slug) {
    if (!db || !slug) {
      this.recursos = [];
      this.renderListaRecursos();
      return;
    }
    try {
      const snapshot = await db.collection('seccion_recursos')
        .where('seccionSlug', '==', slug)
        .get();
      this.recursos = [];
      snapshot.forEach(doc => {
        this.recursos.push({ id: doc.id, ...doc.data() });
      });
      this.recursos.sort((a, b) => (a.orden || 999) - (b.orden || 999));
      this.renderListaRecursos();
    } catch (e) {
      document.getElementById('lista-rs-admin').innerHTML = `<p class="admin-error">Error: ${e.message}</p>`;
    }
  },

  renderListaRecursos() {
    const contenedor = document.getElementById('lista-rs-admin');
    const sinSeccion = document.getElementById('rs-sin-seccion');
    if (!contenedor || !sinSeccion) return;

    if (!this.seccionSeleccionada) {
      contenedor.style.display = 'none';
      sinSeccion.style.display = 'block';
      return;
    }

    sinSeccion.style.display = 'none';
    contenedor.style.display = 'block';

    if (this.recursos.length === 0) {
      contenedor.innerHTML = '<p class="admin-empty">No hay recursos en esta sección. Agrega el primero usando el formulario.</p>';
      return;
    }

    contenedor.innerHTML = '';
    this.recursos.forEach(r => {
      const div = document.createElement('div');
      div.className = 'admin-item';
      div.innerHTML = `
        <div class="admin-item-info">
          <div class="admin-item-icon">${Engine.obtenerIcono(r.tipo)}</div>
          <div class="admin-item-data">
            <strong>${r.titulo}</strong>
            <span class="admin-item-meta">${r.grupo || '—'} • ${r.tipo || '—'} ${r.tamaño ? '• ' + r.tamaño : ''}</span>
            <p class="admin-item-desc">${r.descripcion || ''}</p>
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="btn-preview admin-btn-sm" onclick="AdminRecursosSeccion.editar('${r.id}')">✏️</button>
          <button class="btn-recurso admin-btn-sm" onclick="AdminRecursosSeccion.eliminar('${r.id}')">🗑️</button>
        </div>
      `;
      contenedor.appendChild(div);
    });
  },

  llenarFormulario(r) {
    document.getElementById('rs-edit-id').value = r.id;
    document.getElementById('rs-titulo').value = r.titulo || '';
    document.getElementById('rs-descripcion').value = r.descripcion || '';
    document.getElementById('rs-grupo').value = r.grupo || '';
    const normalizarTipo = (t) => {
      const mapa = {
        'docx': 'Word', 'doc': 'Word',
        'xlsx': 'Excel', 'xls': 'Excel',
        'pptx': 'PowerPoint', 'ppt': 'PowerPoint',
        'jpg': 'JPG', 'jpeg': 'JPEG',
        'png': 'PNG', 'txt': 'TXT',
        'pdf': 'PDF', 'url': 'Enlace'
      };
      return mapa[t.toLowerCase()] || t;
    };
    document.getElementById('rs-tipo').value = r.tipo ? normalizarTipo(r.tipo) : '';
    document.getElementById('rs-tamaño').value = r.tamaño || '';
    document.getElementById('rs-fecha').value = r.fecha || '';
    document.getElementById('rs-es-enlace').value = r.esEnlace ? 'true' : 'false';

    if (r.esEnlace) {
      document.getElementById('rs-archivo').style.display = 'none';
      document.getElementById('rs-url').style.display = 'block';
      document.getElementById('rs-url').value = r.enlace || '';
      document.getElementById('rs-tipo-enlace-label').textContent = 'Modo: URL externa';
      document.getElementById('rs-tipo-enlace-btn').textContent = 'Subir archivo';
    } else {
      document.getElementById('rs-archivo').style.display = 'block';
      document.getElementById('rs-url').style.display = 'none';
      document.getElementById('rs-tipo-enlace-label').textContent = 'Modo: archivo';
      document.getElementById('rs-tipo-enlace-btn').textContent = 'Usar URL externa';
    }

    document.getElementById('rs-file-hint').textContent = r.enlace ? `Enlace actual: ${r.enlace}` : 'Sube un archivo desde tu computadora';
    document.getElementById('rs-form-title').textContent = 'Editar Recurso';
    document.getElementById('btn-guardar-rs').textContent = 'Guardar Cambios';
    document.getElementById('btn-cancelar-rs').style.display = 'inline-block';
  },

  limpiarFormulario() {
    document.getElementById('rs-form').reset();
    document.getElementById('rs-edit-id').value = '';
    document.getElementById('rs-url').style.display = 'none';
    document.getElementById('rs-archivo').style.display = 'block';
    document.getElementById('rs-tipo-enlace-label').textContent = 'Modo: archivo';
    document.getElementById('rs-tipo-enlace-btn').textContent = 'Usar URL externa';
    document.getElementById('rs-file-hint').textContent = 'Sube el archivo desde tu computadora o pega una URL externa';
    document.getElementById('rs-es-enlace').value = 'false';
    document.getElementById('rs-tipo').value = '';
    document.getElementById('rs-form-title').textContent = 'Nuevo Recurso en Sección';
    document.getElementById('btn-guardar-rs').textContent = 'Agregar Recurso';
    document.getElementById('btn-cancelar-rs').style.display = 'none';
    this.archivoSeleccionado = null;
  },

  async guardar(e) {
    e.preventDefault();
    if (!db) { alert('Firebase no conectado'); return; }
    if (!this.seccionSeleccionada) { alert('Selecciona una sección primero'); return; }

    const editId = document.getElementById('rs-edit-id').value;
    const titulo = document.getElementById('rs-titulo').value.trim();
    const descripcion = document.getElementById('rs-descripcion').value.trim();
    const grupo = document.getElementById('rs-grupo').value.trim();
    const tipo = document.getElementById('rs-tipo').value.trim();
    const tamaño = document.getElementById('rs-tamaño').value.trim();
    const fecha = document.getElementById('rs-fecha').value;
    const esEnlace = document.getElementById('rs-es-enlace').value === 'true';

    if (!titulo || !descripcion || !grupo || !tipo) {
      alert('Completa título, descripción, grupo y tipo');
      return;
    }

    const btn = document.getElementById('btn-guardar-rs');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    const progress = document.getElementById('rs-upload-progress');
    const progressBar = document.getElementById('rs-progress-bar');
    const progressText = document.getElementById('rs-progress-text');

    try {
      let enlace = '';

      if (!editId && !esEnlace && this.archivoSeleccionado) {
        progress.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = 'Subiendo archivo...';

        const urlCloudinary = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

        enlace = await new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', this.archivoSeleccionado);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', urlCloudinary);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = (e.loaded / e.total) * 100;
              progressBar.style.width = pct + '%';
              progressText.textContent = `Subiendo... ${Math.round(pct)}%`;
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                if (data.secure_url) resolve(data.secure_url);
                else reject(new Error('Cloudinary no devolvió URL'));
              } catch (pe) { reject(new Error('Error al leer respuesta')); }
            } else {
              reject(new Error('Error al subir (código ' + xhr.status + ')'));
            }
          };
          xhr.onerror = () => reject(new Error('Error de conexión'));
          xhr.send(formData);
        });

        progressText.textContent = 'Archivo subido ✓';
      } else if (esEnlace) {
        enlace = document.getElementById('rs-url').value.trim();
        if (!enlace) { alert('Ingresa una URL'); btn.disabled = false; btn.textContent = 'Agregar Recurso'; return; }
      } else if (editId) {
        const original = this.recursos.find(r => r.id === editId);
        enlace = original?.enlace || '';
        if (!enlace && this.archivoSeleccionado) {
          progress.style.display = 'block';
          progressBar.style.width = '0%';
          progressText.textContent = 'Subiendo archivo...';
          const urlCloudinary = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
          enlace = await new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', this.archivoSeleccionado);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', urlCloudinary);
            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const pct = (e.loaded / e.total) * 100;
                progressBar.style.width = pct + '%';
                progressText.textContent = `Subiendo... ${Math.round(pct)}%`;
              }
            };
            xhr.onload = () => {
              if (xhr.status === 200) {
                try { const data = JSON.parse(xhr.responseText); if (data.secure_url) resolve(data.secure_url); else reject(new Error('Sin URL')); }
                catch (pe) { reject(new Error('Error al leer')); }
              } else { reject(new Error('Error (código ' + xhr.status + ')')); }
            };
            xhr.onerror = () => reject(new Error('Error de conexión'));
            xhr.send(formData);
          });
          progressText.textContent = 'Archivo subido ✓';
        }
      } else {
        alert('Debes subir un archivo o ingresar una URL');
        btn.disabled = false;
        btn.textContent = 'Agregar Recurso';
        return;
      }

      const data = {
        seccionSlug: this.seccionSeleccionada,
        titulo,
        descripcion,
        grupo,
        tipo,
        tamaño,
        fecha: fecha || new Date().toISOString().split('T')[0],
        enlace,
        esEnlace,
        orden: this.recursos.length + 1
      };

      if (editId) {
        await db.collection('seccion_recursos').doc(editId).update(data);
      } else {
        await db.collection('seccion_recursos').add(data);
      }

      this.limpiarFormulario();
      await this.cargarRecursos(this.seccionSeleccionada);
      btn.textContent = 'Agregar Recurso';
      btn.disabled = false;
      progress.style.display = 'none';
      alert('Recurso guardado correctamente ✓');

    } catch (error) {
      alert('Error: ' + error.message);
      console.error(error);
      btn.textContent = editId ? 'Guardar Cambios' : 'Agregar Recurso';
      btn.disabled = false;
      progress.style.display = 'none';
    }
  },

  async editar(id) {
    const r = this.recursos.find(x => x.id === id);
    if (!r) return;
    this.llenarFormulario(r);
  },

  async eliminar(id) {
    if (!confirm('¿Eliminar este recurso?')) return;
    if (!db) return;
    try {
      await db.collection('seccion_recursos').doc(id).delete();
      await this.cargarRecursos(this.seccionSeleccionada);
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  toggleTipoEnlace() {
    const esEnlace = document.getElementById('rs-es-enlace');
    const archivo = document.getElementById('rs-archivo');
    const url = document.getElementById('rs-url');
    const btn = document.getElementById('rs-tipo-enlace-btn');
    const label = document.getElementById('rs-tipo-enlace-label');

    if (esEnlace.value === 'true') {
      esEnlace.value = 'false';
      archivo.style.display = 'block';
      url.style.display = 'none';
      label.textContent = 'Modo: archivo';
      btn.textContent = 'Usar URL externa';
    } else {
      esEnlace.value = 'true';
      archivo.style.display = 'none';
      url.style.display = 'block';
      label.textContent = 'Modo: URL externa';
      btn.textContent = 'Subir archivo';
      document.getElementById('rs-tipo').value = 'Enlace';
    }
  },

  initEventListeners() {
    document.getElementById('rs-form')?.addEventListener('submit', (e) => this.guardar(e));
    document.getElementById('btn-cancelar-rs')?.addEventListener('click', () => this.limpiarFormulario());
    document.getElementById('rs-tipo-enlace-btn')?.addEventListener('click', () => this.toggleTipoEnlace());

    document.getElementById('rs-archivo')?.addEventListener('change', (e) => {
      this.archivoSeleccionado = e.target.files[0];
      if (this.archivoSeleccionado) {
        document.getElementById('rs-file-hint').textContent = `${this.archivoSeleccionado.name}`;
        const ext = this.archivoSeleccionado.name.split('.').pop().toLowerCase();
        const mapa = {
          pdf: 'PDF', docx: 'Word', doc: 'Word',
          xlsx: 'Excel', xls: 'Excel',
          pptx: 'PowerPoint', ppt: 'PowerPoint',
          jpg: 'JPG', jpeg: 'JPEG',
          png: 'PNG', txt: 'TXT'
        };
        if (mapa[ext]) {
          document.getElementById('rs-tipo').value = mapa[ext];
        }
      }
    });

    document.getElementById('rs-seccion')?.addEventListener('change', async (e) => {
      this.seccionSeleccionada = e.target.value || null;
      this.limpiarFormulario();
      if (this.seccionSeleccionada) {
        await this.cargarRecursos(this.seccionSeleccionada);
      } else {
        this.recursos = [];
        this.renderListaRecursos();
      }
    });
  }
};
