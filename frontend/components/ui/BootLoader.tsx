'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getContact, getTheme } from '@/lib/api';
import { useContactStore, useThemeStore } from '@/lib/store';

function clampMs(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/** Boot splash accent — fixed orange (not theme secondary). */
const ORANGE = {
  core: '#F97316',
  bright: '#FB923C',
  deep: '#C2410C',
  glow: 'rgba(249, 115, 22, 0.85)',
  glowSoft: 'rgba(249, 115, 22, 0.35)',
  wash12: 'rgba(249, 115, 22, 0.12)',
} as const;

function AmbientLayer() {
  return (
    <>
      <div
        className="boot-ambient-conic pointer-events-none absolute inset-0 z-0 scale-[2]"
        aria-hidden
      />
      <div
        className="boot-orb boot-orb-a pointer-events-none absolute z-[1] h-[380px] w-[380px] rounded-full"
        style={{
          background: `color-mix(in srgb, ${ORANGE.core} 14%, transparent)`,
          filter: 'blur(64px)',
          top: '-90px',
          left: '-90px',
        }}
        aria-hidden
      />
      <div
        className="boot-orb boot-orb-b pointer-events-none absolute z-[1] h-[280px] w-[280px] rounded-full"
        style={{
          background: `color-mix(in srgb, ${ORANGE.core} 8%, transparent)`,
          filter: 'blur(56px)',
          bottom: '-70px',
          right: '-70px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `radial-gradient(ellipse 82% 62% at 50% 40%, color-mix(in srgb, ${ORANGE.core} 12%, transparent), transparent 60%), radial-gradient(ellipse 100% 78% at 50% 100%, color-mix(in srgb, ${ORANGE.core} 6%, transparent), transparent 52%)`,
        }}
        aria-hidden
      />
      {/* Same film grain as Hero (`globals.css` .grain-overlay) — static, no extra flicker */}
      <div className="pointer-events-none absolute inset-0 z-[2] grain-overlay" aria-hidden />
    </>
  );
}

function CornerBracketsStatic() {
  const L = 24;
  const stroke = 'absolute bg-orange-500';
  return (
    <>
      <div className="absolute left-5 top-5 z-[11]">
        <div className={`${stroke} left-0 top-0 h-[2px]`} style={{ width: L }} />
        <div className={`${stroke} left-0 top-0 w-[2px]`} style={{ height: L }} />
      </div>
      <div className="absolute right-5 top-5 z-[11]">
        <div className={`${stroke} right-0 top-0 h-[2px]`} style={{ width: L }} />
        <div className={`${stroke} right-0 top-0 w-[2px]`} style={{ height: L }} />
      </div>
      <div className="absolute bottom-5 left-5 z-[11]">
        <div className={`${stroke} bottom-0 left-0 h-[2px]`} style={{ width: L }} />
        <div className={`${stroke} bottom-0 left-0 w-[2px]`} style={{ height: L }} />
      </div>
      <div className="absolute bottom-5 right-5 z-[11]">
        <div className={`${stroke} bottom-0 right-0 h-[2px]`} style={{ width: L }} />
        <div className={`${stroke} bottom-0 right-0 w-[2px]`} style={{ height: L }} />
      </div>
    </>
  );
}

function ZMark() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="boot-z-glow pointer-events-none absolute h-[300px] w-[300px] rounded-full"
        aria-hidden
      />
      <div
        className="relative z-[2] font-display leading-none text-accent"
        style={{
          fontSize: 'clamp(140px, 22vw, 200px)',
          letterSpacing: '-6px',
          textShadow: `0 0 48px ${ORANGE.wash12}, 0 0 80px rgba(249, 115, 22, 0.15)`,
        }}
      >
        Z
        <span
          className="boot-glitch-a pointer-events-none absolute inset-0 z-[3] font-display"
          style={{
            fontSize: 'clamp(140px, 22vw, 200px)',
            letterSpacing: '-6px',
            color: ORANGE.bright,
            clipPath: 'polygon(0 14%, 100% 14%, 100% 32%, 0 32%)',
          }}
        >
          Z
        </span>
        <span
          className="boot-glitch-b pointer-events-none absolute inset-0 z-[3] font-display"
          style={{
            fontSize: 'clamp(140px, 22vw, 200px)',
            letterSpacing: '-6px',
            color: ORANGE.deep,
            clipPath: 'polygon(0 62%, 100% 62%, 100% 80%, 0 80%)',
          }}
        >
          Z
        </span>
      </div>
    </div>
  );
}

function BrandLetters({ brand }: { brand: string }) {
  return (
    <div className="-mt-2 flex items-center gap-2">
      {brand.split('').map((letter, i) => (
        <span key={`${letter}-${i}`} className="font-display text-[18px] uppercase tracking-[4px] text-white/50">
          {letter}
        </span>
      ))}
    </div>
  );
}

function Rule() {
  return (
    <div className="my-4 flex w-[200px] items-center gap-2">
      <div className="boot-rule-line h-px flex-1 origin-center bg-white/10" />
      <div
        className="rule-dot h-[3px] w-[3px] flex-shrink-0 rounded-full bg-orange-500"
        style={{
          boxShadow: `0 0 10px ${ORANGE.glow}`,
        }}
      />
      <div className="boot-rule-line h-px flex-1 origin-center bg-white/10" />
    </div>
  );
}

function ProgressBarsCss() {
  return (
    <div className="flex w-[180px] flex-col gap-[6px]">
      <div className="relative h-[1.5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="boot-bar-sweep absolute left-0 top-0 h-full w-[28%] rounded-full"
          style={{
            background: ORANGE.core,
            boxShadow: `0 0 14px ${ORANGE.glow}, 0 0 28px ${ORANGE.glowSoft}`,
          }}
        />
      </div>
      <div className="relative h-[1.5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="boot-bar-sweep boot-bar-sweep-delay absolute left-0 top-0 h-full w-[18%] rounded-full bg-white/35"
          style={{ animationDelay: '0.75s' }}
        />
      </div>
    </div>
  );
}

function StatusText() {
  const [text, setText] = useState('');
  const full = 'Loading the drop...';

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = window.setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i += 1;
        setText(full.slice(0, i));
        if (i >= full.length && intervalId != null) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      }, 32);
    }, 80);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId != null) clearInterval(intervalId);
    };
  }, []);

  return (
    <p className="mt-3 font-mono text-[8px] uppercase tracking-[4px] text-white/25">
      {text}
      <span className="boot-cursor motion-safe:inline motion-reduce:hidden">|</span>
    </p>
  );
}

function TickerCss() {
  const items = ['ZENTH', '·', 'WEAR THE CULTURE', '·', 'LIMITED STOCK', '·', 'STREET APPROVED', '·'];
  const doubled = [...items, ...items];

  return (
    <div
      className="boot-ticker-strip absolute bottom-0 left-0 right-0 z-[10] overflow-hidden border-t py-2"
      style={{
        borderColor: `color-mix(in srgb, ${ORANGE.core} 22%, transparent)`,
        background: `color-mix(in srgb, ${ORANGE.core} 7%, transparent)`,
      }}
    >
      <div className="boot-ticker-track flex w-max whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex-shrink-0 px-6 font-mono text-[7px] uppercase tracking-[4px]"
            style={{ color: `color-mix(in srgb, ${ORANGE.bright} 58%, transparent)` }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BootLoader({ children }: { children: React.ReactNode }) {
  const themeHydrated = useThemeStore((s) => s.hydrated);
  const setTheme = useThemeStore((s) => s.setTheme);
  const applyCssVariables = useThemeStore((s) => s.applyCssVariables);
  const setThemeHydrated = useThemeStore((s) => s.setHydrated);
  const logoUrl = useThemeStore((s) => s.logoUrl);

  const contactHydrated = useContactStore((s) => s.hydrated);
  const setContact = useContactStore((s) => s.setContact);
  const setContactHydrated = useContactStore((s) => s.setHydrated);
  const contact = useContactStore((s) => s.contact);

  const [ready, setReady] = useState(false);
  const minShowMs = useMemo(() => clampMs(Number(process.env.NEXT_PUBLIC_BOOT_MIN_MS || 720), 0, 5000), []);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    (async () => {
      try {
        const [t, c] = await Promise.allSettled([getTheme(), getContact()]);
        if (cancelled) return;

        if (t.status === 'fulfilled') {
          setTheme({
            primaryColor: t.value.primaryColor,
            secondaryColor: t.value.secondaryColor,
            logoUrl: t.value.logoUrl || '',
          });
        }
        applyCssVariables();
        setThemeHydrated(true);

        if (c.status === 'fulfilled') setContact(c.value);
        else setContactHydrated(true);
      } catch {
        if (cancelled) return;
        applyCssVariables();
        setThemeHydrated(true);
        setContactHydrated(true);
      } finally {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const wait = Math.max(0, minShowMs - elapsed);
        window.setTimeout(() => {
          if (!cancelled) setReady(true);
        }, wait);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyCssVariables, minShowMs, setContact, setContactHydrated, setTheme, setThemeHydrated]);

  const brand = contact?.brandName?.trim() || 'ZENTH';
  const shouldShow = !ready || !themeHydrated || !contactHydrated;

  return (
    <>
      {children}

      <style>{`
        /* Synced cadence: 24s / 8s / ~1.5s bar / 24s ticker — one coordinated pulse */
        @keyframes bootBgRotate {
          from { transform: rotate(0deg) scale(2); }
          to   { transform: rotate(360deg) scale(2); }
        }
        @keyframes bootOrbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(18px, -26px) scale(1.04); }
          66%      { transform: translate(-14px, 18px) scale(0.97); }
        }
        @keyframes bootUiReveal {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(10px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }
        @keyframes bootZGlow {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { opacity: 0.95; transform: scale(1.12); }
        }
        @keyframes bootGlitchA {
          0%, 91%, 100% { transform: translate(0,0); opacity: 0; }
          92% { transform: translate(-2px,0); opacity: 0.75; }
          93% { transform: translate(1px,0); opacity: 0.55; }
          94% { transform: translate(0,0); opacity: 0; }
        }
        @keyframes bootGlitchB {
          0%, 93%, 100% { transform: translate(0,0); opacity: 0; }
          94% { transform: translate(2px,0); opacity: 0.5; }
          95% { transform: translate(-1px,0); opacity: 0.45; }
          96% { transform: translate(0,0); opacity: 0; }
        }
        @keyframes bootRuleGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes bootBarSweep {
          from { transform: translateX(-130%); }
          to { transform: translateX(480%); }
        }
        @keyframes bootCursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes bootTickerX {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .boot-ambient-conic {
          background: conic-gradient(
            from 0deg at 50% 50%,
            #0a0a0a 0deg,
            color-mix(in srgb, ${ORANGE.core} 4%, #0a0a0a) 72deg,
            #0a0a0a 144deg,
            color-mix(in srgb, ${ORANGE.core} 3%, #0a0a0a) 216deg,
            #0a0a0a 288deg,
            color-mix(in srgb, ${ORANGE.core} 4%, #0a0a0a) 360deg
          );
          animation: bootBgRotate 24s linear infinite;
        }
        .boot-orb-a {
          animation: bootOrbFloat 8s ease-in-out infinite;
        }
        .boot-orb-b {
          animation: bootOrbFloat 8s ease-in-out infinite;
          animation-delay: -4s;
        }
        .boot-loader-ui {
          opacity: 0;
          animation: bootUiReveal 0.48s cubic-bezier(0.22, 1, 0.32, 1) 0.02s forwards;
          will-change: opacity, transform, filter;
        }
        .boot-z-glow {
          background: radial-gradient(
            circle,
            color-mix(in srgb, ${ORANGE.core} 14%, transparent) 0%,
            transparent 68%
          );
          animation: bootZGlow 3s ease-in-out infinite;
        }
        .boot-glitch-a {
          animation: bootGlitchA 3.4s linear infinite;
        }
        .boot-glitch-b {
          animation: bootGlitchB 3.4s linear infinite;
        }
        .boot-rule-line {
          animation: bootRuleGrow 0.4s ease-out 0.1s both;
        }
        .boot-bar-sweep {
          animation: bootBarSweep 1.5s ease-in-out infinite;
        }
        .boot-bar-sweep-delay {
          animation: bootBarSweep 1.5s ease-in-out infinite;
        }
        .boot-cursor {
          animation: bootCursorBlink 0.65s steps(1, end) infinite;
        }
        .boot-ticker-track {
          animation: bootTickerX 24s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .boot-ambient-conic,
          .boot-orb-a,
          .boot-orb-b,
          .boot-z-glow,
          .boot-glitch-a,
          .boot-glitch-b,
          .boot-rule-line,
          .boot-bar-sweep,
          .boot-bar-sweep-delay,
          .boot-cursor,
          .boot-ticker-track {
            animation: none !important;
          }
          .boot-loader-ui {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            animation: none !important;
          }
          .boot-glitch-a,
          .boot-glitch-b {
            opacity: 0 !important;
          }
          .boot-bar-sweep,
          .boot-bar-sweep-delay {
            transform: translateX(35%) !important;
          }
          .boot-ticker-track {
            transform: none !important;
          }
        }
      `}</style>

      <AnimatePresence>
        {shouldShow && (
          <motion.div
            className="boot-loader-root fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-primary"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: 'blur(8px)',
              transition: { duration: 0.42, ease: 'easeOut' },
            }}
          >
            <AmbientLayer />

            <div className="boot-loader-ui pointer-events-none absolute inset-0 z-[10]">
              <div className="pointer-events-auto absolute inset-0">
                <CornerBracketsStatic />

                <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4">
                  <span className="font-mono text-[7px] uppercase tracking-[3px] text-white/15">ZENTH / 2026</span>
                  <span className="font-mono text-[7px] uppercase tracking-[3px] text-white/15">DROP 001 · @ZENTHWORLD</span>
                </div>

                <span className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[7px] uppercase tracking-[3px] text-white/10">
                  Est. 2024 · India
                </span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[7px] uppercase tracking-[3px] text-white/10">
                  Streetwear · Redefined
                </span>

                <div className="relative flex h-full flex-col items-center justify-center text-center">
                  {logoUrl ? (
                    <div className="relative mb-2 h-20 w-56">
                      <Image src={logoUrl} alt={brand} fill className="object-contain" unoptimized priority />
                    </div>
                  ) : (
                    <ZMark />
                  )}
                  <BrandLetters brand={brand} />
                  <Rule />
                  <ProgressBarsCss />
                  <StatusText />
                </div>

                <TickerCss />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
