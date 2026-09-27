# a11y-scan

Scans every page in a site's sitemap for WCAG 2.2 Level A and AA issues using [axe-core](https://github.com/dequelabs/axe-core) in headless Chromium, prints a per-page summary, and writes a JSON report. The exit code makes it usable as a CI gate.

I wrote it for the [Hope Church site](../../case-studies/hope-church/README.md), then made it generic: point it at any site that serves a sitemap.

## Setup

```bash
cd tools/a11y-scan
npm install
npx playwright install chromium
```

Requires Node 20 or newer.

## Usage

```bash
node a11y-scan.mjs https://example.com
node a11y-scan.mjs http://localhost:3000 --first-party-only --fail-on=critical
BASE_URL=https://example.com node a11y-scan.mjs --limit=10
```

Sample output:

```
Scanning 21 pages on https://example.com (first-party only, iframes excluded)

  pass  /
  pass  /about  (manual review: color-contrast)
  FAIL  /events
        [serious] color-contrast: Elements must meet minimum color contrast ratio thresholds (3 elements)

21 pages: 20 pass, 1 with violations, 0 errored. Report: a11y-report.json
1 issue(s) at "serious" or above, or pages that failed to load. Failing.
```

## Options

| Flag | Default | What it does |
| --- | --- | --- |
| `[url]` | `BASE_URL` env var | Site to scan. Only the origin is used. |
| `--first-party-only` | off | Excludes iframes, where third-party embeds (calendars, video players, forms) usually live. Use it to gate CI on code you control; run without it to see everything. |
| `--fail-on=<level>` | `serious` | Lowest axe impact that fails the run: `minor`, `moderate`, `serious`, `critical`, or `none` for report-only. |
| `--sitemap=<path\|url>` | `/sitemap.xml` | Sitemap location. Sitemap indexes are followed. |
| `--limit=<n>` | all pages | Scan at most `n` pages. Handy for a quick check. |
| `--out=<file>` | `a11y-report.json` | Where to write the JSON report. |

| Env var | Default | What it does |
| --- | --- | --- |
| `BASE_URL` | none | Site to scan when no URL argument is given. |
| `CONCURRENCY` | `4` | Pages scanned in parallel. |
| `VERCEL_BYPASS_TOKEN` | none | For Vercel previews behind Deployment Protection. Sent as `x-vercel-protection-bypass`, only to the scanned origin, never to third-party requests. |

Exit codes: `0` nothing at or above `--fail-on`; `1` violations at or above `--fail-on`, or a page failed to load (unless `--fail-on=none`); `2` bad arguments or an unreadable sitemap.

## How it works

1. Fetches the sitemap and collects every `<loc>`, following sitemap indexes and de-duplicating.
2. Rewrites each URL onto the target origin, so a sitemap that lists production URLs still works against `localhost` or a preview deployment.
3. Opens each page with `prefers-reduced-motion: reduce`, waits for the network to go idle, and treats HTTP 4xx and 5xx responses as errors.
4. Scrolls to the bottom and back, then waits 1.5 seconds, so scroll-triggered entrance animations finish before axe measures contrast.
5. Runs axe with the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa` tags and records violations plus "needs review" items.

## Report format

```json
{
  "baseUrl": "https://example.com",
  "sitemap": "https://example.com/sitemap.xml",
  "firstPartyOnly": true,
  "failOn": "serious",
  "scannedAt": "2026-09-27T14:00:00.000Z",
  "tags": ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
  "pages": [
    {
      "url": "https://example.com/events",
      "violations": [
        {
          "id": "color-contrast",
          "impact": "serious",
          "help": "Elements must meet minimum color contrast ratio thresholds",
          "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/color-contrast",
          "nodes": [{ "target": [".date-label"], "summary": "Fix any of the following: ..." }]
        }
      ],
      "needsReview": []
    }
  ]
}
```

Pages that fail to load have an `error` field instead of `violations`.

## CI

[`.github/workflows/a11y.yml`](../../.github/workflows/a11y.yml) runs the scan on demand from the Actions tab (with a URL input) and uploads the report as a build artifact. A weekly schedule is written but commented out until the Hope Church fixes ship.

## Known limits

- **Automated checks are a floor, not a certification.** axe finds a subset of WCAG failures. Keyboard access, focus order, screen reader output, zoom, and whether content makes sense still need manual testing.
- **Sitemap only.** Pages missing from the sitemap aren't scanned, and there's no crawler fallback. Pages behind a login aren't reachable.
- **Only the initial page state is scanned.** Menus, modals, accordions, and form error states aren't opened.
- **One viewport.** Scans run at Playwright's default desktop size; mobile-only layouts aren't covered.
- **Animation timing can vary.** The scroll-and-wait step handles most entrance animations, but a slow page can still produce a contrast result that doesn't reproduce. Rerun before treating a single contrast failure as real.
- **`--first-party-only` is a blunt rule.** It excludes all iframes, including any the site owner does control.
- **`networkidle` can time out** on pages with long-polling or streaming connections. Those pages show up as errors after 45 seconds.
