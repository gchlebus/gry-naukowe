import { test } from "node:test";
import assert from "node:assert/strict";
import { TRACKS } from "../dist/js/music.mjs";
import { freshState, parseState } from "../dist/js/state.mjs";
test("five distinct Suno tracks and old backups keep their notes and preferences", () => {
  assert.equal(TRACKS.length, 5);
  assert.equal(new Set(TRACKS.map((t) => t.source)).size, 5);
  const old = freshState();
  delete old.musicTrack;
  old.notes["s-code"] = "Moja hipoteza";
  const restored = parseState(JSON.stringify(old));
  assert.equal(restored.musicTrack, TRACKS[0].id);
  assert.equal(restored.notes["s-code"], old.notes["s-code"]);
  assert.equal(
    parseState(JSON.stringify({ ...old, musicTrack: "nieznany" })).musicTrack,
    TRACKS[0].id,
  );
  assert.equal(
    parseState(JSON.stringify({ ...old, musicTrack: TRACKS[4].id })).musicTrack,
    TRACKS[4].id,
  );
});
