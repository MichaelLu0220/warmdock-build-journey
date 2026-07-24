const POINTER_DEFAULTS = Object.freeze({
  mouse: Object.freeze({
    distance: 28,
    axisDominance: 1.5,
  }),
  touch: Object.freeze({
    distance: 56,
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
 * The wider touch threshold reflects a useful interaction lesson from
 * WarmDock: a gesture that feels precise with a mouse can feel accidental
 * under a thumb.
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

