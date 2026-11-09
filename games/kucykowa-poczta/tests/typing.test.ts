import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newRun,
  stroke,
  pause,
  resume,
  elapsedAt,
  backspace,
  metrics,
  finish,
  freshProgress,
  parseProgress,
  keyGuide,
  LESSONS,
  recommended,
} from "../lib/typing.ts";
function complete(text = "fj", errors = 0, ms = 10000) {
  let r = newRun(text);
  for (let i = 0; i < errors; i++) r = stroke(r, "!", 100);
  for (const [i, c] of [...text].entries())
    r = stroke(r, c, 100 + (i * ms) / Math.max(1, text.length - 1));
  return r;
}
test("first character starts timer; errors neither advance nor disappear", () => {
  let r = newRun("fj");
  assert.equal(elapsedAt(r, 10000), 0);
  r = stroke(r, "z", 10000);
  assert.equal(r.index, 0);
  r = stroke(r, "f", 11000);
  r = stroke(r, "j", 12000);
  assert.equal(r.status, "done");
  assert.equal(r.elapsed, 2000);
  assert.equal(r.errors, 1);
  assert.equal(r.attempts, 3);
  assert.ok(metrics(r, 99999).accuracy < 67);
  assert.equal(stroke(r, "j", 14000), r);
});
test("pause excludes time and input; resume continues the same letter", () => {
  let r = stroke(newRun("fj"), "f", 100);
  r = pause(r, 1100);
  assert.equal(elapsedAt(r, 99999), 1000);
  assert.equal(stroke(r, "j", 99999), r);
  r = resume(r, 10100);
  r = stroke(r, "j", 11100);
  assert.equal(r.elapsed, 2000);
  assert.equal(metrics(r, 0).wpm, 12);
});
test("backspace preserves error history", () => {
  let r = stroke(newRun("fj"), "x", 0);
  r = stroke(r, "f", 100);
  r = backspace(r);
  assert.equal(r.index, 0);
  assert.equal(r.errors, 1);
  assert.equal(r.attempts, 2);
  r = stroke(r, "f", 200);
  r = stroke(r, "j", 300);
  assert.equal(r.attempts, 4);
  assert.equal(metrics(r, 0).accuracy, 75);
});
test("Polish NFC, spaces, case and punctuation remain exact; paste is rejected", () => {
  let r = newRun("Ź ć.");
  for (const [i, c] of [..."Ź ć."].entries()) r = stroke(r, c, i * 1000);
  assert.equal(r.status, "done");
  assert.equal(stroke(newRun("Ć"), "C", 0).index, 0);
  assert.equal(stroke(newRun("ć"), "c\u0301", 0).status, "done");
  assert.equal(stroke(newRun("fj"), "fj", 0).attempts, 0);
});
test("speed reward and record require at least 95 percent accuracy", () => {
  let p = finish(freshProgress(), complete("fj", 1, 100), "fj", 6);
  assert.equal(p.records.fj.stars, 1);
  assert.equal(p.records.fj.bestWpm, 0);
  p = finish(p, complete("fj", 0, 10000), "fj", 6);
  assert.equal(p.records.fj.stars, 2);
  assert.ok(Math.abs(p.records.fj.bestWpm - 2.4) < 1e-9);
  assert.equal(finish(p, newRun("fj"), "fj", 6), p);
});
test("two accurate runs suggest progression and save a round trip", () => {
  let p = freshProgress();
  p = finish(p, complete(), "fj", 6);
  assert.equal(recommended(p, 0), 0);
  p = finish(p, complete(), "fj", 6);
  assert.equal(recommended(p, 0), 1);
  assert.equal(p.delivered, 2);
  assert.equal(recommended(p, 11), 11);
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
});
test("finger map covers all characters, accent keys and opposite Shift", () => {
  for (const l of LESSONS)
    for (const text of l.texts)
      for (const c of text)
        assert.ok("qwertyuiopasdfghjkl;zxcvbnm,./ ".includes(keyGuide(c).base));
  assert.equal(keyGuide("b").finger, "li");
  assert.equal(keyGuide("y").finger, "ri");
  assert.equal(keyGuide(";").finger, "rp");
  assert.equal(keyGuide("Ź").base, "x");
  assert.equal(keyGuide("Ź").alt, true);
  assert.equal(keyGuide("Ź").shiftSide, "right");
  assert.equal(keyGuide("J").shiftSide, "left");
  assert.equal(keyGuide(" ").finger, "thumb");
});
test("backups reject wrong versions and clamp imported values", () => {
  assert.throws(() => parseProgress('{"version":2}'));
  const p = parseProgress(
    '{"version":1,"lesson":999,"records":{"fj":{"runs":3,"stars":99,"bestWpm":-4,"lastAccuracy":999,"streak":999}}}',
  );
  assert.equal(p.lesson, 11);
  assert.equal(p.records.fj.stars, 3);
  assert.equal(p.records.fj.bestWpm, 0);
  assert.equal(p.records.fj.streak, 3);
  assert.equal(p.delivered, 3);
});
test("early lessons introduce only the keys learned so far", () => {
  let learned = " ";
  for (const [i, keys] of [
    "fj",
    "dk",
    "sl",
    "a;",
    "gh",
    "ru",
    "ei",
    "wo",
    "qtyp",
    "zxcvbnm",
  ].entries()) {
    learned += keys;
    for (const text of LESSONS[i].texts)
      for (const c of text)
        assert.ok(learned.includes(c), `${LESSONS[i].id}: ${c}`);
  }
});
