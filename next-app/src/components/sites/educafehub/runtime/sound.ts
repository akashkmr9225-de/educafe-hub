/**
 * Minimal sound helper — plays UI sounds at low volume on user gesture only.
 * No autoplay, no dependencies, fails silently if audio unavailable.
 */

const SOUND_VOLUME = 0.12;

const soundCache: Map<string, HTMLAudioElement> = new Map();

function getAudio(name: string): HTMLAudioElement | null {
  if (soundCache.has(name)) return soundCache.get(name)!;
  try {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.preload = "auto";
    audio.volume = SOUND_VOLUME;
    soundCache.set(name, audio);
    return audio;
  } catch {
    return null;
  }
}

export function playSound(name: "select" | "success" | "error"): void {
  if (typeof window === "undefined") return;
  const enabled = localStorage.getItem("educafehub_sound") !== "off";
  if (!enabled) return;
  const audio = getAudio(name);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Silent fail — user gesture required or audio unavailable
  });
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("educafehub_sound") !== "off";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("educafehub_sound", enabled ? "on" : "off");
}