import test from "node:test";
import assert from "node:assert/strict";

import { dragPreview } from "../src/drag-preview.js";

test("rotates toward the drag and caps at maxDegrees", () => {
  const half = dragPreview({ delta: -16, threshold: 32 });
  assert.equal(half.progress, 0.5);
  assert.equal(half.degrees, -3.5); // 0.5 * 7, toward the negative direction
  assert.equal(half.willTurn, false);

  const full = dragPreview({ delta: 40, threshold: 32 });
  assert.equal(full.progress, 1); // clamped
  assert.equal(full.degrees, 7); // capped at maxDegrees
  assert.equal(full.willTurn, true);
});

test("commits exactly at the threshold", () => {
  assert.equal(dragPreview({ delta: 32, threshold: 32 }).willTurn, true);
  assert.equal(dragPreview({ delta: 31, threshold: 32 }).willTurn, false);
});

test("dragging back past the origin never over-rotates the wrong way", () => {
  const back = dragPreview({ delta: 0, threshold: 32 });
  assert.equal(back.progress, 0);
  assert.equal(back.degrees, 0);
});

test("rejects a non-positive threshold", () => {
  assert.throws(() => dragPreview({ delta: 10, threshold: 0 }), /threshold/);
});
