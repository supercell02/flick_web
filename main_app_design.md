---
name: Flick
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  h1:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  h2-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: IBM Plex Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stat-numeric:
    fontFamily: IBM Plex Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.0'
spacing:
  base: 4px
  unit: 8px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system employs a **Brutalist** aesthetic to create an uncompromising, archival atmosphere for event memories. The brand personality is raw, objective, and starkly editorial. By stripping away all color, shadows, and ornamentation, the focus shifts entirely to the structural integrity of the layout and the monochromatic weight of the photography. 

The emotional response should feel like a high-end physical gallery or a meticulously kept architectural journal. Every element is deliberate, using hard edges and high-contrast lines to communicate permanence and clarity. 

**Key Principles:**
- **Honesty in Materials:** Interfaces are composed of lines and blocks; no attempt is made to mimic physical depth or softness.
- **Grayscale Priority:** Emotion is conveyed through contrast and imagery, not color theory.
- **Structural Rigidity:** Every element aligns to a strict grid, emphasized by visible 1px borders.

## Colors

The palette is strictly monochromatic, utilizing extreme contrasts to define hierarchy. 

- **Pure Black (#000000):** Used for primary text, primary button backgrounds, and structural 1px borders.
- **Pure White (#FFFFFF):** The canvas. Used for the global background and text on primary interactive elements.
- **Mid-Gray (#888888):** Reserved for secondary metadata and disabled states.
- **Light-Gray (#E5E5E5):** Used for subtle structural divisions and secondary borders where pure black would be too aggressive.

**Visual Filter Rule:** 
All photography and user-uploaded content must be rendered with a `grayscale(100%)` CSS filter to maintain the systemic integrity of the monochromatic environment.

## Typography

This system utilizes a high-contrast typographic pairing to balance editorial elegance with technical precision.

- **Headings:** 'Playfair Display' provides a sophisticated, serif touch that elevates the "Gallery" aspect of the app. It should be used for event titles and major section headers.
- **Body & Data:** 'IBM Plex Mono' is used for all functional text, labels, and stats. This monospaced font reinforces the Brutalist aesthetic and provides a rhythmic, systematic feel to the data.

All text should be rendered in `#000000`, with metadata and secondary labels in `#888888`.

## Layout & Spacing

The layout philosophy is based on a **Fluid Grid** constrained by hard structural borders. 

- **Grid Model:** A 12-column system is used across all device types, though mobile views will primarily utilize elements spanning all 12 columns.
- **Margins & Gutters:** 16px margins on mobile, scaling to 32px on desktop. Gutters are fixed at 16px to ensure tight, technical spacing between archival items.
- **Archival Framing:** Every major section or component container must be wrapped in a 1px solid border. When components are stacked, they share borders to create a "grid of boxes" effect.
- **Motion:** All content blocks transition using a subtle fade-in-up:
  - `initial: { y: 24, opacity: 0 }`
  - `animate: { y: 0, opacity: 1 }`
  - `transition: { duration: 0.4, ease: "easeOut" }`

## Elevation & Depth

In this design system, elevation does not exist in the traditional Z-axis sense. There are no shadows, blurs, or gradients.

**Hierarchy is established through:**
- **Layering:** Using a 1px offset to simulate depth (e.g., a "active" card might have a 1px black border while others have 1px light-gray).
- **Inversion:** Primary actions use a black background to "pop" against the white canvas.
- **Blocking:** Thick 1px lines define the relationship between elements. If an element is "above" another, it is simply placed higher in the vertical flow within its own bordered container.

## Shapes

The shape language is strictly **Sharp**. 

Every interactive element, container, input field, and image frame must have a `border-radius: 0`. There are no exceptions. This geometric rigidity is central to the Brutalist aesthetic and ensures the UI feels constructed rather than grown.

## Components

### Buttons
- **Primary:** Black background (#000000), white text (#FFFFFF). No border. Sharp corners.
- **Secondary:** White background (#FFFFFF), 1px black border (#000000), black text.
- **Interaction:** On hover/active, secondary buttons invert (Black bg, white text).

### Form Inputs
- **Text Fields:** White background, 1px black border, sharp corners. Text in IBM Plex Mono.
- **Focus State:** Border width increases to 2px or remains 1px with a solid black interior "focus bar" if required for accessibility.

### Cards & Containers
- All cards are white rectangles with a 1px border. 
- Headers within cards are separated by a 1px horizontal line.
- Images within cards always sit flush against the top and side borders.

### Icons
- Icons must be stroke-based SVGs.
- **Stroke Width:** 1.5px.
- **Ends:** Square caps and miters (no rounded joins).
- **Color:** Always `#000000`.

### Lists
- Lists should be separated by 1px horizontal lines (#E5E5E5).
- Each list item should use IBM Plex Mono for a "ledger" or "manifest" appearance.