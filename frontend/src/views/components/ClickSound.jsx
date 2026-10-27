'use client';

import { useEffect } from 'react';

/**
 * ============================================================================
 * CLICK SOUND: SOFT iOS-STYLE TICK ON BUTTONS AND LINKS
 * ============================================================================
 * Synthesised with Web Audio (a 12 ms band-passed noise burst), so there is no
 * audio file to download. Plays only on buttons/links, never on text fields.
 * Visitors can switch it off from the footer; the choice is kept in localStorage.
 */

export const CLICK_SOUND_KEY = 'cg_click_sound';
const TARGETS = 'button, a[href], [role="button"], [role="tab"], summary, label[for]';

let ctx = null;
let noise = null;
let lastPlayed = 0;

export function isClickSoundOn() {
  try {
    return localStorage.getItem(CLICK_SOUND_KEY) !== 'off';
  } catch (e) {
    return true;
  }
}

export function setClickSound(on) {
  try {
    localStorage.setItem(CLICK_SOUND_KEY, on ? 'on' : 'off');
  } catch (e) {}
  window.dispatchEvent(new Event('cg_click_sound_changed'));
}

export function playTick() {
  const now = performance.now();
  if (now - lastPlayed < 45) return;
  lastPlayed = now;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!ctx) {
    ctx = new AudioCtx();
    const length = Math.floor(ctx.sampleRate * 0.012);
    noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
  }
  if (ctx.state === 'suspended') ctx.resume();

  const source = ctx.createBufferSource();
  source.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 3200;
  band.Q.value = 0.9;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  source.connect(band).connect(gain).connect(ctx.destination);
  source.start();
}

export default function ClickSound() {
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.button !== 0 || !isClickSoundOn()) return;
      const target = e.target instanceof Element ? e.target.closest(TARGETS) : null;
      if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
      playTick();
    };
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return null;
}
