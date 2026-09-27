# 0003: Run automated accessibility scans in CI

**Status:** Accepted · **Date:** September 2026

## Context

Accessibility was one of the main reasons for the rebuild, but without a regular check, regressions can slip in whenever content or components change. A one-off scan in September 2026 found issues that manual review had missed.

## Decision

Use [`a11y-scan`](../../../tools/a11y-scan/README.md), a script that runs axe-core (WCAG 2.2 A and AA rules) against every URL in the sitemap. A GitHub Actions workflow in this portfolio repo runs it against production:

- on demand, against any URL
- weekly, once the current contrast fixes are deployed and the scan passes

The run fails on serious or critical issues in the site's own code. Third-party embeds (the events calendar and YouTube players) are excluded from the gate with `--first-party-only`, since their markup can't be fixed from this codebase. A manual run without that flag shows the full picture.

## Alternatives considered

- **Lighthouse CI.** Useful for performance, but its accessibility score summarizes rather than lists every failure.
- **Manual audits only.** Necessary but infrequent; they don't catch regressions between audits.
- **Scanning every Vercel preview deployment from the site repo.** Catches regressions before they reach production, which a production scan can't. Not set up yet.

## Consequences

- Automated checks cover only part of WCAG. Keyboard, screen reader, and zoom testing stay manual. See [accessibility.md](../accessibility.md).
- Scroll-triggered animations can cause false contrast failures, so the script scrolls each page and waits for animations to settle before scanning.
- A production-only scan finds regressions after they ship, not before.
