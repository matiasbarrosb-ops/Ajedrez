/*
 * Contenido de las lecciones.
 * Tipos de paso:
 *   info  — tablero de muestra + texto. showMoves: casilla cuya pieza muestra sus movimientos.
 *   quiz  — pregunta de alternativas (answer = índice correcto).
 *   move  — el jugador mueve. goal:
 *     {anyOf:[...]}             una de esas jugadas
 *     {check:true}              cualquier jaque
 *     {mate:true}               cualquier jaque mate
 *     {captureAll:true, par}    capturar todas las piezas negras (las negras no mueven)
 *     {line:[...]}              secuencia; '*' = responde el motor, otra jugada = respuesta fija
 *     {play:'mate'|'promote', maxMoves}  partida libre contra el motor hasta lograrlo
 * Las jugadas van en formato e2e4 (más letra de coronación: e7e8q). Alternativas con '|'.
 */
export const UNITS = [
  {
    id: 'piezas', title: 'Conoce las piezas', desc: 'Cómo se mueve cada una y cuánto vale', glyph: 'N',
    lessons: [
      { id: 'torre', title: 'La torre', glyph: 'R', steps: [
        { t: 'info', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'La torre se mueve en línea recta: adelante, atrás y hacia los lados, todas las casillas que quiera mientras nada le bloquee el camino.' },
        { t: 'move', fen: '3p4/8/8/8/3R3p/8/8/8 w - - 0 1', goal: { captureAll: true, par: 2 }, text: 'Captura los dos peones con la torre.' },
        { t: 'move', fen: '8/1p6/8/8/1R2P2p/8/8/8 w - - 0 1', goal: { captureAll: true, par: 3 }, text: 'Tu propio peón bloquea el camino. Captura los peones de todos modos.' },
        { t: 'quiz', text: '¿A cuántas casillas puede llegar una torre en un tablero vacío?', options: ['7', '14', '28'], answer: 1, explain: 'Siempre 14: siete en su fila y siete en su columna, esté donde esté.' }
      ] },
      { id: 'alfil', title: 'El alfil', glyph: 'B', steps: [
        { t: 'info', fen: '8/8/8/8/3B4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'El alfil se mueve en diagonal, todas las casillas que quiera.' },
        { t: 'move', fen: '8/6p1/8/8/3B4/8/1p6/8 w - - 0 1', goal: { captureAll: true, par: 2 }, text: 'Captura los dos peones.' },
        { t: 'move', fen: '1p6/8/8/8/3B3p/8/8/8 w - - 0 1', goal: { captureAll: true, par: 3 }, text: 'Estos peones no están en tu diagonal. Piensa el camino: vas a necesitar más de una jugada.' },
        { t: 'quiz', text: 'Un alfil que está en una casilla oscura, ¿puede llegar alguna vez a una casilla clara?', options: ['Sí', 'No'], answer: 1, explain: 'Nunca. Por eso cada jugador tiene un alfil de casillas claras y otro de casillas oscuras.' }
      ] },
      { id: 'dama', title: 'La dama', glyph: 'Q', steps: [
        { t: 'info', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'La dama junta a la torre y al alfil: se mueve en línea recta y en diagonal. Es la pieza más poderosa del tablero.' },
        { t: 'move', fen: '8/p5p1/8/8/3Q3p/8/8/3p4 w - - 0 1', goal: { captureAll: true, par: 4 }, text: 'Captura los cuatro peones con la dama.' },
        { t: 'quiz', text: '¿Qué dos piezas combina la dama?', options: ['Torre y caballo', 'Torre y alfil', 'Alfil y caballo'], answer: 1, explain: 'Recto como la torre, en diagonal como el alfil.' }
      ] },
      { id: 'caballo', title: 'El caballo', glyph: 'N', steps: [
        { t: 'info', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'El caballo salta en forma de L: dos casillas en una dirección y una hacia el costado.' },
        { t: 'info', fen: '8/8/8/2ppp3/2pNp3/2ppp3/8/8 w - - 0 1', showMoves: 'd4', text: 'Es la única pieza que salta por encima de las demás. Aunque esté rodeado, sale igual.' },
        { t: 'move', fen: '8/6p1/4p3/7p/3N4/8/8/8 w - - 0 1', goal: { captureAll: true, par: 3 }, text: 'Captura los tres peones, uno detrás de otro.' },
        { t: 'quiz', text: '¿A cuántas casillas puede saltar un caballo que está en una esquina?', options: ['2', '4', '8'], answer: 0, explain: 'Solo 2. En el centro llega a 8: los caballos rinden más en el centro del tablero.' }
      ] },
      { id: 'rey', title: 'El rey', glyph: 'K', steps: [
        { t: 'info', fen: '8/8/8/8/3K4/8/8/8 w - - 0 1', showMoves: 'd4', text: 'El rey se mueve una sola casilla, en cualquier dirección. Es la pieza más importante: si queda atrapado, pierdes la partida.' },
        { t: 'info', fen: '8/8/8/8/3K4/8/8/4r3 w - - 0 1', showMoves: 'd4', text: 'El rey nunca puede ir a una casilla atacada. La torre negra controla la columna e, por eso el rey no puede ir hacia allá.' },
        { t: 'move', fen: '8/8/8/6p1/3pKp2/8/8/8 w - - 0 1', goal: { anyOf: ['e4d4'] }, text: 'Captura un peón con el rey. Ojo: uno de los dos está defendido.', ok: 'Bien. El peón de f4 lo defiende el de g5, así que el rey no puede capturarlo.' },
        { t: 'quiz', text: '¿Puede el rey capturar una pieza que está defendida?', options: ['Sí', 'No'], answer: 1, explain: 'No, porque se estaría metiendo en una casilla atacada.' }
      ] },
      { id: 'peon', title: 'El peón', glyph: 'P', steps: [
        { t: 'info', fen: '8/8/8/8/8/8/4P3/8 w - - 0 1', showMoves: 'e2', text: 'El peón avanza una casilla hacia adelante. En su primera jugada puede avanzar dos. Nunca retrocede.' },
        { t: 'info', fen: '8/8/8/3p1p2/4P3/8/8/8 w - - 0 1', showMoves: 'e4', text: 'Para capturar, el peón se mueve distinto: una casilla en diagonal hacia adelante.' },
        { t: 'move', fen: '8/8/8/3p4/4P3/8/8/8 w - - 0 1', goal: { anyOf: ['e4d5'] }, text: 'Captura el peón negro.' },
        { t: 'move', fen: '8/4P3/8/8/8/8/8/8 w - - 0 1', goal: { anyOf: ['e7e8q'] }, text: 'Cuando un peón llega a la última fila se corona: se convierte en otra pieza. ¡Corónalo como dama!', wrong: 'Elige la dama, que es la pieza más fuerte.' },
        { t: 'quiz', text: '¿Cómo captura el peón?', options: ['Hacia adelante', 'En diagonal hacia adelante', 'Hacia los lados'], answer: 1 }
      ] },
      { id: 'valor', title: 'Valor de las piezas', glyph: 'Q', steps: [
        { t: 'info', fen: '8/8/8/8/8/8/8/8 w - - 0 1', text: 'Cada pieza tiene un valor aproximado en puntos: peón 1, caballo 3, alfil 3, torre 5 y dama 9. El rey no tiene precio: perderlo es perder la partida.' },
        { t: 'move', fen: '3r4/8/8/8/p7/8/8/3Q4 w - - 0 1', goal: { anyOf: ['d1d8'] }, text: 'Puedes capturar una de dos piezas. Elige la que vale más.', wrong: 'Esa vale menos. Busca la pieza más valiosa.' },
        { t: 'quiz', text: '¿Te conviene cambiar tu torre por un caballo del rival?', options: ['Sí, ganas puntos', 'No, pierdes 2 puntos'], answer: 1, explain: 'La torre vale 5 y el caballo 3: entregas más de lo que recibes.' },
        { t: 'quiz', text: '¿Cuánto suman un alfil y un caballo?', options: ['5', '6', '9'], answer: 1, explain: '3 + 3 = 6, un poco más que una torre.' }
      ] }
    ]
  },
  {
    id: 'mate', title: 'Jaque y jaque mate', desc: 'Atacar al rey y ganar la partida', glyph: 'K',
    lessons: [
      { id: 'jaque', title: 'El jaque', glyph: 'K', steps: [
        { t: 'info', fen: '4k3/8/8/8/8/8/8/4R1K1 b - - 0 1', text: 'Cuando una pieza ataca al rey enemigo, es jaque. El rival está obligado a sacar a su rey del jaque en la jugada siguiente.' },
        { t: 'move', fen: '4k3/8/8/8/8/8/8/R5K1 w - - 0 1', goal: { check: true }, text: 'Da jaque al rey negro con la torre.' },
        { t: 'move', fen: '4k3/8/8/8/4N3/8/8/6K1 w - - 0 1', goal: { check: true }, text: 'Ahora con el caballo.' },
        { t: 'quiz', text: '¿De qué tres formas se sale de un jaque?', options: ['Mover el rey, tapar el jaque o capturar la pieza que ataca', 'Enrocar, mover el rey o pasar el turno', 'Solo moviendo el rey'], answer: 0 }
      ] },
      { id: 'salir', title: 'Salir del jaque', glyph: 'K', steps: [
        { t: 'move', fen: '6k1/8/8/8/8/8/5q2/6K1 w - - 0 1', goal: { anyOf: ['g1f2'] }, text: 'Tu rey está en jaque. La mejor salida aquí: captura la pieza que lo ataca.', wrong: 'Así escapas, pero la dama negra no está defendida. ¡Captúrala!' },
        { t: 'move', fen: '4r1k1/8/8/8/8/8/3B4/4K3 w - - 0 1', goal: { anyOf: ['d2e3'] }, text: 'Tapa el jaque poniendo el alfil en el camino.', wrong: 'Eso también sale del jaque, pero aquí se pide taparlo con el alfil.' },
        { t: 'move', fen: '6k1/8/8/8/8/8/5P1P/r5K1 w - - 0 1', goal: { anyOf: ['g1g2'] }, text: 'Aquí no puedes capturar ni tapar. Lleva el rey a una casilla segura.' }
      ] },
      { id: 'jaquemate', title: 'Jaque mate', glyph: 'Q', steps: [
        { t: 'info', fen: 'R5k1/5ppp/8/8/8/8/8/6K1 b - - 0 1', text: 'Jaque mate: el rey está en jaque y no tiene cómo salir. Ahí termina la partida.' },
        { t: 'move', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', goal: { mate: true }, text: 'Da jaque mate en una jugada.' },
        { t: 'move', fen: '7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', goal: { mate: true }, text: 'Dama y rey trabajan juntos. Da jaque mate.' },
        { t: 'move', fen: '6k1/1R6/8/8/8/8/8/R5K1 w - - 0 1', goal: { mate: true }, text: 'Una torre corta la séptima fila. Da mate con la otra.' }
      ] },
      { id: 'pasillo', title: 'Mate del pasillo', glyph: 'R', steps: [
        { t: 'info', fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', text: 'Cuando el rey está en la última fila y sus propios peones le tapan la salida, una torre o la dama pueden darle mate desde el costado. Se llama mate del pasillo.' },
        { t: 'move', fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', goal: { mate: true }, text: 'Da mate del pasillo.' },
        { t: 'move', fen: '6k1/5ppp/8/8/8/8/1Q3PPP/6K1 w - - 0 1', goal: { mate: true }, text: 'Ahora con la dama.' },
        { t: 'quiz', text: '¿Cómo evitas que te den mate del pasillo?', options: ['Abriendo una salida al rey con un peón (por ejemplo h3)', 'Llevando la dama al otro lado', 'Moviendo el rey al centro en la apertura'], answer: 0, explain: 'Una jugada como h3 o g3 a tiempo le da aire al rey.' }
      ] },
      { id: 'ahogado', title: 'Cuidado con el ahogado', glyph: 'K', steps: [
        { t: 'info', fen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1', text: 'El rey negro no está en jaque, pero no tiene ninguna jugada legal. Eso es ahogado y la partida termina en tablas. ¡Pasa mucho cuando vas ganando y te apuras!' },
        { t: 'move', fen: '7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', goal: { mate: true }, text: 'Da jaque mate sin ahogar al rey.' },
        { t: 'quiz', text: 'Si el rival no tiene jugadas pero NO está en jaque, ¿qué pasa?', options: ['Gano yo', 'Son tablas (ahogado)', 'Pierde el turno'], answer: 1 }
      ] }
    ]
  },
  {
    id: 'tacticas', title: 'Tácticas', desc: 'Trucos para ganar material', glyph: 'B',
    lessons: [
      { id: 'colgada', title: 'Piezas colgadas', glyph: 'N', steps: [
        { t: 'info', fen: 'r3k3/8/8/3n4/8/8/8/3QK3 w - - 0 1', text: 'Una pieza colgada es una que nadie defiende. Antes de cada jugada pregúntate: ¿hay algo gratis para capturar? ¿Dejé algo mío sin defensa?' },
        { t: 'move', fen: 'r3k3/8/8/3n4/8/8/8/3QK3 w - - 0 1', goal: { anyOf: ['d1d5'] }, text: 'Hay una pieza negra sin defensa. Captúrala.' }
      ] },
      { id: 'horquilla', title: 'La horquilla', glyph: 'N', steps: [
        { t: 'info', fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', text: 'Una horquilla es atacar dos piezas a la vez con una sola. El rival solo puede salvar una. El caballo es el rey de las horquillas.' },
        { t: 'move', fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', goal: { line: ['d5c7', '*', 'c7a8'] }, text: 'Ataca al rey y a la torre a la vez con el caballo. Después, cobra.', notes: ['¡Jaque y la torre atacada! El rey tiene que moverse…', 'Ganaste la torre.'] },
        { t: 'move', fen: 'k7/8/8/2r1n3/8/3P4/8/K7 w - - 0 1', goal: { anyOf: ['d3d4'] }, text: 'Hasta un peón puede hacer una horquilla. Ataca las dos piezas negras.', ok: 'Atacas la torre y el caballo. El rival solo puede salvar una.' }
      ] },
      { id: 'doble', title: 'Ataque doble', glyph: 'Q', steps: [
        { t: 'move', fen: 'r3k3/8/8/8/8/8/8/3QK3 w - - 0 1', goal: { line: ['d1a4', '*', 'a4a8'] }, text: 'Con la dama puedes atacar dos cosas a la vez. Da jaque y ataca la torre.', notes: ['Jaque al rey y la torre atacada por la columna a.', 'Torre ganada.'] }
      ] },
      { id: 'clavada', title: 'La clavada', glyph: 'B', steps: [
        { t: 'info', fen: '4k3/8/2n5/8/B7/8/8/4K3 w - - 0 1', text: 'El caballo negro está clavado: si se mueve, deja a su rey en jaque, así que no puede moverse. Una pieza clavada es un blanco fácil.' },
        { t: 'move', fen: '4k3/8/2n5/8/B2P4/8/8/4K3 w - - 0 1', goal: { line: ['d4d5', '*', 'd5c6'] }, text: 'Ataca al caballo clavado con el peón. No va a poder escapar.', notes: ['El caballo no se puede mover.', '¡Caballo ganado!'] }
      ] },
      { id: 'enfilada', title: 'La enfilada', glyph: 'R', steps: [
        { t: 'info', fen: '8/8/2k3q1/8/8/8/7K/R7 w - - 0 1', text: 'La enfilada es como una clavada al revés: atacas una pieza valiosa que está adelante y, cuando se mueve, capturas la que estaba detrás.' },
        { t: 'move', fen: '8/8/2k3q1/8/8/8/7K/R7 w - - 0 1', goal: { line: ['a1a6', '*', 'a6g6'] }, text: 'El rey y la dama están en la misma fila. Da jaque con la torre y gana la dama.', notes: ['Jaque. Cuando el rey se mueva, la dama queda descubierta…', '¡Dama ganada!'] }
      ] }
    ]
  },
  {
    id: 'aperturas', title: 'Aperturas', desc: 'Cómo empezar bien una partida', glyph: 'P',
    lessons: [
      { id: 'principios', title: 'Tres reglas de oro', glyph: 'P', steps: [
        { t: 'info', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', marks: ['d4', 'e4', 'd5', 'e5'], text: 'Regla 1: controla el centro. Las cuatro casillas marcadas son las más importantes al principio.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { anyOf: ['e2e4', 'd2d4'] }, text: 'Juega un peón al centro avanzando dos casillas.' },
        { t: 'move', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', goal: { anyOf: ['g1f3', 'b1c3'] }, text: 'Regla 2: desarrolla tus piezas. Saca un caballo hacia el centro.' },
        { t: 'move', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', goal: { anyOf: ['e1g1'] }, text: 'Regla 3: protege a tu rey enrocando. Mueve el rey dos casillas hacia la torre.', ok: 'Eso es el enroque: el rey queda protegido y la torre entra en juego.' },
        { t: 'quiz', text: '¿Cuál de estas jugadas NO sigue las reglas de oro?', options: ['Sacar un caballo', 'Mover la dama muchas veces al principio', 'Enrocar'], answer: 1, explain: 'Si sacas la dama muy temprano, el rival la ataca mientras desarrolla sus piezas.' }
      ] },
      { id: 'italiana', title: 'La Italiana', glyph: 'B', steps: [
        { t: 'info', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', text: 'La Italiana es una de las aperturas más antiguas y sanas: peón al centro, caballo y alfil apuntando a f7, el punto débil de las negras.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { line: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4'] }, text: 'Juega la Italiana: e4, después caballo a f3 y alfil a c4.', notes: ['Peón al centro.', 'El caballo ataca el peón de e5.', 'El alfil apunta a f7. ¡Esa es la Italiana!'], hints: ['e2e4', 'g1f3', 'f1c4'] }
      ] },
      { id: 'pastor', title: 'El mate del pastor', glyph: 'Q', steps: [
        { t: 'info', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', text: 'La dama y el alfil apuntan juntos a f7, que solo defiende el rey. Si las negras no se dan cuenta, es mate en una.' },
        { t: 'move', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', goal: { mate: true }, text: 'Da el mate del pastor.' },
        { t: 'move', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', goal: { anyOf: ['g7g6', 'd8e7', 'd8f6'] }, text: 'Ahora juegas con negras. Las blancas amenazan mate en f7. Defiéndete.', ok: 'Bien defendido. Saber parar este mate te va a salvar muchas partidas.' }
      ] }
    ]
  },
  {
    id: 'finales', title: 'Finales', desc: 'Rematar partidas ganadas', glyph: 'K',
    lessons: [
      { id: 'coronar', title: 'Carrera a coronar', glyph: 'P', steps: [
        { t: 'info', fen: 'k7/8/8/4P3/8/8/8/K7 w - - 0 1', text: 'En el final, un peón que corona vale una dama. Cuenta las jugadas: ¿llega tu peón antes de que lo alcance el rey rival?' },
        { t: 'move', fen: 'k7/8/8/4P3/8/8/8/K7 w - - 0 1', goal: { play: 'promote', maxMoves: 4 }, text: 'Corre con el peón y corónalo antes de que llegue el rey negro.' }
      ] },
      { id: 'reydama', title: 'Mate con dama y rey', glyph: 'Q', steps: [
        { t: 'info', fen: '8/8/8/4k3/8/8/8/K6Q w - - 0 1', text: 'Técnica: usa la dama para encerrar al rey en una caja cada vez más chica (sin dar jaques inútiles), acerca tu rey y da mate en el borde. Cuidado con ahogar.' },
        { t: 'move', fen: '8/8/8/4k3/8/8/8/K6Q w - - 0 1', goal: { play: 'mate', maxMoves: 25 }, text: 'Da jaque mate con la dama y el rey. Tienes 25 jugadas.' }
      ] },
      { id: 'dostorres', title: 'Mate de la escalera', glyph: 'R', steps: [
        { t: 'info', fen: '8/8/8/4k3/8/8/8/RR4K1 w - - 0 1', text: 'Con dos torres no necesitas al rey: una corta una fila y la otra da jaque en la siguiente, subiendo como una escalera hasta el borde.' },
        { t: 'move', fen: '8/8/8/4k3/8/8/8/RR4K1 w - - 0 1', goal: { play: 'mate', maxMoves: 15 }, text: 'Da mate con las dos torres. Tienes 15 jugadas.' }
      ] }
    ]
  }
];

export const PIECE_NAMES = { K: 'rey', Q: 'dama', R: 'torre', B: 'alfil', N: 'caballo', P: 'peón' };
