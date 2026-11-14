/* ═══════════════════════════════════════════════════════════════════
   plan.js — LOS DATOS FIJOS DE LA CARRERA
   ═══════════════════════════════════════════════════════════════════
   Acá no hay nada de React: solo datos y funcioncitas chicas. Separar
   los datos de los componentes hace que sea fácil cambiar el plan sin
   tocar la interfaz.

   Cada materia:  n = número · a = año (1–4) · c = cuatrimestre (1–2) · t = título
   ═══════════════════════════════════════════════════════════════════ */

export const PLAN = [
  { n: 1, a: 1, c: 1, t: "Problemáticas del Diseño" },
  { n: 2, a: 1, c: 1, t: "Diseño de Interacción I" },
  { n: 3, a: 1, c: 1, t: "Tipografía I" },
  { n: 4, a: 1, c: 1, t: "Morfología I" },
  { n: 5, a: 1, c: 1, t: "Tecnología Digital para el Diseño" },
  { n: 6, a: 1, c: 2, t: "Diseño Multimedia I" },
  { n: 7, a: 1, c: 2, t: "Desarrollo Frontend I" },
  { n: 8, a: 1, c: 2, t: "Historia del Arte y del Diseño" },
  { n: 9, a: 1, c: 2, t: "Laboratorio de Técnicas Visuales" },
  { n: 10, a: 1, c: 2, t: "Fotografía Digital" },
  { n: 11, a: 2, c: 1, t: "Diseño de Interacción II" },
  { n: 12, a: 2, c: 1, t: "Tipografía II" },
  { n: 13, a: 2, c: 1, t: "Audio Digital" },
  { n: 14, a: 2, c: 1, t: "Psicología del Diseño y Procesos Cognitivos" },
  { n: 15, a: 2, c: 1, t: "Introducción al Marketing" },
  { n: 16, a: 2, c: 2, t: "Diseño Multimedia II" },
  { n: 17, a: 2, c: 2, t: "Desarrollo Frontend II" },
  { n: 18, a: 2, c: 2, t: "Contenidos Audiovisuales" },
  { n: 19, a: 2, c: 2, t: "Animación 2D" },
  { n: 20, a: 2, c: 2, t: "Semiótica del Diseño" },
  { n: 21, a: 3, c: 1, t: "Diseño de Interacción III" },
  { n: 22, a: 3, c: 1, t: "Narrativa Interactiva" },
  { n: 23, a: 3, c: 1, t: "Modelado 3D" },
  { n: 24, a: 3, c: 1, t: "Arte Contemporáneo y Lenguajes Combinados" },
  { n: 25, a: 3, c: 1, t: "Optativa I · Paradigma Orientado a Objetos" },
  { n: 26, a: 3, c: 2, t: "Diseño Multimedia III" },
  { n: 27, a: 3, c: 2, t: "Animación Gráfica" },
  { n: 28, a: 3, c: 2, t: "Seminario de Tópicos de Avanzada I" },
  { n: 29, a: 3, c: 2, t: "Optativa II" },
  { n: 30, a: 3, c: 2, t: "Optativa III" },
  { n: 31, a: 4, c: 1, t: "Proyecto Emprendedor de Diseño" },
  { n: 32, a: 4, c: 1, t: "Diseño de Porfolio" },
  { n: 33, a: 4, c: 1, t: "Sistemas Interactivos" },
  { n: 34, a: 4, c: 1, t: "Diseño y Pensamiento Complejo" },
  { n: 35, a: 4, c: 1, t: "Seminario de Tópicos de Avanzada II" },
  { n: 36, a: 4, c: 2, t: "Trabajo Integrador Final" },
  { n: 37, a: 4, c: 2, t: "Diseño de Videojuegos" },
  { n: 38, a: 4, c: 2, t: "Tecnologías Electrónicas y Nuevos Medios" },
  { n: 39, a: 4, c: 2, t: "Principios Jurídicos Aplicados al Diseño" },
];

export const TOTAL = PLAN.length;

/* El estado de un usuario nuevo: todas las materias pendientes.
   Forma de cada materia guardada:
     e     → "aprobada" | "previa" | "curso" | "pendiente"
     nota  → nota del final (null = entró por equivalencia)
     cur   → cuatrimestre de la cursada, ej. "1C-2025"
     vence → "AAAA-MM-DD", pisa el vencimiento estimado
     int   → intentos de final usados (0 a 3)

   Es una función (y no un objeto fijo) para que cada vez devuelva un
   objeto NUEVO. Si fuera un objeto compartido, modificarlo en un
   lado lo cambiaría en todos. */
export function estadoVacio() {
  // Object.fromEntries convierte [[1, {...}], [2, {...}]] en { 1: {...}, 2: {...} }
  return Object.fromEntries(PLAN.map((m) => [m.n, { e: "pendiente" }]));
}

// Ayuditas de texto que usan varios componentes.
export const ORD = ["", "1.º", "2.º", "3.º", "4.º"];
export const cuat = (c) => (c === 1 ? "1.er" : "2.º");
export const pad = (n) => String(n).padStart(2, "0"); // 4 → "04"
