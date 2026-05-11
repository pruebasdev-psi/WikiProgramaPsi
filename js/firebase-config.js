// ─────────────────────────────────────────────
// Configuración de Firebase
// ─────────────────────────────────────────────
//
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto (o usa uno existente)
// 3. En "Firestore Database" → Crear base de datos → Modo prueba
// 4. En "Storage" → Configurar → Modo prueba
// 5. En ⚙️ → Configuración del proyecto → Tus apps → Web (</>)
// 6. Copia el objeto con apiKey, authDomain, etc. y pégalo abajo:
// ─────────────────────────────────────────────

// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbVFSq4FyIzlifPRRNTOxLgW-3DRh2-uc",
  authDomain: "wikiprogramapsi.firebaseapp.com",
  projectId: "wikiprogramapsi",
  storageBucket: "wikiprogramapsi.firebasestorage.app",
  messagingSenderId: "34316660396",
  appId: "1:34316660396:web:360e0097a9c3c5d311f909",
  measurementId: "G-67ZR1J3JND"
};

// Initialize Firebase

// Contraseña del panel de administración (cámbiala)
const ADMIN_PASSWORD = "admin123";

// ─────────────────────────────────────────────
// No editar desde aquí
// ─────────────────────────────────────────────
let db, storage;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    console.log('Firebase inicializado correctamente');
} catch (e) {
    console.warn('Firebase no se pudo inicializar:', e.message);
}
