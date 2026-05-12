// ─────────────────────────────────────────────
// Configuración de Firebase (solo Firestore) + Cloudinary
// ─────────────────────────────────────────────
//
// Firebase (solo para la base de datos de metadatos):
//   1. Ve a https://console.firebase.google.com
//   2. Crea un proyecto → Firestore Database → Crear → Modo prueba
//   3. ⚙️ → Configuración del proyecto → Tus apps → Web → Copia el config
//
// Cloudinary (para almacenar los archivos PDF, DOCX, etc.):
//   1. Ve a https://cloudinary.com → Register
//   2. Settings → Upload → Upload Presets → Add preset → Unsigned
//   3. Copia el Cloud name y el nombre del preset aquí abajo
// ─────────────────────────────────────────────

const firebaseConfig = {
    apiKey: "AIzaSyCbVFSq4FyIzlifPRRNTOxLgW-3DRh2-uc",
    authDomain: "wikiprogramapsi.firebaseapp.com",
    projectId: "wikiprogramapsi",
    storageBucket: "wikiprogramapsi.firebasestorage.app",
    messagingSenderId: "34316660396",
    appId: "1:34316660396:web:360e0097a9c3c5d311f909"
};

const CLOUDINARY_CLOUD_NAME = "deeiqiix2";
const CLOUDINARY_UPLOAD_PRESET = "wiki-psi";

// Contraseña del panel de administración
const ADMIN_PASSWORD = "admin123";

// ─────────────────────────────────────────────
// No editar desde aquí
// ─────────────────────────────────────────────
let db;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log('Firebase inicializado correctamente');
} catch (e) {
    console.warn('Firebase no se pudo inicializar:', e.message);
}
