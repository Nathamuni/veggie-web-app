# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

India-first, English-first, mobile-majority. Seven confirmed segments, all of whom
are choosing what to eat *right now* — in a kitchen, on a street, or in front of a
menu with other people waiting:

- **Meat-heavy reducer** — wants less meat without losing satisfaction. Enters via
  the transition assessment.
- **Red-meat reducer** — stopping or cutting red meat while keeping familiar meals.
- **Vegetarian transitioner** — removing meat and fish.
- **Vegan transitioner** — removing animal-derived foods progressively.
- **Existing vegetarian** — wants variety, nutrition, better discovery.
- **Existing vegan** — wants verified options and more satisfying meals.
- **Fitness/protein conscious** — protein targets without returning to meat.
- **Budget home cook** — eating well while controlling cost and using the pantry.

Secondary: restaurant owners maintaining their own listing; internal operations and
moderation staff.

## Product Purpose

Help people eat less meat by solving the actual reasons they keep eating it — taste,
fullness, familiarity, nutrition, convenience, cost and social context — rather than
by persuasion. Success is a *satisfying* replacement meal completed, repeatedly,
by a transitioning user.

## Positioning

An end-to-end transition system: understand → recommend → fulfil → learn → measure
progress → show estimated animal impact.

The defensible mechanism is not access to Google, USDA or OSM — those are commodity
inputs. It is the accumulated relationship between a user's starting diet, cuisine
and cravings and the vegetarian/vegan foods, combinations and contexts that actually
produce high satisfaction and sustained change.

Explicitly **not**: a vegetarian restaurant directory, a recipe app, a calorie
tracker, a moral scoring system, or a medical diagnostic product.

## Operating Context

- Decisions happen at meal time, often on a phone, often with low attention and
  sometimes with no network certainty.
- Food culture is regional and specific: South Indian, Tamil, Kerala, Andhra,
  Telangana, Karnataka, Chettinad, Punjabi, Gujarati and more. A recommendation that
  ignores region reads as foreign, not aspirational.
- Eating is social. Users frequently need the best vegetarian choice at a
  *mixed* restaurant chosen by somebody else.
- Users log meals themselves. Logging burden is the single largest threat to the
  data the product depends on.

## Capabilities and Constraints

**Six permanent pillars:** Transition, Satisfaction, Nutrition, Discovery, Progress,
Impact.

**Hard product rules, all of which shape the interface:**

- Vegetarian and vegan are **separate modes and filters everywhere** — never
  conflated, never a display preference.
- **Reduction-first**: a single meat meal never resets progress. No breakable
  streaks, no punishment.
- Nutrition is **wellness support, not diagnosis**. Permitted: "your logged meals
  appear low in protein today." Forbidden: "you are protein deficient," and any
  treatment or dosage advice.
- Missing data renders as **"data unavailable"** — never zero, never inferred.
- Every imported or calculated food, rating and impact figure carries visible
  **source, confidence and methodology**.
- External restaurant ratings are shown **separately** from the Veggie Rating and
  are never mathematically blended into it.
- Animal impact is shown as **estimates** with a linked method; the unambiguous
  base metric is animal-based meals avoided. No CO₂, water or land metrics, ever.
- Consent is **itemised per purpose** and never bundled; withdrawal, export and
  deletion must be operationally real.

**Undecided:** pilot city (Chennai assumed, unconfirmed); whether ICMR-NIN food
composition data can be licensed; whether the product ever becomes an e-commerce
food business.

## Brand Commitments

Name: **Veggie**. No logo, wordmark, palette or typeface has been supplied — none
exist yet to preserve.

Voice: never preachy, never punitive, never medical. Satisfaction before ideology.
Explains its estimates rather than asserting them.

## Evidence on Hand

- `docs/Veggie_Web_Application_PRD_v1.0.docx` — the full product requirements
  document (v1.0, 22 September 2026) and the source of every fact above.
- `/home/nathamuni/.claude/plans/i-want-to-build-wise-dawn.md` — the approved build plan.

**Absent, and not to be fabricated:** real restaurant data, real recipes, real
nutrition figures, real user counts, testimonials, partner names, prices, and the
animal-impact reference factors (which are pending legal review). Everything shown
in the current prototype is placeholder content and must be labelled as such.

## Product Principles

1. **Satisfaction before ideology.** If the food does not satisfy, the transition
   will not last. Appetite and familiarity outrank persuasion.
2. **Reward progress; never punish an imperfect day.** The interface must make
   slipping survivable.
3. **Regional familiarity is the mechanism.** Recommendations reflect the user's
   actual food culture, at dish level, not category level.
4. **Explain every estimate.** Impact and nutrition figures carry their method and
   source where the user can reach them.
5. **Unknown is a legitimate, visible state.** Never fabricate a menu, a nutrient or
   a suitability claim to fill a layout.

## Accessibility & Inclusion

- **WCAG 2.2 AA** is the stated target: keyboard access, semantic landmarks, visible
  labels, contrast, and status never carried by colour alone.
- Core flows must be fully usable at **360px** width.
- English first, with the data model ready for Tamil, Hindi, Telugu, Malayalam and
  Kannada; food and recipe aliases may be multilingual before the UI is localised.
- Location permission is always optional — every location-dependent screen must work
  with a manually chosen area.
