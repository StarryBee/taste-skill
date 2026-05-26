# CLAUDE.md
> Merged from: andrej-karpathy-skills · frontend-design (Swiss/Editorial anchor) · claude-frontend-skills · Claude-Code-Frontend-Design-Toolkit · taste-skill

---

## PART 1 — BEHAVIORAL GUIDELINES
*Source: andrej-karpathy-skills*

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## PART 2 — DESIGN AESTHETIC ANCHOR: SWISS (Editorial / Magazine)
*Source: frontend-design — anchor selected for editorial/magazine work*

> "Reach for the unexpected. Fidelity to the anchor. Discipline on the content. Nothing left to default."

### Process

Before writing a single line of CSS:
1. Identify context and problem
2. Confirm anchor: **Swiss** (for editorial/magazine contexts)
3. Define one memorable differentiator — what makes this instance of Swiss distinct
4. Match tokens precisely to the spec below
5. Implement with authored content — never fabricated or filler data

### Swiss Anchor — Locked CSS Tokens

```css
/* SWISS / EDITORIAL — locked token set */
--bg:           #ffffff;          /* or near-white: #f9f9f7 for warmth */
--bg-alt:       #f2f2f0;
--text:         #111111;          /* near-black, never pure #000 */
--text-2:       #555555;
--text-3:       #999999;
--accent:       /* ONE deliberate accent — pick contextually, keep sat < 70% */
--border:       #e0e0e0;
--font-display: /* clean geometric sans-serif, e.g. Helvetica Neue, Outfit, Geist */
--font-body:    /* same family, lighter weight — or humanist serif for editorial body */
--font-mono:    /* DM Mono or similar for labels, metadata */
--grid:         visible structure — 12-col, consistent margins
--radius:       0 — no rounded corners unless content demands it
--shadow:       none — elevation via border and spacing only
```

### Swiss Rules
- White or near-white background — no dark mode unless explicitly requested
- One accent color maximum — used sparingly and intentionally
- Grid is always visible in the structure, even if not drawn
- Typography does the heavy lifting: size, weight, and spacing create hierarchy
- Negative space is not emptiness — it is structure
- No decorative elements: no ornamental borders, no glyphs, no flourishes
- Images are always cropped precisely to grid — no arbitrary sizing
- Labels are always outside and below images, never overlaid

### Verification (ship only when all pass)
- [ ] Tokens remain within the Swiss anchor's defined range
- [ ] Content avoids fabrication and filler
- [ ] The differentiator is visibly rendered
- [ ] Execution commits to one anchor — no hybridising multiple aesthetics

---

## PART 3 — DESIGN DIMENSIONS
*Source: claude-frontend-skills*

Apply all four dimensions cohesively. Partial application produces incoherence.

### Typography

- Use extreme font weight contrasts: pair `100–200` (thin) with `800–900` (black)
- Avoid safe mid-range weights: 400/500/600 used alone are forgettable
- Establish font pairings via CSS variables — apply them systematically
- For Swiss/Editorial: geometric or humanist sans-serif display + serif body is the canonical pairing
- Never use Inter, Roboto, or Poppins as primary display faces

### Color & Theme

- Draw from a cultural or historical reference — name it before you code it
- For Swiss/Editorial: the reference is the tradition of Swiss International Typographic Style (Müller-Brockmann, Ruder, Hoffmann)
- One accent color — desaturated enough to feel considered, not branded
- Neutral base (Zinc, Slate, or warm grey) + one chromatic accent
- No purple/blue gradients. No rainbow palettes.

### Motion

- Prioritise **page-load choreography** over scattered micro-interactions
- Stagger entrance sequences: `animation-delay: calc(var(--index) * 100ms)`
- Use `cubic-bezier(0.16, 1, 0.3, 1)` for all easing — never `linear` or `ease`
- Animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`
- Always include `prefers-reduced-motion` media query:
  ```css
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
  ```

### Backgrounds

- Create depth through layering — not through flat color
- For Swiss/Editorial: white with subtle paper texture or fine grid overlay
- Noise/grain only on fixed `pointer-events: none` pseudo-elements
- No mesh gradients in Swiss anchor — those belong to Aurora Maximalism

---

## PART 4 — TASTE-SKILL DESIGN ENGINEERING DIRECTIVES
*Source: taste-skill (leonxlnx) — active dial settings*

```
DESIGN_VARIANCE:  8   (asymmetric grids, fractional units, negative space)
MOTION_INTENSITY: 6   (cubic-bezier transitions, staggered cascades)
VISUAL_DENSITY:   4   (normal spacing — not airy, not packed)
```

### Layout Rules

- **No centered Hero** when `DESIGN_VARIANCE > 4` — use Split Screen (50/50), Left-aligned, or Asymmetric
- **No 3-equal-column card layouts** — use 2-col zig-zag, asymmetric grid (`2fr 1fr`), or horizontal scroll
- **No generic cards** for lists — use `border-top`, `divide-y`, or negative space instead
- Contain with `max-width: 1400px; margin: 0 auto`
- Prefer CSS Grid over complex flex math
- Mobile: all high-variance layouts collapse to single column (`width: 100%; padding: 0 20px`) at `< 768px`
- Full-height sections use `min-height: 100dvh` not `height: 100vh`

### Typography Rules

- Display/Headlines: `font-size: clamp(min, vw, max); letter-spacing: -0.02em; line-height: 1.05`
- Body: `font-size: 14–16px; line-height: 1.7; max-width: 65ch`
- Avoid Inter — use Geist, Outfit, Cabinet Grotesk, or Satoshi for UI
- Serif fonts allowed only for creative/editorial designs (this project qualifies)

### Color Rules

- Never use pure `#000000` — use off-black: Zinc-950, `#0c0a0f`, or `#111111`
- Max one accent color, saturation < 80%
- No neon outer glows — use inner border: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.1)`
- No excessive gradient text
- No "AI purple/blue" as primary palette

### Image Rules

- Labels always **outside and below** images — never overlaid
- Format: `[Image title / location — context]` + right-aligned index number
- Images filtered: `saturate(0.8–0.9) brightness(0.85–0.9)` for editorial consistency
- Hover: `transform: scale(1.03–1.05)` — never animate `width` or `height`

---

## PART 5 — ANTI-PATTERNS (FORBIDDEN)
*Source: taste-skill + claude-frontend-skills + frontend-design*

### Visual & CSS
- NO neon outer glows (`text-shadow`, `box-shadow` in bright accent colors)
- NO pure `#000000` backgrounds
- NO oversaturated accent colors
- NO gradient text (`-webkit-background-clip: text`) used excessively
- NO custom mouse cursors
- NO flat backgrounds without texture or structural depth
- NO ornamental borders, glyphs, or decorative flourishes (Swiss anchor)

### Typography
- NO Inter, Roboto, or Poppins as primary display faces
- NO mid-range font weights (400–600) used alone without contrast
- NO oversized H1 without weight/color hierarchy to support it
- NO serif fonts in dashboard or software UI contexts

### Layout & Spacing
- NO 3-column equal-width card grid
- NO centered hero layout (when variance > 4)
- NO arbitrary `z-index` values (z-50, z-10 spam)
- Padding and margins must follow a consistent scale

### Content (The "Jane Doe" Effect)
- NO generic placeholder names: John Doe, Sarah Chan, Jack Su
- NO standard SVG avatar eggs
- NO fake round numbers: use organic figures (47.2%, +1 (312) 847-1928)
- NO startup slop names: Acme, Nexus, SmartFlow
- NO filler copy: Elevate, Seamless, Unleash, Next-Gen — use concrete verbs
- NO broken external image URLs — use `picsum.photos` or self-hosted assets

### Framework & Code
- NO `height: 100vh` for full-height sections — use `min-height: 100dvh`
- NO animating layout properties (`top`, `left`, `width`, `height`)
- NO mixing GSAP and Framer Motion in the same component tree
- NO `useEffect` animation hooks without cleanup functions
- Ensure Empty, Loading, and Error states exist for all interactive components

---

## PART 6 — TOOLKIT REFERENCE
*Source: Claude-Code-Frontend-Design-Toolkit*

### Recommended Stack (this project)
| Layer | Tool |
|---|---|
| Styling | Tailwind CSS v4 (or custom CSS vars for pure HTML) |
| Motion | CSS transitions + Intersection Observer (no-build) / Framer Motion (React) |
| Icons | `@phosphor-icons/react` or `@radix-ui/react-icons` |
| Fonts | Google Fonts CDN: Outfit + Playfair Display + DM Mono |
| Testing | Playwright MCP for visual regression |
| Docs | Context7 for up-to-date framework references |

### MCP Token Budget Warning
> Loading 5+ MCP servers consumes ~55k tokens at session start before any interaction. Keep active servers to 3–5 maximum. Disable unused ones.

### Design-to-Code Pipeline
- If a Figma file exists: use Figma MCP to read design tokens directly
- Push rendered UIs back to Figma as editable layers for design review
- Maintain a single CSS variable controlling hue — OKLCH color math auto-rethemes entire palette

---

## PART 7 — PRE-FLIGHT CHECKLIST

Before shipping any frontend output, verify:

**Behavioral**
- [ ] Assumptions stated before implementation
- [ ] Simplest approach chosen — no speculative features
- [ ] Only requested lines changed in existing files
- [ ] Success criteria defined and verified

**Design**
- [ ] Anchor committed: Swiss / Editorial — no hybridising
- [ ] Tokens within anchor range
- [ ] No forbidden patterns present (Part 5)
- [ ] One accent color maximum, saturation < 80%
- [ ] Labels outside and below images
- [ ] No centered hero (variance 8)

**Code**
- [ ] `min-height: 100dvh` not `height: 100vh`
- [ ] Only `transform` and `opacity` animated
- [ ] `prefers-reduced-motion` respected
- [ ] Mobile collapse guaranteed at < 768px
- [ ] Empty / loading / error states present
- [ ] No broken image URLs
- [ ] No placeholder slop names or filler copy
