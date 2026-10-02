const GL: Record<string, string> = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
/** Figura de la pieza (se colorea con CSS). El ︎ evita que el teléfono la dibuje como emoji. */
export const glyph = (T: string) => GL[T.toUpperCase()] + '︎';
