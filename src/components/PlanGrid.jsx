/* ═══════════════════════════════════════════════════════════════════
   PlanGrid.jsx — LA GRILLA: 4 AÑOS × 2 CUATRIMESTRES
   Ejemplo de .map() anidados: años → cuatrimestres → materias.
   Este componente no dibuja las materias él mismo: delega en <Cell>.
   Partir en componentes chicos hace que cada archivo se entienda solo.
   ═══════════════════════════════════════════════════════════════════ */

import { PLAN, ORD, cuat } from "../data/plan";
import Cell from "./Cell";

export default function PlanGrid({ S, filtro, onAbrir }) {
  return (
    <div className="plan">
      <div className="plan-hd">
        <div className="lbl">Plan de estudios · {PLAN.length} materias en orden</div>
        <div className="lbl">Tocá una materia para editarla</div>
      </div>

      <div className="grid">
        {[1, 2, 3, 4].map((a) => {
          // Con llaves { } en la flecha podemos calcular cosas antes del return.
          const delAnio = PLAN.filter((x) => x.a === a);
          const ok = delAnio.filter((x) => S[x.n].e === "aprobada").length;

          return (
            <div key={a} className="yb">
              <div className="yb-hd">
                <b>{ORD[a]} año</b>
                <i>{ok}/{delAnio.length}</i>
              </div>

              <div className="yb-cols">
                {[1, 2].map((c) => (
                  <div key={c} className="col">
                    <div className="col-hd">{cuat(c)} cuat</div>
                    <div className="col-cells">
                      {delAnio
                        .filter((x) => x.c === c)
                        .map((mt) => (
                          // onAbrir viaja desde Tablero, pasa por acá y llega a Cell.
                          // A esto se le dice "prop drilling" (pasar props hacia abajo).
                          <Cell key={mt.n} materia={mt} d={S[mt.n]} filtro={filtro} onAbrir={onAbrir} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
