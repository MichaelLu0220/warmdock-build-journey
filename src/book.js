/**
 * A tiny book-of-cards state machine — the shape WarmDock's panel uses, with
 * none of its content. It only knows how many cards there are and which one is
 * showing, and it clamps at both ends: you cannot turn past the covers.
 *
 * Pure and framework-free. The demo wires pointer gestures to it; the real app
 * does the same with a great deal more on top.
 */

export function createBook(size) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer");
  }
  return { size, index: 0 };
}

/**
 * @param {{size:number,index:number}} state
 * @param {"next"|"previous"|null} direction
 */
export function turnBook(state, direction) {
  const step = direction === "next" ? 1 : direction === "previous" ? -1 : 0;
  const index = Math.min(state.size - 1, Math.max(0, state.index + step));
  return { size: state.size, index };
}

export function canTurn(state, direction) {
  return turnBook(state, direction).index !== state.index;
}
