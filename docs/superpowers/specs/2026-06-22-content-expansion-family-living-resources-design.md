# Design: Content Expansion — Hub Reorg + Family & Living Resources (incl. all-50-state benefits)

Date: 2026-06-22
Status: Approved (pending written-spec review)
Branch: `expansion-and-refresh-2026-06` (continues this session's branch)

## Goal

Grow `thebriefyoudeserved` into a single landing page (index.html) that links to
everything, with sub-pages holding the depth — "anything a veteran or their family
might need to know," available to anyone whether or not they buy the book.

This spec covers two things, in order:
1. **Hub reorganization** — regroup index.html's flat card grid into labeled sections
   so it stays scannable as the directory grows, and ensure it links every sub-page.
2. **Four new reference pages** under a new "Family & Living" grouping, built on the
   existing data-driven page pattern. State-benefits page covers **all 50 states**.

## Non-goals (YAGNI)

- No interactive tools/wizards this round (reference content only — user picked "A").
- No new "free forever" / ethos messaging — the existing hero line ("Free companion
  resources…") already conveys availability.
- No new framework, build step, or component system. Reuse the existing pattern.
- No unrelated refactor of existing pages beyond the index.html layout regroup.

## Part 1 — Hub Reorganization (do FIRST)

Regroup the existing `.card-grid` in `index.html` into four labeled sections, each
its own `<h2 class="section-heading">` followed by a `.card-grid`. Every sub-page is
reachable. New pages from Part 2 slot into the "Family & Living" and "State Resources"
sections.

Sections and their cards:
- **Claims & Benefits:** VA Disability Claims Guide, Federal Benefits Guide,
  Family/Survivor/Retiree Benefits, Scholarships & NGO Benefits
- **State Resources:** State Education Benefits Guide, State Benefits Beyond Education *(new)*
- **Family & Living** *(new section):* Caregiver & Mental-Health Support *(new)*,
  Healthcare Navigation *(new)*, Dependents & Life Events *(new)*
- **Tools & Planning:** Financial Freedom Calculator, Transition Timeline Checklist,
  Veteran Voices Questionnaire, Errata & Corrections

Only index.html changes in Part 1 (layout/markup); no other page's content is touched.
The existing `.section-heading` and `.card-grid` CSS already support this — no new CSS
unless visual spacing needs a tweak.

## Part 2 — Four New Reference Pages

Each page reuses the proven pattern from `federal.html` / `benefits.html`:
thin HTML shell + inline CSS (copied from federal.html for visual consistency) +
the category→program card renderer that `fetch()`es its own JSON + `shared-footer.js`.
Each card supports the optional `transferable` badge field; not all pages use it.

| Page | Data file | Categories / contents |
|---|---|---|
| `state-benefits.html` | `data/state-benefits.json` | **All 50 states.** Per state, up to 5 program entries: property-tax exemption, vehicle registration/plates, hunting & fishing licenses, state veterans home(s), state income-tax treatment of military retired pay. |
| `caregiver-support.html` | `data/caregiver-support.json` | VA Caregiver Support (PCAFC stipend + PGCSS), Vet Centers, Veterans Crisis Line (988 press 1), PTSD/TBI resources, family/marriage counseling, Military Sexual Trauma (MST) support, substance-use treatment. |
| `healthcare-navigation.html` | `data/healthcare-navigation.json` | VA health enrollment + priority groups, how to enroll (10-10EZ), community care, dental (VADIP), vision, prescriptions/copays, CHAMPVA vs TRICARE decision help, mental-health access. |
| `dependents-life-events.html` | `data/dependents-life-events.json` | DEERS & dependent ID cards, adding dependents to VA compensation, marriage/divorce/new-child benefit impacts, GI Bill transfer to dependents, survivor checklist (what families must do when a veteran dies). |

### Data schema (matches existing federal.json / benefits.json)

`state-benefits.json` uses the **state-as-category** shape so it renders with the
existing category→program renderer with zero JS changes:

```json
[
  {
    "category": "California",
    "programs": [
      {
        "name": "Property Tax Exemption (Disabled Veterans' Exemption)",
        "agency": "California State Board of Equalization / County Assessor",
        "website": "https://...official .gov...",
        "eligibility": "…",
        "coverage": "…exact $ exemption / threshold…",
        "notes": "…",
        "lastUpdated": "2026-06-22"
      }
      // up to 5 programs per state
    ]
  }
  // 50 state objects
]
```

The other three JSON files use topic-as-category (same as federal.json).

### HTML pages

Each new `.html` is a copy of `benefits.html`'s structure with: page title/H1/H2/intro
adjusted, the `fetch()` path pointed at its own data file, the console log label
changed, and the render function renamed. Renderer body is otherwise identical (proven
code). `shared-footer.js` included on every page.

## Research discipline (hard constraints)

- **All figures verified against official sources** — VA.gov, state .gov, DoD/DFAS/
  TRICARE. No benefit number, threshold, or eligibility stated from memory.
- **WAF-blocked .gov sites:** when WebFetch returns 403 (dfas.mil, dol.gov, many state
  sites), escalate to **Playwright** (installed; headless Chromium cached) or
  cross-verify via congress.gov/CRS or a .gov PDF. Do NOT omit data or guess.
  (See memory `waf-blocked-sites-use-playwright`.)
- **Anything unconfirmable** is flagged and omitted, not guessed (per the SBP-premium
  precedent earlier this session).

## Agent fan-out & checkpoint constraints (hard constraints — user-mandated)

The 50-state research is the large grind. To avoid losing work to a quota wipe:

- **Max 5 research agents running at once.** Never spin up more than 5 concurrently.
- **Process states in batches of ~5** (10 batches total).
- **After each batch returns, immediately write the verified results to disk**
  (append to `data/state-benefits.json` or a per-batch partial file that is merged),
  and `git add`/`commit` the partial. A quota interruption then loses at most the
  in-flight batch, never completed batches.
- Batches run sequentially; within a batch, up to 5 states researched in parallel.
- The three national pages (caregiver/healthcare/dependents) are researched after the
  state grind (or interleaved one batch at a time) under the same 5-at-a-time cap.

## Data flow

1. index.html reorg (Part 1) → commit.
2. Build the 4 HTML shells + empty/seed JSON → commit (pages render "loading" until data).
3. State research in batches of ≤5 → write+commit after each batch until 50/50 done.
4. National-page research (≤5 agents) → write+commit each JSON.
5. Add the 4 hub cards into the reorganized sections (some added in step 1 as
   placeholders pointing at pages that render once data lands).

## Error handling

- Each page's `fetch().catch()` already renders a friendly error if JSON fails to load
  (copied from federal.html). No change needed.
- JSON validated with `python -c "json.load(...)"` after every batch write — a malformed
  append breaks the whole page, so validation gates every commit.

## Testing / verification

- After each JSON write: validate it parses (python) and count states/programs.
- Final: serve the dir over HTTP (`python -m http.server`) and confirm each new page
  returns 200, its JSON returns 200, and the rendered HTML contains category headings
  (not the loading spinner or error text) — same render test used for benefits.html.
- Link-check every new official URL (HEAD; browser-UA / Playwright fallback for WAF
  sites) — record dead/redirected per the quarterly cadence.
- index.html: confirm it links all sub-pages (grep for each `*.html` href).
- Report hard counts: states done / 50, programs total, URLs checked / live.

## Integration

- Continues on branch `expansion-and-refresh-2026-06`; Mike reviews/merges (not direct
  to main). Commits are incremental (per batch) so review shows clear progression.
- `data/state-benefits.json` added to the quarterly URL-validation scope (memory
  `url-validation-cadence` already updated to include `data/benefits.json`; add this too).
