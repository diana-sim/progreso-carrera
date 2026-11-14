/* ═══════════════════════════════════════════════════════════════════
   Cell.jsx — UNA MATERIA DE LA GRILLA
   Se usa 39 veces, una por materia. Escribirla una vez y reutilizarla
   es justamente la gracia de los componentes.
   ═══════════════════════════════════════════════════════════════════ */

import { pad } from "../data/plan";
import { dias, urgencia, vencimiento } from "../lib/progreso";

export default function Cell({ materia, d, filtro, onAbrir }) {
  // Si hay un filtro activo y esta materia no coincide, se ve apagada.
  const dim = filtro !== "todas" && d.e !== filtro;

  // Qué mostrar abajo a la derecha según el estado.
  let val = "";
  let alarm = false;
  if (d.e === "aprobada") val = typeof d.nota === "number" ? d.nota : "eq";
  if (d.e === "previa") {
    alarm = urgencia(dias(vencimiento(d))).crit;
    val = alarm ? "!" : "·";
  }
  if (d.e === "curso") val = "●";

  // Arma "cell aprobada dim" sacando los false del medio.
  const cls = ["cell", d.e, dim && "dim", alarm && "alarm"].filter(Boolean).join(" ");

  return (
    // () => onAbrir(materia.n): una función nueva que, al hacer clic,
    // le avisa al padre QUÉ materia se tocó.
    <button className={cls} title={materia.t} onClick={() => onAbrir(materia.n)}>
      <div className="cell-t">{materia.t}</div>
      <div className="cell-f">
        <span className="cell-n">{pad(materia.n)}</span>
        <span className="cell-v">{val}</span>
      </div>
    </button>
  );
}
