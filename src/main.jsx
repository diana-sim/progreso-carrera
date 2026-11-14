/* ═══════════════════════════════════════════════════════════════════
   main.jsx — EL PUNTO DE ENTRADA
   ═══════════════════════════════════════════════════════════════════
   Es el primer archivo de JavaScript que corre. index.html lo carga
   con <script type="module" src="/src/main.jsx">.

   Su único trabajo: agarrar el <div id="root"> vacío de index.html y
   decirle a React "de acá para adentro mandás vos". A partir de ahí,
   todo lo que ves en pantalla lo dibuja React a partir de <App />.

   📘 ¿Qué es eso de <App />?
   Parece HTML pero es JSX: una sintaxis que mezcla HTML con
   JavaScript. Vite la traduce a llamadas de JavaScript comunes antes
   de mandarla al navegador. <App /> significa "dibujá el componente
   App". Por eso los archivos se llaman .jsx y no .js.
   ═══════════════════════════════════════════════════════════════════ */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Importar un .css desde JS es un truco de Vite: lo inyecta en la página.
import "./styles.css";

createRoot(document.getElementById("root")).render(
  // StrictMode no dibuja nada. En desarrollo hace chequeos extra y
  // corre algunas cosas dos veces a propósito para que aparezcan los
  // bugs antes. En la versión final (npm run build) no hace nada.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
