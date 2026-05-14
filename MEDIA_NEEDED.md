# Flick — Media Assets Needed

> This file lists every visual asset the website needs to look polished and production-ready.
> Priority is marked as 🔴 Critical · 🟡 Important · 🟢 Nice-to-have.

---

## 1. Brand / Logo

| Asset | Size / Format | Where Used | Priority |
|---|---|---|---|
| **Wordmark logo** (SVG) | Vector SVG | Navbar, emails, print | 🔴 |
| **Icon / App icon** (square) | 512×512 PNG + SVG | Favicon, PWA, app stores | 🔴 |
| **Favicon** | 32×32 + 16×16 ICO / PNG | Browser tab | 🔴 |
| **Logo on dark background** (white version) | SVG | Footer CTA section (black bg) | 🟡 |
| **Logo on light background** (black version) | SVG | Navbar, cards | 🟡 |

**Design direction:** The logo should feel like a camera shutter or a polaroid snap — clean, minimal, with a single-stroke icon. Think of a stylised "F" or a camera aperture. Works in black & white only (no colour — matches design system).

---

## 2. Open Graph / Social Sharing

| Asset | Size | Where Used | Priority |
|---|---|---|---|
| **OG image** | 1200×630 PNG | Link previews on WhatsApp, Twitter, iMessage | 🔴 |
| **Twitter card image** | 1200×600 PNG | Twitter link unfurl | 🟡 |
| **WhatsApp thumbnail** | 400×400 PNG | WhatsApp link preview | 🟡 |

**What the OG image should show:** "Flick" wordmark, tagline "Flick it!!", a collage of 4–6 sample event photos arranged in a masonry grid, dark or white background consistent with brand.

---

## 3. Landing Page

### 3a. Hero Section
| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Phone mockup** (real device frame) | 400×800px PNG / SVG | Replace the CSS-drawn rectangle with a real iPhone/Android frame showing the gallery UI | 🟡 |
| **Hero background texture** (optional) | Full-width | Subtle paper grain or noise texture for the hero bg | 🟢 |
| **Sample gallery screenshots** | 390×844 (iPhone 14) | Real screenshots of the Flick gallery, shown inside the phone frame | 🟡 |

### 3b. "How It Works" Steps
| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Step 01 illustration** — Create a gallery | 400×300px | Someone on their phone creating an event, minimal line art | 🟢 |
| **Step 02 illustration** — Share QR code | 400×300px | QR code being shown on a big screen / projector at an event | 🟢 |
| **Step 03 illustration** — Guests upload | 400×300px | Multiple phones uploading photos, crowd scene | 🟢 |

### 3c. Features Section
| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Feature icons** (4 total) | 48×48px SVG | Already using lucide-react icons — upgrade to custom illustrated icons for: Zap, Upload, Lock, Share2 | 🟢 |

### 3d. Footer CTA
| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Background pattern / texture** | Full-width | Works on black background — could be a subtle dot grid or noise | 🟢 |

---

## 4. Event Gallery Page (`/e/[slug]`)

| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Cover image placeholder** | 1200×300px (4:1 ratio) | Shown when a host hasn't set a cover — currently shows nothing; a branded placeholder would look better | 🟡 |
| **Empty gallery illustration** | 300×200px SVG | Shown when no photos uploaded yet — replace the plain text with a friendly illustration (camera, polaroid, empty frame) | 🟡 |
| **Gallery unrevealed illustration** | 300×200px SVG | Shown when gallery is locked before reveal time | 🟡 |

---

## 5. Upload Page (`/e/[slug]/upload`)

| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Upload zone illustration** | 200×150px SVG | Shown inside the drag-and-drop zone on desktop — a camera or cloud-upload doodle | 🟢 |
| **Success animation** | Lottie / GIF | Plays after a successful upload — confetti or a polaroid popping out | 🟢 |

---

## 6. Dashboard

| Asset | Size | Notes | Priority |
|---|---|---|---|
| **Empty dashboard illustration** | 400×300px SVG | Shown when the host has no events yet — a blank photo frame or camera | 🟡 |
| **Event card default cover** | 800×450px PNG | Default cover image for events with no cover set | 🟡 |

---

## 7. PWA / Mobile App Assets

| Asset | Size | Format | Priority |
|---|---|---|---|
| **App icon** | 192×192 PNG | `manifest.json` icon for Android home screen | 🟡 |
| **App icon** | 512×512 PNG | `manifest.json` maskable icon | 🟡 |
| **Apple touch icon** | 180×180 PNG | iOS "Add to Home Screen" | 🟡 |
| **Splash screen** | 1125×2436 PNG | iOS splash on launch | 🟢 |

---

## 8. Sample / Demo Content

For the landing page and marketing, you'll need realistic sample photos that look like event photos:

| Asset | Count | Notes | Priority |
|---|---|---|---|
| **Indian wedding photos** | 8–12 | Candid, vibrant — used in landing page mockup and OG image | 🟡 |
| **College fest / birthday party photos** | 6–8 | Fun, crowded shots | 🟢 |
| **Corporate event photos** | 4–6 | Clean, professional | 🟢 |

> **Sources:** Use royalty-free stock from [Unsplash](https://unsplash.com), [Pexels](https://pexels.com), or commission a photographer. Avoid AI-generated faces.

---

## 9. File Placement Guide

Once assets are ready, put them here:

```
public/
  favicon.ico
  favicon-32x32.png
  favicon-16x16.png
  apple-touch-icon.png
  icon-192.png
  icon-512.png
  og-image.png
  logo.svg
  logo-white.svg
  images/
    hero-phone-mockup.png
    placeholder-cover.png
    empty-gallery.svg
    empty-dashboard.svg
    upload-illustration.svg
```

---

## 10. Quick Wins (Do These First)

1. **Favicon + app icon** — Without this the browser tab shows a blank page icon. Takes 30 min with [favicon.io](https://favicon.io) or [RealFaviconGenerator](https://realfavicongenerator.net).
2. **OG image** — Every WhatsApp share of your event link currently shows a blank preview. A good OG image dramatically increases click-through.
3. **Empty gallery illustration** — The "No photos yet" state is just plain text right now. A small SVG illustration makes it feel polished.
4. **Cover image placeholder** — Events without a cover look bare at the top of the guest page.

---

## Tools Recommended

| Tool | Use |
|---|---|
| [Figma](https://figma.com) | Design all brand assets, illustrations, OG image |
| [favicon.io](https://favicon.io) | Generate favicon pack from a logo or emoji |
| [RealFaviconGenerator](https://realfavicongenerator.net) | Full favicon + manifest generator |
| [Squoosh](https://squoosh.app) | Compress PNG/WebP before adding to `public/` |
| [SVGOMG](https://jakearchibald.github.io/svgomg/) | Minify SVG files |
| [Lottie Files](https://lottiefiles.com) | Free Lottie animations (upload success, confetti) |
| [unDraw](https://undraw.co) | Free customisable SVG illustrations |
| [Storyset](https://storyset.com) | Animated / static illustrations for empty states |
