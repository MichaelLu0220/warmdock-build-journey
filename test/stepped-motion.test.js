import test from "node:test";
import assert from "node:assert/strict";

import {
  sampleSteppedProgress,
  steppedFrames,
} from "../src/stepped-motion.js";

test("includes both endpoints", () => {
  assert.deepEqual(
    steppedFrames({
      from: 0,
      to: 1,
      steps: 4,
    }),
    [0, 0.25, 0.5, 0.75, 1],
  );
});

test("supports descending ranges", () => {
  assert.deepEqual(
    steppedFrames({
      from: 3,
      to: 1,
      steps: 2,
    }),
    [3, 2, 1],
  );
});

test("snaps and clamps normalized progress", () => {
  assert.equal(sampleSteppedProgress(0.58, 6), 0.5);
  assert.equal(sampleSteppedProgress(-10, 6), 0);
  assert.equal(sampleSteppedProgress(10, 6), 1);
});

