import test from "node:test";
import assert from "node:assert/strict";

import { closingLine } from "../src/warm-copy.js";

test("selects a calm line for each outcome", () => {
  assert.match(closingLine({ completed: 0, total: 0 }), /Tomorrow/);
  assert.match(closingLine({ completed: 1, total: 3 }), /Carry the lesson/);
  assert.match(closingLine({ completed: 3, total: 3 }), /Rest/);
});

test("rejects impossible counts", () => {
  assert.throws(() => closingLine({ completed: 4, total: 3 }), /greater/);
});

