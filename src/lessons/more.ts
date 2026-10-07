/*
 * Lecciones adicionales (unidades nuevas). Mismo formato que data.ts.
 * Todo se verifica con `node tools/check-lessons.ts`.
 */
import type { Unit } from './data.ts';

export const MORE_UNITS: Unit[] = [
  /* ---------------- Principiante ---------------- */
  {
    id: 'seguridad', level: 'Principiante', title: 'No regales piezas', desc: 'El error más común: dejar piezas sin defensa',
    lessons: [
      { id: 'atacada', title: 'Pieza atacada', glyph: 'N', topic: 'seguridad', summary: ['Si te atacan una pieza: muévela, defiéndela o captura al atacante.', 'Revisa siempre qué ataca la última jugada del rival.'], steps: [
        { t: 'info', fen: '4k3/8/8/2p5/3N4/8/8/4K3 w - - 0 1', marks: ['c5', 'd4'], text: 'El peón negro de c5 ataca a tu caballo de d4. Un peón vale 1 y un caballo 3: si no haces nada, lo pierdes. La mayoría de las partidas entre principiantes se deciden por piezas regaladas así.' },
        { t: 'move', fen: '4k3/8/8/2p5/3N4/8/8/4K3 w - - 0 1', goal: { anyOf: ['d4b3', 'd4b5', 'd4c2', 'd4c6', 'd4e2', 'd4e6', 'd4f3', 'd4f5'] }, text: 'Pon tu caballo a salvo.', hint: 'Mueve el caballo a una casilla que el peón no ataque.', ok: 'Bien: tu caballo ya no está en peligro.' },
        { t: 'info', fen: '4k3/8/8/8/3b4/8/8/R3K3 w - - 0 1', marks: ['d4', 'a1'], text: 'Los ataques no siempre son tan obvios. El alfil negro de d4 apunta en diagonal hasta a1, donde está tu torre.' },
        { t: 'move', fen: '4k3/8/8/8/3b4/8/8/R3K3 w - - 0 1', goal: { anyOf: ['a1a2', 'a1a3', 'a1a4', 'a1a5', 'a1a6', 'a1a8', 'a1b1', 'a1c1', 'a1d1'] }, text: 'Salva tu torre: llévala a una casilla donde el alfil no la alcance.', hint: 'El alfil controla toda la diagonal a1–h8 y también a7. Evita esas casillas.', wrong: 'Esa casilla también la ataca el alfil. Sigue su diagonal con el dedo.' },
        { t: 'quiz', text: 'Te atacan una pieza. ¿Qué puedes hacer?', options: ['Moverla, defenderla o capturar a la pieza que ataca', 'Nada: hay que seguir con el plan', 'Atacar otra pieza cualquiera'], answer: 0, explain: 'Esas son las tres defensas. Ignorar el ataque solo conviene si con eso ganas algo todavía más grande.' }
      ] },
      { id: 'gratis', title: '¿Es gratis?', glyph: 'Q', topic: 'seguridad', summary: ['Una pieza defendida no es gratis: te la cambian.', 'Cuenta atacantes y defensores antes de capturar.'], steps: [
        { t: 'info', fen: '4k3/8/4p3/3p4/n7/8/8/3QK3 w - - 0 1', marks: ['d5', 'a4'], text: 'Tu dama puede capturar dos cosas. El peón de d5 está defendido por el peón de e6: si lo capturas, te quitan la dama. El caballo de a4 no lo defiende nadie.' },
        { t: 'move', fen: '4k3/8/4p3/3p4/n7/8/8/3QK3 w - - 0 1', goal: { anyOf: ['d1a4'] }, text: 'Captura la pieza que de verdad está gratis.', hint: '¿Cuál de las dos piezas negras no tiene quién la defienda?', wrong: 'Ese peón está defendido: perderías la dama (9) por un peón (1).', ok: 'Exacto: caballo gratis y además das jaque.' },
        { t: 'quiz', fen: '4k3/8/2p5/3p4/8/8/8/3RK3 w - - 0 1', text: 'Tu torre captura en d5. ¿Qué pasa después?', options: ['Ganas un peón limpio', 'El peón de c6 captura tu torre: pierdes 5 por 1', 'El rey negro no puede hacer nada'], answer: 1, explain: 'El peón de c6 defiende d5. Torre por peón es un mal negocio.' },
        { t: 'quiz', text: 'Una pieza tuya está atacada por un caballo y defendida por un peón. ¿Está a salvo?', options: ['Sí, siempre', 'Depende: si vale más que el caballo, igual pierdes material', 'No, nunca'], answer: 1, explain: 'Si es tu dama, el rival da el caballo (3) por tu dama (9) y gana igual. Estar defendida solo basta cuando la pieza vale lo mismo o menos que el atacante.' }
      ] },
      { id: 'amenazas', title: '¿Qué amenaza el rival?', glyph: 'K', topic: 'seguridad', summary: ['Después de cada jugada del rival pregúntate: ¿qué quiere hacer?', 'Busca jaques, capturas y amenazas de mate.'], steps: [
        { t: 'info', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', text: 'El mejor hábito del ajedrez: cuando el rival mueve, antes de pensar en tu plan pregúntate qué quiere hacer él. ¿Ataca algo? ¿Amenaza un jaque o un mate?' },
        { t: 'quiz', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', text: 'Juegan negras. ¿Qué amenazan las blancas?', options: ['Dxf7, jaque mate', 'Nada importante', 'Capturar la torre de h8'], answer: 0, explain: 'La dama y el alfil apuntan juntos a f7, que solo defiende el rey.' },
        { t: 'quiz', fen: '4k3/8/8/8/3b4/8/8/R3K3 w - - 0 1', text: '¿Qué pieza blanca está en peligro?', options: ['El rey', 'La torre de a1', 'Ninguna'], answer: 1, explain: 'El alfil de d4 ataca a1 por la diagonal.' },
        { t: 'quiz', text: '¿Cuál es el orden recomendado para revisar una posición?', options: ['Jaques, capturas y amenazas', 'Primero mover peones', 'Mirar solo tus piezas'], answer: 0, explain: 'Jaques, capturas y amenazas, tuyas y del rival. Así no se te escapan las tácticas.' }
      ] }
    ]
  },
  {
    id: 'mates2', level: 'Principiante', title: 'Practica el mate', desc: 'Encuentra mates en una jugada y aprende los mates básicos',
    lessons: [
      { id: 'mate1a', title: 'Mate en 1 · I', glyph: 'Q', topic: 'mate', summary: ['Revisa todos los jaques: uno de ellos es mate.'], steps: [
        { t: 'info', fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', text: 'Para encontrar un mate en 1, revisa cada jaque posible y pregúntate: ¿puede el rey escapar, taparse o capturar al atacante? Si la respuesta es no tres veces, es mate.' },
        { t: 'puzzle', id: 'mate1-1' }, { t: 'puzzle', id: 'mate1-2' }, { t: 'puzzle', id: 'mate1-3' }, { t: 'puzzle', id: 'mate1-4' }
      ] },
      { id: 'mate1b', title: 'Mate en 1 · II', glyph: 'R', topic: 'mate', summary: ['Los peones del propio rey muchas veces le quitan las casillas de escape.'], steps: [
        { t: 'puzzle', id: 'mate1-5' }, { t: 'puzzle', id: 'mate1-6' }, { t: 'puzzle', id: 'mate1-7' }, { t: 'puzzle', id: 'mate1-8' }
      ] },
      { id: 'mate1c', title: 'Mate en 1 · III', glyph: 'B', topic: 'mate', summary: ['Mira jaques de todas tus piezas, también los de caballo y alfil.'], steps: [
        { t: 'puzzle', id: 'mate1-9' }, { t: 'puzzle', id: 'mate1-10' }, { t: 'puzzle', id: 'mate1-11' }, { t: 'puzzle', id: 'mate1-12' }
      ] },
      { id: 'beso', title: 'El mate del beso', glyph: 'Q', topic: 'mate', summary: ['La dama pegada al rey rival, protegida por tu rey, es mate.'], steps: [
        { t: 'info', fen: '6k1/6Q1/6K1/8/8/8/8/8 b - - 0 1', marks: ['g7'], text: 'El "mate del beso": la dama se pone pegada al rey rival y tu rey la protege. El rey negro no puede capturarla ni escapar.' },
        { t: 'move', fen: '6k1/8/6KQ/8/8/8/8/8 w - - 0 1', goal: { mate: true }, text: 'Da el mate del beso.', hint: 'Pon la dama al lado del rey negro, en una casilla que tu rey defienda.' },
        { t: 'move', fen: '7k/8/6K1/8/8/8/8/5Q2 w - - 0 1', goal: { mate: true }, text: 'Otra forma: el rey quita las casillas de abajo y la dama da jaque por la última fila.', hint: 'La dama puede dar jaque desde lejos, en la fila 8.' }
      ] },
      { id: 'matetorre', title: 'Mate con torre y rey', glyph: 'R', topic: 'finales', summary: ['La torre corta al rey en una caja.', 'Acerca tu rey y empuja al rival hasta el borde.', 'Da mate cuando los reyes estén enfrentados.'], steps: [
        { t: 'info', fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1', text: 'Técnica: la torre corta al rey rival en una "caja". Tu rey se acerca, y cuando los dos reyes quedan enfrentados, la torre da jaque y achica la caja. Al llegar al borde, ese jaque es mate.' },
        { t: 'quiz', fen: '4k3/8/4K3/8/8/8/8/7R w - - 0 1', text: 'Los reyes están enfrentados. ¿Qué jugada da mate?', options: ['Th8', 'Th7', 'Re5'], answer: 0, explain: 'Th8 da jaque por la última fila y el rey blanco cubre d7, e7 y f7.' },
        { t: 'move', fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1', goal: { play: 'mate', maxMoves: 30 }, text: 'Da mate con torre y rey. Tienes 30 jugadas.', hint: 'No des jaques sueltos: primero acerca tu rey, la torre solo corta.' }
      ] }
    ]
  },

  /* ---------------- Intermedio ---------------- */
  {
    id: 'tacticas2', level: 'Intermedio', title: 'Más tácticas', desc: 'Jaque doble, sobrecarga y práctica con partidas reales',
    lessons: [
      { id: 'jaquedoble', title: 'Jaque doble', glyph: 'B', topic: 'jaques', summary: ['Dos piezas dan jaque a la vez: el rey tiene que moverse.', 'No se puede tapar ni capturar dos jaques a la vez.'], steps: [
        { t: 'info', fen: '4k3/8/8/8/8/8/4B3/K3R3 w - - 0 1', text: 'Un jaque doble es un jaque descubierto en el que la pieza que se mueve TAMBIÉN da jaque. Como hay dos atacantes, no se puede tapar ni capturar: el rey está obligado a moverse.' },
        { t: 'move', fen: '4k3/8/8/8/8/8/4B3/K3R3 w - - 0 1', goal: { anyOf: ['e2b5', 'e2h5'] }, text: 'Mueve el alfil para dar jaque doble.', hint: 'El alfil tiene que destapar la torre y además dar jaque él mismo.', ok: '¡Jaque doble! Torre y alfil dan jaque al mismo tiempo.' },
        { t: 'quiz', text: 'Contra un jaque doble, ¿qué puede hacer el rival?', options: ['Tapar uno de los jaques', 'Capturar una de las piezas', 'Solo mover el rey'], answer: 2, explain: 'Tapar o capturar resuelve un jaque, pero queda el otro.' }
      ] },
      { id: 'sobrecarga', title: 'Sobrecarga', glyph: 'R', topic: 'tacticas', summary: ['Una pieza que defiende dos cosas no puede cumplir con las dos.', 'Atácala o captura una de las que defiende.'], steps: [
        { t: 'info', fen: '6k1/8/8/8/8/8/8/6K1 w - - 0 1', text: 'Una pieza está sobrecargada cuando tiene dos tareas a la vez: por ejemplo, defender a su dama y además impedir una coronación. Si la obligas a cumplir una, abandona la otra. Es lo que pasa en el problema del peón que corona en g2: el alfil de f1 no puede comerse el peón sin abandonar a su dama.' },
        { t: 'quiz', text: 'Un alfil defiende a la vez una torre y una casilla de coronación. ¿Cómo se llama esa debilidad?', options: ['Clavada', 'Sobrecarga', 'Enfilada'], answer: 1, explain: 'Tiene más trabajo del que puede hacer: está sobrecargado.' },
        { t: 'puzzle', id: 'material-1', text: 'Busca la pieza que hace demasiadas cosas a la vez.' },
        { t: 'puzzle', id: 'material-2' }
      ] },
      { id: 'colgada2', title: 'Colgadas · práctica', glyph: 'N', topic: 'colgada', summary: ['Antes de cada jugada, busca piezas rivales sin defensa.'], steps: [
        { t: 'puzzle', id: 'colgada-2' }, { t: 'puzzle', id: 'colgada-3' }, { t: 'puzzle', id: 'colgada-4' }, { t: 'puzzle', id: 'colgada-5' }
      ] },
      { id: 'doble2', title: 'Ataque doble · práctica', glyph: 'N', topic: 'doble', summary: ['Busca casillas desde donde una pieza ataque dos cosas.'], steps: [
        { t: 'puzzle', id: 'doble-2' }, { t: 'puzzle', id: 'doble-3' }, { t: 'puzzle', id: 'doble-4' }, { t: 'puzzle', id: 'doble-5' }
      ] },
      { id: 'material', title: 'Ganar material', glyph: 'Q', topic: 'material', summary: ['Jaques, capturas y amenazas: una de ellas gana algo.'], steps: [
        { t: 'puzzle', id: 'material-3' }, { t: 'puzzle', id: 'material-4' }, { t: 'puzzle', id: 'material-5' }, { t: 'puzzle', id: 'material-6' }
      ] }
    ]
  },
  {
    id: 'aperturas2', level: 'Intermedio', title: 'Más aperturas', desc: 'Española, Gambito de dama, Siciliana, Londres y una trampa famosa',
    lessons: [
      { id: 'espanola', title: 'La Española', glyph: 'B', topic: 'aperturas', summary: ['1.e4 e5 2.Cf3 Cc6 3.Ab5.', 'El alfil presiona al caballo que defiende e5.'], steps: [
        { t: 'info', fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', marks: ['c6', 'e5'], text: 'La Española (o Ruy López) es la apertura favorita de muchos campeones del mundo. El alfil de b5 ataca al caballo que defiende el peón de e5: una presión lenta pero constante.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { line: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5'] }, text: 'Juega la Española.', hint: 'Igual que la Italiana, pero el alfil va a b5.', notes: ['Peón al centro.', 'El caballo ataca e5.', 'El alfil presiona al caballo de c6. ¡La Española!'] },
        { t: 'quiz', text: 'En la Española, ¿por qué el alfil va a b5?', options: ['Para atacar al caballo que defiende e5', 'Para dar mate rápido', 'Para proteger al rey'], answer: 0 }
      ] },
      { id: 'gambito', title: 'Gambito de dama', glyph: 'P', topic: 'aperturas', summary: ['1.d4 d5 2.c4.', 'Se ofrece un peón para dominar el centro.'], steps: [
        { t: 'info', fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', marks: ['c4', 'd5'], text: 'En el Gambito de dama las blancas ofrecen el peón de c4 para quitar al peón negro del centro. Si las negras lo capturan, las blancas suelen recuperarlo con e3 y Axc4.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { line: ['d2d4', 'd7d5', 'c2c4'] }, text: 'Juega el Gambito de dama.', hint: 'Empieza con el peón de la dama.', notes: ['Peón de dama al centro.', 'Ofreces el peón de c4: ¡Gambito de dama!'] },
        { t: 'quiz', text: '¿Qué significa "gambito"?', options: ['Ofrecer material a cambio de ventajas', 'Un tipo de mate', 'Enrocar largo'], answer: 0 }
      ] },
      { id: 'siciliana', title: 'La Siciliana', glyph: 'P', topic: 'aperturas', summary: ['Con negras: 1.e4 c5.', 'Luchas por d4 desde el costado.'], steps: [
        { t: 'info', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', marks: ['c5', 'd4'], text: 'La Siciliana es la respuesta más popular a 1.e4. En vez de copiar con e5, el peón de c5 controla d4 desde el costado y crea posiciones desequilibradas, buenas para jugar a ganar con negras.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', goal: { anyOf: ['c7c5'] }, text: 'Juegas con negras. Responde a 1.e4 con la Siciliana.', hint: 'Usa el peón de c.' },
        { t: 'quiz', text: '¿Qué casilla central controla el peón de c5?', options: ['d4', 'e5', 'c4'], answer: 0 }
      ] },
      { id: 'londres', title: 'Sistema Londres', glyph: 'B', topic: 'aperturas', summary: ['d4, Af4, e3, Cf3 y c3.', 'Un esquema fácil que sirve contra casi todo.'], steps: [
        { t: 'info', fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R b KQkq - 0 4', text: 'El Sistema Londres es un esquema: peón a d4, alfil a f4 (antes de jugar e3, para que no quede encerrado), después e3, Cf3, c3 y Ad3. Sirve contra casi cualquier defensa.' },
        { t: 'move', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', goal: { line: ['d2d4', 'd7d5', 'c1f4'] }, text: 'Empieza el Sistema Londres.', hint: 'Peón de dama, y después el alfil de casillas oscuras sale antes de mover e3.', notes: ['Peón al centro.', 'El alfil sale a f4 antes de cerrarle el camino con e3.'] },
        { t: 'quiz', text: '¿Por qué el alfil sale a f4 antes de jugar e3?', options: ['Porque e3 le cerraría el camino', 'Porque así se enroca más rápido', 'No importa el orden'], answer: 0 }
      ] },
      { id: 'legal', title: 'El mate de Legal', glyph: 'N', topic: 'aperturas', summary: ['Una clavada no siempre es real.', 'Capturar la dama puede costar la partida.'], steps: [
        { t: 'info', fen: 'rn1qkbnr/ppp2p1p/3p2p1/4p3/2B1P1b1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5', marks: ['f3', 'd1'], text: 'Las negras clavaron el caballo de f3 contra la dama. Pero es una clavada "falsa": si el caballo se mueve y las negras se comen la dama, las blancas dan mate con las piezas menores.' },
        { t: 'move', fen: 'rn1qkbnr/ppp2p1p/3p2p1/4p3/2B1P1b1/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5', goal: { line: ['f3e5', 'g4d1', 'c4f7', 'e8e7', 'c3d5'] }, text: 'Sacrifica la dama y da el mate de Legal.', hint: 'Captura el peón de e5 con el caballo, aunque quede la dama colgada.', notes: ['¡Ofreces la dama! Las negras la capturan…', 'Jaque con el alfil: el rey solo puede ir a e7.', '¡Jaque mate con el caballo! El mate de Legal.'] }
      ] }
    ]
  },
  {
    id: 'finales2', level: 'Intermedio', title: 'Finales de peones', desc: 'Oposición, regla del cuadrado y coronar',
    lessons: [
      { id: 'oposicion', title: 'La oposición', glyph: 'K', topic: 'finales', summary: ['Reyes enfrentados con una casilla entre medio: el que NO mueve tiene la oposición.', 'Con el rey delante de su peón en la 6ª fila, se gana siempre (salvo peón de torre).'], steps: [
        { t: 'info', fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1', text: 'Dos reyes están "en oposición" cuando están enfrentados con una casilla entre ellos. El que tiene que mover debe ceder el paso. En los finales de peones, ganar la oposición decide si el peón corona o no.' },
        { t: 'quiz', fen: '4k3/8/4K3/4P3/8/8/8/8 b - - 0 1', text: 'Juegan negras. ¿Quién tiene la oposición?', options: ['Las blancas', 'Las negras'], answer: 0, explain: 'Las negras tienen que mover y ceder el paso al rey blanco.' },
        { t: 'move', fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1', goal: { play: 'promote', maxMoves: 8 }, text: 'Corona el peón. Tu rey va delante abriendo camino.', hint: 'Mueve el rey hacia el costado para ganar la oposición, y después avanza el peón.' }
      ] },
      { id: 'cuadrado', title: 'La regla del cuadrado', glyph: 'P', topic: 'finales', summary: ['Dibuja un cuadrado desde el peón hasta la fila de coronación.', 'Si el rey rival entra al cuadrado, alcanza al peón.'], steps: [
        { t: 'info', fen: '8/8/8/8/1P6/8/k7/7K w - - 0 1', marks: ['b4', 'f4', 'b8', 'f8'], text: 'Para saber si un rey alcanza a un peón sin calcular, dibuja un cuadrado desde el peón hasta su casilla de coronación. Si el rey rival puede entrar al cuadrado en su turno, lo alcanza. Si no, el peón corona.' },
        { t: 'quiz', fen: '8/8/8/8/1P6/8/k7/7K w - - 0 1', text: 'Juegan blancas. ¿Alcanza el rey negro al peón?', options: ['Sí', 'No'], answer: 1, explain: 'Tras b5 el cuadrado es b5-e5-e8-b8, y el rey de a2 no puede entrar.' },
        { t: 'move', fen: '8/8/8/8/1P6/8/k7/7K w - - 0 1', goal: { play: 'promote', maxMoves: 6 }, text: 'Corona el peón.', hint: 'Avanza el peón todas las jugadas.' }
      ] }
    ]
  },

  /* ---------------- Avanzado ---------------- */
  {
    id: 'estrategia', level: 'Avanzado', title: 'Estrategia', desc: 'Planes cuando no hay tácticas',
    lessons: [
      { id: 'columnas', title: 'Columnas abiertas', glyph: 'R', topic: 'estrategia', summary: ['Las torres rinden en columnas sin peones.', 'Dobla las torres en la columna abierta.'], steps: [
        { t: 'info', fen: '2r3k1/pp3ppp/8/8/8/8/PP3PPP/3R2K1 w - - 0 1', marks: ['c1', 'c8', 'd1', 'd8'], text: 'Una columna abierta es una columna sin peones. Las torres son muy fuertes ahí porque pueden entrar a la 7ª fila rival. Aquí las columnas c, d y e están abiertas.' },
        { t: 'quiz', text: '¿Dónde rinde más una torre?', options: ['En una columna abierta', 'Detrás de sus propios peones', 'En una esquina'], answer: 0 },
        { t: 'quiz', fen: '2r3k1/pp3ppp/8/8/8/8/PP3PPP/3R2K1 w - - 0 1', text: '¿Qué es "llegar a la 7ª"?', options: ['Poner una torre en la segunda fila del rival, donde ataca sus peones', 'Coronar un peón', 'Enrocar largo'], answer: 0, explain: 'Una torre en la 7ª ataca los peones que todavía no se movieron y encierra al rey.' }
      ] },
      { id: 'peonesdebiles', title: 'Peones débiles', glyph: 'P', topic: 'estrategia', summary: ['Peón aislado: no tiene peones vecinos que lo defiendan.', 'Peones doblados: dos en la misma columna.', 'Ataca las debilidades con tus piezas.'], steps: [
        { t: 'info', fen: '6k1/pp3ppp/8/3p4/8/8/PP3PPP/6K1 w - - 0 1', marks: ['d5'], text: 'El peón negro de d5 está aislado: no hay peones negros en las columnas c ni e para defenderlo. Solo lo pueden defender las piezas, y eso las vuelve pasivas.' },
        { t: 'info', fen: '6k1/pp3p1p/5p2/8/8/8/PP3PPP/6K1 w - - 0 1', marks: ['f7', 'f6'], text: 'Aquí las negras tienen peones doblados en la columna f. Los peones doblados no se defienden entre sí y son lentos.' },
        { t: 'quiz', text: '¿Qué es un peón aislado?', options: ['Un peón sin peones propios en las columnas vecinas', 'Un peón que ya no puede avanzar', 'El último peón de la partida'], answer: 0 },
        { t: 'quiz', text: 'Contra un peón aislado, ¿qué casilla conviene ocupar?', options: ['La casilla justo delante de él', 'Una esquina', 'La de al lado'], answer: 0, explain: 'Delante del peón aislado ninguna pieza rival puede echarte con un peón: es un puesto perfecto para tu caballo.' }
      ] },
      { id: 'alfiles', title: 'Alfil bueno y alfil malo', glyph: 'B', topic: 'estrategia', summary: ['Un alfil es malo si sus propios peones están en casillas de su color.', 'Pon tus peones en casillas del color contrario a tu alfil.'], steps: [
        { t: 'info', fen: '6k1/8/4p3/3pPp2/3P1P2/8/2B5/6K1 w - - 0 1', marks: ['d5', 'e6', 'f5'], text: 'Los peones negros están en casillas claras. Un alfil negro de casillas claras quedaría "malo": encerrado detrás de sus propios peones. El alfil blanco de c2, en cambio, ataca esos peones desde fuera.' },
        { t: 'quiz', text: 'Tu alfil es de casillas oscuras. ¿Dónde conviene poner tus peones?', options: ['En casillas claras', 'En casillas oscuras', 'Da lo mismo'], answer: 0, explain: 'Así no le estorban al alfil y entre los dos controlan casillas de ambos colores.' },
        { t: 'quiz', text: '¿Qué pieza suele ser mejor en posiciones abiertas, con pocos peones?', options: ['El alfil', 'El caballo'], answer: 0, explain: 'El alfil controla diagonales largas. En posiciones cerradas suele brillar el caballo.' }
      ] },
      { id: 'puesto', title: 'Puestos para el caballo', glyph: 'N', topic: 'estrategia', summary: ['Un puesto avanzado es una casilla que ningún peón rival puede atacar.', 'Un caballo en un puesto en el centro vale tanto como una torre.'], steps: [
        { t: 'info', fen: '6k1/pp3ppp/3p4/3N4/4P3/8/PP3PPP/6K1 w - - 0 1', marks: ['d5'], text: 'El caballo de d5 está en un puesto avanzado: está defendido por el peón de e4 y ningún peón negro puede atacarlo (no hay peones negros en c ni e que avancen). Desde ahí controla todo.' },
        { t: 'quiz', text: '¿Qué hace que una casilla sea un buen puesto para un caballo?', options: ['Que ningún peón rival pueda atacarla', 'Que esté en una esquina', 'Que esté lejos del centro'], answer: 0 },
        { t: 'quiz', text: '¿Dónde suele ser más fuerte un caballo?', options: ['En el centro, en la mitad del rival', 'En el borde del tablero', 'En su casilla inicial'], answer: 0, explain: '"Caballo en el borde, caballo que se pierde": en el centro llega a 8 casillas.' }
      ] },
      { id: 'reyactivo', title: 'El rey en el final', glyph: 'K', topic: 'estrategia', summary: ['En el final el rey es una pieza de ataque.', 'Llévalo al centro apenas salgan las damas.'], steps: [
        { t: 'info', fen: '8/5pk1/6p1/8/8/6P1/5PK1/8 w - - 0 1', text: 'En la apertura el rey se esconde. Pero cuando salen las damas y casi todas las piezas, el rey se vuelve una pieza fuerte: hay que llevarlo al centro para apoyar a los peones y atacar los del rival.' },
        { t: 'quiz', text: 'Se cambiaron las damas y quedan pocas piezas. ¿Qué haces con el rey?', options: ['Lo llevo al centro', 'Lo dejo en la esquina', 'Lo muevo solo si me dan jaque'], answer: 0 },
        { t: 'move', fen: '8/5pk1/6p1/8/8/6P1/5PK1/8 w - - 0 1', goal: { anyOf: ['g2f3'] }, text: 'Empieza a activar tu rey: dale un paso hacia el centro.', hint: 'De las casillas a las que puede ir el rey, ¿cuál está más cerca del centro?', ok: 'Bien: tu rey se acerca al centro y a los peones rivales.' }
      ] }
    ]
  },
  {
    id: 'calculo2', level: 'Avanzado', title: 'Cálculo · práctica', desc: 'Más mates y combinaciones de partidas reales',
    lessons: [
      { id: 'mate2b', title: 'Mate en 2 · II', glyph: 'Q', topic: 'calculo', summary: ['Si la primera jugada no es jaque, debe dejar al rival sin defensa.'], steps: [
        { t: 'puzzle', id: 'mate2-4' }, { t: 'puzzle', id: 'mate2-5' }, { t: 'puzzle', id: 'mate2-6' }, { t: 'puzzle', id: 'mate2-7' }
      ] },
      { id: 'mate2c', title: 'Mate en 2 · III', glyph: 'R', topic: 'calculo', summary: ['Calcula todas las respuestas del rival, no solo la que te conviene.'], steps: [
        { t: 'puzzle', id: 'mate2-8' }, { t: 'puzzle', id: 'mate2-9' }, { t: 'puzzle', id: 'mate2-10' }, { t: 'puzzle', id: 'mate2-11' }
      ] },
      { id: 'mate3b', title: 'Mate en 3 · II', glyph: 'K', topic: 'calculo', summary: ['Las jugadas forzadas (jaques) hacen el cálculo más corto.'], steps: [
        { t: 'puzzle', id: 'mate3-3' }, { t: 'puzzle', id: 'mate3-4' }, { t: 'puzzle', id: 'mate3-5' }
      ] },
      { id: 'combis', title: 'Combinaciones', glyph: 'N', topic: 'calculo', summary: ['Una combinación es una serie de jugadas forzadas que gana algo.'], steps: [
        { t: 'puzzle', id: 'material-7' }, { t: 'puzzle', id: 'material-8' }, { t: 'puzzle', id: 'material-9' }, { t: 'puzzle', id: 'material-10' }
      ] }
    ]
  }
];
