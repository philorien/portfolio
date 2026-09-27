# 0001: Rebuild on Next.js and Sanity

**Status:** Accepted · **Date:** [month year]

## Context

The site ran on a hosted church-website platform. It cost [$X/year], its templates limited what we could build, and it had accessibility problems we couldn't fix from inside the platform: a three-level navigation duplicated in the markup, vague link text, and contrast issues. A February 2026 audit produced 22 recommendations, several of which the platform couldn't support.

Whatever replaced it had to be something [staff and volunteers] could update without a developer.

## Decision

Rebuild as a Next.js site with Sanity as the CMS, hosted on Vercel.

## Alternatives considered

- **Stay on the platform.** [Why not.]
- **A general site builder (Squarespace, Wix).** [e.g. Cheaper and easy to edit, but the same lock-in and limited control over markup and accessibility.]
- **WordPress.** [e.g. Flexible, but plugin and security upkeep would fall on volunteers.]

## Consequences

- Editors work in structured fields rather than a freeform page, with guardrails: body images can't be published without a description, and rich text only offers heading levels 2 through 4. The exception is an opt-in raw HTML body on posts, which bypasses those guardrails.
- The site depends on one developer's knowledge of the codebase. Mitigation: [these docs, a handoff guide, a Lorien Web maintenance arrangement].
- [Hosting cost now / hosting plan terms confirmed for an organization's site.]
