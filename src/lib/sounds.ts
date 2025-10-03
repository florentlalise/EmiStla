export const SOUNDS = {
  startup: "/sounds/starting_sound.mp3",
  click1: "/sounds/multimedia_click_1.mp3",
  click2: "/sounds/multimedia_click_2.mp3",
  click3: "/sounds/multimedia_click_3.mp3",
  click4: "/sounds/multimedia_click_4.mp3",
  organic1: "/sounds/organic_click_1.mp3",
  organic2: "/sounds/organic_click_2.mp3",
  organic3: "/sounds/organic_click_3.mp3",
} as const;

export type SoundKey = keyof typeof SOUNDS;

export function playSound(
  soundKey: SoundKey,
  volume: number = 1.0
): Promise<void> {
  const soundPath = SOUNDS[soundKey];

  if (!soundPath) {
    console.warn(`Sound "${soundKey}" not found in registry`);
    return Promise.resolve();
  }

  const audio = new Audio(soundPath);
  audio.volume = Math.max(0, Math.min(1, volume)); // Volume between 0 and 1

  return audio.play().catch((error) => {
    console.warn(`Could not play sound "${soundKey}":`, error);
    return undefined;
  });
}

export function preloadSound(soundKey: SoundKey): void {
  const soundPath = SOUNDS[soundKey];
  if (soundPath) {
    const audio = new Audio(soundPath);
    audio.load();
  }
}

export function preloadAllSounds(): void {
  Object.keys(SOUNDS).forEach((key) => {
    preloadSound(key as SoundKey);
  });
}
