# Progreso de carrera

Tablero de avance de la Lic. en Diseño Multimedia y de Interacción (UADE).
React + Vite, con login de Google y datos guardados en la nube (Firebase).

---

## 1. Configurar Firebase (una sola vez, ~10 minutos)

Firebase es gratis para este uso. Todo se hace desde https://console.firebase.google.com

1. **Crear el proyecto.** "Crear un proyecto" (*Add project*), ponele `progreso-carrera`.
   Google Analytics no hace falta, podés desactivarlo.

2. **Registrar la app web.** En la pantalla del proyecto tocá el ícono **`</>`** (Web).
   Apodo: `progreso`. No tildes Hosting. Te va a mostrar un bloque `firebaseConfig`
   con `apiKey`, `authDomain`, `projectId`, `appId`… dejalo abierto.

3. **Pegar la configuración.** En esta carpeta, duplicá `.env.example`, renombralo a
   **`.env.local`** y completá cada línea con los valores del paso anterior:

   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=progreso-carrera.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=progreso-carrera
   VITE_FIREBASE_APP_ID=1:1234:web:abcd
   ```

   > En Finder los archivos que empiezan con punto están ocultos: **Cmd + Shift + .** los muestra.

4. **Activar el login con Google.** Menú izquierdo → *Compilación* (*Build*) →
   **Authentication** → *Comenzar* → pestaña *Método de acceso* → **Google** →
   activar → elegí tu mail como correo de asistencia → Guardar.

5. **Crear la base de datos.** *Compilación* → **Firestore Database** → *Crear base de
   datos* → ubicación `southamerica-east1 (São Paulo)` → **modo de producción**.

6. **Poner las reglas de seguridad.** En Firestore, pestaña **Reglas**: borrá lo que
   hay, pegá el contenido de `firestore.rules` y tocá **Publicar**. Esto hace que cada
   persona vea solo sus propios datos.

## 2. Correr la app

Necesitás [Node.js](https://nodejs.org) 18 o más nuevo. En la Terminal:

```bash
cd ~/Desktop/progreso-carrera
npm install      # la primera vez, y cada vez que cambien las dependencias
npm run dev      # abre en http://localhost:5173
```

Si cambiás `.env.local` con la app corriendo, cortala (Ctrl + C) y volvé a correr `npm run dev`.

## 3. Tus notas

La primera vez que entrás, la app busca los datos que tenías guardados en el navegador
(de la versión sin usuarios) y los sube a tu cuenta. Si arrancás vacío, abrí
`mis-notas.json`, copiá todo el texto y tocá **Importar** en la app.

---

## Cómo leer el código (recorrido para aprender React)

Cada archivo arranca con un comentario que explica qué hace, y los conceptos nuevos
están marcados con 📘. Leelos en este orden, que va de lo simple a lo complejo:

| # | Archivo | Qué vas a aprender |
|---|---------|--------------------|
| 1 | `src/main.jsx` | Cómo arranca React, qué es JSX |
| 2 | `src/data/plan.js` | Datos separados de la interfaz |
| 3 | `src/components/Stats.jsx` | Componente simple, props, listas con `.map()` |
| 4 | `src/components/Cell.jsx` | Reutilizar un componente, eventos (`onClick`) |
| 5 | `src/components/PlanGrid.jsx` | Componer componentes, `.map()` anidados |
| 6 | `src/components/Rail.jsx` | `key`, estilos en línea, SVG en JSX |
| 7 | `src/components/Editor.jsx` | `useState`, inputs controlados, `useEffect` |
| 8 | `src/lib/progreso.js` | Funciones puras, estado derivado |
| 9 | `src/components/Tablero.jsx` | "Los datos bajan, los eventos suben", `useMemo`, `useCallback` |
| 10 | `src/App.jsx` | Renderizado condicional, la regla de los hooks |
| 11 | `src/hooks/useAuth.js` | Hooks propios, suscripciones con limpieza |
| 12 | `src/firebase.js` + `src/hooks/useProgreso.js` | Hablar con un servicio externo, inmutabilidad |

### Mapa

```
App                     ← decide qué pantalla mostrar
├─ Login / Cargando     (src/components/Pantallas.jsx)
└─ Tablero              ← dueño de los datos
   ├─ Rail              anillo, filtros, usuario
   ├─ Stats             4 tarjetas
   ├─ PlanGrid → Cell   la grilla de 39 materias
   ├─ Vencimientos      previas por urgencia
   └─ Editor            modal de edición
```

### Ejercicios para practicar

1. **Fácil:** cambiá `UMBRAL_URGENTE` en `src/lib/progreso.js` de 150 a 60 y mirá qué cambia.
2. **Fácil:** agregá una quinta tarjeta en `Stats.jsx` con las materias restantes (`m.pe`).
3. **Medio:** en `Cell.jsx`, mostrá los días que faltan en vez de "!" para las previas urgentes.
4. **Medio:** agregá un campo "Comentario" en `Editor.jsx` (un `useState` más + un `<input>`
   + guardarlo en `out`).
