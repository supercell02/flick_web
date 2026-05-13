---
name: The Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
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
  tertiary-container: '#1b1b1b'
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
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
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
  code:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
  margin: 40px
---

## Brand & Style

This design system draws inspiration from the high-contrast, intellectual grit of 1970s photojournalism and vintage editorial layouts, transposed into a functional SaaS environment. It evokes the feeling of a Magnum Photos contact sheet—raw, definitive, and urgent—while maintaining the systematic precision required for modern software. 

The aesthetic is rooted in Neo-Brutalism and Swiss Style, prioritizing content and structural honesty over decorative artifice. It targets a sophisticated audience that values clarity, truth, and a "no-frills" professional environment. The emotional response is one of authority and timelessness; it feels less like an app and more like a permanent record.

## Colors

The palette is strictly binary: **Pure Black (#000000)** and **Pure White (#FFFFFF)**. There are no grays, no opacities, and no mid-tones. 

- **Canvas:** Always white, representing the blank page of a journal or the white border of a photographic print.
- **Ink:** All text, borders, and icons are rendered in pure black.
- **Interactions:** State changes (hover/active) are managed through color inversion (White-on-Black) rather than hue shifts.
- **Depth:** Contrast is the sole tool for creating hierarchy.

## Typography

The typography creates a tension between the literary elegance of the serif and the technical utility of the monospace.

- **Headlines:** Use **Playfair Display**. These should feel like newspaper mastheads or editorial titles. Use high weight and tight line-heights.
- **Body & Interface:** Use **IBM Plex Mono**. This introduces a "teletype" or typewriter feel, suggesting data entry and archival work.
- **Hierarchy:** Use all-caps with generous letter spacing for labels and metadata to distinguish them from standard body prose.

## Layout & Spacing

The layout is governed by a **Fixed Grid** system that mimics a printed broadsheet.

- **Grid:** Use a 12-column grid for desktop with 24px gutters. Elements should align strictly to these vertical axes.
- **The Rule Line:** Use 1px black lines to separate sections horizontally and vertically. These lines are not decorative; they are the primary structural element of the layout.
- **Rhythm:** Use a consistent 4px baseline. Spacing between elements should be aggressive and intentional, favoring larger gaps (32px+) to emphasize the "white space" of high-end editorial design.
- **Mobile:** Transition to a 4-column grid with 16px gutters. Ruled lines remain 1px.

## Elevation & Depth

This design system is strictly **flat**. There is no Z-axis in the traditional sense of shadows or blurs.

- **Hierarchy through Borders:** Depth is achieved by "boxing" content. Higher priority elements are enclosed in 1px or 2px black borders.
- **Inversion:** To simulate a "lifted" or "active" state, invert the color scheme: Black background with White text.
- **Layering:** When a modal or overlay is required, it should have a thick 2px black border and no shadow. It must be positioned offset to the grid to appear as if it is a physical sheet laid over another.

## Shapes

There are **no rounded corners** in this design system. 

Every element—buttons, input fields, cards, and containers—must have a `0px` border radius. This reinforces the "hard-edged" vintage aesthetic and the rigidity of a grid-based layout. Icons must also utilize sharp angles where possible, avoiding circular terminals in favor of flat ends.

## Components

### Buttons
- **Default:** 1px black border, white background, black IBM Plex Mono text (all caps).
- **Hover/Active:** Inverted (Black background, white text).
- **Shape:** Rectangular, hard edges only.

### Input Fields
- **Style:** 1px black bottom-border only (mimicking a form line) or a full 1px black box. 
- **Focus:** The border thickness increases to 2px. No "glow" or color change.

### Cards & Boxes
- **Style:** 1px black ruled borders. No padding should feel "soft"; use clear 16px or 24px internal padding.
- **Header:** Use a 1px horizontal line to separate the card title from the content.

### Icons
- **Style:** 24px bounding box, 1.5px or 2px stroke width. 
- **Geometry:** Minimalist, stroke-based SVG icons. Avoid filled shapes unless representing a toggle/active state.

### Lists
- Separate list items with a 1px horizontal rule. 
- Use the monospace font for list data to maintain the archival look.

### Checkboxes & Radios
- **Checkbox:** Square, 1px border. Checked state is a solid black fill or a heavy 'X' mark.
- **Radio:** Square (breaking convention to maintain hard edges), with a smaller solid black square inside when selected.