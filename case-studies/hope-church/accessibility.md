# Accessibility: Hope Church

Site: [hopechurchcolumbus.org](https://www.hopechurchcolumbus.org)

Target: WCAG 2.2 Level AA across every public page.

## How it's tested

**Automated:** [`a11y-scan`](../../tools/a11y-scan/README.md) runs axe-core against every URL in the sitemap (see [decision 0003](decisions/0003-automated-accessibility-scans.md)). It runs from this repo's [GitHub Actions workflow](../../.github/workflows/a11y.yml) on demand, and weekly once the fixes below ship.

```bash
cd tools/a11y-scan
node a11y-scan.mjs https://www.hopechurchcolumbus.org --first-party-only   # the site's own code
node a11y-scan.mjs https://www.hopechurchcolumbus.org --fail-on=none       # everything, including embeds
```

**Manual:** [keyboard-only pass, screen reader (NVDA / VoiceOver), 200% zoom, reduced motion. Record dates and findings here.]

## Current status

Scan of all 51 sitemap pages on September 27, 2026, with `--first-party-only`. 44 pages pass; 7 have issues in the site's own code. All are serious-impact color contrast (plus one link-styling issue), and most trace back to a few shared styles. No critical issues.

| Issue | Where | Measured | Needs | Likely fix |
| --- | --- | --- | --- | --- |
| Coral link on blue background | /kids | 1.58:1 | 4.5:1 | Use white or a light tint for links on blue sections |
| Coral link not distinguishable from body text | /kids | 2.92:1 vs. text | 3:1 or underline | Underline inline links |
| `text-white/70` on brand blue | /give, /work-mentors | 4.28:1 | 4.5:1 | Raise to `text-white/80` or higher |
| Light accent text on blue | /give | 3.62:1 | 4.5:1 | Lighten or enlarge |
| Small date labels (`#4d849c`, 12px) | /events | 4.12:1 | 4.5:1 | Darken the brand tint |
| Coral heading accent (`text-coral-light`) | /mercy | 2.13:1 | 3:1 (large text) | Darken the coral |
| Light blue accent text on white (12px) | /mission-vision-values | 1.89:1 | 4.5:1 | Darken, or mark decorative |
| Large faded numerals (`text-coral-button/40`) | /give | 1.75:1 | 3:1 | If decorative, `aria-hidden="true"`; if meaningful, darken |
| Large faded watermark text | /what-we-believe | 1.14 to 1.2:1 | 3:1 | If decorative, `aria-hidden="true"` |

Decorative text that repeats nearby content can be hidden from assistive tech with `aria-hidden="true"`, which also removes it from contrast checks. Anything that carries meaning needs to meet contrast.

## Third-party embeds

A full scan with embeds included, on the same date, flags 15 pages: the 7 above plus 8 more whose only issues are inside third-party iframes. These can't be fixed in the site's codebase:

- **Church Center calendar** (/events): missing ARIA parent and child roles, unlabeled icons.
- **Spotify player** (/sermons and 6 Prepare for Sunday posts): missing ARIA child roles, invalid definition-list markup, low-contrast text.
- **YouTube player** (/what-to-expect): disallowed and prohibited ARIA attributes.

Mitigations: every embed already has a descriptive `title`. Where one is missing, add a plain link to the same content (for example, "View the full calendar" or "Open the playlist in Spotify") next to each embed.

## Known limits of the scan

- Automated tools find only part of WCAG failures. Passing the scan is a floor, not a certification.
- Scroll-triggered animations leave text semi-transparent until they finish. The script scrolls each page and waits before scanning, but a few results can still vary between runs; rerun before treating one as real.
