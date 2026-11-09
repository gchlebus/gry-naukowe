"use client";
import { useEffect, useRef, useState } from "react";

export function chime(final = false) {
  try {
    const ctx = new AudioContext();
    void ctx.resume();
    const notes = final
      ? [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
      : [523.25, 659.25, 783.99];
    notes.forEach((f, i) => {
      const t = ctx.currentTime + i * 0.16,
        o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.65);
    });
    setTimeout(() => void ctx.close(), 2200);
  } catch {
    /* Sound is optional. */
  }
}
export function Music({
  volume,
  setVolume,
}: {
  volume: number;
  setVolume: (n: number) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null),
    [playing, setPlaying] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        audio.current?.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  async function toggle() {
    const a = audio.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
        setError("");
      } catch {
        setError("Nie udało się włączyć muzyki. Spróbuj ponownie.");
      }
    }
  }
  return (
    <div className="music-box">
      <audio
        ref={audio}
        src="/audio/ogrod-malych-odkryc.mp3"
        loop
        preload="none"
        onError={() => {
          setError("Muzyka jest chwilowo niedostępna.");
          setPlaying(false);
        }}
      />
      <button
        className={"music-toggle " + (playing ? "is-playing" : "")}
        onClick={toggle}
        aria-pressed={playing}
      >
        <span aria-hidden>♫</span> {playing ? "Wyłącz muzykę" : "Włącz muzykę"}
      </button>
      <label className="volume">
        Głośność
        <input
          aria-label="Głośność muzyki"
          type="range"
          min="0"
          max="60"
          value={Math.round(volume * 100)}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
        />
      </label>
      {error && <small role="status">{error}</small>}
    </div>
  );
}
