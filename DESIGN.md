---
name: Veggie
description: Meal-time transition tool, in the visual grammar of a South Indian tiffin room — not a wellness app.
colors:
  turmeric: "#C97A0C"
  turmeric-deep: "#A3630A"
  turmeric-tint: "#F3DDB4"
  ink: "#211D16"
  ink-soft: "#5B5344"
  paper: "#F7F3EA"
  surface: "#FFFDF8"
  hairline: "#DDD3C0"
  curry-leaf: "#4B7A3D"
  curry-leaf-tint: "#DEE9D6"
  kattam-blue: "#2B5C6B"
  kattam-blue-tint: "#D8E5E8"
  rust: "#B8452E"
  rust-tint: "#F2DAD3"
typography:
  display:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  step-title:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  body-alt:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  caption:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.06em"
  micro-label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 500
    letterSpacing: "0.05em"
  metric:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
  metric-hero:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  chip: "999px"
  sm: "4px"
  md: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.turmeric}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.turmeric-deep}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
---

# Design System: Veggie

## Overview

**Creative North Star: "The Tiffin Room Menu Board"**

Veggie rejects the default plant-based-app look — pastel sage, rounded pill buttons,
stock leaf iconography, clinical whitespace — because that look reads as foreign to
the people it's actually for: someone deciding what to eat *right now*, in Chennai,
often mid-meal-planning with family. The reference world instead is the everyday
vegetarian "mess"/tiffin room: laminated menu boards, steel thali compartments,
hand-chalked specials, thin ruled price lists, the tumbler-davara. This is a
functional, appetite-forward, unpretentious world — not a lifestyle brand.

The interface behaves like a well-run tiffin counter: information is laid out in
clean ruled rows (hairlines, not shadows), one warm accent color does the signalling
work a menu-board chalk color would do, and mode distinctions (vegetarian vs. vegan)
get their own small, consistent tag colors the way a counter marks "veg" and "Jain"
separately — never blended, never inferred.

This is an **Operate**-mode product: the visitor is completing a task (log a meal,
check today's target, find what to eat), not being persuaded or entertained. Craft
shows up in restraint and precision, not in spectacle.

**Key Characteristics:**
- Flat, ruled, ledger-like layout — hairlines do the separating, not shadows or cards-on-cards
- One accent (turmeric) carries all primary action and progress signalling; used sparingly
- Vegetarian/vegan get distinct, small, consistent tag colors — never merged into the accent
- IBM Plex Sans for everything read as prose or UI chrome; IBM Plex Mono for anything read as a figure, label, source, or confidence tag — like a printed price list
- Corners are mostly square (menu board, not app-store bubble); only chips/tags and the bottom nav get full pill rounding, echoing a steel tumbler

## Colors

Warm, low-saturation neutrals carry the page; turmeric is the only color allowed to
own real estate at page scale, and only for progress and primary action.

### Primary
- **Turmeric Gold** (#C97A0C): primary buttons, active nav state, progress bars/rings, key numerals (streaks, target counts). Never used as a background fill larger than a button or chip.

### Secondary
- **Curry Leaf Green** (#4B7A3D): the *vegetarian* mode tag and any "on target" positive state. Confined to small tags/badges, never a section background.
- **Kattam Blue** (#2B5C6B, named for Chettinad tile blue): the *vegan* mode tag, kept visually distinct from vegetarian so the two modes are never confusable at a glance (§16 top product risk is conflating them — color reinforces the hard filter).

### Tertiary
- **Rust** (#B8452E): allergy warnings, "data unavailable" markers, destructive actions. Never used for anything routine.

### Neutral
- **Paper** (#F7F3EA): page background — warm, like unbleached menu card stock, never sterile white.
- **Surface** (#FFFDF8): card/row background, barely lighter than paper; separation comes from the hairline below, not elevation.
- **Ink** (#211D16): primary text — warm near-black, like chalk-board or thick menu-board marker, never pure `#000`.
- **Ink Soft** (#5B5344): secondary text, captions, source/confidence labels.
- **Hairline** (#DDD3C0): every rule, divider, and card border. The single structural device of the system.

### Named Rules
**The One Accent Rule.** Turmeric appears on at most one primary action and one progress element per screen. If a screen wants two things to feel urgent, one of them is wrong.

**The Mode-Tag Rule.** Vegetarian is always Curry Leaf Green, vegan is always Kattam Blue, everywhere in the product, with no exceptions for visual balance. A screen that needs a third diet-adjacent tag (Jain, egg-optional) uses a neutral ink-bordered tag, never a third saturated color.

## Typography

**Display Font:** IBM Plex Sans (system-ui fallback)
**Body Font:** IBM Plex Sans
**Label/Mono Font:** IBM Plex Mono

**Character:** A workhorse grotesque doing double duty as both UI chrome and reading text — legible, slightly technical, no personality flourishes — paired with its own monospace for anything numeric or sourced, so a figure on the page reads the way a printed price or a nutrition label does: fixed-width, slightly smaller, quietly authoritative.

### Hierarchy
- **Display** (600, clamp(1.75rem, 5vw, 2.25rem), 1.15): top-level screen titles (`PageTitle`) — one per screen.
- **Step Title** (600, 1.5rem, 1.25): onboarding step headings — one size down from Display, reserved for the 7-step gate's question text.
- **Title** (600, 1.125rem, 1.3): card/section headers ("Next best meal", "This week").
- **Body** (400, 0.9375rem, 1.55): primary prose, form inputs, the main line of a list row.
- **Body Alt** (400, 0.875rem, 1.5): secondary prose one step down from Body — subtitles, longer helper text.
- **Body Small** (400, 0.8125rem, 1.45): the most common secondary register — card metadata, helper copy, chip/tag text at normal case.
- **Caption** (400, 0.75rem, 1.4): tertiary fine print below Label in visual weight but not mono.
- **Label** (500, 0.6875rem, mono, 0.06em tracking, uppercase): source tags, confidence markers, section eyebrows.
- **Micro Label** (500, 0.625rem, mono, 0.05em tracking, uppercase): the smallest register — bottom nav item labels only.
- **Metric** (600, 1.25rem, 1.2): a stat-card numeral (streak, target count, meat-free days) — always paired with a Label eyebrow above it.
- **Metric Hero** (600, 2.5rem, 1): the single largest number on a screen — reserved for one figure per page (e.g. Animal Impact's total). Never two Metric Heroes on the same screen.

### Named Rules
**The Receipt Rule.** Any number the user didn't type themselves — a nutrition figure, a rating, an impact estimate — renders in Plex Mono at Label size, exactly like a printed receipt line, with its source/confidence directly beside it. This is the typographic expression of the product's "never assert without source" rule (PRODUCT.md).

## Layout

Mobile-first, single column, 360px minimum width (hard product requirement). Content
sits in a max-width 480px column even on desktop — this is a phone-at-the-table
product, not a dashboard that benefits from wide layouts. Section rhythm is a
consistent 16px (md) between rows within a card and 24px (lg) between cards. A
bottom tab bar (Home / Discover / Log / Recipes / Progress) is fixed on `/app/*`
routes, per the wireframe already specified in the build plan.

Onboarding screens carry a thin turmeric progress rule at the top (segment-filled,
"Step N of 7") rather than a percentage — count-based, matching how a form actually
feels to fill in.

## Elevation & Depth

Flat by design — no drop shadows anywhere. Depth and grouping are communicated by
the Hairline rule alone (a 1px border, `#DDD3C0`) and by the paper/surface tone
step, echoing a laminated menu board rather than a stack of floating app cards.

### Named Rules
**The No-Shadow Rule.** If two elements need visual separation, add a hairline or a spacing step — never a shadow. The one exception is a pressed/active button state, which darkens rather than lifts.

## Shapes

Mostly square. Cards and inputs use a 6px radius (just enough to not be a printed
form), buttons use 4px. Chips, tags, and the bottom nav pill use full (999px)
rounding — the one place the steel-tumbler curve shows up, so it reads as
intentional rather than a missed default.

## Components

### Buttons
- **Shape:** 4px radius, generous horizontal padding (20px)
- **Primary:** Turmeric background, Paper text, 600 weight; darkens to Turmeric Deep on hover/press, no lift
- **Secondary:** Surface background, Ink text, 1px Hairline border
- **Ghost/text:** Ink text, underline on hover, no background at any state

### Tags / Mode Chips
- **Style:** full pill radius, small Label-size mono text, uppercase; Curry Leaf Green for vegetarian, Kattam Blue for vegan, Rust for allergy/warning, neutral ink-outline for anything else (Jain, budget band, spice level)

### Cards / Rows
- **Corner Style:** 6px
- **Background:** Surface (#FFFDF8) on Paper (#F7F3EA) page — a one-step tonal lift, not a shadow
- **Border:** 1px Hairline, all sides
- **Internal Padding:** 16px

### Inputs / Fields
- **Style:** Surface background, 1px Hairline border, 6px radius, Ink text
- **Focus:** border shifts to Turmeric, 2px, no glow/ring
- **Error:** border shifts to Rust, helper text in Rust below the field

### Navigation
- **Bottom tab bar** (`/app/*`): fixed, Surface background, Hairline top border, 5 items, active item in Turmeric with a filled icon, inactive in Ink Soft outline icon, Label-size text under each icon
- **Onboarding step header**: back chevron (Ink) + "Step N of 7" (Label, mono) + segmented turmeric progress rule beneath

### Progress Ring / Bar
- Track in Hairline color, fill in Turmeric, center numeral in Plex Mono — used for weekly meat-meal target and onboarding progress alike, so the same visual language means "progress toward a count" everywhere

## Do's and Don'ts

### Do:
- **Do** keep turmeric to one primary action + one progress element per screen (The One Accent Rule).
- **Do** render every sourced number in Plex Mono with its confidence/source visible beside it (The Receipt Rule).
- **Do** use hairlines for every separation; never reach for a shadow (The No-Shadow Rule).
- **Do** keep vegetarian = Curry Leaf Green and vegan = Kattam Blue with zero exceptions (The Mode-Tag Rule).
- **Do** label all prototype content (recipes, restaurants, names, numbers) as synthetic somewhere reachable, per PRODUCT.md — this build has no real data yet.

### Don't:
- **Don't** use pastel sage green, rounded-pill hero buttons, or stock leaf/sprout iconography — the default plant-based-app look this system exists to reject.
- **Don't** blend the external restaurant rating into the Veggie Rating visually or numerically — show them as two separate figures, always.
- **Don't** render a missing nutrient or figure as 0 or blank — render the literal words "data unavailable" in Ink Soft.
- **Don't** apply turmeric, curry-leaf, or kattam-blue as a full section background — they are accents and tags, never fields.
