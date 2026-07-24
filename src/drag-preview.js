function assertFinite(name, value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

/**
 * Turns an in-progress drag into what the card should show *before* release.
 *
 * WarmDock does not wait for the finger to lift to give feedback. As you pull,
 * the card rotates a little in the direction it would turn, and once the drag
 * passes the commit threshold the caller can signal "let go and it turns."
 * Release under the threshold and the card springs back; release past it and the
 * real turn animation takes over.
 *
 * This returns numbers only — no DOM, no timers, no rendering. The caller maps
 * `degrees` onto a transform and reads `willTurn` to decide what release does.
 *
 * @param {object} input
 * @param {number} input.delta      signed drag distance (px); sign = direction
 * @param {number} input.threshold  distance at which the turn commits (px, > 0)
 * @param {number} [input.maxDegrees=7] rotation at full progress
 * @returns {{ progress: number, degrees: number, willTurn: boolean }}
 */
export function dragPreview({ delta, threshold, maxDegrees = 7 }) {
  assertFinite("delta", delta);
  assertFinite("threshold", threshold);
  assertFinite("maxDegrees", maxDegrees);

  if (threshold <= 0) {
    throw new RangeError("threshold must be greater than 0");
  }
  if (maxDegrees < 0) {
    throw new RangeError("maxDegrees must be >= 0");
  }

  // Only pulling toward a turn counts. Dragging back past the origin is 0,
  // not negative progress — the card never over-rotates the wrong way.
  const magnitude = Math.max(0, Math.abs(delta));
  const progress = Math.min(1, magnitude / threshold);

  // Rotate toward wherever the finger is going.
  const sign = delta < 0 ? -1 : 1;

  return {
    progress,
    degrees: sign * progress * maxDegrees,
    willTurn: progress >= 1,
  };
}
