/* GENERADO por tools/gen-tactic-lessons.ts a partir de los problemas de Lichess. No editar a mano. */
import type { Unit } from './data.ts';

export const TACTIC_UNITS: Unit[] = [
 {
  "id": "t-dobles",
  "level": "Tácticas",
  "title": "Ataques dobles",
  "desc": "Una jugada, dos amenazas",
  "lessons": [
   {
    "id": "tac-doble-1",
    "title": "Ataque doble · fácil",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "B2qkb1r/p3nppp/8/2p5/4Q3/6Pb/PP3P1P/RNB3K1 b k - 2 14",
      "text": "Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dd1+."
     },
     {
      "t": "puzzle",
      "id": "l05zfC",
      "text": "Ataque doble · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lcIxpV",
      "text": "Ataque doble · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0TlIw",
      "text": "Ataque doble · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09ocU",
      "text": "Ataque doble · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lAIsux",
      "text": "Ataque doble · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-doble-2",
    "title": "Ataque doble · media",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r2q1rk1/p1pb1p1p/6p1/8/2PQ4/2B1n3/P2NPPPP/R3KB1R b KQ - 3 14",
      "text": "Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas.\n\nEjemplo de una partida real: juegan negras y la jugada fue Cc2+."
     },
     {
      "t": "puzzle",
      "id": "lj1frG",
      "text": "Ataque doble · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Z5jz",
      "text": "Ataque doble · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lNtil6",
      "text": "Ataque doble · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l01KFo",
      "text": "Ataque doble · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0I5MK",
      "text": "Ataque doble · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-doble-3",
    "title": "Ataque doble · difícil",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rn1qk2r/ppp1bppp/5n2/4p3/2B1P3/2N2Q2/PPPP2PP/R1B2RK1 b kq - 5 8",
      "text": "Busca piezas rivales sin defensa o el rey: si una sola pieza tuya puede atacar dos de ellas a la vez, el rival no alcanza a salvar ambas. El caballo es el rey de las horquillas.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dd4+."
     },
     {
      "t": "puzzle",
      "id": "l3BMai",
      "text": "Ataque doble · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lS9gVs",
      "text": "Ataque doble · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lDkK4t",
      "text": "Ataque doble · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l8TjiP",
      "text": "Ataque doble · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0axmS",
      "text": "Ataque doble · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-descubierta-1",
    "title": "Ataque a la descubierta · fácil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla \"descubre\" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r3r1k1/pbp2ppp/1p6/3p4/3P1q2/2P1RP2/PP1Q2PP/5RK1 w - - 0 21",
      "text": "Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla \"descubre\" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txe8+."
     },
     {
      "t": "puzzle",
      "id": "lAOlnK",
      "text": "Ataque a la descubierta · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lq3fuh",
      "text": "Ataque a la descubierta · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l9YeTw",
      "text": "Ataque a la descubierta · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1PoNJ",
      "text": "Ataque a la descubierta · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1YBJm",
      "text": "Ataque a la descubierta · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-descubierta-2",
    "title": "Ataque a la descubierta · media",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla \"descubre\" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rn3rk1/pb2nppp/1p2p3/4P3/3q4/2NB4/PP3PPP/R2Q1RK1 w - - 0 13",
      "text": "Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla \"descubre\" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Axh7+."
     },
     {
      "t": "puzzle",
      "id": "lKOORj",
      "text": "Ataque a la descubierta · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l054x7",
      "text": "Ataque a la descubierta · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0yDDX",
      "text": "Ataque a la descubierta · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lIhQ2K",
      "text": "Ataque a la descubierta · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1OdL2",
      "text": "Ataque a la descubierta · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-descubierta-3",
    "title": "Ataque a la descubierta · difícil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla \"descubre\" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1b2rk1/5pp1/pqp1p2p/3p4/3b4/PP1B4/1BP3PP/R2Q1R1K w - - 0 18",
      "text": "Cuando una pieza tuya tapa la línea de un alfil, torre o dama, moverla \"descubre\" ese ataque. Si la pieza que se mueve también amenaza algo, son dos ataques en una jugada.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Axd4."
     },
     {
      "t": "puzzle",
      "id": "l0KxBm",
      "text": "Ataque a la descubierta · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lGNFgk",
      "text": "Ataque a la descubierta · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Wv7K",
      "text": "Ataque a la descubierta · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l5gCIr",
      "text": "Ataque a la descubierta · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2bok3",
      "text": "Ataque a la descubierta · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-jaquedoble-1",
    "title": "Jaque doble · fácil",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1q1k2r/pp2bpp1/2R3p1/1B1n4/3P4/4P3/PP3PPP/4K2R w Kkq - 0 16",
      "text": "Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txc8#."
     },
     {
      "t": "puzzle",
      "id": "l3WIFz",
      "text": "Jaque doble · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l4ZgZR",
      "text": "Jaque doble · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2SpNr",
      "text": "Jaque doble · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1Hs2J",
      "text": "Jaque doble · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l17X7G",
      "text": "Jaque doble · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-jaquedoble-2",
    "title": "Jaque doble · media",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1b1k2r/pppp1ppp/5q2/2bPp3/2PnP3/2N2N1P/PP4P1/R1BQ1BKR b kq - 0 9",
      "text": "Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse.\n\nEjemplo de una partida real: juegan negras y la jugada fue Cxf3#."
     },
     {
      "t": "puzzle",
      "id": "l01Z8E",
      "text": "Jaque doble · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0H2EI",
      "text": "Jaque doble · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0DxdK",
      "text": "Jaque doble · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0MXpJ",
      "text": "Jaque doble · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3lS1E",
      "text": "Jaque doble · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-jaquedoble-3",
    "title": "Jaque doble · difícil",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/1p4k1/3p4/1NpP1Q2/PnP1pb2/6rP/1P5K/4RBr1 b - - 0 35",
      "text": "Un jaque doble es una descubierta donde las dos piezas dan jaque. El rey no puede tapar ni capturar ambas: tiene que moverse.\n\nEjemplo de una partida real: juegan negras y la jugada fue T3g2#."
     },
     {
      "t": "puzzle",
      "id": "lC51rX",
      "text": "Jaque doble · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0SJS4",
      "text": "Jaque doble · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1r534",
      "text": "Jaque doble · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0N5vw",
      "text": "Jaque doble · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0ELid",
      "text": "Jaque doble · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 },
 {
  "id": "t-lineas",
  "level": "Tácticas",
  "title": "Clavadas y ensartadas",
  "desc": "Piezas en la misma línea",
  "lessons": [
   {
    "id": "tac-clavada-1",
    "title": "Clavada · fácil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "5R1k/6qp/p6r/4p3/2B1PpbQ/P1P2N2/1P4P1/3R3K b - - 0 35",
      "text": "Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dxf8."
     },
     {
      "t": "puzzle",
      "id": "lGbHyR",
      "text": "Clavada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1YoIv",
      "text": "Clavada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0F53J",
      "text": "Clavada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lj4O3a",
      "text": "Clavada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Rjtl",
      "text": "Clavada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-clavada-2",
    "title": "Clavada · media",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnb1k1nr/ppp2ppp/2qb4/4p3/8/2N1P2P/PP1P1PP1/R1BQKBNR w KQkq - 3 6",
      "text": "Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Ab5."
     },
     {
      "t": "puzzle",
      "id": "l00tB9",
      "text": "Clavada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Hxpz",
      "text": "Clavada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0tIFs",
      "text": "Clavada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l07HDk",
      "text": "Clavada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0j32K",
      "text": "Clavada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-clavada-3",
    "title": "Clavada · difícil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3r2k1/pp5p/6p1/3q4/2Q1p3/1P5P/PR3P1K/8 w - - 0 38",
      "text": "Si una pieza rival está entre tu alfil, torre o dama y algo más valioso (su dama o su rey), no se puede mover. Ataca la pieza clavada con algo barato: no puede escapar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Td2."
     },
     {
      "t": "puzzle",
      "id": "l9AGQ4",
      "text": "Clavada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1aQm0",
      "text": "Clavada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lDSfdT",
      "text": "Clavada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0hfF8",
      "text": "Clavada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08lNe",
      "text": "Clavada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-ensartada-1",
    "title": "Ensartada · fácil",
    "glyph": "R",
    "topic": "tacticas",
    "summary": [
     "Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/2k2r2/R7/1p2p3/p2pP3/P2P4/1P2K3/8 w - - 6 61",
      "text": "Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Ta7+."
     },
     {
      "t": "puzzle",
      "id": "l1SR45",
      "text": "Ensartada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08yjS",
      "text": "Ensartada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1dxYv",
      "text": "Ensartada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0QZgl",
      "text": "Ensartada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02Z4F",
      "text": "Ensartada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-ensartada-2",
    "title": "Ensartada · media",
    "glyph": "R",
    "topic": "tacticas",
    "summary": [
     "Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "4r3/pp5p/4k3/2p1r3/3p4/PP1P4/3KR2P/5R2 w - - 2 32",
      "text": "Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txe5+."
     },
     {
      "t": "puzzle",
      "id": "l00TiV",
      "text": "Ensartada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l00ICz",
      "text": "Ensartada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0DMLv",
      "text": "Ensartada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02tfs",
      "text": "Ensartada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Uv8Q",
      "text": "Ensartada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-ensartada-3",
    "title": "Ensartada · difícil",
    "glyph": "R",
    "topic": "tacticas",
    "summary": [
     "Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2R5/8/1p1k4/6p1/3q4/5bP1/2B4P/1R1q1K2 w - - 0 44",
      "text": "Ataca primero a la pieza más valiosa que está adelante en la línea. Cuando se aparte, capturas la que estaba detrás.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txd1."
     },
     {
      "t": "puzzle",
      "id": "l8MpA7",
      "text": "Ensartada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08a5H",
      "text": "Ensartada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l9cKf0",
      "text": "Ensartada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0LihW",
      "text": "Ensartada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l15DNC",
      "text": "Ensartada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-rayosx-1",
    "title": "Rayos X · fácil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla \"a través\" de ella."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "Q2q2k1/p4ppp/4p3/8/8/1P6/P2r1PPP/3R2K1 w - - 1 26",
      "text": "Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla \"a través\" de ella.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dxd8+."
     },
     {
      "t": "puzzle",
      "id": "l7INEi",
      "text": "Rayos X · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l4SuYs",
      "text": "Rayos X · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0cMlC",
      "text": "Rayos X · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l05adP",
      "text": "Rayos X · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0ocY6",
      "text": "Rayos X · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-rayosx-2",
    "title": "Rayos X · media",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla \"a través\" de ella."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3r2k1/p3rp2/7p/2P3p1/1P6/P4P1P/R3pP2/4R1K1 b - - 2 30",
      "text": "Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla \"a través\" de ella.\n\nEjemplo de una partida real: juegan negras y la jugada fue Td1."
     },
     {
      "t": "puzzle",
      "id": "l0mj7c",
      "text": "Rayos X · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0J33L",
      "text": "Rayos X · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0uS5h",
      "text": "Rayos X · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l115qA",
      "text": "Rayos X · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0XWpB",
      "text": "Rayos X · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-rayosx-3",
    "title": "Rayos X · difícil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla \"a través\" de ella."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2r3k1/1Q3ppp/2rqp3/p2p4/3P4/P3P3/NP2BPPP/2R2nK1 w - - 1 25",
      "text": "Una torre o dama sigue actuando a través de otra pieza en su misma línea: puede defender o atacar una casilla \"a través\" de ella.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dxc8+."
     },
     {
      "t": "puzzle",
      "id": "l17HCW",
      "text": "Rayos X · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0GEr9",
      "text": "Rayos X · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3H9HT",
      "text": "Rayos X · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1UZuY",
      "text": "Rayos X · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l8KC1c",
      "text": "Rayos X · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 },
 {
  "id": "t-defensores",
  "level": "Tácticas",
  "title": "Sacar al defensor",
  "desc": "Desviar, atraer y eliminar defensores",
  "lessons": [
   {
    "id": "tac-defensor-1",
    "title": "Eliminar al defensor · fácil",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2kr3r/2p3pp/p4p2/1p1np2b/8/2P1B2P/PP1N1PPN/R3R1K1 b - - 1 19",
      "text": "Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado.\n\nEjemplo de una partida real: juegan negras y la jugada fue Cxe3."
     },
     {
      "t": "puzzle",
      "id": "lDbnYx",
      "text": "Eliminar al defensor · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "liDU1a",
      "text": "Eliminar al defensor · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2jGob",
      "text": "Eliminar al defensor · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1aXHQ",
      "text": "Eliminar al defensor · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1TNvs",
      "text": "Eliminar al defensor · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-defensor-2",
    "title": "Eliminar al defensor · media",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r2qkb1r/pp2pppp/2b2n2/8/3B4/1P3N2/P1PP1PPP/RN1Q1RK1 b kq - 0 9",
      "text": "Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado.\n\nEjemplo de una partida real: juegan negras y la jugada fue Axf3."
     },
     {
      "t": "puzzle",
      "id": "l0z6iR",
      "text": "Eliminar al defensor · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08SaK",
      "text": "Eliminar al defensor · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lDIn3H",
      "text": "Eliminar al defensor · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2IpDO",
      "text": "Eliminar al defensor · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08QJS",
      "text": "Eliminar al defensor · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-defensor-3",
    "title": "Eliminar al defensor · difícil",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "6k1/4b1pp/p1b1p3/B3Np2/P2PpP2/1pr1P2P/R4KP1/8 w - - 0 32",
      "text": "Antes de capturar lo que quieres, mira quién lo defiende. Si capturas o cambias a ese defensor, lo demás queda colgado.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Axc3."
     },
     {
      "t": "puzzle",
      "id": "l0He6Y",
      "text": "Eliminar al defensor · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lKCwVS",
      "text": "Eliminar al defensor · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0RRfS",
      "text": "Eliminar al defensor · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lWN81K",
      "text": "Eliminar al defensor · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1LUUX",
      "text": "Eliminar al defensor · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-desviacion-1",
    "title": "Desviación · fácil",
    "glyph": "R",
    "topic": "tacticas",
    "summary": [
     "Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "5k2/8/1r2BKP1/8/5P2/8/8/1q6 w - - 0 62",
      "text": "Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor.\n\nEjemplo de una partida real: juegan blancas y la jugada fue g7+."
     },
     {
      "t": "puzzle",
      "id": "l14Nem",
      "text": "Desviación · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2Ef2h",
      "text": "Desviación · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2j214",
      "text": "Desviación · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04PCA",
      "text": "Desviación · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1glWd",
      "text": "Desviación · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-desviacion-2",
    "title": "Desviación · media",
    "glyph": "R",
    "topic": "tacticas",
    "summary": [
     "Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r3k1nr/ppp2ppp/5q2/2bPp3/6PP/8/PPQP4/RNB1KBNR b KQkq - 0 9",
      "text": "Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor.\n\nEjemplo de una partida real: juegan negras y la jugada fue Df2+."
     },
     {
      "t": "puzzle",
      "id": "l0gViA",
      "text": "Desviación · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lGcGOc",
      "text": "Desviación · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0AZKa",
      "text": "Desviación · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02fzY",
      "text": "Desviación · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lIj0K4",
      "text": "Desviación · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-desviacion-3",
    "title": "Desviación · difícil",
    "glyph": "R",
    "topic": "tacticas",
    "summary": [
     "Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2kr1b1r/ppp2ppp/2B5/q7/6b1/2n2N2/PP3PPP/R1BQ1RK1 w - - 0 12",
      "text": "Una pieza rival defiende algo importante. Oblígala a moverse con un jaque, una captura o una amenaza mayor.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Axb7+."
     },
     {
      "t": "puzzle",
      "id": "lRkPgT",
      "text": "Desviación · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04E6r",
      "text": "Desviación · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l00LZl",
      "text": "Desviación · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0rtaZ",
      "text": "Desviación · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Ei9E",
      "text": "Desviación · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-atraccion-1",
    "title": "Atracción · fácil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada)."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2R3rk/1p1r1p1p/p3pPp1/3p4/8/1P5P/P4PP1/2R3K1 w - - 1 34",
      "text": "Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada).\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txg8+."
     },
     {
      "t": "puzzle",
      "id": "l3hZy3",
      "text": "Atracción · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l6T91I",
      "text": "Atracción · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l11GLn",
      "text": "Atracción · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l06fev",
      "text": "Atracción · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l06scF",
      "text": "Atracción · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-atraccion-2",
    "title": "Atracción · media",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada)."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "1r2k2r/3qppbp/2bp1np1/2p3N1/5B2/2P1P3/P4PPP/1R2KB1R w Kk - 0 18",
      "text": "Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada).\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txb8+."
     },
     {
      "t": "puzzle",
      "id": "l0Okvz",
      "text": "Atracción · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lUpGeo",
      "text": "Atracción · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l8tvjY",
      "text": "Atracción · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l60OLo",
      "text": "Atracción · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04cGp",
      "text": "Atracción · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-atraccion-3",
    "title": "Atracción · difícil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada)."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3r2k1/pR3pp1/8/5p1p/5q2/5n2/PP4R1/6QK w - - 0 30",
      "text": "Sacrifica una pieza para atraer al rey o a una pieza rival a una casilla donde después le cae una táctica (horquilla, mate, clavada).\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txg7+."
     },
     {
      "t": "puzzle",
      "id": "l02a72",
      "text": "Atracción · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lJ0ZVn",
      "text": "Atracción · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l4okcg",
      "text": "Atracción · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02prq",
      "text": "Atracción · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2V9h8",
      "text": "Atracción · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-interferencia-1",
    "title": "Interferencia · fácil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/p1n3k1/1p2p3/1P1pP1p1/q1pB1pP1/2P2P2/1R4Q1/4K3 b - - 2 63",
      "text": "Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa.\n\nEjemplo de una partida real: juegan negras y la jugada fue Da1+."
     },
     {
      "t": "puzzle",
      "id": "lyb9yO",
      "text": "Interferencia · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2op1R",
      "text": "Interferencia · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l11VJQ",
      "text": "Interferencia · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3dEae",
      "text": "Interferencia · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lD9j2w",
      "text": "Interferencia · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-interferencia-2",
    "title": "Interferencia · media",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3q1rk1/p2Qbppp/4p3/4p3/8/2P1B3/P1P2PPP/2KR3R b - - 0 16",
      "text": "Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa.\n\nEjemplo de una partida real: juegan negras y la jugada fue Aa3+."
     },
     {
      "t": "puzzle",
      "id": "l11Y5c",
      "text": "Interferencia · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0IUHG",
      "text": "Interferencia · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0a62z",
      "text": "Interferencia · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0kzam",
      "text": "Interferencia · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lMJ3ue",
      "text": "Interferencia · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-interferencia-3",
    "title": "Interferencia · difícil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r3kb1r/pp4pp/5p2/q2pp3/2B2R2/3Q4/PPP3PP/3R2K1 w kq - 0 19",
      "text": "Pon una pieza en medio de dos piezas rivales que se protegen: se corta la defensa.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Ab5+."
     },
     {
      "t": "puzzle",
      "id": "l0qEc2",
      "text": "Interferencia · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0KLkD",
      "text": "Interferencia · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1oHD2",
      "text": "Interferencia · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1XHQd",
      "text": "Interferencia · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1Di98",
      "text": "Interferencia · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-despeje-1",
    "title": "Despeje · fácil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r4rk1/1pb2ppp/p2qpn2/3pn3/8/2P1PN1P/PPBBQPP1/R4RK1 b - - 5 16",
      "text": "A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla.\n\nEjemplo de una partida real: juegan negras y la jugada fue Cxf3+."
     },
     {
      "t": "puzzle",
      "id": "lGwTLc",
      "text": "Despeje · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l7IL73",
      "text": "Despeje · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1AiAY",
      "text": "Despeje · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0lIYr",
      "text": "Despeje · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0jTTO",
      "text": "Despeje · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-despeje-2",
    "title": "Despeje · media",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rn3rk1/3pppb1/b6p/2pP2Nq/4N3/8/PPQ2PP1/R3KB2 w Q - 0 19",
      "text": "A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Cf6+."
     },
     {
      "t": "puzzle",
      "id": "lD6Rk3",
      "text": "Despeje · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09UWV",
      "text": "Despeje · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0nyuK",
      "text": "Despeje · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0MP31",
      "text": "Despeje · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l01gA2",
      "text": "Despeje · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-despeje-3",
    "title": "Despeje · difícil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3q1r1k/5r1p/pp2pnp1/2P1p3/4P3/2P1Q1N1/PP3PP1/R4RK1 b - - 0 21",
      "text": "A veces una pieza tuya estorba. Muévela con ganancia de tiempo (jaque o amenaza) para abrir una línea o una casilla.\n\nEjemplo de una partida real: juegan negras y la jugada fue Cg4."
     },
     {
      "t": "puzzle",
      "id": "l09Xh7",
      "text": "Despeje · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09W90",
      "text": "Despeje · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lFOFQ0",
      "text": "Despeje · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l8Pgpu",
      "text": "Despeje · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0nOQ6",
      "text": "Despeje · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 },
 {
  "id": "t-sutiles",
  "level": "Tácticas",
  "title": "Jugadas que se escapan",
  "desc": "Lo que no es jaque ni captura",
  "lessons": [
   {
    "id": "tac-intermedia-1",
    "title": "Jugada intermedia · fácil",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r3kb1r/pp3ppp/2n1p3/8/3q4/P4B1P/1P3PP1/R1BQK2R w KQkq - 0 13",
      "text": "Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Axc6+."
     },
     {
      "t": "puzzle",
      "id": "l1xVVV",
      "text": "Jugada intermedia · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1iAlc",
      "text": "Jugada intermedia · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1H7J2",
      "text": "Jugada intermedia · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Fcy0",
      "text": "Jugada intermedia · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l06Qtv",
      "text": "Jugada intermedia · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-intermedia-2",
    "title": "Jugada intermedia · media",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3Q1r1k/2P3p1/b6p/P1p5/1p6/4r1Pq/7P/4R1K1 w - - 0 35",
      "text": "Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dxf8+."
     },
     {
      "t": "puzzle",
      "id": "l29ccW",
      "text": "Jugada intermedia · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lDMYOr",
      "text": "Jugada intermedia · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2wM4V",
      "text": "Jugada intermedia · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0HTLv",
      "text": "Jugada intermedia · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04Iqy",
      "text": "Jugada intermedia · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-intermedia-3",
    "title": "Jugada intermedia · difícil",
    "glyph": "N",
    "topic": "tacticas",
    "summary": [
     "Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2rq1rk1/pp2p2p/2n3p1/3p1p2/1P1b4/P1B2PP1/3NQ1KP/2R2R2 w - - 0 19",
      "text": "Antes de recapturar en automático, pregúntate si hay un jaque o una amenaza más fuerte que intercalar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue De6+."
     },
     {
      "t": "puzzle",
      "id": "l0VggT",
      "text": "Jugada intermedia · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0HLf3",
      "text": "Jugada intermedia · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1IjUX",
      "text": "Jugada intermedia · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lCP8rT",
      "text": "Jugada intermedia · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02hgm",
      "text": "Jugada intermedia · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-tranquila-1",
    "title": "Jugada tranquila · fácil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/8/8/3K4/p1P5/Pn6/7k/8 w - - 4 57",
      "text": "La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue c5."
     },
     {
      "t": "puzzle",
      "id": "lBXcnb",
      "text": "Jugada tranquila · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0JjQM",
      "text": "Jugada tranquila · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1aJEF",
      "text": "Jugada tranquila · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0BhUs",
      "text": "Jugada tranquila · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09Lzt",
      "text": "Jugada tranquila · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-tranquila-2",
    "title": "Jugada tranquila · media",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/1k1q4/8/p4Q1p/3Np2P/3bP3/5PP1/6K1 b - - 1 51",
      "text": "La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dxf5."
     },
     {
      "t": "puzzle",
      "id": "l0G92F",
      "text": "Jugada tranquila · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0Bz3A",
      "text": "Jugada tranquila · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l07COk",
      "text": "Jugada tranquila · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02551",
      "text": "Jugada tranquila · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lJQTVQ",
      "text": "Jugada tranquila · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-tranquila-3",
    "title": "Jugada tranquila · difícil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/8/8/pp6/4k1p1/P1P3P1/1P2K3/8 b - - 3 53",
      "text": "La jugada ganadora no siempre da jaque ni captura: a veces es una jugada silenciosa que deja una amenaza imposible de parar.\n\nEjemplo de una partida real: juegan negras y la jugada fue a4."
     },
     {
      "t": "puzzle",
      "id": "l1QPxz",
      "text": "Jugada tranquila · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0xepE",
      "text": "Jugada tranquila · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0EyEU",
      "text": "Jugada tranquila · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l4zadj",
      "text": "Jugada tranquila · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0M514",
      "text": "Jugada tranquila · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-defensa-1",
    "title": "Defensa precisa · fácil",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "5k2/4qpp1/p6p/2KQ4/1P6/5P2/6PP/8 w - - 7 45",
      "text": "Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dd6."
     },
     {
      "t": "puzzle",
      "id": "l1UkQA",
      "text": "Defensa precisa · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l37yGq",
      "text": "Defensa precisa · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0H6Dd",
      "text": "Defensa precisa · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08vmA",
      "text": "Defensa precisa · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2pVmL",
      "text": "Defensa precisa · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-defensa-2",
    "title": "Defensa precisa · media",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/7p/3rk1p1/1p3p2/1P1R1P2/4K2P/6P1/8 w - - 0 39",
      "text": "Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txd6+."
     },
     {
      "t": "puzzle",
      "id": "l02ccm",
      "text": "Defensa precisa · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04Zsc",
      "text": "Defensa precisa · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l6vpfi",
      "text": "Defensa precisa · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lIZ1nn",
      "text": "Defensa precisa · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0AzGU",
      "text": "Defensa precisa · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-defensa-3",
    "title": "Defensa precisa · difícil",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3r1rk1/pppb1pb1/6pp/2qNp3/4P3/PnPP2P1/1P4BP/R1BQ1RK1 w - - 1 19",
      "text": "Antes de atacar, mira qué amenaza el rival. Hay posiciones donde una sola jugada te salva.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Ae3."
     },
     {
      "t": "puzzle",
      "id": "l0vHHJ",
      "text": "Defensa precisa · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l03RZV",
      "text": "Defensa precisa · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lJLkxY",
      "text": "Defensa precisa · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lEiTRe",
      "text": "Defensa precisa · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lOUh4r",
      "text": "Defensa precisa · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 },
 {
  "id": "t-material",
  "level": "Tácticas",
  "title": "Ganar material",
  "desc": "Piezas colgadas, atrapadas y sacrificios",
  "lessons": [
   {
    "id": "tac-colgada-1",
    "title": "Pieza colgada · fácil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rn2k2r/pp2nppp/1bp2q2/8/4B3/1NN3P1/PPQ4P/R1B2R1K b kq - 0 14",
      "text": "Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dxf1#."
     },
     {
      "t": "puzzle",
      "id": "lS7FJJ",
      "text": "Pieza colgada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1lmGR",
      "text": "Pieza colgada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lNIe1v",
      "text": "Pieza colgada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lc5qdi",
      "text": "Pieza colgada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09bGw",
      "text": "Pieza colgada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-colgada-2",
    "title": "Pieza colgada · media",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r2qk2r/1bpp4/1pn1pnp1/p5Bp/3PB3/P6P/1PPQNPP1/R3K2R b KQkq - 1 16",
      "text": "Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis.\n\nEjemplo de una partida real: juegan negras y la jugada fue Cxe4."
     },
     {
      "t": "puzzle",
      "id": "l19ieu",
      "text": "Pieza colgada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08AvB",
      "text": "Pieza colgada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l6nPIz",
      "text": "Pieza colgada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l05J0M",
      "text": "Pieza colgada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04KwW",
      "text": "Pieza colgada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-colgada-3",
    "title": "Pieza colgada · difícil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1b1r1k1/pp3ppp/1bq5/8/3N1Q2/1PN2P2/P1P3PP/R1B2R1K b - - 0 16",
      "text": "Después de cada jugada del rival revisa: ¿dejó alguna pieza sin defensa? Una pieza colgada se gana gratis.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dxc3."
     },
     {
      "t": "puzzle",
      "id": "l2uGv0",
      "text": "Pieza colgada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l01M1X",
      "text": "Pieza colgada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l5JpQ4",
      "text": "Pieza colgada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l492bE",
      "text": "Pieza colgada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0UoAK",
      "text": "Pieza colgada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-atrapada-1",
    "title": "Pieza atrapada · fácil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1b1k2r/ppq2ppp/1b2p1n1/P2p4/1P6/2Pn1N2/4QPPP/RNB1K2R w KQkq - 0 12",
      "text": "Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dxd3."
     },
     {
      "t": "puzzle",
      "id": "l1cJ8l",
      "text": "Pieza atrapada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "llGb9w",
      "text": "Pieza atrapada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0T1h6",
      "text": "Pieza atrapada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1IAOC",
      "text": "Pieza atrapada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0IfsA",
      "text": "Pieza atrapada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-atrapada-2",
    "title": "Pieza atrapada · media",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r4rk1/pp3pbp/2npbqp1/2p1p3/4P3/2PP2Q1/PP2BPPP/RNB1K2R w KQ - 0 11",
      "text": "Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Ag5."
     },
     {
      "t": "puzzle",
      "id": "lNigwj",
      "text": "Pieza atrapada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l7iov7",
      "text": "Pieza atrapada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lEqe3m",
      "text": "Pieza atrapada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lBdCSf",
      "text": "Pieza atrapada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lH9pJa",
      "text": "Pieza atrapada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-atrapada-3",
    "title": "Pieza atrapada · difícil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r3kb1r/pQ2nppp/2n5/q7/4p1b1/2NP4/PP2PPBP/R1B1K1NR b KQkq - 2 10",
      "text": "Una pieza rival sin casillas de escape se puede atacar y ganar. Cuenta las casillas a las que puede huir.\n\nEjemplo de una partida real: juegan negras y la jugada fue Tb8."
     },
     {
      "t": "puzzle",
      "id": "lC0Jfg",
      "text": "Pieza atrapada · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0s14E",
      "text": "Pieza atrapada · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l4g0OS",
      "text": "Pieza atrapada · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0VKzD",
      "text": "Pieza atrapada · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3cCUi",
      "text": "Pieza atrapada · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-sacrificio-1",
    "title": "Sacrificio · fácil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "3r3k/p4p1p/1p3Pp1/2p5/7P/1P2Q1P1/P3RK2/7q w - - 5 46",
      "text": "Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar.\n\nEjemplo de una partida real: juegan blancas y la jugada fue De8+."
     },
     {
      "t": "puzzle",
      "id": "l1jFE7",
      "text": "Sacrificio · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0rR9j",
      "text": "Sacrificio · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l125Zx",
      "text": "Sacrificio · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0KNZa",
      "text": "Sacrificio · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l03RFD",
      "text": "Sacrificio · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-sacrificio-2",
    "title": "Sacrificio · media",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r3k2r/pp3pp1/2ppq3/4p3/3bP3/P2P1QP1/1PP1N1PN/2R2R1K b kq - 1 22",
      "text": "Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar.\n\nEjemplo de una partida real: juegan negras y la jugada fue Txh2+."
     },
     {
      "t": "puzzle",
      "id": "l2GI6H",
      "text": "Sacrificio · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l00Oim",
      "text": "Sacrificio · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lNzFZY",
      "text": "Sacrificio · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0VSCm",
      "text": "Sacrificio · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l00wUm",
      "text": "Sacrificio · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-sacrificio-3",
    "title": "Sacrificio · difícil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "2k4r/ppp1q1p1/3b2p1/3Q4/1P2NPn1/P1P5/6P1/R1B2RKN b - - 0 21",
      "text": "Entregar material vale la pena si después ganas más, das mate o abres al rey. Calcula hasta el final antes de sacrificar.\n\nEjemplo de una partida real: juegan negras y la jugada fue Txh1+."
     },
     {
      "t": "puzzle",
      "id": "l6eYad",
      "text": "Sacrificio · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0KE1r",
      "text": "Sacrificio · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1JYco",
      "text": "Sacrificio · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lefbT3",
      "text": "Sacrificio · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lCMc0A",
      "text": "Sacrificio · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 },
 {
  "id": "t-rey",
  "level": "Tácticas",
  "title": "Ataque al rey",
  "desc": "Cuando el rey rival está débil",
  "lessons": [
   {
    "id": "tac-ataquerey-1",
    "title": "Ataque al rey · fácil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1b1k1nr/1p1p1ppp/p1pb4/4q3/2P5/2N1P3/PP1QBPPP/R1B2RK1 b kq - 3 10",
      "text": "Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dxh2#."
     },
     {
      "t": "puzzle",
      "id": "lGpk59",
      "text": "Ataque al rey · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lyQ5dR",
      "text": "Ataque al rey · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l8CiRW",
      "text": "Ataque al rey · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0EOWL",
      "text": "Ataque al rey · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1b1ay",
      "text": "Ataque al rey · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-ataquerey-2",
    "title": "Ataque al rey · media",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnb2qk1/2p1b1pp/p3p3/1pPpP3/8/2N5/PPBB2PP/R2QN1K1 b - - 0 19",
      "text": "Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque.\n\nEjemplo de una partida real: juegan negras y la jugada fue Axc5+."
     },
     {
      "t": "puzzle",
      "id": "l1OR4U",
      "text": "Ataque al rey · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l00tZP",
      "text": "Ataque al rey · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1xylV",
      "text": "Ataque al rey · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lGrjqW",
      "text": "Ataque al rey · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l1WvJw",
      "text": "Ataque al rey · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-ataquerey-3",
    "title": "Ataque al rey · difícil",
    "glyph": "Q",
    "topic": "tacticas",
    "summary": [
     "Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r4rk1/ppp2ppp/8/8/1P1P2nq/P1B1P2P/4NRPN/R2Q2K1 b - - 0 18",
      "text": "Cuenta atacantes y defensores alrededor del rey rival. Si tienes más piezas cerca, busca jaques y sacrificios que abran su enroque.\n\nEjemplo de una partida real: juegan negras y la jugada fue Dxf2+."
     },
     {
      "t": "puzzle",
      "id": "l2j5MD",
      "text": "Ataque al rey · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l6nO2k",
      "text": "Ataque al rey · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l28Khn",
      "text": "Ataque al rey · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2Ojza",
      "text": "Ataque al rey · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3t6zn",
      "text": "Ataque al rey · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-f7-1",
    "title": "Ataque a f7 / f2 · fácil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r2qkb1r/1ppn1npp/p3p3/8/2BP2PP/5Q2/PPP5/R1B2RK1 w kq - 0 15",
      "text": "En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dxf7#."
     },
     {
      "t": "puzzle",
      "id": "lKPsKY",
      "text": "Ataque a f7 / f2 · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lUXSMB",
      "text": "Ataque a f7 / f2 · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l5fwqk",
      "text": "Ataque a f7 / f2 · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l6EjAP",
      "text": "Ataque a f7 / f2 · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l68fMY",
      "text": "Ataque a f7 / f2 · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-f7-2",
    "title": "Ataque a f7 / f2 · media",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rn2k2r/ppp2ppp/8/3pp3/3bn1b1/1P1Q4/P1P2NP1/RNB1KB1R b KQkq - 0 10",
      "text": "En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas.\n\nEjemplo de una partida real: juegan negras y la jugada fue Axf2#."
     },
     {
      "t": "puzzle",
      "id": "lcUH47",
      "text": "Ataque a f7 / f2 · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lMxxoo",
      "text": "Ataque a f7 / f2 · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0T15m",
      "text": "Ataque a f7 / f2 · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0jiUb",
      "text": "Ataque a f7 / f2 · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2yXDw",
      "text": "Ataque a f7 / f2 · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-f7-3",
    "title": "Ataque a f7 / f2 · difícil",
    "glyph": "B",
    "topic": "tacticas",
    "summary": [
     "En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqk2r/ppp2ppp/5n2/2N1p3/2P5/P3p2P/1P1P1PP1/R1BQKBNR b KQkq - 0 7",
      "text": "En la apertura, f7 (f2 para blancas) solo la defiende el rey. Alfil y dama apuntando ahí son la base de muchas trampas.\n\nEjemplo de una partida real: juegan negras y la jugada fue exf2+."
     },
     {
      "t": "puzzle",
      "id": "lNXwFD",
      "text": "Ataque a f7 / f2 · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0fblR",
      "text": "Ataque a f7 / f2 · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l03JjV",
      "text": "Ataque a f7 / f2 · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0f9O8",
      "text": "Ataque a f7 / f2 · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3ymsz",
      "text": "Ataque a f7 / f2 · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-reyexpuesto-1",
    "title": "Rey expuesto · fácil",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "6r1/pb2k3/1p6/2p5/2P1pb2/1P2R1P1/P6P/4R1K1 w - - 0 31",
      "text": "Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Txe4+."
     },
     {
      "t": "puzzle",
      "id": "l6D6JJ",
      "text": "Rey expuesto · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l27LUU",
      "text": "Rey expuesto · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lLDwUW",
      "text": "Rey expuesto · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04qWI",
      "text": "Rey expuesto · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l8rQl2",
      "text": "Rey expuesto · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-reyexpuesto-2",
    "title": "Rey expuesto · media",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1b1kb1r/pp4pp/2n1pn2/2p2p2/Q1P5/3q2P1/PP1P1PBP/R1BNK1NR w KQkq - 0 10",
      "text": "Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Axc6+."
     },
     {
      "t": "puzzle",
      "id": "l08ls2",
      "text": "Rey expuesto · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09MNf",
      "text": "Rey expuesto · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0OPEF",
      "text": "Rey expuesto · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l04rt9",
      "text": "Rey expuesto · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l01aAR",
      "text": "Rey expuesto · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-reyexpuesto-3",
    "title": "Rey expuesto · difícil",
    "glyph": "K",
    "topic": "tacticas",
    "summary": [
     "Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "7k/2pr4/4N1p1/1p5p/8/2P1Q1K1/2q3PP/8 w - - 11 42",
      "text": "Un rey sin peones que lo cubran sufre jaques en cadena, y los jaques suelen esconder ataques dobles.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Dh6+."
     },
     {
      "t": "puzzle",
      "id": "l0Jaze",
      "text": "Rey expuesto · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l071Uj",
      "text": "Rey expuesto · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l013U2",
      "text": "Rey expuesto · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l7vdBj",
      "text": "Rey expuesto · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0hdV3",
      "text": "Rey expuesto · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 },
 {
  "id": "t-peones",
  "level": "Tácticas",
  "title": "Peones decisivos",
  "desc": "Coronar y avanzar",
  "lessons": [
   {
    "id": "tac-coronacion-1",
    "title": "Coronación · fácil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/6n1/8/7P/2pk4/8/2K5/8 w - - 0 49",
      "text": "Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue.\n\nEjemplo de una partida real: juegan blancas y la jugada fue h6."
     },
     {
      "t": "puzzle",
      "id": "lF4kO1",
      "text": "Coronación · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0e8rX",
      "text": "Coronación · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l5Ui5h",
      "text": "Coronación · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l02I1j",
      "text": "Coronación · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0FTQP",
      "text": "Coronación · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-coronacion-2",
    "title": "Coronación · media",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "1R6/1P6/4pkp1/5p2/3P4/3KP2p/8/1r6 w - - 0 44",
      "text": "Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue.\n\nEjemplo de una partida real: juegan blancas y la jugada fue Tf8+."
     },
     {
      "t": "puzzle",
      "id": "l0Ofs3",
      "text": "Coronación · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l099Yk",
      "text": "Coronación · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l070Gp",
      "text": "Coronación · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lBom6H",
      "text": "Coronación · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l091Lf",
      "text": "Coronación · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-coronacion-3",
    "title": "Coronación · difícil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/6p1/R5k1/6p1/6P1/1p1p1p1P/1P1Kb3/8 b - - 1 45",
      "text": "Un peón que corona vale una dama. Desvía o sacrifica lo que sea necesario para que llegue.\n\nEjemplo de una partida real: juegan negras y la jugada fue Rh7."
     },
     {
      "t": "puzzle",
      "id": "l08vXy",
      "text": "Coronación · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l2iWjx",
      "text": "Coronación · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09fof",
      "text": "Coronación · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0M3v7",
      "text": "Coronación · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0fTsF",
      "text": "Coronación · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-peonavanzado-1",
    "title": "Peón avanzado · fácil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "5k2/8/5P2/p7/P1p5/7K/7N/8 b - - 0 60",
      "text": "Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas.\n\nEjemplo de una partida real: juegan negras y la jugada fue c3."
     },
     {
      "t": "puzzle",
      "id": "lBf8Iy",
      "text": "Peón avanzado · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l3XYxs",
      "text": "Peón avanzado · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l5O5wB",
      "text": "Peón avanzado · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0M087",
      "text": "Peón avanzado · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0C0hL",
      "text": "Peón avanzado · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-peonavanzado-2",
    "title": "Peón avanzado · media",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/8/6P1/nK6/8/8/pk6/N7 w - - 1 58",
      "text": "Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas.\n\nEjemplo de una partida real: juegan blancas y la jugada fue g7."
     },
     {
      "t": "puzzle",
      "id": "l0Jkyy",
      "text": "Peón avanzado · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l6pABf",
      "text": "Peón avanzado · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lv6tRm",
      "text": "Peón avanzado · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l08f3U",
      "text": "Peón avanzado · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l0EWLS",
      "text": "Peón avanzado · 5 de 5. Encuentra la jugada."
     }
    ]
   },
   {
    "id": "tac-peonavanzado-3",
    "title": "Peón avanzado · difícil",
    "glyph": "P",
    "topic": "tacticas",
    "summary": [
     "Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "8/6k1/N4ppp/2p5/3p4/P1P3nP/1P4P1/6K1 b - - 0 42",
      "text": "Un peón en la sexta o séptima fila obliga al rival a vigilarlo; úsalo para desviar sus piezas.\n\nEjemplo de una partida real: juegan negras y la jugada fue d3."
     },
     {
      "t": "puzzle",
      "id": "lNnONu",
      "text": "Peón avanzado · 1 de 5. El rival acaba de jugar. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l09KUf",
      "text": "Peón avanzado · 2 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "lFJYwG",
      "text": "Peón avanzado · 3 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l07VjD",
      "text": "Peón avanzado · 4 de 5. Encuentra la jugada."
     },
     {
      "t": "puzzle",
      "id": "l15vpx",
      "text": "Peón avanzado · 5 de 5. Encuentra la jugada."
     }
    ]
   }
  ]
 }
];

export const OPENING_UNITS: Unit[] = [
 {
  "id": "ap-abiertas",
  "level": "Aperturas",
  "title": "Aperturas abiertas",
  "desc": "1.e4 e5: Italiana, Española, Escocesa y más",
  "lessons": [
   {
    "id": "ap-italian_game-1",
    "title": "Apertura Italiana",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cc6 3.Ac4: el alfil apunta a f7, el punto débil de las negras. Las trampas giran alrededor de f7 y del centro."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      "text": "1.e4 e5 2.Cf3 Cc6 3.Ac4: el alfil apunta a f7, el punto débil de las negras. Las trampas giran alrededor de f7 y del centro.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l044Sh",
      "text": "Apertura Italiana · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0fWCk",
      "text": "Apertura Italiana · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0IxfP",
      "text": "Apertura Italiana · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l031G5",
      "text": "Apertura Italiana · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0W5q4",
      "text": "Apertura Italiana · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-italian_game-2",
    "title": "Apertura Italiana · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cc6 3.Ac4: el alfil apunta a f7, el punto débil de las negras. Las trampas giran alrededor de f7 y del centro."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      "text": "1.e4 e5 2.Cf3 Cc6 3.Ac4: el alfil apunta a f7, el punto débil de las negras. Las trampas giran alrededor de f7 y del centro.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0D3Pa",
      "text": "Apertura Italiana · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0JZDR",
      "text": "Apertura Italiana · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0A1Jy",
      "text": "Apertura Italiana · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0aBQR",
      "text": "Apertura Italiana · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1SrL6",
      "text": "Apertura Italiana · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-ruy_lopez-1",
    "title": "Apertura Española",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cc6 3.Ab5: el alfil presiona al caballo que defiende e5. Ojo con las clavadas sobre la diagonal del rey."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      "text": "1.e4 e5 2.Cf3 Cc6 3.Ab5: el alfil presiona al caballo que defiende e5. Ojo con las clavadas sobre la diagonal del rey.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0RU5y",
      "text": "Apertura Española · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Is9S",
      "text": "Apertura Española · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0FGqW",
      "text": "Apertura Española · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l02MZb",
      "text": "Apertura Española · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0J2ws",
      "text": "Apertura Española · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-ruy_lopez-2",
    "title": "Apertura Española · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cc6 3.Ab5: el alfil presiona al caballo que defiende e5. Ojo con las clavadas sobre la diagonal del rey."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      "text": "1.e4 e5 2.Cf3 Cc6 3.Ab5: el alfil presiona al caballo que defiende e5. Ojo con las clavadas sobre la diagonal del rey.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l07pJd",
      "text": "Apertura Española · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0CeVT",
      "text": "Apertura Española · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l07eDk",
      "text": "Apertura Española · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0d3aJ",
      "text": "Apertura Española · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1jDrw",
      "text": "Apertura Española · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-scotch_game-1",
    "title": "Apertura Escocesa",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cc6 3.d4: las blancas abren el centro de inmediato. Piezas activas y ataques dobles sobre piezas que salen temprano."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
      "text": "1.e4 e5 2.Cf3 Cc6 3.d4: las blancas abren el centro de inmediato. Piezas activas y ataques dobles sobre piezas que salen temprano.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l3d9Hz",
      "text": "Apertura Escocesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0zbBV",
      "text": "Apertura Escocesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0FAs7",
      "text": "Apertura Escocesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0H03X",
      "text": "Apertura Escocesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l03TUH",
      "text": "Apertura Escocesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-scotch_game-2",
    "title": "Apertura Escocesa · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cc6 3.d4: las blancas abren el centro de inmediato. Piezas activas y ataques dobles sobre piezas que salen temprano."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
      "text": "1.e4 e5 2.Cf3 Cc6 3.d4: las blancas abren el centro de inmediato. Piezas activas y ataques dobles sobre piezas que salen temprano.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0I6jj",
      "text": "Apertura Escocesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0CoXh",
      "text": "Apertura Escocesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l04Lnq",
      "text": "Apertura Escocesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1GiPj",
      "text": "Apertura Escocesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l2RWao",
      "text": "Apertura Escocesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-petrovs_defense-1",
    "title": "Defensa Petrov",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cf6: las negras contraatacan e4. La trampa clásica: copiar las jugadas del rival demasiado tiempo."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
      "text": "1.e4 e5 2.Cf3 Cf6: las negras contraatacan e4. La trampa clásica: copiar las jugadas del rival demasiado tiempo.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l8uqSL",
      "text": "Defensa Petrov · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l4tCG2",
      "text": "Defensa Petrov · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l10RBX",
      "text": "Defensa Petrov · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0obXj",
      "text": "Defensa Petrov · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Bjtj",
      "text": "Defensa Petrov · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-petrovs_defense-2",
    "title": "Defensa Petrov · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 Cf6: las negras contraatacan e4. La trampa clásica: copiar las jugadas del rival demasiado tiempo."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
      "text": "1.e4 e5 2.Cf3 Cf6: las negras contraatacan e4. La trampa clásica: copiar las jugadas del rival demasiado tiempo.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0XHQp",
      "text": "Defensa Petrov · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0geqR",
      "text": "Defensa Petrov · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l3nyxR",
      "text": "Defensa Petrov · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l2HSYw",
      "text": "Defensa Petrov · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1FLQ7",
      "text": "Defensa Petrov · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-philidor_defense-1",
    "title": "Defensa Philidor",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 d6: sólida pero pasiva. Las blancas buscan f7 y la columna e."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
      "text": "1.e4 e5 2.Cf3 d6: sólida pero pasiva. Las blancas buscan f7 y la columna e.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l1kGA0",
      "text": "Defensa Philidor · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1v5J3",
      "text": "Defensa Philidor · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0z2fz",
      "text": "Defensa Philidor · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Iv0a",
      "text": "Defensa Philidor · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0MGZ2",
      "text": "Defensa Philidor · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-philidor_defense-2",
    "title": "Defensa Philidor · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cf3 d6: sólida pero pasiva. Las blancas buscan f7 y la columna e."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
      "text": "1.e4 e5 2.Cf3 d6: sólida pero pasiva. Las blancas buscan f7 y la columna e.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l07Gtd",
      "text": "Defensa Philidor · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0DKzD",
      "text": "Defensa Philidor · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Oqw6",
      "text": "Defensa Philidor · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Pnug",
      "text": "Defensa Philidor · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1LmHK",
      "text": "Defensa Philidor · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-vienna_game-1",
    "title": "Partida Vienesa",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cc3: prepara f4 y ataques rápidos."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
      "text": "1.e4 e5 2.Cc3: prepara f4 y ataques rápidos.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l57OcQ",
      "text": "Partida Vienesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0h81z",
      "text": "Partida Vienesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l2LA5i",
      "text": "Partida Vienesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0tS8d",
      "text": "Partida Vienesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0MAhd",
      "text": "Partida Vienesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-vienna_game-2",
    "title": "Partida Vienesa · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.Cc3: prepara f4 y ataques rápidos."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
      "text": "1.e4 e5 2.Cc3: prepara f4 y ataques rápidos.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0Ii0m",
      "text": "Partida Vienesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0MdLF",
      "text": "Partida Vienesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0aYR2",
      "text": "Partida Vienesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0DX6i",
      "text": "Partida Vienesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l5hmNu",
      "text": "Partida Vienesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-four_knights_game-1",
    "title": "Cuatro caballos",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "Los cuatro caballos salen primero. Posiciones simétricas donde una jugada descuidada cuesta material."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
      "text": "Los cuatro caballos salen primero. Posiciones simétricas donde una jugada descuidada cuesta material.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0KctV",
      "text": "Cuatro caballos · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0fp6h",
      "text": "Cuatro caballos · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0BxB9",
      "text": "Cuatro caballos · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0uBbo",
      "text": "Cuatro caballos · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l05iQ7",
      "text": "Cuatro caballos · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-four_knights_game-2",
    "title": "Cuatro caballos · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "Los cuatro caballos salen primero. Posiciones simétricas donde una jugada descuidada cuesta material."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 4",
      "text": "Los cuatro caballos salen primero. Posiciones simétricas donde una jugada descuidada cuesta material.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0iEGd",
      "text": "Cuatro caballos · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Z0pF",
      "text": "Cuatro caballos · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l02rAh",
      "text": "Cuatro caballos · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0EIPW",
      "text": "Cuatro caballos · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l71Skd",
      "text": "Cuatro caballos · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-kings_gambit_accepted-1",
    "title": "Gambito de Rey",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.f4: las blancas entregan un peón para abrir la columna f y atacar f7. Muy táctico."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3",
      "text": "1.e4 e5 2.f4: las blancas entregan un peón para abrir la columna f y atacar f7. Muy táctico.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l1hr4T",
      "text": "Gambito de Rey · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l27WqG",
      "text": "Gambito de Rey · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0lAk5",
      "text": "Gambito de Rey · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Jj5q",
      "text": "Gambito de Rey · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0CcJO",
      "text": "Gambito de Rey · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-kings_gambit_accepted-2",
    "title": "Gambito de Rey · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e5 2.f4: las blancas entregan un peón para abrir la columna f y atacar f7. Muy táctico."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3",
      "text": "1.e4 e5 2.f4: las blancas entregan un peón para abrir la columna f y atacar f7. Muy táctico.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0AKbi",
      "text": "Gambito de Rey · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0WsI7",
      "text": "Gambito de Rey · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0KwTT",
      "text": "Gambito de Rey · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0YkEx",
      "text": "Gambito de Rey · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1gNlo",
      "text": "Gambito de Rey · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   }
  ]
 },
 {
  "id": "ap-semiabiertas",
  "level": "Aperturas",
  "title": "Defensas contra 1.e4",
  "desc": "Siciliana, Francesa, Caro-Kann y otras",
  "lessons": [
   {
    "id": "ap-sicilian_defense-1",
    "title": "Defensa Siciliana",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 c5: las negras pelean por el centro desde el flanco. Posiciones tácticas, con enroques opuestos y ataques al rey."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
      "text": "1.e4 c5: las negras pelean por el centro desde el flanco. Posiciones tácticas, con enroques opuestos y ataques al rey.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0Cyma",
      "text": "Defensa Siciliana · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1mUBN",
      "text": "Defensa Siciliana · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1Agev",
      "text": "Defensa Siciliana · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0khDH",
      "text": "Defensa Siciliana · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0H149",
      "text": "Defensa Siciliana · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-sicilian_defense-2",
    "title": "Defensa Siciliana · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 c5: las negras pelean por el centro desde el flanco. Posiciones tácticas, con enroques opuestos y ataques al rey."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2",
      "text": "1.e4 c5: las negras pelean por el centro desde el flanco. Posiciones tácticas, con enroques opuestos y ataques al rey.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l025Cu",
      "text": "Defensa Siciliana · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1VExN",
      "text": "Defensa Siciliana · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l03Sv4",
      "text": "Defensa Siciliana · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l02K3C",
      "text": "Defensa Siciliana · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0RX1F",
      "text": "Defensa Siciliana · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-french_defense-1",
    "title": "Defensa Francesa",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e6 2.d4 d5: estructura sólida, pero el alfil de c8 queda encerrado. Muchas tácticas sobre e5, d4 y el enroque negro."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3",
      "text": "1.e4 e6 2.d4 d5: estructura sólida, pero el alfil de c8 queda encerrado. Muchas tácticas sobre e5, d4 y el enroque negro.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0L1PM",
      "text": "Defensa Francesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0MqwH",
      "text": "Defensa Francesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0AA4E",
      "text": "Defensa Francesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l01Suf",
      "text": "Defensa Francesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l07V8t",
      "text": "Defensa Francesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-french_defense-2",
    "title": "Defensa Francesa · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 e6 2.d4 d5: estructura sólida, pero el alfil de c8 queda encerrado. Muchas tácticas sobre e5, d4 y el enroque negro."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3",
      "text": "1.e4 e6 2.d4 d5: estructura sólida, pero el alfil de c8 queda encerrado. Muchas tácticas sobre e5, d4 y el enroque negro.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l07ZS4",
      "text": "Defensa Francesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l04779",
      "text": "Defensa Francesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l08tNo",
      "text": "Defensa Francesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Cvif",
      "text": "Defensa Francesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0b808",
      "text": "Defensa Francesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-caro-kann_defense-1",
    "title": "Defensa Caro-Kann",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 c6 2.d4 d5: sólida y segura. Las trampas típicas aparecen cuando las negras desarrollan el alfil o la dama demasiado pronto."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3",
      "text": "1.e4 c6 2.d4 d5: sólida y segura. Las trampas típicas aparecen cuando las negras desarrollan el alfil o la dama demasiado pronto.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0OuiZ",
      "text": "Defensa Caro-Kann · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0GJAh",
      "text": "Defensa Caro-Kann · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Eexx",
      "text": "Defensa Caro-Kann · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l01rgi",
      "text": "Defensa Caro-Kann · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0DRqa",
      "text": "Defensa Caro-Kann · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-caro-kann_defense-2",
    "title": "Defensa Caro-Kann · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 c6 2.d4 d5: sólida y segura. Las trampas típicas aparecen cuando las negras desarrollan el alfil o la dama demasiado pronto."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3",
      "text": "1.e4 c6 2.d4 d5: sólida y segura. Las trampas típicas aparecen cuando las negras desarrollan el alfil o la dama demasiado pronto.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0I0ds",
      "text": "Defensa Caro-Kann · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l033xz",
      "text": "Defensa Caro-Kann · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l009XT",
      "text": "Defensa Caro-Kann · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l07CCA",
      "text": "Defensa Caro-Kann · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0zQbV",
      "text": "Defensa Caro-Kann · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-scandinavian_defense-1",
    "title": "Defensa Escandinava",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 d5: la dama negra sale temprano. Las blancas ganan tiempos atacándola; las negras deben cuidar que no la atrapen."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
      "text": "1.e4 d5: la dama negra sale temprano. Las blancas ganan tiempos atacándola; las negras deben cuidar que no la atrapen.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l03eid",
      "text": "Defensa Escandinava · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l08XzM",
      "text": "Defensa Escandinava · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0IBhi",
      "text": "Defensa Escandinava · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l05soY",
      "text": "Defensa Escandinava · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l06M8G",
      "text": "Defensa Escandinava · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-scandinavian_defense-2",
    "title": "Defensa Escandinava · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 d5: la dama negra sale temprano. Las blancas ganan tiempos atacándola; las negras deben cuidar que no la atrapen."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
      "text": "1.e4 d5: la dama negra sale temprano. Las blancas ganan tiempos atacándola; las negras deben cuidar que no la atrapen.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l04beQ",
      "text": "Defensa Escandinava · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l09gt7",
      "text": "Defensa Escandinava · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0HKSM",
      "text": "Defensa Escandinava · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0PSpy",
      "text": "Defensa Escandinava · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1ruTE",
      "text": "Defensa Escandinava · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-pirc_defense-1",
    "title": "Defensa Pirc",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 d6 2.d4 Cf6: las negras dejan el centro a las blancas y lo atacan después."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3",
      "text": "1.e4 d6 2.d4 Cf6: las negras dejan el centro a las blancas y lo atacan después.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l5oLRi",
      "text": "Defensa Pirc · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0qd2i",
      "text": "Defensa Pirc · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0slDk",
      "text": "Defensa Pirc · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0gZlB",
      "text": "Defensa Pirc · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0LtvL",
      "text": "Defensa Pirc · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-pirc_defense-2",
    "title": "Defensa Pirc · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 d6 2.d4 Cf6: las negras dejan el centro a las blancas y lo atacan después."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3",
      "text": "1.e4 d6 2.d4 Cf6: las negras dejan el centro a las blancas y lo atacan después.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l009FP",
      "text": "Defensa Pirc · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0P8Y6",
      "text": "Defensa Pirc · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l09sh0",
      "text": "Defensa Pirc · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0SPrx",
      "text": "Defensa Pirc · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1mpFD",
      "text": "Defensa Pirc · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-alekhine_defense-1",
    "title": "Defensa Alekhine",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 Cf6: provoca a los peones blancos a avanzar para atacarlos luego."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
      "text": "1.e4 Cf6: provoca a los peones blancos a avanzar para atacarlos luego.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "lDtwGM",
      "text": "Defensa Alekhine · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "lF4AcL",
      "text": "Defensa Alekhine · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Erxs",
      "text": "Defensa Alekhine · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0grGW",
      "text": "Defensa Alekhine · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0VgYu",
      "text": "Defensa Alekhine · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-alekhine_defense-2",
    "title": "Defensa Alekhine · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.e4 Cf6: provoca a los peones blancos a avanzar para atacarlos luego."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2",
      "text": "1.e4 Cf6: provoca a los peones blancos a avanzar para atacarlos luego.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0TLAn",
      "text": "Defensa Alekhine · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0xD5d",
      "text": "Defensa Alekhine · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1ORM0",
      "text": "Defensa Alekhine · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l23eQX",
      "text": "Defensa Alekhine · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l3GLxF",
      "text": "Defensa Alekhine · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   }
  ]
 },
 {
  "id": "ap-cerradas",
  "level": "Aperturas",
  "title": "Aperturas de peón de dama",
  "desc": "Gambito de Dama, Eslava, India de Rey, Inglesa",
  "lessons": [
   {
    "id": "ap-queens_gambit_declined-1",
    "title": "Gambito de Dama rehusado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 d5 2.c4 e6: lucha por el centro con d4 y c4. Clavadas del alfil sobre el caballo de f6 y presión en la columna c."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 d5 2.c4 e6: lucha por el centro con d4 y c4. Clavadas del alfil sobre el caballo de f6 y presión en la columna c.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0Znpr",
      "text": "Gambito de Dama rehusado · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1VkDq",
      "text": "Gambito de Dama rehusado · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l11Zkj",
      "text": "Gambito de Dama rehusado · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l03ISd",
      "text": "Gambito de Dama rehusado · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0C4xT",
      "text": "Gambito de Dama rehusado · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-queens_gambit_declined-2",
    "title": "Gambito de Dama rehusado · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 d5 2.c4 e6: lucha por el centro con d4 y c4. Clavadas del alfil sobre el caballo de f6 y presión en la columna c."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 d5 2.c4 e6: lucha por el centro con d4 y c4. Clavadas del alfil sobre el caballo de f6 y presión en la columna c.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l03LVu",
      "text": "Gambito de Dama rehusado · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l02kzX",
      "text": "Gambito de Dama rehusado · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0HnDV",
      "text": "Gambito de Dama rehusado · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l04YBe",
      "text": "Gambito de Dama rehusado · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0iA80",
      "text": "Gambito de Dama rehusado · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-queens_gambit_accepted-1",
    "title": "Gambito de Dama aceptado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 d5 2.c4 dxc4: las negras toman el peón; querer conservarlo suele costar caro."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 d5 2.c4 dxc4: las negras toman el peón; querer conservarlo suele costar caro.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0KtKd",
      "text": "Gambito de Dama aceptado · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0acZr",
      "text": "Gambito de Dama aceptado · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0iFkz",
      "text": "Gambito de Dama aceptado · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0eP1X",
      "text": "Gambito de Dama aceptado · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0pT9G",
      "text": "Gambito de Dama aceptado · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-queens_gambit_accepted-2",
    "title": "Gambito de Dama aceptado · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 d5 2.c4 dxc4: las negras toman el peón; querer conservarlo suele costar caro."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 d5 2.c4 dxc4: las negras toman el peón; querer conservarlo suele costar caro.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l04AXr",
      "text": "Gambito de Dama aceptado · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l04vot",
      "text": "Gambito de Dama aceptado · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0jJMh",
      "text": "Gambito de Dama aceptado · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l2KuTd",
      "text": "Gambito de Dama aceptado · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "lDyOZ0",
      "text": "Gambito de Dama aceptado · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-slav_defense-1",
    "title": "Defensa Eslava",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 d5 2.c4 c6: defiende d5 con un peón y deja libre el alfil de c8."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 d5 2.c4 c6: defiende d5 con un peón y deja libre el alfil de c8.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l6XqmN",
      "text": "Defensa Eslava · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0TrCT",
      "text": "Defensa Eslava · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0n3wF",
      "text": "Defensa Eslava · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0BVF5",
      "text": "Defensa Eslava · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0SSPW",
      "text": "Defensa Eslava · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-slav_defense-2",
    "title": "Defensa Eslava · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 d5 2.c4 c6: defiende d5 con un peón y deja libre el alfil de c8."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 d5 2.c4 c6: defiende d5 con un peón y deja libre el alfil de c8.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0gOGN",
      "text": "Defensa Eslava · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0ST13",
      "text": "Defensa Eslava · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l18gO8",
      "text": "Defensa Eslava · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1FtJL",
      "text": "Defensa Eslava · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "lCeMMZ",
      "text": "Defensa Eslava · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-kings_indian_defense-1",
    "title": "India de Rey",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 Cf6 2.c4 g6: las negras ceden el centro para atacarlo después; ataques en el flanco de rey."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 Cf6 2.c4 g6: las negras ceden el centro para atacarlo después; ataques en el flanco de rey.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "lSaBPq",
      "text": "India de Rey · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l4AXvg",
      "text": "India de Rey · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l04lFX",
      "text": "India de Rey · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0ovSD",
      "text": "India de Rey · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0phbi",
      "text": "India de Rey · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-kings_indian_defense-2",
    "title": "India de Rey · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 Cf6 2.c4 g6: las negras ceden el centro para atacarlo después; ataques en el flanco de rey."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
      "text": "1.d4 Cf6 2.c4 g6: las negras ceden el centro para atacarlo después; ataques en el flanco de rey.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l193hM",
      "text": "India de Rey · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0eBtd",
      "text": "India de Rey · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1B4bM",
      "text": "India de Rey · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1TptH",
      "text": "India de Rey · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l2FGxV",
      "text": "India de Rey · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-english_opening-1",
    "title": "Apertura Inglesa",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.c4: control del centro desde el flanco, con el alfil en g2 apuntando a la gran diagonal."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
      "text": "1.c4: control del centro desde el flanco, con el alfil en g2 apuntando a la gran diagonal.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l3y0fR",
      "text": "Apertura Inglesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0ggDk",
      "text": "Apertura Inglesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0QLm2",
      "text": "Apertura Inglesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l03LO0",
      "text": "Apertura Inglesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l08DRY",
      "text": "Apertura Inglesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-english_opening-2",
    "title": "Apertura Inglesa · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.c4: control del centro desde el flanco, con el alfil en g2 apuntando a la gran diagonal."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1",
      "text": "1.c4: control del centro desde el flanco, con el alfil en g2 apuntando a la gran diagonal.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0J6kj",
      "text": "Apertura Inglesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0EHXt",
      "text": "Apertura Inglesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0N4gY",
      "text": "Apertura Inglesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Ey1j",
      "text": "Apertura Inglesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1GO5i",
      "text": "Apertura Inglesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-dutch_defense-1",
    "title": "Defensa Holandesa",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 f5: controla e4 pero debilita la diagonal del rey negro: cuidado con los jaques en h5."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6 0 2",
      "text": "1.d4 f5: controla e4 pero debilita la diagonal del rey negro: cuidado con los jaques en h5.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0cxhn",
      "text": "Defensa Holandesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1P6A3",
      "text": "Defensa Holandesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l24NzN",
      "text": "Defensa Holandesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l1EgiP",
      "text": "Defensa Holandesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l11Qas",
      "text": "Defensa Holandesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   },
   {
    "id": "ap-dutch_defense-2",
    "title": "Defensa Holandesa · avanzado",
    "glyph": "N",
    "topic": "aperturas",
    "summary": [
     "1.d4 f5: controla e4 pero debilita la diagonal del rey negro: cuidado con los jaques en h5."
    ],
    "steps": [
     {
      "t": "info",
      "fen": "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6 0 2",
      "text": "1.d4 f5: controla e4 pero debilita la diagonal del rey negro: cuidado con los jaques en h5.\n\nAhora vienen tácticas de partidas reales que empezaron así."
     },
     {
      "t": "puzzle",
      "id": "l0Witz",
      "text": "Defensa Holandesa · 1 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l04OYD",
      "text": "Defensa Holandesa · 2 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l149J3",
      "text": "Defensa Holandesa · 3 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "l0Dwaa",
      "text": "Defensa Holandesa · 4 de 5. El rival acaba de jugar: encuentra la táctica."
     },
     {
      "t": "puzzle",
      "id": "lHxvbQ",
      "text": "Defensa Holandesa · 5 de 5. El rival acaba de jugar: encuentra la táctica."
     }
    ]
   }
  ]
 }
];
