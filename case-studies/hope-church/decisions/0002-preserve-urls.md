# 0002: Preserve existing URLs and redirect the rest

**Status:** Accepted · **Date:** [month year]

## Context

Links to the old site lived in search results, printed bulletins, emails, and partner sites. Changing URLs without redirects would break all of them and lose search ranking.

## Decision

Keep existing paths wherever they still made sense (for example, `/mission-vision-values`), and add permanent (308) redirects for every old URL whose page moved or merged. Redirects live in the `redirects()` function in `next.config.mjs`, so they're versioned with the code and reviewed like any other change.

## How the map was built

[e.g. Exported the old sitemap, listed every URL, mapped each to its new home or the closest equivalent, then checked every old URL returned a redirect or a 200 after launch.]

## Consequences

- Two redirects to maintain today: `/about` to `/mission-vision-values` and `/where-to-find-us` to `/directions`. [If other old URLs were handled elsewhere, or simply kept the same path, say so here.]
- Internal-only pages like `/teachers` are left out of the sitemap, disallowed in `robots.txt`, and gated behind a password.
