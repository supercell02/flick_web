"use client";

// Client component required for useId (unique pattern IDs per instance
// prevent conflicting SVG defs when rendered multiple times on the same page).
import { useId } from "react";

export function FilmStripDivider() {
  const uid = useId().replace(/:/g, "");
  const patternId = `film-sprocket-${uid}`;

  return (
    <div className="w-full leading-none" aria-hidden="true" role="presentation">
      <svg
        width="100%"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        // preserveAspectRatio="none" lets the strip stretch full-width
        preserveAspectRatio="none"
      >
        <defs>
          {/*
            Pattern unit = 24 px wide × 32 px tall (full strip height).
            Each unit contains two sprocket holes — one top, one bottom.
            Holes are zinc-700 (#3f3f46), lighter than the zinc-900 background,
            mimicking the bright edge of a punched perforation.
          */}
          <pattern
            id={patternId}
            width="24"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            {/* Top sprocket hole */}
            <rect x="5" y="3" width="14" height="9" rx="2" fill="#3f3f46" />
            {/* Bottom sprocket hole */}
            <rect x="5" y="20" width="14" height="9" rx="2" fill="#3f3f46" />
          </pattern>
        </defs>

        {/* Outer dark strip — zinc-900 */}
        <rect width="100%" height="32" fill="#18181b" />

        {/* Centre film-gate band — zinc-800, slightly lighter */}
        <rect y="14" width="100%" height="4" fill="#27272a" />

        {/* Sprocket holes overlay */}
        <rect width="100%" height="32" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
