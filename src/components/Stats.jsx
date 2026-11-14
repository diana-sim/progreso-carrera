/* ═══════════════════════════════════════════════════════════════════
   Stats.jsx — LAS 4 TARJETAS DE ARRIBA
   El componente más simple: recibe datos y los muestra. No tiene
   estado ni hace nada más. A estos se los llama "presentacionales".
   ═══════════════════════════════════════════════════════════════════ */

export default function Stats({ m }) {
  // [clase de color, título, número grande]
  const items = [
    ["g", "Aprobadas", m.ap],
    ["p", "Finales previos", m.pr],
    ["w", "Cursando ahora", m.cu],
    ["y", "Promedio", m.prom ? m.prom.toFixed(2) : "—"],
  ];

  return (
    <div className="stats">
      {items.map(([cl, t, big]) => (
        // En JSX se escribe className, no class (class es palabra reservada de JS).
        // `st ${cl}` es un "template string": arma "st g", "st p", etc.
        <div key={t} className={`st ${cl}`}>
          <h4>{t}</h4>
          <div className="big">{big}</div>
        </div>
      ))}
    </div>
  );
}
