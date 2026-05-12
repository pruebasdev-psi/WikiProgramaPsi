# WikiProgramaPsi
## Descripción
Sitio educativo estático para la carrera de Psicología, con panel admin para subir documentos.
## Tecnologías
- Vanilla HTML / CSS / JS (sin frameworks ni build tools)
- Firebase Firestore (solo metadatos)
- Cloudinary (almacenamiento de archivos)
- GitHub Pages (hosting)
## Páginas del sitio
| Archivo | Descripción |
|---|---|
| index.html | Inicio |
| html/documentos.html | Recursos académicos (consume Firebase + datos locales) |
| html/main-capsulas.htm | Cápsulas educativas |
| html/maya.html | Actualización Malla Curricular |
| admin.html | Panel admin (protegido por contraseña) |
## Archivos clave
- `js/firebase-config.js` → Config Firebase + Cloudinary + contraseña admin
- `js/recursos.js` → Lógica de documentos.html (descarga con fetch+blob + ?fl_attachment=1)
- `js/maya.js` → Lógica de maya.html
- `js/admin.js` → CRUD de recursos, upload XHR a Cloudinary con barra de progreso
- `css/style.css` → Estilos globales + modo oscuro `[data-theme="dark"]`
- `css/admin.css` → Estilos del panel admin
## Funcionamiento
1. Los recursos locales (hardcoded en `js/recursos.js`) siempre se muestran
2. Al cargar documentos.html, intenta conectar a Firestore y fusiona recursos (dedup por ID)
3. Admin sube archivos → Cloudinary devuelve URL → se guarda en Firestore
4. Descarga usa `fetch + blob` con fallback a `?fl_attachment=1` (fuerza Content-Disposition: attachment)
## Despliegue en GitHub Pages
(instrucciones paso a paso)
## Configuración de servicios
### Cloudinary
- Cloud Name: `deeiqiix2`
- Upload Preset: `wiki-psi` (Unsigned, Delivery Type: Upload, Access: Public)
### Firebase Firestore
- Proyecto: `wikiprogramapsi`
- Reglas de seguridad en modo test
## Solución de problemas comunes
- "Bloqueado para entrega" → Verificar asset en consola Cloudinary
- "Cannot read 'ref'" → Hard refresh (Ctrl+F5), cache viejo
- Descarga no funciona → Verificar ?fl_attachment=1
