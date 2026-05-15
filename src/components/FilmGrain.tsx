"use client";

import { useEffect, useRef } from "react";

export function FilmGrain() {
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const rafRef = useRef<number>(0);
  const seedRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      // Throttle to ~12 fps (every 80 ms) so the grain shifts slowly
      if (timestamp - lastTimeRef.current >= 80) {
        seedRef.current = (seedRef.current + 1) % 1000;
        turbRef.current?.setAttribute("seed", String(seedRef.current));
        lastTimeRef.current = timestamp;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-[0.08]"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="flick-grain-filter">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              seed="0"
            />
            {/* Strip colour so the noise is pure luminance grain */}
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#flick-grain-filter)" />
      </svg>
    </div>
  );
}
