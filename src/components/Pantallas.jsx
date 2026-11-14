/* ═══════════════════════════════════════════════════════════════════
   Pantallas.jsx — LOGIN, CARGANDO Y "FALTA CONFIGURAR"
   ═══════════════════════════════════════════════════════════════════
   Un archivo puede exportar varios componentes. Estos tres son
   chiquitos y comparten el mismo marco, así que viven juntos.
   ═══════════════════════════════════════════════════════════════════ */

import { useState } from "react";

/* 📘 children
   Lo que ponés ENTRE las etiquetas de un componente llega como la
   prop especial "children". Así Marco funciona como un molde:
     <Marco><h1>Hola</h1></Marco>  → children = <h1>Hola</h1> */
function Marco({ children }) {
  return (
    <div className="pantalla">
      <div className="pantalla-card">
        <div className="brand brand-dark">
          PROGRESO<span>.</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Cargando() {
  return (
    <Marco>
      <p className="pantalla-txt">Cargando…</p>
    </Marco>
  );
}

export function Login({ onEntrar }) {
  // Estado local: solo le importa a este componente.
  const [error, setError] = useState("");
  const [esperando, setEsperando] = useState(false);

  /* 📘 Eventos
     En JSX los eventos se escriben en camelCase (onClick, no onclick)
     y reciben una FUNCIÓN, no un string. onClick={entrar} = "cuando
     hagan clic, llamá a entrar". Ojo: onClick={entrar()} estaría mal,
     porque la ejecutaría al dibujar, no al hacer clic. */
  async function entrar() {
    setError("");
    setEsperando(true);
    try {
      await onEntrar();
      // Si salió bien no hacemos nada: App se entera solo y cambia de pantalla.
    } catch (e) {
      // Cerrar la ventanita de Google no es un error de verdad.
      if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
        setError("No se pudo entrar. Probá de nuevo.");
        console.error(e);
      }
      setEsperando(false);
    }
  }

  return (
    <Marco>
      <p className="pantalla-txt">
        Seguí tu carrera de Diseño Multimedia y de Interacción: materias, notas y
        vencimientos de finales.
      </p>
      <button className="btn-google" onClick={entrar} disabled={esperando}>
        <LogoG />
        {esperando ? "Esperando a Google…" : "Entrar con Google"}
      </button>
      {/* && en JSX: "si lo de la izquierda es verdadero, mostrá lo de la derecha". */}
      {error && <p className="pantalla-err">{error}</p>}
    </Marco>
  );
}

export function FaltaConfig() {
  return (
    <Marco>
      <p className="pantalla-txt">
        Falta conectar Firebase. Creá el archivo <code>.env.local</code> con los datos de
        tu proyecto (los pasos están en el README) y reiniciá <code>npm run dev</code>.
      </p>
    </Marco>
  );
}

// La "G" de Google en SVG. En JSX los atributos con guion van en camelCase.
function LogoG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
