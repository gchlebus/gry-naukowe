import { test } from "node:test";
import assert from "node:assert/strict";
import { freshBook, parseBook, reducer, type Editor } from "../lib/salon.ts";
const fresh = (): Editor => ({ book: freshBook(), past: [], future: [] });
test("each doll keeps her own choices when switching and after a reload", () => {
  let s = fresh();
  s = reducer(s, {
    type: "edit",
    patch: { dye: "#83afd3", lipstick: "#bf4664", hairStyle: "bob" },
  });
  s = reducer(s, { type: "doll", id: "nina" });
  s = reducer(s, {
    type: "edit",
    patch: { hairStyle: "bun", nails: "#b59bdf" },
  });
  s = reducer(s, { type: "doll", id: "mila" });
  assert.equal(s.book.looks.mila.dye, "#83afd3");
  assert.equal(s.book.looks.mila.hairStyle, "bob");
  assert.equal(s.book.looks.nina.hairStyle, "bun");
  assert.equal(s.book.looks.nina.dye, null);
  assert.deepEqual(parseBook(JSON.stringify(s.book)), s.book);
});
test("album is a snapshot and loading a look does not modify the other dolls", () => {
  let s = fresh();
  s = reducer(s, {
    type: "edit",
    patch: { accessories: ["bow"], dye: "#e88db0" },
  });
  s = reducer(s, { type: "save", id: "one", name: "  Lawendowy sen  " });
  s = reducer(s, {
    type: "edit",
    patch: { accessories: ["glasses"], dye: "#83afd3" },
  });
  assert.equal(s.book.album[0].name, "Lawendowy sen");
  assert.equal(s.book.album[0].look.dye, "#e88db0");
  assert.deepEqual(s.book.album[0].look.accessories, ["bow"]);
  s = reducer(s, { type: "doll", id: "nina" });
  s = reducer(s, { type: "load", id: "one" });
  assert.equal(s.book.doll, "mila");
  assert.equal(s.book.looks.mila.dye, "#e88db0");
  assert.equal(s.book.looks.nina.dye, null);
});
test("undo and redo recover changes, resets and album removal without changing sound settings", () => {
  let s = fresh();
  s = reducer(s, {
    type: "edit",
    patch: { nails: "#bf4664", texture: "crimped" },
  });
  s = reducer(s, { type: "sound", value: true });
  s = reducer(s, { type: "reset" });
  assert.equal(s.book.looks.mila.nails, null);
  s = reducer(s, { type: "undo" });
  assert.equal(s.book.looks.mila.nails, "#bf4664");
  assert.equal(s.book.sound, true);
  s = reducer(s, { type: "redo" });
  assert.equal(s.book.looks.mila.nails, null);
  s = reducer(s, { type: "save", id: "one", name: "Pierwsza" });
  s = reducer(s, { type: "delete", id: "one" });
  assert.equal(s.book.album.length, 0);
  s = reducer(s, { type: "undo" });
  assert.equal(s.book.album.length, 1);
  s = reducer(s, { type: "edit", patch: { texture: "curly" } });
  assert.equal(s.future.length, 0);
});
test("corrupt storage cannot inject colors or unsupported catalog options", () => {
  const b = freshBook();
  const x = JSON.parse(JSON.stringify(b));
  x.looks.mila.dye = "url(https://example.com/tracker)";
  x.looks.mila.hairStyle = "unknown";
  x.looks.mila.shoes = "invalid";
  x.looks.mila.accessories = ["bow", "bow", "not-a-thing"];
  x.doll = "unknown";
  const clean = parseBook(JSON.stringify(x));
  assert.equal(clean.doll, "mila");
  assert.equal(clean.looks.mila.dye, null);
  assert.equal(clean.looks.mila.hairStyle, "long");
  assert.equal(clean.looks.mila.shoes, "ballet");
  assert.deepEqual(clean.looks.mila.accessories, ["bow"]);
  assert.throws(() => parseBook("{"));
  assert.throws(() => parseBook('{"version":99}'));
});
test("album capacity never overwrites a saved look and history is bounded", () => {
  let s = fresh();
  for (let i = 0; i < 30; i++)
    s = reducer(s, { type: "save", id: String(i), name: "Pomysł " + i });
  assert.equal(s.book.album.length, 24);
  assert.equal(s.book.album[0].name, "Pomysł 0");
  for (let i = 0; i < 70; i++)
    s = reducer(s, {
      type: "edit",
      patch: { shadow: i % 2 ? "#83afd3" : "#bf4664" },
    });
  assert.equal(s.past.length, 40);
});
