/*
 * Contenido de las lecciones, por nivel y unidad.
 *
 * Cada lección sigue: explicación corta → ejemplo en el tablero → pregunta → jugada del usuario
 * → feedback con pistas → nuevo ejercicio → resumen → XP.
 *
 * Tipos de paso:
 *   info    tablero de muestra + texto. showMoves: casilla cuya pieza muestra sus movimientos. marks: casillas marcadas.
 *   quiz    pregunta de alternativas (answer = índice correcto).
 *   move    el usuario mueve; goal define qué cuenta como correcto (ver MoveGoal).
 *   puzzle  un problema del banco (src/problems/puzzles.json) por id.
 * Las jugadas van en formato UCI (e2e4, e7e8q). Alternativas con '|'.
 * Todo ejercicio se verifica con `node tools/check-lessons.ts`.
 */

export type Level = 'Principiante' | 'Intermedio' | 'Avanzado';

export type MoveGoal =
  | { anyOf: string[] }
  | { check: true }
  | { mate: true }
  | { captureAll: true; par: number }
  /** secuencia: jugadas del usuario y respuestas; '*' = responde el motor */
  | { line: string[] }
  /** partida libre contra el motor hasta lograrlo */
  | { play: 'mate' | 'promote'; maxMoves: number };

export interface InfoStep { t: 'info'; fen: string; text: string; showMoves?: string; marks?: string[] }
export interface QuizStep { t: 'quiz'; text: string; options: string[]; answer: number; explain?: string; fen?: string }
export interface MoveStep {
  t: 'move'; fen: string; text: string; goal: MoveGoal;
  /** pista 1 (conceptual); las pistas 2 y 3 (zona y pieza) se generan solas */
  hint?: string;
  /** mensaje al acertar */
  ok?: string;
  /** mensaje ante una jugada legal pero incorrecta */
  wrong?: string;
  /** comentarios después de cada jugada del usuario en una línea */
  notes?: string[];
}
export interface PuzzleStep { t: 'puzzle'; id: string; text?: string }
export type Step = InfoStep | QuizStep | MoveStep | PuzzleStep;

export interface Lesson { id: string; title: string; glyph: string; topic: string; steps: Step[]; summary: string[] }
export interface Unit { id: string; level: Level; title: string; desc: string; lessons: Lesson[] }

export const UNITS: Unit[] = [
  {
    id: 'piezas', level: 'Principiante', title: 'Conoce las piezas', desc: 'Cómo se mueve cada una y cuánto vale',
    lessons: [
      { id: 'torre', title: 'La torre', glyph: 'R', topic: 'piezas', summary: ['La torre se mueve en línea recta, tan lejos como quiera.', 'No puede saltar piezas.'], steps: [
        { t: 'info', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'La torre se mueve en línea recta: adelante, atrás y hacia los lados, todas las casillas que quiera mientras nada le bloquee el camino.' },
        { t: 'move', fen: '3p4/8/8/8/3R3p/8/8/8 w - - 0 1', goal: { captureAll: true, par: 3 }, text: 'Captura los dos peones con la torre. Se puede en 3 jugadas.', hint: 'Mira qué peones están en la misma fila o columna que la torre.' },
        { t: 'move', fen: '8/1p6/8/8/1R2P2p/8/8/8 w - - 0 1', goal: { captureAll: true, par: 3 }, text: 'Tu propio peón bloquea el camino. Captura los peones de todos modos.', hint: 'Si no puedes ir directo, da la vuelta por otra fila.' },
        { t: 'quiz', text: '¿A cuántas casillas puede llegar una torre en un tablero vacío?', options: ['7', '14', '28'], answer: 1, explain: 'Siempre 14: siete en su fila y siete en su columna, esté donde esté.' }
      ] },
      { id: 'alfil', title: 'El alfil', glyph: 'B', topic: 'piezas', summary: ['El alfil se mueve en diagonal.', 'Siempre se queda en casillas del mismo color.'], steps: [
        { t: 'info', fen: '8/8/8/8/3B4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'El alfil se mueve en diagonal, todas las casillas que quiera.' },
        { t: 'move', fen: '8/6p1/8/8/3B4/8/1p6/8 w - - 0 1', goal: { captureAll: true, par: 2 }, text: 'Captura los dos peones.', hint: 'Sigue las diagonales que salen del alfil.' },
        { t: 'move', fen: '1p6/8/8/8/3B3p/8/8/8 w - - 0 1', goal: { captureAll: true, par: 4 }, text: 'Estos peones no están en tu diagonal. Vas a necesitar más de una jugada.', hint: 'Primero lleva el alfil a una diagonal que pase por el peón.' },
        { t: 'quiz', text: 'Un alfil que está en una casilla oscura, ¿puede llegar alguna vez a una casilla clara?', options: ['Sí', 'No'], answer: 1, explain: 'Nunca. Por eso cada jugador tiene un alfil de casillas claras y otro de casillas oscuras.' }
      ] },
      { id: 'dama', title: 'La dama', glyph: 'Q', topic: 'piezas', summary: ['La dama se mueve como torre y como alfil.', 'Es la pieza más poderosa: vale 9.'], steps: [
        { t: 'info', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'La dama junta a la torre y al alfil: se mueve en línea recta y en diagonal. Es la pieza más poderosa del tablero.' },
        { t: 'move', fen: '3p4/8/8/p7/3Q3p/8/8/4p3 w - - 0 1', goal: { captureAll: true, par: 4 }, text: 'Captura los cuatro peones con la dama, uno detrás de otro.', hint: 'Combina líneas rectas y diagonales.' },
        { t: 'quiz', text: '¿Qué dos piezas combina la dama?', options: ['Torre y caballo', 'Torre y alfil', 'Alfil y caballo'], answer: 1, explain: 'Recto como la torre, en diagonal como el alfil.' }
      ] },
      { id: 'caballo', title: 'El caballo', glyph: 'N', topic: 'piezas', summary: ['El caballo salta en L: dos casillas y una al costado.', 'Es la única pieza que salta por encima de otras.'], steps: [
        { t: 'info', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'El caballo salta en forma de L: dos casillas en una dirección y una hacia el costado.' },
        { t: 'info', fen: '8/8/8/2ppp3/2pNp3/2ppp3/8/8 w - - 0 1', showMoves: 'd4', text: 'Es la única pieza que salta por encima de las demás. Aunque esté rodeado, sale igual.' },
        { t: 'move', fen: '8/6p1/4p3/7p/3N4/8/8/8 w - - 0 1', goal: { captureAll: true, par: 3 }, text: 'Captura los tres peones, uno detrás de otro.', hint: 'Cada captura deja al caballo listo para la siguiente.' },
        { t: 'quiz', text: '¿A cuántas casillas puede saltar un caballo que está en una esquina?', options: ['2', '4', '8'], answer: 0, explain: 'Solo 2. En el centro llega a 8: los caballos rinden más en el centro del tablero.' }
      ] },
      { id: 'rey', title: 'El rey', glyph: 'K', topic: 'piezas', summary: ['El rey se mueve una casilla en cualquier dirección.', 'Nunca puede ir a una casilla atacada.'], steps: [
        { t: 'info', fen: '8/8/8/8/3K4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'El rey se mueve una sola casilla, en cualquier dirección. Es la pieza más importante: si queda atrapado, pierdes la partida.' },
        { t: 'info', fen: '8/8/8/8/3K4/8/8/4r3 w - - 0 1', showMoves: 'd4', text: 'El rey nunca puede ir a una casilla atacada. La torre negra controla la columna e, por eso el rey no puede ir hacia allá.' },
        { t: 'move', fen: '8/8/8/6p1/3pKp2/8/8/8 w - - 0 1', goal: { anyOf: ['e4d4'] }, text: 'Captura un peón con el rey. Ojo: uno de los dos está defendido.', hint: '¿Qué peón negro protege a otro?', ok: 'Bien. El peón de f4 lo defiende el de g5, así que el rey no puede capturarlo.' },
        { t: 'quiz', text: '¿Puede el rey capturar una pieza que está defendida?', options: ['Sí', 'No'], answer: 1, explain: 'No, porque se estaría metiendo en una casilla atacada.' }
      ] },
      { id: 'peon', title: 'El peón', glyph: 'P', topic: 'piezas', summary: ['El peón avanza hacia adelante y captura en diagonal.', 'En su primera jugada puede avanzar dos.', 'Al llegar al final se corona.'], steps: [
        { t: 'info', fen: '8/8/8/8/8/8/4P3/8 w - - 0 1', showMoves: 'e2', text: 'El peón avanza una casilla hacia adelante. En su primera jugada puede avanzar dos. Nunca retrocede.' },
        { t: 'info', fen: '8/8/8/3p1p2/4P3/8/8/8 w - - 0 1', showMoves: 'e4', text: 'Para capturar, el peón se mueve distinto: una casilla en diagonal hacia adelante.' },
        { t: 'move', fen: '8/8/8/3p4/4P3/8/8/8 w - - 0 1', goal: { anyOf: ['e4d5'] }, text: 'Captura el peón negro.', hint: 'El peón captura en diagonal, no hacia adelante.' },
        { t: 'move', fen: '8/4P3/8/8/8/8/8/8 w - - 0 1', goal: { anyOf: ['e7e8q'] }, text: 'Cuando un peón llega a la última fila se corona: se convierte en otra pieza. ¡Corónalo como dama!', wrong: 'Elige la dama, que es la pieza más fuerte.' },
        { t: 'quiz', text: '¿Cómo captura el peón?', options: ['Hacia adelante', 'En diagonal hacia adelante', 'Hacia los lados'], answer: 1 }
      ] },
      { id: 'valor', title: 'Valor de las piezas', glyph: 'Q', topic: 'piezas', summary: ['Peón 1, caballo 3, alfil 3, torre 5, dama 9.', 'Antes de cambiar piezas, compara lo que das con lo que recibes.'], steps: [
        { t: 'info', fen: '8/8/8/8/8/8/8/8 w - - 0 1', text: 'Cada pieza tiene un valor aproximado en puntos: peón 1, caballo 3, alfil 3, torre 5 y dama 9. El rey no tiene precio: perderlo es perder la partida.' },
        { t: 'move', fen: '3r4/8/8/8/p7/8/8/3Q4 w - - 0 1', goal: { anyOf: ['d1d8'] }, text: 'Puedes capturar una de dos piezas. Elige la que vale más.', hint: 'Una vale 1 punto y la otra 5.', wrong: 'Esa vale menos. Busca la pieza más valiosa.' },
        { t: 'quiz', text: '¿Te conviene cambiar tu torre por un caballo del rival?', options: ['Sí, ganas puntos', 'No, pierdes 2 puntos'], answer: 1, explain: 'La torre vale 5 y el caballo 3: entregas más de lo que recibes.' },
        { t: 'quiz', text: '¿Cuánto suman un alfil y un caballo?', options: ['5', '6', '9'], answer: 1, explain: '3 + 3 = 6, un poco más que una torre.' }
      ] }
    ]
  },
  {
    id: 'mate', level: 'Principiante', title: 'Jaque y jaque mate', desc: 'Atacar al rey y ganar la partida',
    lessons: [
      { id: 'jaque', title: 'El jaque', glyph: 'K', topic: 'mate', summary: ['Atacar al rey es dar jaque.', 'El rival está obligado a salir del jaque.'], steps: [
        { t: 'info', fen: '4k3/8/8/8/8/8/8/4R1K1 b - - 0 1', text: 'Cuando una pieza ataca al rey enemigo, es jaque. El rival está obligado a sacar a su rey del jaque en la jugada siguiente.' },
        { t: 'move', fen: '4k3/8/8/8/8/8/8/R5K1 w - - 0 1', goal: { check: true }, text: 'Da jaque al rey negro con la torre.', hint: 'Pon la torre en la misma fila o columna que el rey.' },
        { t: 'move', fen: '4k3/8/8/8/4N3/8/8/6K1 w - - 0 1', goal: { check: true }, text: 'Ahora con el caballo.', hint: 'Busca una casilla desde donde el salto en L llegue al rey.' },
        { t: 'quiz', text: '¿De qué tres formas se sale de un jaque?', options: ['Mover el rey, tapar el jaque o capturar la pieza que ataca', 'Enrocar, mover el rey o pasar el turno', 'Solo moviendo el rey'], answer: 0 }
      ] },
      { id: 'salir', title: 'Salir del jaque', glyph: 'K', topic: 'mate', summary: ['Capturar al atacante suele ser lo mejor.', 'Si no se puede, tapa el jaque o mueve el rey a una casilla segura.'], steps: [
        { t: 'move', fen: '6k1/8/8/8/8/8/5q2/6K1 w - - 0 1', goal: { anyOf: ['g1f2'] }, text: 'Tu rey está en jaque. La mejor salida aquí: captura la pieza que lo ataca.', hint: '¿La dama negra está defendida por alguien?', wrong: 'Así escapas, pero la dama negra no está defendida. ¡Captúrala!' },
        { t: 'move', fen: '4r1k1/8/8/8/8/8/3B4/4K3 w - - 0 1', goal: { anyOf: ['d2e3'] }, text: 'Tapa el jaque poniendo el alfil en el camino.', hint: 'Busca una casilla entre la torre y tu rey.', wrong: 'Eso también sale del jaque, pero aquí se pide taparlo con el alfil.' },
        { t: 'move', fen: '6k1/8/8/8/8/8/5P1P/r5K1 w - - 0 1', goal: { anyOf: ['g1g2'] }, text: 'Aquí no puedes capturar ni tapar. Lleva el rey a una casilla segura.', hint: '¿Qué casilla junto al rey no ataca la torre?' }
      ] },
      { id: 'jaquemate', title: 'Jaque mate', glyph: 'Q', topic: 'mate', summary: ['Jaque mate = jaque sin ninguna salida.', 'Las piezas trabajan juntas para cerrar las escapatorias.'], steps: [
        { t: 'info', fen: 'R5k1/5ppp/8/8/8/8/8/6K1 b - - 0 1', text: 'Jaque mate: el rey está en jaque y no tiene cómo salir. Ahí termina la partida.' },
        { t: 'move', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', goal: { mate: true }, text: 'Da jaque mate en una jugada.', hint: 'Los propios peones negros encierran a su rey.' },
        { t: 'move', fen: '7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', goal: { mate: true }, text: 'Dama y rey trabajan juntos. Da jaque mate.', hint: 'Tu rey ya controla g7 y h7.' },
        { t: 'move', fen: '6k1/1R6/8/8/8/8/8/R5K1 w - - 0 1', goal: { mate: true }, text: 'Una torre corta la séptima fila. Da mate con la otra.', hint: 'El rey no puede bajar a la séptima.' }
      ] },
      { id: 'pasillo', title: 'Mate del pasillo', glyph: 'R', topic: 'mate', summary: ['Un rey en la última fila tapado por sus peones es vulnerable.', 'Defensa: darle una salida con h3 o g3 a tiempo.'], steps: [
        { t: 'info', fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', marks: ['e8'], text: 'Cuando el rey está en la última fila y sus propios peones le tapan la salida, una torre o la dama pueden darle mate desde el costado. Se llama mate del pasillo.' },
        { t: 'move', fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', goal: { mate: true }, text: 'Da mate del pasillo.', hint: '¿Quién defiende la última fila negra?' },
        { t: 'move', fen: '6k1/5ppp/8/8/8/8/1Q3PPP/6K1 w - - 0 1', goal: { mate: true }, text: 'Ahora con la dama.', hint: 'La dama también puede llegar a la última fila.' },
        { t: 'quiz', text: '¿Cómo evitas que te den mate del pasillo?', options: ['Abriendo una salida al rey con un peón (por ejemplo h3)', 'Llevando la dama al otro lado', 'Moviendo el rey al centro en la apertura'], answer: 0, explain: 'Una jugada como h3 o g3 a tiempo le da aire al rey.' }
      ] },
      { id: 'ahogado', title: 'Cuidado con el ahogado', glyph: 'K', topic: 'mate', summary: ['Sin jaque y sin jugadas legales = ahogado = tablas.', 'Cuando vas ganando, deja siempre una casilla libre al rey hasta el mate.'], steps: [
        { t: 'info', fen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1', text: 'El rey negro no está en jaque, pero no tiene ninguna jugada legal. Eso es ahogado y la partida termina en tablas. ¡Pasa mucho cuando vas ganando y te apuras!' },
        { t: 'move', fen: '7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', goal: { mate: true }, text: 'Da jaque mate sin ahogar al rey.', hint: 'Tiene que ser jaque: si no, es ahogado.' },
        { t: 'quiz', text: 'Si el rival no tiene jugadas pero NO está en jaque, ¿qué pasa?', options: ['Gano yo', 'Son tablas (ahogado)', 'Pierde el turno'], answer: 1 }
      ] }
    ]
  },
  {
    id: 'especiales', level: 'Principiante', title: 'Jugadas especiales', desc: 'Enroque, coronación y captura al paso',
    lessons: [
      { id: 'enroque', title: 'El enroque', glyph: 'K', topic: 'aperturas', summary: ['El rey se mueve dos casillas hacia la torre y la torre salta al otro lado.', 'No se puede si el rey o esa torre ya se movieron, si hay piezas entre medio o si el rey está en jaque o pasa por una casilla atacada.'], steps: [
        { t: 'info', fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1', showMoves: 'e1', text: 'El enroque es la única jugada donde se mueven dos piezas: el rey avanza dos casillas hacia una torre y la torre salta al otro lado del rey. Protege al rey y activa la torre.' },
        { t: 'move', fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', goal: { anyOf: ['e1g1'] }, text: 'Enroca corto: mueve el rey dos casillas hacia la torre de h1.', hint: 'Se mueve el rey, no la torre.' },
        { t: 'move', fen: 'r3kbnr/ppp1pppp/2nq4/3p1b2/3P1B2/2NQ4/PPP1PPPP/R3KBNR w KQkq - 6 5', goal: { anyOf: ['e1c1'] }, text: 'Ahora enroca largo, hacia la torre de a1.', hint: 'El rey va dos casillas hacia la izquierda.' },
        { t: 'quiz', text: '¿Cuándo NO puedes enrocar?', options: ['Si el rey está en jaque o ya se movió', 'Si todavía tienes la dama', 'Después de la jugada 10'], answer: 0 }
      ] },
      { id: 'alpaso', title: 'Captura al paso', glyph: 'P', topic: 'piezas', summary: ['Si un peón rival avanza dos casillas y queda al lado del tuyo, puedes capturarlo como si hubiera avanzado una.', 'Solo en la jugada inmediatamente siguiente.'], steps: [
        { t: 'info', fen: '8/8/8/3pP3/8/8/8/8 w - d6 0 1', showMoves: 'e5', text: 'El peón negro acaba de avanzar dos casillas (de d7 a d5) y quedó al lado del tuyo. Puedes capturarlo "al paso", moviendo a d6 como si hubiera avanzado solo una.' },
        { t: 'move', fen: 'k7/8/8/3pP3/8/8/8/K7 w - d6 0 1', goal: { anyOf: ['e5d6'] }, text: 'Captura al paso.', hint: 'Tu peón va en diagonal a la casilla que el peón negro "saltó".' },
        { t: 'quiz', text: '¿Cuándo se puede capturar al paso?', options: ['Solo justo después de que el peón rival avanzó dos casillas', 'En cualquier momento de la partida', 'Solo con la dama'], answer: 0 }
      ] }
    ]
  },
  {
    id: 'aperturas', level: 'Principiante', title: 'Aperturas', desc: 'Centro, desarrollo y seguridad del rey',
    lessons: [
      { id: 'principios', title: 'Tres reglas de oro', glyph: 'P', topic: 'aperturas', summary: ['Controla el centro.', 'Desarrolla caballos y alfiles.', 'Enroca temprano.'], steps: [
        { t: 'info', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', marks: ['d4', 'e4', 'd5', 'e5'], text: 'Regla 1: controla el centro. Las cuatro casillas marcadas son las más importantes al principio.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { anyOf: ['e2e4', 'd2d4'] }, text: 'Juega un peón al centro avanzando dos casillas.', hint: 'Los peones de d y e son los del centro.' },
        { t: 'move', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', goal: { anyOf: ['g1f3', 'b1c3'] }, text: 'Regla 2: desarrolla tus piezas. Saca un caballo hacia el centro.', hint: 'Los caballos van mejor a f3 y c3 que a los bordes.' },
        { t: 'move', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', goal: { anyOf: ['e1g1'] }, text: 'Regla 3: protege a tu rey enrocando.', ok: 'Eso es el enroque: el rey queda protegido y la torre entra en juego.' },
        { t: 'quiz', text: '¿Cuál de estas jugadas NO sigue las reglas de oro?', options: ['Sacar un caballo', 'Mover la dama muchas veces al principio', 'Enrocar'], answer: 1, explain: 'Si sacas la dama muy temprano, el rival la ataca mientras desarrolla sus piezas.' }
      ] },
      { id: 'italiana', title: 'La Italiana', glyph: 'B', topic: 'aperturas', summary: ['1.e4 e5 2.Cf3 Cc6 3.Ac4.', 'El alfil apunta a f7, el punto débil de las negras.'], steps: [
        { t: 'info', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', text: 'La Italiana es una de las aperturas más antiguas y sanas: peón al centro, caballo y alfil apuntando a f7, el punto débil de las negras.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { line: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4'] }, text: 'Juega la Italiana: e4, después caballo a f3 y alfil a c4.', hint: 'Primero el peón del rey dos casillas.', notes: ['Peón al centro.', 'El caballo ataca el peón de e5.', 'El alfil apunta a f7. ¡Esa es la Italiana!'] }
      ] },
      { id: 'pastor', title: 'El mate del pastor', glyph: 'Q', topic: 'aperturas', summary: ['Dama y alfil contra f7 pueden dar mate en 4 jugadas.', 'Defensa: cubrir f7 o atacar a la dama (g6, De7, Df6).'], steps: [
        { t: 'info', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', marks: ['f7'], text: 'La dama y el alfil apuntan juntos a f7, que solo defiende el rey. Si las negras no se dan cuenta, es mate en una.' },
        { t: 'move', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', goal: { mate: true }, text: 'Da el mate del pastor.', hint: 'La casilla débil es f7.' },
        { t: 'move', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', goal: { anyOf: ['g7g6', 'd8e7', 'd8f6'] }, text: 'Ahora juegas con negras. Las blancas amenazan mate en f7. Defiéndete.', hint: 'Cubre f7 o ataca a la dama blanca.', ok: 'Bien defendido. Saber parar este mate te va a salvar muchas partidas.' }
      ] }
    ]
  },
  {
    id: 'tacticas', level: 'Intermedio', title: 'Tácticas', desc: 'Trucos para ganar material',
    lessons: [
      { id: 'colgada', title: 'Piezas colgadas', glyph: 'N', topic: 'colgada', summary: ['Antes de jugar: ¿hay algo gratis? ¿dejé algo sin defensa?'], steps: [
        { t: 'info', fen: 'r5k1/8/8/3n4/8/8/8/3QK3 w - - 0 1', text: 'Una pieza colgada es una que nadie defiende. Antes de cada jugada pregúntate: ¿hay algo gratis para capturar? ¿Dejé algo mío sin defensa?' },
        { t: 'move', fen: 'r5k1/8/8/3n4/8/8/8/3QK3 w - - 0 1', goal: { anyOf: ['d1d5'] }, text: 'Hay una pieza negra sin defensa. Captúrala.', hint: 'Revisa qué piezas negras ataca tu dama.' },
        { t: 'puzzle', id: 'colgada-1', text: 'Ahora en una partida real: encuentra la pieza que gana material.' }
      ] },
      { id: 'horquilla', title: 'La horquilla', glyph: 'N', topic: 'doble', summary: ['Atacar dos piezas a la vez: el rival solo salva una.', 'El caballo es el rey de las horquillas.'], steps: [
        { t: 'info', fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', text: 'Una horquilla es atacar dos piezas a la vez con una sola. El rival solo puede salvar una. El caballo es el rey de las horquillas.' },
        { t: 'move', fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', goal: { line: ['d5c7', '*', 'c7a8'] }, text: 'Ataca al rey y a la torre a la vez con el caballo. Después, cobra.', hint: 'Busca una casilla que ataque a e8 y a a8.', notes: ['¡Jaque y la torre atacada! El rey tiene que moverse…', 'Ganaste la torre.'] },
        { t: 'move', fen: 'k7/8/8/2r1n3/8/3P4/8/K7 w - - 0 1', goal: { anyOf: ['d3d4'] }, text: 'Hasta un peón puede hacer una horquilla. Ataca las dos piezas negras.', hint: 'Un peón ataca las dos casillas diagonales de adelante.', ok: 'Atacas la torre y el caballo. El rival solo puede salvar una.' }
      ] },
      { id: 'doble', title: 'Ataque doble', glyph: 'Q', topic: 'doble', summary: ['La dama ataca en ocho direcciones: ideal para atacar dos cosas a la vez.'], steps: [
        { t: 'move', fen: 'r5k1/8/8/8/8/8/8/3QK3 w - - 0 1', goal: { line: ['d1d5', '*', 'd5a8'] }, text: 'Con la dama puedes atacar dos cosas a la vez. Da jaque y ataca la torre.', hint: 'Busca una casilla con una diagonal hacia el rey y otra hacia la torre.', notes: ['Jaque al rey y la torre atacada por la otra diagonal.', 'Torre ganada.'] },
        { t: 'puzzle', id: 'doble-1', text: 'Encuentra el ataque doble en esta partida.' }
      ] },
      { id: 'clavada', title: 'La clavada', glyph: 'B', topic: 'clavada', summary: ['Una pieza clavada no puede moverse sin exponer algo más valioso.', 'Ataca a la pieza clavada.'], steps: [
        { t: 'info', fen: '4k3/8/3p4/4n3/8/8/5P2/4R1K1 w - - 0 1', marks: ['e5'], text: 'Una pieza está clavada cuando no puede moverse porque detrás de ella hay una pieza más importante. Aquí la torre de e1 clava al caballo: si se mueve, su rey queda en jaque.' },
        { t: 'move', fen: '4k3/8/3p4/4n3/8/8/5P2/4R1K1 w - - 0 1', goal: { line: ['f2f4', '*', 'f4e5'] }, text: 'Encuentra la jugada que aprovecha la clavada.', hint: 'Fíjate en la pieza que está detrás. Si el caballo se mueve, queda expuesto el rey. ¿Qué pieza tuya puede atacarlo?', notes: ['El caballo no puede escapar.', '¡Caballo ganado por un peón!'] }
      ] },
      { id: 'enfilada', title: 'La enfilada', glyph: 'R', topic: 'clavada', summary: ['Ataca una pieza valiosa; al moverse, deja descubierta la de atrás.'], steps: [
        { t: 'info', fen: '8/8/2k3q1/8/8/8/7K/R7 w - - 0 1', text: 'La enfilada es como una clavada al revés: atacas una pieza valiosa que está adelante y, cuando se mueve, capturas la que estaba detrás.' },
        { t: 'move', fen: '8/8/2k3q1/8/8/8/7K/R7 w - - 0 1', goal: { line: ['a1a6', '*', 'a6g6'] }, text: 'El rey y la dama están en la misma fila. Da jaque con la torre y gana la dama.', hint: '¿En qué fila están el rey y la dama?', notes: ['Jaque. Cuando el rey se mueva, la dama queda descubierta…', '¡Dama ganada!'] }
      ] },
      { id: 'descubierto', title: 'Ataque descubierto', glyph: 'N', topic: 'descubierto', summary: ['Mover una pieza puede destapar el ataque de otra que estaba detrás.', 'Si es jaque descubierto, la pieza que se mueve puede capturar lo que quiera.'], steps: [
        { t: 'info', fen: '4k3/8/8/2q5/4N3/8/8/4R2K w - - 0 1', text: 'La torre de e1 apunta al rey, pero el caballo está en medio. Si el caballo se mueve, destapa un jaque, y mientras el rival se defiende del jaque, el caballo puede capturar.' },
        { t: 'move', fen: '4k3/8/8/2q5/4N3/8/8/4R2K w - - 0 1', goal: { anyOf: ['e4c5'] }, text: 'Mueve el caballo con jaque descubierto y gana la dama.', hint: '¿Qué pieza negra puede capturar el caballo?' }
      ] }
    ]
  },
  {
    id: 'finales', level: 'Intermedio', title: 'Finales', desc: 'Rematar partidas ganadas',
    lessons: [
      { id: 'coronar', title: 'Carrera a coronar', glyph: 'P', topic: 'finales', summary: ['Un peón coronado es una dama nueva.', 'Cuenta las jugadas antes de correr.'], steps: [
        { t: 'info', fen: 'k7/8/8/4P3/8/8/8/K7 w - - 0 1', text: 'En el final, un peón que corona vale una dama. Cuenta las jugadas: ¿llega tu peón antes de que lo alcance el rey rival?' },
        { t: 'move', fen: 'k7/8/8/4P3/8/8/8/K7 w - - 0 1', goal: { play: 'promote', maxMoves: 4 }, text: 'Corre con el peón y corónalo antes de que llegue el rey negro.', hint: 'Avanza el peón en cada jugada, sin perder tiempo.' }
      ] },
      { id: 'reydama', title: 'Mate con dama y rey', glyph: 'Q', topic: 'finales', summary: ['Encierra al rey con la dama sin dar jaques inútiles.', 'Acerca tu rey y da mate en el borde.', 'Ojo con el ahogado.'], steps: [
        { t: 'info', fen: '8/8/8/4k3/8/8/8/K6Q w - - 0 1', text: 'Técnica: usa la dama para encerrar al rey en una caja cada vez más chica (sin dar jaques inútiles), acerca tu rey y da mate en el borde. Cuidado con ahogar.' },
        { t: 'move', fen: '8/8/8/4k3/8/8/8/K6Q w - - 0 1', goal: { play: 'mate', maxMoves: 25 }, text: 'Da jaque mate con la dama y el rey. Tienes 25 jugadas.', hint: 'Pon la dama a un salto de caballo del rey negro para encerrarlo.' }
      ] },
      { id: 'dostorres', title: 'Mate de la escalera', glyph: 'R', topic: 'finales', summary: ['Una torre corta una fila y la otra da jaque en la siguiente.'], steps: [
        { t: 'info', fen: '8/8/8/4k3/8/8/8/RR4K1 w - - 0 1', text: 'Con dos torres no necesitas al rey: una corta una fila y la otra da jaque en la siguiente, subiendo como una escalera hasta el borde.' },
        { t: 'move', fen: '8/8/8/4k3/8/8/8/RR4K1 w - - 0 1', goal: { play: 'mate', maxMoves: 15 }, text: 'Da mate con las dos torres. Tienes 15 jugadas.', hint: 'Si el rey se acerca a una torre, llévala al otro lado del tablero.' }
      ] }
    ]
  },
  {
    id: 'calculo', level: 'Avanzado', title: 'Cálculo', desc: 'Ver varias jugadas adelante',
    lessons: [
      { id: 'mate2a', title: 'Mate en 2', glyph: 'Q', topic: 'calculo', summary: ['Calcula la respuesta del rival antes de jugar.', 'Busca primero jaques, capturas y amenazas.'], steps: [
        { t: 'info', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', text: 'Calcular es ver la posición unas jugadas más adelante. Método: mira primero los jaques, después las capturas y después las amenazas, y para cada uno imagina la mejor respuesta del rival.' },
        { t: 'puzzle', id: 'mate2-1' }, { t: 'puzzle', id: 'mate2-2' }, { t: 'puzzle', id: 'mate2-3' }
      ] },
      { id: 'mate3a', title: 'Mate en 3', glyph: 'K', topic: 'calculo', summary: ['En los mates largos, cada jugada debe dejarle al rival lo mínimo.'], steps: [
        { t: 'puzzle', id: 'mate3-1' }, { t: 'puzzle', id: 'mate3-2' }
      ] }
    ]
  }
];

export const ALL_LESSONS = UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unit: u })));
export const lessonById = (id: string) => ALL_LESSONS.find(l => l.id === id);
