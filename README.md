# Jaque Mate

Plataforma de ajedrez para jugar, aprender y practicar, donde cada partida alimenta el entrenamiento:
**jugar → analizar → detectar errores → practicar → aprender → volver a jugar**.

Proyecto universitario hecho con **React + TypeScript + Vite**, publicado en GitHub Pages, con Firebase para cuentas y partidas online.

## Estado

Etapas 1, 2, 5, 6 y 7 listas (de 9). Faltan la barra de evaluación, el tutor en partida y el análisis post-partida.

- Navegación: Inicio, Jugar, Aprender, Entrenar, Problemas, Partidas, Perfil (barra inferior en celular, lateral en computador).
- Bienvenida con dos preguntas que arman el plan inicial.
- Jugar: modo **Entrenador** (comenta cada jugada tuya y del rival justo bajo tu reloj, y la lee en voz alta) o modo **Bots** (sin comentarios). 5 niveles: Novato, Básico, Intermedio, Avanzado y Experto (comprobados con `node tools/bot-match.ts`). Ritmos 1+0 a 15+10 y personalizado, dos personas en el mismo teléfono, amigo online por código.
- Tablero: tocar o arrastrar, jugadas legales, última jugada, jaque, coronación, enroque, captura al paso, tablas por repetición/50 jugadas/material, reloj con incremento.
- Cuentas con nombre + PIN y marcador por rival.
- Aprender: Tácticas (66 lecciones: ataque doble, clavada, ensartada, descubierta, desviación…) y Aperturas (40 lecciones con las trampas típicas de cada una), además de 58 lecciones de Principiante, Intermedio y Avanzado.
- Entrenador en la partida: califica cada jugada en 6 niveles (Mejor, Excelente, Buena, Imprecisión, Error, Error grave), explica por qué, marca la mejor jugada en el tablero y explica qué hizo el rival.
- Estadísticas: resultados por color y rival, calidad de jugadas, precisión por partida, piezas que más mueves, aperturas y tabla partida por partida.
- Problemas: más de 13.000, casi todos de partidas reales de la base de Lichess (CC0), verificados con el motor; por táctica, por apertura y por dificultad, con rating Elo propio, 3 pistas y problema del día. Sin tema elegido, alterna tácticas y pocos mates; no se repiten.
- Entrenar: repaso espaciado (1, 3, 7, 14, 30 días), recomendaciones por tema débil y finales contra el motor.
- Partidas: historial con visor jugada por jugada; rating Elo contra los bots.
- Perfil: nivel, XP, racha (con un día libre), estadísticas, fortalezas y áreas para mejorar, gráfico de rating.

## Estructura

```
src/
  engine/       motor de ajedrez (sin interfaz) + Web Worker + niveles de bot
  chess/        partida, notación (FEN, SAN, UCI) y reloj
  components/   ChessBoard, PlayerBar, MoveList, GameView, Layout, ...
  pages/        una vista por pantalla
  hooks/        lógica de partida local
  database/     sesión, cuentas, Firebase y salas online
  styles/       tokens, base, componentes y páginas
  training/ lessons/ problems/ profile/ statistics/   (próximas etapas)
tools/          scripts de Node: perft, generador de problemas
tests/          prueba online de punta a punta con Firebase simulado
docs/           compilación publicada en GitHub Pages
```

## Comandos

```bash
npm install
npm run dev          # desarrollo en http://localhost:5173
npm run build        # compila a docs/ (lo que publica GitHub Pages)
npm test             # perft: verifica el generador de jugadas
node tools/check-lessons.ts   # resuelve cada ejercicio de las lecciones
node tools/gen-puzzles.ts 500 tools/data/rawN.json 1800000   # genera problemas nuevos (30 min)
node tools/build-puzzles.ts   # verifica y arma el banco de problemas (conserva los ids existentes)
node tools/import-lichess.ts seleccion.json   # importa problemas de Lichess (seleccion.json sale de lichess_db_puzzle.csv.zst)
node tools/gen-tactic-lessons.ts              # arma las lecciones de Tácticas y Aperturas con esos problemas
node tools/bot-match.ts 12    # enfrenta los niveles de bot para comprobar que cada uno gana al anterior
npm run test:online  # dos navegadores juegan una partida online (Firebase simulado)
```

## Configurar Firebase

1. console.firebase.google.com → Crear proyecto → Realtime Database.
2. Pestaña **Reglas** → pegar `database.rules.json` → Publicar.
3. Configuración del proyecto → Tus apps → Web → copiar `firebaseConfig` en `src/database/firebase-config.ts`.
4. `npm run build` y subir.

## Publicar

Settings → Pages → Branch `main`, carpeta **/docs** → Save.

## Seguridad

Pensado para jugar entre amigos: el PIN evita que alguien use tu nombre por descuido, pero no es una protección fuerte.
