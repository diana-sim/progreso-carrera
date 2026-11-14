/* ═══════════════════════════════════════════════════════════════════
   useAuth.js — ¿QUIÉN ESTÁ CONECTADO?
   ═══════════════════════════════════════════════════════════════════
   📘 ¿Qué es un "hook"?
   Es una función que empieza con "use" y que puede usar las
   herramientas de React (useState, useEffect…). Sirve para sacar
   lógica de los componentes y reutilizarla. Un componente llama
   useAuth() y recibe { usuario, entrar, salir } sin saber nada de
   Firebase: los detalles quedan escondidos acá adentro.

   Regla de oro de los hooks: se llaman siempre arriba de todo en el
   componente, nunca adentro de un if o de un loop. React los
   identifica por el ORDEN en que se llaman en cada render.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, proveedorGoogle } from "../firebase";

export function useAuth() {
  /* 📘 useState
     Es la "memoria" de un componente. Devuelve dos cosas:
       usuario     → el valor actual
       setUsuario  → la función para cambiarlo
     Cada vez que llamás a setUsuario, React vuelve a dibujar el
     componente con el valor nuevo. Nunca se cambia a mano
     (usuario = x no funciona): siempre con el set.

     Usamos tres valores posibles a propósito:
       undefined → todavía no sabemos (Firebase está chequeando)
       null      → no hay nadie conectado → mostrar Login
       {…}       → hay alguien conectado → mostrar el tablero */
  const [usuario, setUsuario] = useState(undefined);

  /* 📘 useEffect
     Sirve para conectarse con cosas de AFUERA de React (Firebase, el
     navegador, un timer…). Recibe:
       1. una función que se ejecuta DESPUÉS de dibujar
       2. una lista de "dependencias": [] = solo la primera vez

     Si la función devuelve otra función, React la llama cuando el
     componente desaparece. Es la "limpieza": acá cortamos la
     suscripción para no seguir escuchando a Firebase al pedo. */
  useEffect(() => {
    // onAuthStateChanged nos avisa cada vez que alguien entra o sale,
    // y también al cargar la página (si ya estabas logueado de antes,
    // Firebase lo recuerda y te devuelve el usuario directo).
    // Devuelve una función para desuscribirse → la devolvemos tal cual.
    return onAuthStateChanged(auth, (u) => setUsuario(u));
  }, []);

  // Abre la ventanita de Google. No hace falta hacer setUsuario acá:
  // cuando el login termina, onAuthStateChanged se entera solo.
  const entrar = () => signInWithPopup(auth, proveedorGoogle);
  const salir = () => signOut(auth);

  return { usuario, entrar, salir };
}
