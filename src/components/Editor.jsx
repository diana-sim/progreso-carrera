/* ═══════════════════════════════════════════════════════════════════
   Editor.jsx — EL MODAL PARA EDITAR UNA MATERIA
   ═══════════════════════════════════════════════════════════════════
   📘 Inputs "controlados"
   En React, el valor de cada input vive en un useState. El input
   muestra ese valor (value={nota}) y cada tecla lo actualiza
   (onChange → setNota). Así React siempre sabe qué hay escrito, y al
   tocar Guardar ya tenemos todo en variables, sin ir a buscar al DOM.

   Los cambios quedan en este estado local hasta que tocás Guardar.
   Si cancelás, el componente desaparece y su estado se pierde: los
   datos reales (en Tablero) nunca se tocaron.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { PLAN, ORD, cuat, pad } from "../data/plan";

const ESTADOS = [
  ["aprobada", "Aprobada"],
  ["previa", "Final previo"],
  ["curso", "Cursando"],
  ["pendiente", "Pendiente"],
];

// ["1C-2023", "2C-2023", "1C-2024", …] armado una sola vez.
const CUATRIS = [2023, 2024, 2025, 2026, 2027].flatMap((y) => ["1C", "2C"].map((c) => `${c}-${y}`));

export default function Editor({ n, d, onGuardar, onCerrar }) {
  const mt = PLAN.find((x) => x.n === n);

  // Un useState por cada campo, arrancando con lo que ya tenía la materia.
  const [e, setE] = useState(d.e);
  const [nota, setNota] = useState(typeof d.nota === "number" ? String(d.nota) : "");
  const [cur, setCur] = useState(d.cur || "");
  const [vence, setVence] = useState(d.vence || "");
  const [int, setInt] = useState(d.int || 0);

  // Cerrar con Escape. Escuchamos el teclado de toda la página mientras
  // el modal existe, y dejamos de escuchar al cerrarse (la limpieza).
  useEffect(() => {
    const alApretar = (ev) => ev.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alApretar);
    return () => document.removeEventListener("keydown", alApretar);
  }, [onCerrar]);

  // Arma el objeto final según el estado elegido, guardando solo los
  // campos que tienen sentido (una materia pendiente no lleva nota).
  function guardar() {
    const out = { e };
    if (d.plan) out.plan = d.plan; // un dato extra ("Verano"…) que no queremos perder
    if (d.cur) out.cur = d.cur;
    if (e === "aprobada") {
      if (nota !== "") out.nota = Number(nota);
      else {
        out.nota = null; // vacío = equivalencia
        out.eq = 1;
      }
    }
    if (e === "previa") {
      out.cur = cur || null;
      if (vence) out.vence = vence;
      out.int = Number(int);
    }
    onGuardar(n, out);
  }

  return (
    // Clic en el fondo oscuro (y no en la tarjeta) = cerrar.
    // ev.target es lo que se clickeó; ev.currentTarget, el div del fondo.
    <div className="scrim" onClick={(ev) => ev.target === ev.currentTarget && onCerrar()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="shTitle">
        <div className="lbl">
          {pad(n)} · {ORD[mt.a]} año · {cuat(mt.c)} cuatrimestre
        </div>
        <h3 id="shTitle">{mt.t}</h3>

        <div className="fld">
          <label>Estado</label>
          <div className="seg">
            {ESTADOS.map(([v, t]) => (
              <button key={v} data-v={v} aria-pressed={e === v} onClick={() => setE(v)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Los campos aparecen según el estado elegido. Cambiá el estado
            y fijate cómo React agrega y saca bloques solo. */}
        {e === "aprobada" && (
          <div className="fld">
            {/* htmlFor en vez de for (otra palabra reservada de JS) */}
            <label htmlFor="shNota">Nota del final</label>
            <input
              id="shNota" type="number" min="4" max="10" step="1"
              placeholder="4 a 10 · vacío = equivalencia"
              value={nota}
              onChange={(ev) => setNota(ev.target.value)}
            />
            <p className="hint">
              El promedio de la carrera usa la nota del final. Dejalo vacío si entró por
              equivalencia: suma como aprobada pero no pesa en el promedio.
            </p>
          </div>
        )}

        {e === "previa" && (
          <>
            <div className="fld">
              <label htmlFor="shCur">Cuatrimestre en que aprobaste la cursada</label>
              <select id="shCur" value={cur} onChange={(ev) => setCur(ev.target.value)}>
                <option value="">— elegir —</option>
                {CUATRIS.map((v) => (
                  <option key={v} value={v}>{v.replace("-", " · ")}</option>
                ))}
              </select>
            </div>
            <div className="fld">
              <label htmlFor="shVence">Vencimiento real (pisa la estimación)</label>
              <input id="shVence" type="date" value={vence} onChange={(ev) => setVence(ev.target.value)} />
            </div>
            <div className="fld">
              <label htmlFor="shInt">Intentos de final usados</label>
              <select id="shInt" value={int} onChange={(ev) => setInt(ev.target.value)}>
                <option value="0">0 de 3</option>
                <option value="1">1 de 3</option>
                <option value="2">2 de 3</option>
                <option value="3">3 de 3 — sin intentos</option>
              </select>
              <p className="hint">
                Si te inscribís a recursar la materia, perdés los intentos de previo que te queden.
              </p>
            </div>
          </>
        )}

        <div className="btns">
          <button className="cta ghost" onClick={onCerrar}>Cancelar</button>
          <button className="cta" onClick={guardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
