import test from "node:test";
import assert from "node:assert/strict";

import { classifyPageTurn } from "../src/gesture.js";

test("classifies a deliberate left touch swipe as next", () => {
  assert.equal(
    classifyPageTurn({
      deltaX: -92,
      deltaY: 18,
      pointer: "touch",
    }),
    "next",
  );
});

test("classifies a deliberate right mouse drag as previous", () => {
  assert.equal(
    classifyPageTurn({
      deltaX: 40,
      deltaY: 4,
      pointer: "mouse",
    }),
    "previous",
  );
});

test("rejects short and diagonal drags", () => {
  assert.equal(
    classifyPageTurn({
      deltaX: 20,
      deltaY: 2,
      pointer: "mouse",
    }),
    null,
  );

  assert.equal(
    classifyPageTurn({
      deltaX: 60,
      deltaY: 60,
      pointer: "touch",
    }),
    null,
  );
});

test("validates pointer values", () => {
  assert.throws(
    () =>
      classifyPageTurn({
        deltaX: 10,
        deltaY: 0,
        pointer: "trackball",
      }),
    /pointer/,
  );
});

