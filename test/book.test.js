import test from "node:test";
import assert from "node:assert/strict";

import { canTurn, createBook, turnBook } from "../src/book.js";

test("starts on the first card", () => {
  assert.equal(createBook(3).index, 0);
});

test("turns forward and backward", () => {
  let book = createBook(3);
  book = turnBook(book, "next");
  assert.equal(book.index, 1);
  book = turnBook(book, "previous");
  assert.equal(book.index, 0);
});

test("clamps at both covers — you cannot turn past the ends", () => {
  const first = createBook(3);
  assert.equal(turnBook(first, "previous").index, 0);
  assert.equal(canTurn(first, "previous"), false);

  const last = { size: 3, index: 2 };
  assert.equal(turnBook(last, "next").index, 2);
  assert.equal(canTurn(last, "next"), false);
});

test("null direction is a no-op", () => {
  const book = { size: 3, index: 1 };
  assert.equal(turnBook(book, null).index, 1);
});

test("rejects an empty book", () => {
  assert.throws(() => createBook(0), /size/);
});
