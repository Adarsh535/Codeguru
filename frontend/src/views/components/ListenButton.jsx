'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Headphones, Pause, Play, Square } from 'lucide-react';

/**
 * ============================================================================
 * LISTEN BUTTON: READS THE PAGE ALOUD (HINDI OR ENGLISH)
 * ============================================================================
 * Uses the browser's own speech engine (free, nothing to download).
 * Picks the most natural voice available: Edge "Online (Natural)" voices first,
 * then Google voices, then any voice for the page language.
 * Text is spoken in short sentence chunks because some browsers stop long utterances.
 */
const READABLE = 'h1, h2, h3, p, li, dt, dd, summary';
const SKIP = 'nav, footer, header, button, [aria-hidden="true"], script, style, .cg-listen';

function pageLanguage() {
  const main = document.querySelector('main');
  const marked = main && main.querySelector('[lang]');
  return marked && marked.getAttribute('lang') === 'hi' ? 'hi' : 'en';
}

function collectText() {
  const main = document.querySelector('main') || document.body;
  const seen = new Set();
  const parts = [];
  main.querySelectorAll(READABLE).forEach((el) => {
    if (el.closest(SKIP) || el.offsetParent === null) return;
    // Skip containers whose readable children will be read on their own
    if (el.querySelector(READABLE)) return;
    const text = el.innerText.replace(/\s+/g, ' ').trim();
    if (text.length < 3 || seen.has(text)) return;
    seen.add(text);
    parts.push(/[.!?।]$/.test(text) ? text : `${text}.`);
  });
  return parts.join(' ');
}

function chunk(text) {
  const sentences = text.match(/[^.!?।]+[.!?।]+/g) || [text];
  const chunks = [];
  let current = '';
  sentences.forEach((s) => {
    if ((current + s).length > 220 && current) {
      chunks.push(current.trim());
      current = '';
    }
    current += s;
  });
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function bestVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  const wanted = lang === 'hi' ? ['hi-IN', 'hi'] : ['en-IN', 'en-GB', 'en-US', 'en'];
  const score = (v) => {
    const langIndex = wanted.findIndex((w) => v.lang.replace('_', '-').startsWith(w));
    if (langIndex === -1) return -1;
    let s = 100 - langIndex * 10;
    if (/natural|online/i.test(v.name)) s += 50;
    if (/google/i.test(v.name)) s += 25;
    if (/female|swara|neerja|lekha|heera/i.test(v.name)) s += 5;
    return s;
  };
  return voices
    .map((v) => ({ v, s: score(v) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)[0]?.v || null;
}

export default function ListenButton() {
  const pathname = usePathname();
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState('idle'); // idle | playing | paused
  const [lang, setLang] = useState('en');
  const queue = useRef([]);

  useEffect(() => {
    setSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    // Voices load asynchronously in Chrome; touching the list triggers loading
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    setLang(pageLanguage());
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    queue.current = [];
    setState('idle');
  }, [pathname]);

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const speakNext = (voice, pageLang) => {
    const next = queue.current.shift();
    if (!next) {
      setState('idle');
      return;
    }
    const u = new SpeechSynthesisUtterance(next);
    u.lang = pageLang === 'hi' ? 'hi-IN' : 'en-IN';
    if (voice) u.voice = voice;
    u.rate = pageLang === 'hi' ? 0.95 : 1;
    u.pitch = 1;
    u.onend = () => speakNext(voice, pageLang);
    u.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') speakNext(voice, pageLang);
    };
    window.speechSynthesis.speak(u);
  };

  const start = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const pageLang = pageLanguage();
    setLang(pageLang);
    queue.current = chunk(collectText());
    setState('playing');
    speakNext(bestVoice(pageLang), pageLang);
  };

  const togglePause = () => {
    const synth = window.speechSynthesis;
    if (state === 'playing') {
      synth.pause();
      setState('paused');
    } else {
      synth.resume();
      setState('playing');
    }
  };

  const stop = () => {
    queue.current = [];
    window.speechSynthesis.cancel();
    setState('idle');
  };

  if (!supported) return null;

  const hi = lang === 'hi';
  return (
    <div className="cg-listen fixed right-4 bottom-[84px] sm:bottom-6 sm:right-6 z-40 flex items-center gap-1 rounded-full bg-slate-900/95 text-white shadow-2xl ring-1 ring-white/10 p-1 backdrop-blur-sm">
      {state === 'idle' ? (
        <button
          type="button"
          suppressHydrationWarning
          onClick={start}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
          aria-label={hi ? 'यह पेज सुनें' : 'Listen to this page'}
        >
          <Headphones className="w-4 h-4 text-orange-400" aria-hidden="true" />
          <span>{hi ? 'सुनिए' : 'Listen'}</span>
        </button>
      ) : (
        <>
          <span className="flex items-end gap-0.5 h-4 pl-3 pr-1" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-orange-400"
                style={{
                  height: state === 'playing' ? undefined : '4px',
                  animation: state === 'playing' ? `cgListenBar 0.9s ${i * 0.15}s ease-in-out infinite` : 'none'
                }}
              />
            ))}
          </span>
          <button
            type="button"
            suppressHydrationWarning
            onClick={togglePause}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label={state === 'playing' ? (hi ? 'रोकें' : 'Pause') : hi ? 'फिर से चलाएं' : 'Resume'}
          >
            {state === 'playing' ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            suppressHydrationWarning
            onClick={stop}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label={hi ? 'बंद करें' : 'Stop'}
          >
            <Square className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
