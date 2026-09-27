# 0002: Preserve existing URLs and redirect the rest

**Status:** Accepted, partly implemented · **Date:** August 2026

## Context

Links to the old site lived in search results, printed bulletins, emails, and partner sites. Changing URLs without redirects would break all of them and lose search ranking.

## Decision

Keep existing paths wherever they still made sense (for example, `/mission-vision-values` and `/visit`), and add permanent (308) redirects for every old URL whose page moved or merged. Redirects live in the `redirects()` function in `next.config.mjs`, so they're versioned with the code and reviewed like any other change.

The old podcast feed address, `/feeds/sermons`, is served by the new site too, so podcast apps that still use it don't break.

## How the map was built

At cutover on August 17, 2026, redirects went in for the two pages known to have moved: `/about` to `/mission-vision-values` and `/where-to-find-us` to `/directions`. There was no full inventory of the old site's URLs.

## Consequences

- A check in September 2026 against URLs from the old site found five that return 404: `/prepare`, `/m3`, `/news-updates`, `/giving`, and `/hope-kids-teachers`. `/prepare` was linked every week. They need redirects to `/prepare-for-sunday`, `/work-mentors`, `/news`, `/give`, and `/teachers`.
- Internal-only pages like `/teachers` are left out of the sitemap, disallowed in `robots.txt`, and gated behind a password.
