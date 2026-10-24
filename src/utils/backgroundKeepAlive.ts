// Keeps the browser tab "active" while a session plays, so switching tabs
// doesn't suspend audio. Must be started synchronously inside a user gesture.
let audioEl: HTMLAudioElement | null = null;
let users = 0;

const buildSilentWav = (): string => {
  const sampleRate = 8000;
  const samples = sampleRate; // 1 second
  const buffer = new ArrayBuffer(44 + samples * 2);
  const v = new DataView(buffer);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, samples * 2, true);
  // near-silent dither so browsers treat the tab as playing audio
  for (let i = 0; i < samples; i++) v.setInt16(44 + i * 2, i % 2 ? 1 : -1, true);
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
};

export const startKeepAlive = () => {
  users++;
  try {
    if (!audioEl) {
      audioEl = new Audio(buildSilentWav());
      audioEl.loop = true;
      audioEl.volume = 0.01;
    }
    audioEl.play().catch(() => {});
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: 'QuantumSync - Sesión activa' });
      navigator.mediaSession.playbackState = 'playing';
    }
  } catch (e) { console.warn('keepAlive start failed', e); }
};

export const stopKeepAlive = () => {
  users = Math.max(0, users - 1);
  if (users === 0 && audioEl) {
    audioEl.pause();
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
  }
};
