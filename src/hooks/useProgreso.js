/* ═══════════════════════════════════════════════════════════════════
   useProgreso.js — LAS MATERIAS DE CADA USUARIO, EN LA NUBE
   ═══════════════════════════════════════════════════════════════════
   Antes guardábamos en localStorage (solo en ese navegador). Ahora
   cada usuario tiene su documento en Firestore: usuarios/<uid>.
   Ventaja: entrás desde la compu, el celu o cualquier lado y ves lo
   mismo. Y como escuchamos el documento "en vivo", si lo cambiás en
   una pestaña se actualiza solo en la otra.

   Flujo:
     1. Llega el uid del usuario logueado.
     2. Nos suscribimos a su documento (onSnapshot).
     3. Si no existe (primera vez que entra), lo creamos: con lo que
        haya en localStorage de la versión vieja, o con todo vacío.
     4. Cada cambio en la app → updateDoc → Firestore → onSnapshot
        nos devuelve el dato nuevo → setS → React redibuja.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { estadoVacio, PLAN } from "../data/plan";

// La clave que usaba la versión sin usuarios. La leemos UNA vez para
// mudar tus datos a la nube la primera vez que entrás.
const KEY_VIEJA = "carrera-uade-v2";

function leerLocalViejo() {
  try {
    const raw = localStorage.getItem(KEY_VIEJA);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // modo incógnito, storage bloqueado, JSON roto…
  }
}

// Revisa que un JSON pegado tenga pinta de respaldo válido antes de
// guardarlo. Mejor rechazar que romper los datos de alguien.
const ESTADOS = ["aprobada", "previa", "curso", "pendiente"];
function esRespaldoValido(obj) {
  return (
    obj && typeof obj === "object" &&
    PLAN.every((m) => obj[m.n] && ESTADOS.includes(obj[m.n].e))
  );
}

export function useProgreso(uid) {
  // S = el estado de las 39 materias. null mientras carga.
  const [S, setS] = useState(null);
  // Un textito para contarle al usuario qué pasó (guardado, error…).
  const [aviso, setAviso] = useState("");

  /* La referencia al documento de este usuario: es como una
     "dirección" (usuarios/abc123), no los datos en sí. */
  const ref = uid ? doc(db, "usuarios", uid) : null;

  useEffect(() => {
    if (!uid) return;
    const docRef = doc(db, "usuarios", uid);

    /* onSnapshot = "avisame cada vez que este documento cambie".
       Se dispara una vez al principio con el valor actual, y después
       cada vez que alguien lo modifica (vos, desde cualquier lado). */
    const desuscribir = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          // Mezclamos con estadoVacio() por si en el futuro agregás
          // materias al plan: las nuevas aparecen como pendientes.
          setS({ ...estadoVacio(), ...snap.data().materias });
          setAviso("Guardado en tu cuenta.");
        } else {
          // Primera vez: creamos el documento. No hacemos setS acá:
          // al crearlo, onSnapshot se vuelve a disparar con los datos.
          const viejo = leerLocalViejo();
          setDoc(docRef, {
            materias: esRespaldoValido(viejo) ? viejo : estadoVacio(),
            creado: serverTimestamp(),
          });
        }
      },
      (error) => {
        console.error(error);
        setAviso("No pude leer tus datos. ¿Configuraste las reglas de Firestore?");
      },
    );

    // Limpieza: si cambia el usuario o se cierra la app, dejamos de escuchar.
    return desuscribir;
  }, [uid]); // ← dependencia: si cambia el uid, el efecto se vuelve a correr

  /* Guarda el estado completo en Firestore.
     Hacemos setS antes de que Firestore responda para que la app se
     sienta instantánea (esto se llama "actualización optimista").

     ¿Por qué updateDoc y no setDoc con merge? Porque merge mezcla
     campo por campo: si borrás la nota de una materia, la nota vieja
     quedaría. updateDoc reemplaza "materias" entero. */
  function guardar(nuevo) {
    setS(nuevo);
    setAviso("Guardando…");
    updateDoc(ref, { materias: nuevo, actualizado: serverTimestamp() })
      .then(() => setAviso("Guardado en tu cuenta."))
      .catch((e) => {
        console.error(e);
        setAviso("No se pudo guardar. Revisá tu conexión.");
      });
  }

  /* 📘 Inmutabilidad
     Fijate que nunca hacemos S[n] = datos. En React no se modifican
     los objetos del estado: se crea uno NUEVO con el cambio. El
     { ...S } ("spread") copia todas las materias, y [n]: datos pisa
     solo la que cambió. React compara el objeto viejo con el nuevo
     para saber que tiene que redibujar; si modificás el mismo
     objeto, React no se entera. */
  const actualizar = (n, datos) => guardar({ ...S, [n]: datos });
  const reiniciar = () => guardar(estadoVacio());

  // Copia todo como texto JSON al portapapeles.
  const respaldar = () => {
    navigator.clipboard?.writeText(JSON.stringify(S, null, 1)).then(
      () => setAviso("Respaldo copiado al portapapeles."),
      () => setAviso("No se pudo copiar en este navegador."),
    );
  };

  // Lo contrario: lee el portapapeles y, si es un respaldo válido, lo carga.
  const importar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      const datos = JSON.parse(texto);
      if (!esRespaldoValido(datos)) throw new Error("formato");
      guardar(datos);
      setAviso("Respaldo importado.");
    } catch {
      setAviso("Copiá primero un respaldo (el JSON) y volvé a tocar Importar.");
    }
  };

  return { S, actualizar, reiniciar, respaldar, importar, aviso };
}
