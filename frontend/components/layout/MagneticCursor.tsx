'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Desktop-only subtle cursor follower */
export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const down = () => setHover(true);
    const up = () => setHover(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [enabled, x, y]);

  useEffect(() => {
    if (!enabled) return;
    const interactive = 'a[href], button, [data-magnetic], input, textarea, select';
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(interactive)) setHover(true);
    };
    const onOut = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest(interactive)) setHover(false);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ left: sx, top: sy }}
    >
      <div
        className={`rounded-full bg-secondary transition-[width,height] duration-200 ${
          hover ? 'h-10 w-10 opacity-90' : 'h-3 w-3 opacity-70'
        }`}
      />
    </motion.div>
  );
}
