export function Marquee() {
  const text =
    'DROP 001 · LIMITED STOCK · ZENTH · WEAR THE CULTURE · NEW ARRIVALS · STREETWEAR REDEFINED · ';
  const repeated = Array(4).fill(text).join('');

  return (
    <div className="relative overflow-hidden border-y border-primary py-3" style={{ backgroundColor: 'var(--color-secondary)' }}>
      <div className="marquee-track flex w-max whitespace-nowrap font-mono text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>
        <span className="pr-16">{repeated}</span>
        <span className="pr-16">{repeated}</span>
      </div>
    </div>
  );
}
