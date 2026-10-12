# Launch Status — St. Dominic Website

Last updated: October 11, 2026. Covers the work done October 8–11, 2026 on the
branch `launch/saintdominic-org`.

## Where things stand

| | Status |
|---|---|
| Live site | https://jmmarquez2025.github.io/st-dom-yt-website/ — still the **June 13, 2026** version (wrong 10:30 Sunday Mass, broken contact/register forms) |
| New version | Branch `launch/saintdominic-org`: 22 commits on top of `main`, **saved on this Mac only** — not yet uploaded to GitHub |
| Blocker | GitHub sign-in on this Mac (`gh auth login`) has not been completed, so the branch can't be pushed or the PR opened |
| saintdominic.org | Still served by eCatholic (Cloudflare nameservers `mario`/`nataly`); registered at GKG.net, expires Feb 8, 2027 |
| Email | Google Workspace — must survive the DNS move (records listed in `docs/domain-transfer.md`) |

The branch includes the pastor's review changes (PR #32, commit `b7decbd`), so
merging it also merges #32; close #32 afterward.

## What's on the branch

**Pastor's review (PR #32):** Sunday Mass 10:00 AM, "Start Here" page, staff and
ministries updates, Holy Matrimony + PDFs, emergency anointing line, contact and
register forms fixed (they crashed on submit on the live site).

**Launch / domain readiness**
- One setting, the repository variable `VITE_SITE_URL`, moves the whole site to
  saintdominic.org (base path, canonical URLs, sitemap, robots). Until it is set,
  deploys keep building for the github.io address.
- Every page is a real file, so GitHub Pages answers 200 instead of 404 (Google
  could not index inner pages before).
- All 136 old eCatholic addresses (e.g. `/about-us`, `/funeral-planning`,
  `/events/...`) forward to the closest new page — `src/data/legacyRedirects.js`.
- react-router-dom 7.18.4 (security fix the deploy's audit step requires).
- Tests now run in CI on every PR and deploy.
- Cutover order and rollback: `docs/domain-transfer.md`.

**Design and content (requested in review sessions)**
- Fonts: Georgia titles, Nunito Sans text, site-wide (tokens in `global.css`).
- "ST. DOMINIC CHURCH" in Georgia caps (hero + top bar), "Youngstown, Ohio"
  under the top-bar name; Spanish: "PARROQUIA SANTO DOMINGO".
- Home: procession hero photo; maroon BULLETIN button under START HERE;
  Dominican dog-with-torch divider (links to Dominicana's "I'm a Dog" essay);
  VERITAS ribbon under START HERE (links to op.org).
- Footer: light-gold parish crest centered above Sunday Mass; Catholic Diocese
  of Youngstown emblem (links to doy.org) beside the Dominican Friars logo;
  "Ways to Give" link to the on-site Give page.
- Give buttons (top bar and phone menu) open the parish Flocknote giving form
  directly. Flocknote has no embeddable form and blocks being shown inside
  other sites.
- Bulletin page shows this week's cover from DiscoverMass (bulletin #2387);
  submission deadline card ends with office@saintdominic.org; the duplicate
  "Submit an Announcement" card was removed.
- Fr. Stephen Dominic Hayes, O.P. added to Friars in Residence.
- Phone fixes: Mass/Confession bar shows every time (no cut-off), menu button
  stays on screen, search works at mid widths, no sideways scrolling.
- "Rosary in a Year" link fixed (old domain was unregistered).

## Decisions made

- Merge #32 now; **hold #30 (dashboard editing) and #31 (Mass intentions)** —
  both use the public dashboard passphrase as a backend password.
- Contact/register forms open the visitor's email app for launch (no backend yet).
- DNS moves to **GKG.net DNS** (not eCatholic's Cloudflare) before eCatholic is cancelled.
- The code stays in the **jmmarquez2025** GitHub account.

## To publish and launch

1. Sign in to GitHub on this Mac (`~/.local/bin/gh auth login --web`).
2. Push `launch/saintdominic-org`, open the PR to `main`, wait for the checks, merge.
   The github.io site updates in ~3 minutes; saintdominic.org is unaffected.
3. Domain cutover — follow `docs/domain-transfer.md` step by step (needs GKG,
   eCatholic and GitHub repo-admin access).

## Open items

**Confirm with the parish office / pastor before wide sharing**
- New Sunday CCD time (11:00 AM–12:15 PM) — not in the pastor's notes.
- Confession and Adoration times differ from the DiscoverMass listing
  (e.g. Sat confession 4:00–4:45 vs 4:00–5:00; Tue 7:20–8:00 PM confession missing).
- "Times verified July 18, 2026" stamps — update to the date the office re-verifies.
- Placeholder staff bios (Ferraro, Womer, Cruz, Gould, Hayes).
- Source for the Pope Leo XIV quote on the Start Here page.
- Spanish text was machine-drafted — Ministerio Hispano review.
- Confirmed from the Oct 11 bulletin: emergency line 234-367-4312 and the
  @saintdominicYT social accounts.

**Still to decide**
- Homepage START HERE / BULLETIN button style (options A–E were shown; current = A).

**Requests to outside parties**
- Diocesan (877-212-7335): the parish's DiscoverMass **bulletin-widget data-key**.
  Set it as repository variable `VITE_DISCOVERMASS_KEY` to add the PDF link and
  the last four issues to the Bulletin page.

**Before cancelling eCatholic**
- Export recurring donors from eCatholic Payments and move them to Flocknote;
  export 2026 giving records for year-end statements.
- Find out what "Light a Candle" does (if it takes payments, it ends with eCatholic).
- Export anything worth keeping: form submissions, photo albums, news posts,
  devotion page text.
- Old pages with no new home (currently redirected): Queen of Peace Cenacle,
  Serra, 31 Club, individual shrine pages, Holy Orders, Divine Office, resource
  pages — decide whether to add content for any of them.
- Check the contract end date.

**Known gaps for later (not launch blockers)**
- Staff dashboard edits save only in the editor's browser; real login is needed
  before connecting it (and before #30/#31).
- `npm run lint` checks only `.js` files (ESLint 8 skips `.jsx`); about 22
  small `.jsx` lint errors exist.
- Contact/registration form backend with spam protection.

## Local setup on this Mac

- Working copy: `~/Desktop/st-dom-yt-website` (the `-main` folder is an old ZIP
  download and can be deleted).
- Node 22 and the GitHub CLI are installed in `~/.local/bin`.
- Preview: `.claude/launch.json` entry `new-site` (http://localhost:5174).
