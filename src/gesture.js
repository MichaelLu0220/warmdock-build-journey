const POINTER_DEFAULTS = Object.freeze({
  // A mouse starts a turn only from a narrow strip at the card's edge, so it can
  // afford a longer drag: an ordinary drag across the middle of a page is almost
  // always someone selecting text, and should not turn the page.
  mouse: Object.freeze({
    distance: 56,
    axisDominance: 1.5,
  }),
  // A thumb is imprecise and the screen edge fights the browser's own back
  // gesture, so touch starts a turn from the whole card and commits with less
  // travel. Wider start target, shorter threshold — the opposite trade to a mouse.
  touch: Object.freeze({
    distance: 32,
    axisDominance: 1.25,
  }),
});

function assertFinite(name, value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

/**
 * Classifies a drag without owning any UI framework or event system.
 *
 * The interaction lesson from WarmDock lives in {@link POINTER_DEFAULTS}: the
 * same gesture that feels deliberate with a mouse feels stubborn under a thumb,
 * so touch commits with a shorter drag from a larger start target while a mouse
 * keeps a longer threshold from a narrow edge.
 *
 * @returns {"previous" | "next" | null}
 */
export function classifyPageTurn({
  deltaX,
  deltaY,
  pointer = "mouse",
  distance,
  axisDominance,
}) {
  assertFinite("deltaX", deltaX);
  assertFinite("deltaY", deltaY);

  const defaults = POINTER_DEFAULTS[pointer];
  if (!defaults) {
    throw new TypeError('pointer must be either "mouse" or "touch"');
  }

  const minimumDistance = distance ?? defaults.distance;
  const minimumDominance = axisDominance ?? defaults.axisDominance;

  assertFinite("distance", minimumDistance);
  assertFinite("axisDominance", minimumDominance);

  if (minimumDistance < 0 || minimumDominance < 1) {
    throw new RangeError("distance must be >= 0 and axisDominance must be >= 1");
  }

  const horizontal = Math.abs(deltaX);
  const vertical = Math.abs(deltaY);

  if (horizontal < minimumDistance) {
    return null;
  }

  if (horizontal < vertical * minimumDominance) {
    return null;
  }

  return deltaX < 0 ? "next" : "previous";
}

export { POINTER_DEFAULTS };

