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
      deltaX: 72,
      deltaY: 4,
      pointer: "mouse",
    }),
    "previous",
  );
});

test("a touch commits with less travel than a mouse", () => {
  // 40px clears the touch threshold (32) but not the mouse threshold (56):
  // the same drag turns the page under a thumb and does nothing under a mouse.
  assert.equal(
    classifyPageTurn({ deltaX: -40, deltaY: 6, pointer: "touch" }),
    "next",
  );
  assert.equal(
    classifyPageTurn({ deltaX: -40, deltaY: 6, pointer: "mouse" }),
    null,
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

