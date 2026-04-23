'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { updateTheme } from '@/lib/api';
import { useThemeStore } from '@/lib/store';

export function ThemePicker() {
  const primary = useThemeStore((s) => s.primaryColor);
  const secondary = useThemeStore((s) => s.secondaryColor);
  const setTheme = useThemeStore((s) => s.setTheme);
  const applyCssVariables = useThemeStore((s) => s.applyCssVariables);

  const [p, setP] = useState(primary);
  const [s, setS] = useState(secondary);

  useEffect(() => {
    setP(primary);
    setS(secondary);
  }, [primary, secondary]);

  const save = async () => {
    try {
      const res = await updateTheme({ primaryColor: p, secondaryColor: s });
      setTheme({ primaryColor: res.primaryColor, secondaryColor: res.secondaryColor });
      applyCssVariables();
      toast.success('THEME SAVED');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'SAVE FAILED');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-8">
        <label className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Primary
          </span>
          <input type="color" value={p} onChange={(e) => setP(e.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Secondary
          </span>
          <input type="color" value={s} onChange={(e) => setS(e.target.value)} />
        </label>
      </div>

      <div className="flex items-center gap-6">
        <div
          className="h-24 flex-1 rounded-lg border border-white/10"
          style={{ background: p }}
        />
        <div
          className="h-24 flex-1 rounded-lg border border-white/10"
          style={{ background: s }}
        />
      </div>

      <Button type="button" onClick={save}>
        SAVE THEME
      </Button>
    </div>
  );
}
