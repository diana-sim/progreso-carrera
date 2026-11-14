/* ═══════════════════════════════════════════════════════════════════
   Rail.jsx — LA COLUMNA OSCURA DE LA IZQUIERDA
   Anillo de progreso, filtros por estado y tu usuario.
   ═══════════════════════════════════════════════════════════════════ */

import { TOTAL } from "../data/plan";

// El anillo es un círculo SVG con un trazo punteado: un solo "guion"
// del largo de la circunferencia. Correr ese guion (dashoffset) hace
// que se vea más o menos círculo pintado.
const R = 53;
const C = 2 * Math.PI * R; // circunferencia

// [clave del filtro, texto, color del puntito, campo de m con la cantidad]
const FILTROS = [
  ["todas", "Todas", "#8C8478", "total"],
  ["aprobada", "Aprobadas", "#C2D3A3", "ap"],
  ["previa", "Finales previos", "#F7CBDE", "pr"],
  ["curso", "Cursando ahora", "#FFFFFF", "cu"],
  ["pendiente", "Restantes", "#EAEAE6", "pe"],
];

export default function Rail({ m, filtro, onFiltro, usuario, onSalir }) {
  const cuenta = { ...m, total: TOTAL };
  // Del nombre completo nos quedamos con el primero ("Hernán Pérez" → "Hernán").
  const nombre = usuario.displayName?.split(" ")[0] || usuario.email;

  return (
    <aside className="rail">
      <div className="brand">
        PROGRESO<span>.</span>
      </div>
      <div className="rail-sub">
        Lic. en Diseño Multimedia
        <br />y de Interacción · UADE
      </div>

      <div className="ring">
        <svg width="124" height="124" viewBox="0 0 124 124">
          {/* En JSX los atributos con guion de SVG van en camelCase: strokeWidth, no stroke-width */}
          <circle cx="62" cy="62" r={R} fill="none" stroke="#2E2B26" strokeWidth="13" />
          {/* Rosa: aprobadas + previas (lo que tendrías rindiendo los finales) */}
          <circle
            className="arc" cx="62" cy="62" r={R} fill="none" stroke="#F7CBDE"
            strokeWidth="13" strokeLinecap="round" strokeDasharray={C}
            strokeDashoffset={C * (1 - (m.ap + m.pr) / TOTAL)}
          />
          {/* Verde, encima: solo aprobadas */}
          <circle
            className="arc" cx="62" cy="62" r={R} fill="none" stroke="#C2D3A3"
            strokeWidth="13" strokeLinecap="round" strokeDasharray={C}
            strokeDashoffset={C * (1 - m.ap / TOTAL)}
          />
        </svg>
        <div className="ring-mid">
          <b>{m.pct.toFixed(1)}%</b>
          <i>de la carrera</i>
        </div>
      </div>

      <div className="tally">
        {m.ap} de {TOTAL} materias aprobadas
      </div>
      {m.pr > 0 && (
        <div className="proj">
          Con las {m.pr} previas rendidas llegás a <b>{m.pctConPrevias.toFixed(1)}%</b>
        </div>
      )}

      <div className="legend">
        {/* 📘 Listas con .map()
            Para dibujar varias cosas, transformás un array de datos en
            un array de JSX. Cada elemento necesita una "key" única:
            React la usa para saber cuál es cuál si la lista cambia. */}
        {FILTROS.map(([k, t, color, campo]) => (
          <button key={k} className="leg" aria-pressed={filtro === k} onClick={() => onFiltro(k)}>
            {/* style en JSX es un objeto, no un string: {{ background: color }} */}
            <span className="dot" style={{ background: color }} />
            <span className="leg-t">{t}</span>
            <span className="leg-n">{cuenta[campo]}</span>
          </button>
        ))}
      </div>

      <div className="user">
        {usuario.photoURL ? (
          // referrerPolicy: sin esto, a veces Google no deja cargar la foto.
          <img className="user-av" src={usuario.photoURL} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="user-av">{nombre[0]}</span>
        )}
        <span className="user-n" title={usuario.email}>{nombre}</span>
        <button className="user-out" onClick={onSalir}>Salir</button>
      </div>
    </aside>
  );
}
