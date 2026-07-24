function assertFinite(name, value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

/**
 * Builds deliberately stepped frames for pixel-style motion.
 *
 * This returns values only. Rendering, easing, timing, and cancellation remain
 * the caller's responsibility.
 */
export function steppedFrames({ from, to, steps }) {
  assertFinite("from", from);
  assertFinite("to", to);

  if (!Number.isInteger(steps) || steps < 1 || steps > 1_000) {
    throw new RangeError("steps must be an integer between 1 and 1000");
  }

  const distance = to - from;
  return Array.from(
    { length: steps + 1 },
    (_, index) => from + (distance * index) / steps,
  );
}

/**
 * Selects a frame by normalized progress while keeping the visible result
 * snapped to a fixed number of steps.
 */
export function sampleSteppedProgress(progress, steps) {
  assertFinite("progress", progress);

  if (!Number.isInteger(steps) || steps < 1) {
    throw new RangeError("steps must be a positive integer");
  }

  const clamped = Math.min(1, Math.max(0, progress));
  return Math.floor(clamped * steps) / steps;
}

