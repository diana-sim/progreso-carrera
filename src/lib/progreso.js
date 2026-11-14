/* ═══════════════════════════════════════════════════════════════════
   progreso.js — LAS CUENTAS
   ═══════════════════════════════════════════════════════════════════
   Funciones "puras": reciben datos y devuelven un resultado, sin
   tocar nada más (ni React, ni Firebase, ni la pantalla). Son las más
   fáciles de entender y de testear. Buena costumbre: mantener la
   lógica acá y que los componentes solo se ocupen de mostrar.
   ═══════════════════════════════════════════════════════════════════ */

import { PLAN, TOTAL } from "../data/plan";

// "1C-2025" → 30 de junio de 2025 · "2C-2025" → 30 de noviembre de 2025
// (Ojo: en JavaScript los meses arrancan en 0. Junio = 5, noviembre = 10.)
export const finCursada = (cur) => {
  const [c, y] = cur.split("-");
  return c === "1C" ? new Date(+y, 5, 30) : new Date(+y, 10, 30);
};

// La cursada aprobada vence 2 años después de terminar el cuatrimestre,
// salvo que hayas cargado la fecha real a mano (d.vence).
export function vencimiento(d) {
  if (d.vence) {
    const [y, m, dd] = d.vence.split("-").map(Number);
    return new Date(y, m - 1, dd);
  }
  if (!d.cur) return null;
  const f = finCursada(d.cur);
  return new Date(f.getFullYear() + 2, f.getMonth(), f.getDate());
}

// Hoy a las 00:00, para que la cuenta de días no dependa de la hora.
export const hoy = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};

// Días que faltan. Restar dos fechas da milisegundos; 864e5 = ms en un día.
export const dias = (v, ref = hoy()) => (v ? Math.round((v - ref) / 864e5) : null);

export const UMBRAL_URGENTE = 150; // días

export function urgencia(dd) {
  if (dd === null) return { crit: false, txt: "sin fecha" };
  if (dd < 0) return { crit: true, txt: "vencida" };
  return { crit: dd <= UMBRAL_URGENTE, txt: dd + " d" };
}

export const fecha = (d) =>
  d ? d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "2-digit" }) : "—";

/* Calcula todos los números del tablero a partir del estado.
   📘 Esto se llama "estado derivado": no lo guardamos en ningún lado,
   lo recalculamos cada vez desde S. Así nunca puede quedar
   desactualizado (si guardáramos "aprobadas: 14" aparte, habría que
   acordarse de cambiarlo cada vez que se aprueba algo). */
export function metricas(S) {
  const cuenta = (e) => PLAN.filter((m) => S[m.n].e === e).length;
  const notas = PLAN.filter(
    (m) => S[m.n].e === "aprobada" && typeof S[m.n].nota === "number",
  ).map((m) => S[m.n].nota);
  const ap = cuenta("aprobada");
  const pr = cuenta("previa");
  const ref = hoy();

  // Las previas, ordenadas por la que vence primero.
  const prevs = PLAN.filter((m) => S[m.n].e === "previa")
    .map((m) => {
      const d = S[m.n];
      const v = vencimiento(d);
      return { m, d, v, dd: dias(v, ref) };
    })
    .sort((x, y) => (x.v ? +x.v : 8e15) - (y.v ? +y.v : 8e15));

  return {
    ap,
    pr,
    cu: cuenta("curso"),
    pe: cuenta("pendiente"),
    prom: notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null,
    pct: (ap / TOTAL) * 100,
    pctConPrevias: ((ap + pr) / TOTAL) * 100,
    prevs,
    crit: prevs.filter((p) => urgencia(p.dd).crit).length,
  };
}
