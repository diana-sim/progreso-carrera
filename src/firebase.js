/* ═══════════════════════════════════════════════════════════════════
   firebase.js — LA CONEXIÓN CON FIREBASE
   ═══════════════════════════════════════════════════════════════════
   Firebase es un servicio de Google que nos da dos cosas sin tener
   que programar un servidor:

   • Authentication → el login con Gmail. Google verifica quién es la
     persona y nos devuelve un "usuario" con nombre, foto y un uid
     (un id único que nunca cambia).

   • Firestore → una base de datos en la nube. Guarda "documentos"
     (objetos tipo JSON) dentro de "colecciones" (carpetas). Nosotros
     usamos una colección "usuarios" con un documento por persona:

        usuarios/
          └─ <uid de Hernán>   { materias: {...}, actualizado: ... }
          └─ <uid de otra>     { materias: {...}, actualizado: ... }

   Este archivo NO es un componente de React: es JavaScript común que
   prepara la conexión una sola vez y la exporta para usarla en otros
   archivos.
   ═══════════════════════════════════════════════════════════════════ */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* 🔑 Los datos de TU proyecto de Firebase.
   No están escritos acá: vienen del archivo .env.local (mirá el
   README). Vite lee ese archivo y reemplaza cada import.meta.env.VITE_…
   por su valor. Solo expone variables que empiezan con "VITE_".

   ¿Es peligroso que esto termine en el navegador? No: la apiKey de
   Firebase no es secreta, solo identifica al proyecto. Lo que protege
   los datos son las reglas de firestore.rules. */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// true si completaste las 4 variables. App.jsx lo usa para mostrarte
// un aviso amable en vez de romperse si todavía no configuraste nada.
export const firebaseConfigurado = Object.values(config).every(Boolean);

const app = firebaseConfigurado ? initializeApp(config) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// "Proveedor" = con qué se puede entrar. Firebase también soporta
// Apple, GitHub, email y contraseña, etc. Nosotros solo Google.
export const proveedorGoogle = new GoogleAuthProvider();
// Que siempre pregunte qué cuenta usar (útil si tenés varias Gmail).
proveedorGoogle.setCustomParameters({ prompt: "select_account" });
