# Jaque Mate

Ajedrez para jugar online con amigos, contra la compu (5 niveles) o entre dos personas en el mismo teléfono. Lleva un marcador por rival y se instala en la pantalla de inicio del teléfono como una app.

- Página estática: funciona en GitHub Pages, sin servidor propio.
- Online y marcador con Firebase Realtime Database (plan gratuito).
- Cuentas simples: nombre + PIN de 4 números.

## Estructura

```
index.html           pantallas (entrar, menú, sala, partida)
styles.css           diseño
app.js               lógica del juego, modos y conexión online
engine.js            reglas del ajedrez y la compu (sin dependencias)
engine-worker.js     corre la compu en segundo plano para que no se trabe la pantalla
firebase-config.js   datos del proyecto de Firebase
database.rules.json  reglas que se pegan en Firebase
sw.js, manifest.webmanifest, icons/   para instalarla en el teléfono
```

## Configurar Firebase (una vez)

1. console.firebase.google.com → Crear proyecto.
2. Compilación → Realtime Database → Crear base de datos.
3. Pestaña **Reglas** → pega el contenido de `database.rules.json` → Publicar.
4. Configuración del proyecto → Tus apps → Web → copia `firebaseConfig` dentro de `firebase-config.js`.

## Publicar en GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
Al par de minutos queda en `https://<usuario>.github.io/ajedrez/`.

## Instalar en el teléfono

- iPhone (Safari): botón Compartir → **Agregar a inicio**.
- Android (Chrome): menú ⋮ → **Instalar app** o **Agregar a la pantalla principal**.

## Seguridad

Pensado para jugar entre amigos: el PIN evita que alguien use tu nombre por descuido, pero no es una protección fuerte (no hay servidor propio que lo verifique).
