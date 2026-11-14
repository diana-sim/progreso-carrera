/* ═══════════════════════════════════════════════════════════════════
   Vencimientos.jsx — LA COLUMNA DE LA DERECHA
   Lista de finales previos ordenada por urgencia + botones de respaldo.
   ═══════════════════════════════════════════════════════════════════ */

import { fecha, finCursada, urgencia } from "../lib/progreso";

export default function Vencimientos({ m, aviso, onAbrir, onRespaldar, onImportar, onReiniciar }) {
  return (
    <aside className="side">
      <div className="side-hd">
        <h3>Vencimientos</h3>
        <span className="pill">
          {m.pr}
          {/* Operador ternario: condición ? siQueSí : siQueNo */}
          {m.crit ? ` · ${m.crit} urgentes` : ""}
        </span>
      </div>

      <div className="prevs">
        {m.prevs.length === 0 && <div className="side-note">Sin previas marcadas.</div>}

        {m.prevs.map(({ m: mt, d, v, dd }) => {
          const u = urgencia(dd);
          // Barrita: qué parte de los 2 años de validez ya pasó.
          const span = d.cur ? (v - finCursada(d.cur)) / 864e5 : 730;
          const usado = dd === null ? 2 : Math.max(2, Math.min(100, (1 - dd / span) * 100));

          return (
            <button key={mt.n} className={`pv ${u.crit ? "crit" : ""}`} onClick={() => onAbrir(mt.n)}>
              <div className="pv-top">
                <div className="pv-t">{mt.t}</div>
                <div className="pv-d">{u.txt}</div>
              </div>
              <div className="pv-m">
                cursada {d.cur ? d.cur.replace("-", " · ") : "—"} · vence {fecha(v)}
                {d.vence ? "" : " (est.)"} · {3 - (d.int || 0)}/3 intentos
              </div>
              <div className="pv-bar">
                <i style={{ width: `${usado}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="side-btns">
        <button className="cta ghost" onClick={onRespaldar} title="Copia tus datos como texto">
          Respaldar
        </button>
        <button className="cta ghost" onClick={onImportar} title="Pega un respaldo copiado">
          Importar
        </button>
        <button className="cta ghost" onClick={onReiniciar}>
          Reiniciar
        </button>
      </div>
      <div className="side-note">{aviso}</div>
    </aside>
  );
}
