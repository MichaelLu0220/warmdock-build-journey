const DEFAULT_LINES = Object.freeze({
  empty: "Nothing was promised today. Tomorrow is still available.",
  partial: "The day can close now. Carry the lesson, not the list.",
  complete: "You kept today's promises. Rest.",
});

/**
 * A tiny example of product tone expressed as data.
 *
 * It avoids urgency, guilt, fake celebration, and streak-loss threats.
 */
export function closingLine({ completed, total, lines = DEFAULT_LINES }) {
  for (const [name, value] of Object.entries({ completed, total })) {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(`${name} must be a non-negative integer`);
    }
  }

  if (completed > total) {
    throw new RangeError("completed cannot be greater than total");
  }

  if (total === 0) {
    return lines.empty;
  }

  if (completed === total) {
    return lines.complete;
  }

  return lines.partial;
}

export { DEFAULT_LINES };

