/* ═══════════════════════════════════════════════════════════════════
   App.jsx — EL "PORTERO"
   ═══════════════════════════════════════════════════════════════════
   📘 ¿Qué es un componente?
   Una función que devuelve JSX (lo que se ve). Su nombre empieza con
   mayúscula para que React lo distinga de las etiquetas HTML:
   <div> es HTML, <Login> es un componente nuestro.

   App decide qué pantalla mostrar según quién está conectado:

     ¿Falta configurar Firebase?  → <FaltaConfig />
     ¿Firebase todavía chequea?   → <Cargando />
     ¿No hay nadie?               → <Login />
     ¿Hay alguien?                → <Tablero />  (la app de verdad)

   📘 Renderizado condicional
   En React no "ocultás" pantallas con CSS: directamente devolvés una
   u otra. Lo que no se devuelve no existe en la página.
   ═══════════════════════════════════════════════════════════════════ */

import { firebaseConfigurado } from "./firebase";
import { useAuth } from "./hooks/useAuth";
import { Cargando, FaltaConfig, Login } from "./components/Pantallas";
import Tablero from "./components/Tablero";

export default function App() {
  // Sin configuración no podemos ni preguntar por el usuario.
  if (!firebaseConfigurado) return <FaltaConfig />;
  return <ConUsuario />;
}

/* ¿Por qué un segundo componente y no todo en App?
   Por la regla de los hooks: no se pueden llamar después de un
   "return" condicional. Si pusiéramos useAuth() debajo del primer if
   de App, a veces se llamaría y a veces no, y React se confunde.
   Solución típica: partir en dos componentes. */
function ConUsuario() {
  const { usuario, entrar, salir } = useAuth();

  if (usuario === undefined) return <Cargando />;
  if (usuario === null) return <Login onEntrar={entrar} />;

  /* 📘 Props
     Son los "parámetros" de un componente, se pasan como atributos:
     <Tablero usuario={usuario} />. Adentro de Tablero llegan como un
     objeto: function Tablero({ usuario, onSalir }).
     Las llaves {} en JSX significan "acá va JavaScript".

     key={usuario.uid}: si cambia de cuenta, React tira el Tablero
     viejo y arma uno nuevo desde cero (sin datos del otro usuario). */
  return <Tablero key={usuario.uid} usuario={usuario} onSalir={salir} />;
}
