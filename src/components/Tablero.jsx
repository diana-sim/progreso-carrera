/* ═══════════════════════════════════════════════════════════════════
   Tablero.jsx — LA APP DE VERDAD (cuando ya entraste)
   ═══════════════════════════════════════════════════════════════════
   Este componente es el "dueño" de los datos. Los pide a
   useProgreso, los reparte a los componentes de abajo por props, y
   les pasa funciones (onAbrir, onFiltro…) para que puedan avisar
   cuando pasa algo.

   📘 "Los datos bajan, los eventos suben"
   Es EL patrón de React. Un hijo nunca modifica los datos del padre
   directamente: lo llama con una función que el padre le pasó.

        Tablero  (tiene S, filtro, editando)
          ├─ Rail          recibe m, filtro    · avisa onFiltro
          ├─ Stats         recibe m
          ├─ PlanGrid      recibe S, filtro    · avisa onAbrir
          ├─ Vencimientos  recibe m            · avisa onAbrir, onImportar…
          └─ Editor        recibe la materia   · avisa onGuardar, onCerrar
   ═══════════════════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { useProgreso } from "../hooks/useProgreso";
import { metricas } from "../lib/progreso";
import { Cargando } from "./Pantallas";
import Rail from "./Rail";
import Stats from "./Stats";
import PlanGrid from "./PlanGrid";
import Vencimientos from "./Vencimientos";
import Editor from "./Editor";

export default function Tablero({ usuario, onSalir }) {
  const { S, actualizar, reiniciar, respaldar, importar, aviso } = useProgreso(usuario.uid);

  // Estado de la interfaz (no se guarda en la nube, es solo de esta pantalla):
  const [filtro, setFiltro] = useState("todas"); // qué estado resaltar
  const [editando, setEditando] = useState(null); // nº de materia abierta, o null

  /* 📘 useMemo
     "Calculá esto y acordatelo hasta que cambie S." Sin useMemo,
     metricas() correría en cada render (por ejemplo al cambiar el
     filtro, que no afecta las cuentas). Acá es una optimización
     chiquita; sirve más para cálculos pesados. */
  const m = useMemo(() => (S ? metricas(S) : null), [S]);

  /* 📘 useCallback
     Lo mismo pero para funciones: devuelve SIEMPRE la misma función
     en vez de crear una nueva en cada render. El Editor usa onCerrar
     dentro de un useEffect, y si la función cambiara cada vez, el
     efecto se volvería a ejecutar sin necesidad. */
  const cerrar = useCallback(() => setEditando(null), []);

  // Importante: este if va DESPUÉS de todos los hooks (regla de los hooks).
  if (!S) return <Cargando />;

  return (
    /* 📘 Fragment: <>…</>
       Un componente tiene que devolver UN solo elemento. Si querés
       devolver dos hermanos (el tablero y el modal) sin agregar un
       <div> extra, los envolvés en <> </>. */
    <>
      <div className="app">
        <Rail m={m} filtro={filtro} onFiltro={setFiltro} usuario={usuario} onSalir={onSalir} />
        <main className="main">
          <Stats m={m} />
          <PlanGrid S={S} filtro={filtro} onAbrir={setEditando} />
        </main>
        <Vencimientos
          m={m}
          aviso={aviso}
          onAbrir={setEditando}
          onRespaldar={respaldar}
          onImportar={importar}
          onReiniciar={() => {
            // window.confirm muestra el cuadrito nativo de "¿Seguro?".
            if (window.confirm("¿Borrar todo y dejar las 39 materias como pendientes?")) {
              reiniciar();
              setFiltro("todas");
            }
          }}
        />
      </div>

      {/* El modal solo existe mientras editando tenga un número.
          key={editando}: al abrir otra materia, React crea un Editor
          nuevo, así su estado interno arranca con los datos correctos. */}
      {editando !== null && (
        <Editor
          key={editando}
          n={editando}
          d={S[editando]}
          onCerrar={cerrar}
          onGuardar={(n, datos) => {
            actualizar(n, datos);
            cerrar();
          }}
        />
      )}
    </>
  );
}
