'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isClickSoundOn, setClickSound } from './ClickSound';

/** Footer switch for the click sound. */
export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    const sync = () => setOn(isClickSoundOn());
    sync();
    window.addEventListener('cg_click_sound_changed', sync);
    return () => window.removeEventListener('cg_click_sound_changed', sync);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setClickSound(!on)}
      aria-pressed={on}
      className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
    >
      {on ? <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> : <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />}
      Click sound {on ? 'on' : 'off'}
    </button>
  );
}
