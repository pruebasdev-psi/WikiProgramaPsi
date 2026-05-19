let recursosActuales = [];
let archivoSeleccionado = null;

// Login
document.getElementById('btn-login').addEventListener('click', () => {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', 'true');
        mostrarDashboard();
    } else {
        document.getElementById('login-error').textContent = 'Contraseña incorrecta';
    }
});

document.getElementById('admin-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-login').click();
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    document.getElementById('login-screen').style.display = '';
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('admin-password').value = '';
});

function mostrarDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard-screen').style.display = 'block';
    cargarRecursos();
    initTabs();
}

// Auto-login si ya está autenticado
if (sessionStorage.getItem('admin_auth') === 'true') {
    mostrarDashboard();
}

// ───── Tabs ─────

function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            const targetContent = document.getElementById('tab-' + target);
            if (targetContent) {
                targetContent.classList.add('active');
                renderTabContent(target);
            }
        });
    });

    // Render contenido del primer tab activo
    const activeTab = document.querySelector('.admin-tab.active');
    if (activeTab) renderTabContent(activeTab.dataset.tab);
}

function renderTabContent(tabName) {
    if (tabName === 'secciones') {
        const container = document.getElementById('admin-secciones-container');
        if (container && !container.hasChildNodes()) {
            container.innerHTML = AdminSecciones.renderFormulario() + AdminSecciones.renderLista();
            AdminSecciones.initEventListeners();
        }
        AdminSecciones.cargarSecciones();
    } else if (tabName === 'recursos-seccion') {
        const container = document.getElementById('admin-recursos-seccion-container');
        if (container && !container.hasChildNodes()) {
            container.innerHTML = AdminRecursosSeccion.renderFormulario() + AdminRecursosSeccion.renderLista();
            AdminRecursosSeccion.initEventListeners();
            AdminRecursosSeccion.cargarSecciones();
        }
        if (AdminRecursosSeccion.seccionSeleccionada) {
            AdminRecursosSeccion.cargarRecursos(AdminRecursosSeccion.seccionSeleccionada);
        }
    }
}

// ───── Archivo seleccionado (tab Archivos) ─────

document.getElementById('archivo').addEventListener('change', (e) => {
    archivoSeleccionado = e.target.files[0];
    if (archivoSeleccionado) {
        document.getElementById('file-hint').textContent = `${archivoSeleccionado.name} (${formatearBytes(archivoSeleccionado.size)})`;
    } else {
        document.getElementById('file-hint').textContent = 'Sube el archivo desde tu computadora';
    }
});

function formatearBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function obtenerIconoExtension(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const mapa = { pdf: '📄', docx: '📝', doc: '📝', xlsx: '📊', xls: '📊', pptx: '📑', ppt: '📑', zip: '📦', png: '🖼️', jpg: '🖼️', jpeg: '🖼️' };
    return mapa[ext] || '📎';
}

function obtenerTipoExtension(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const mapa = { pdf: 'PDF', docx: 'DOCX', doc: 'DOC', xlsx: 'XLSX', xls: 'XLS', pptx: 'PPTX', ppt: 'PPT', zip: 'ZIP', png: 'PNG', jpg: 'JPG', jpeg: 'JPEG' };
    return mapa[ext] || ext.toUpperCase();
}

// ───── Subir recurso (tab Archivos) ─────

document.getElementById('recurso-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!db) {
        alert('Firebase no está conectado. Revisa firebase-config.js.');
        return;
    }

    if (typeof CLOUDINARY_CLOUD_NAME === 'undefined' || typeof CLOUDINARY_UPLOAD_PRESET === 'undefined') {
        alert('Falta la configuración de Cloudinary. Revisa firebase-config.js.');
        return;
    }

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const categoria = document.getElementById('categoria').value;
    const destacado = document.getElementById('destacado').checked;
    const editId = document.getElementById('edit-id').value;

    if (!titulo || !descripcion || !categoria) {
        alert('Completa todos los campos obligatorios.');
        return;
    }

    const btn = document.getElementById('btn-submit');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    const progress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    try {
        let enlace = '';
        let tipo = 'PDF';
        let tamaño = '';

        if (archivoSeleccionado) {
            progress.style.display = 'block';
            progressBar.style.width = '0%';
            progressText.textContent = 'Subiendo archivo...';

            const urlCloudinary = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

            enlace = await new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', archivoSeleccionado);
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
                            if (data.secure_url) {
                                resolve(data.secure_url);
                            } else {
                                reject(new Error('Cloudinary no devolvió URL'));
                            }
                        } catch (parseErr) {
                            reject(new Error('Error al leer respuesta de Cloudinary'));
                        }
                    } else {
                        let msg = 'Error al subir archivo (código ' + xhr.status + ')';
                        try {
                            const err = JSON.parse(xhr.responseText);
                            if (err.error?.message) msg = err.error.message;
                        } catch (e) { /* ignorar */ }
                        reject(new Error(msg));
                    }
                };

                xhr.onerror = () => reject(new Error('Error de conexión con Cloudinary'));
                xhr.send(formData);
            });

            tipo = obtenerTipoExtension(archivoSeleccionado.name);
            tamaño = formatearBytes(archivoSeleccionado.size);
            progressText.textContent = 'Archivo subido ✓';
        }

        const data = {
            titulo,
            descripcion,
            categoria,
            tipo,
            tamaño,
            fecha: new Date().toISOString(),
            destacado,
            enlace
        };

        if (editId) {
            await db.collection('recursos').doc(editId).update(data);
        } else {
            await db.collection('recursos').add(data);
        }

        document.getElementById('recurso-form').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('form-title').textContent = 'Nuevo Recurso';
        document.getElementById('btn-cancel').style.display = 'none';
        document.getElementById('file-hint').textContent = 'Sube el archivo desde tu computadora';
        archivoSeleccionado = null;
        progress.style.display = 'none';

        btn.textContent = 'Subir Recurso';
        btn.disabled = false;

        cargarRecursos();
        alert('Recurso guardado correctamente ✓');

    } catch (error) {
        alert('Error al guardar: ' + error.message + '\n\nRevisa la consola (F12) para más detalles.');
        console.error('Error completo:', error);
        btn.textContent = editId ? 'Actualizar' : 'Subir Recurso';
        btn.disabled = false;
        progress.style.display = 'none';
    }
});

// Cancelar edición
document.getElementById('btn-cancel').addEventListener('click', () => {
    document.getElementById('recurso-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').textContent = 'Nuevo Recurso';
    document.getElementById('btn-cancel').style.display = 'none';
    document.getElementById('file-hint').textContent = 'Sube un archivo desde tu computadora';
    archivoSeleccionado = null;
});

// Cargar recursos desde Firestore
async function cargarRecursos() {
    const contenedor = document.getElementById('admin-lista-recursos');
    contenedor.innerHTML = '<p class="admin-loading">Cargando recursos...</p>';

    if (!db) {
        contenedor.innerHTML = '<p class="admin-error">Firebase no conectado. Configura firebase-config.js</p>';
        return;
    }

    try {
        const snapshot = await db.collection('recursos').orderBy('fecha', 'desc').get();
        recursosActuales = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            recursosActuales.push({ id: doc.id, ...data });
        });

        if (recursosActuales.length === 0) {
            contenedor.innerHTML = '<p class="admin-empty">No hay recursos todavía. Usa el formulario para agregar el primero.</p>';
            return;
        }

        renderListaAdmin(recursosActuales);

        const buscador = document.getElementById('admin-buscador');
        buscador.oninput = () => {
            const termino = buscador.value.toLowerCase();
            const filtrados = recursosActuales.filter(r =>
                r.titulo.toLowerCase().includes(termino) ||
                r.descripcion.toLowerCase().includes(termino) ||
                r.categoria.toLowerCase().includes(termino)
            );
            renderListaAdmin(filtrados);
        };

    } catch (error) {
        contenedor.innerHTML = `<p class="admin-error">Error al cargar: ${error.message}</p>`;
    }
}

function renderListaAdmin(lista) {
    const contenedor = document.getElementById('admin-lista-recursos');
    contenedor.innerHTML = '';

    lista.forEach(r => {
        const div = document.createElement('div');
        div.className = 'admin-item';

        const fecha = r.fecha?.toDate ? r.fecha.toDate().toLocaleDateString('es-ES') : (typeof r.fecha === 'string' ? new Date(r.fecha).toLocaleDateString('es-ES') : '—');

        div.innerHTML = `
            <div class="admin-item-info">
                <div class="admin-item-icon">${obtenerIconoExtension(r.tipo || 'pdf')}</div>
                <div class="admin-item-data">
                    <strong>${r.titulo}</strong>
                    <span class="admin-item-meta">${r.categoria} • ${r.tipo || '—'} ${r.tamaño ? '• ' + r.tamaño : ''} • ${fecha}</span>
                    <p class="admin-item-desc">${r.descripcion}</p>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-preview admin-btn-sm" onclick="editarRecurso('${r.id}')">✏️</button>
                <button class="btn-recurso admin-btn-sm" onclick="eliminarRecurso('${r.id}')">🗑️</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function editarRecurso(id) {
    const r = recursosActuales.find(x => x.id === id);
    if (!r) return;

    document.getElementById('edit-id').value = id;
    document.getElementById('titulo').value = r.titulo;
    document.getElementById('descripcion').value = r.descripcion;
    document.getElementById('categoria').value = r.categoria;
    document.getElementById('destacado').checked = r.destacado || false;
    document.getElementById('form-title').textContent = 'Editar Recurso';
    document.getElementById('btn-cancel').style.display = 'inline-block';
    document.getElementById('file-hint').textContent = r.enlace ? `Archivo actual: ${r.tipo}` : 'Sube un archivo (opcional al editar)';
    archivoSeleccionado = null;
    document.getElementById('archivo').value = '';

    document.getElementById('dashboard-screen').scrollIntoView({ behavior: 'smooth' });
}

async function eliminarRecurso(id) {
    if (!confirm('¿Eliminar este recurso permanentemente?')) return;
    if (!db) return;

    try {
        await db.collection('recursos').doc(id).delete();
        cargarRecursos();
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}


