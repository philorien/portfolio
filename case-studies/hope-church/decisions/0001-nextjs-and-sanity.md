# 0001: Rebuild on Next.js and Sanity

**Status:** Accepted · **Date:** February 2026

## Context

Since 2018 the site had run on Church Plant Media, a hosted church-website platform. It cost about $30 a month plus hosting, its templates limited what we could build, and it had accessibility problems we couldn't fix from inside the platform: a three-level navigation duplicated in the markup, vague link text, and contrast issues. A February 2026 audit produced 22 recommendations, several of which the platform couldn't support.

Whatever replaced it had to be something staff and volunteers could update without a developer: a staff member posting sermons and the weekly Prepare for Sunday post, volunteers updating the weekly accessibility page, and staff managing events.

## Decision

Rebuild as a Next.js site with Sanity as the CMS, hosted on Vercel. Events, forms, and giving stay in Planning Center, and the livestream stays on BoxCast.

## Alternatives considered

- **Stay on the platform.** Its template structure couldn't support the audit's biggest fixes: a flatter navigation, a dedicated path for first-time visitors, and landing pages for families and Ohio State students.
- **Make the audit's quick fixes on the platform first.** The audit included a 90-day plan of low-effort changes, like renaming menu labels and adding the address to the homepage. Those would have helped, but the structural problems would have remained, so the effort went into the rebuild instead.

## Consequences

- Editors work in structured fields rather than a freeform page, with guardrails: body images can't be published without a description, and rich text only offers heading levels 2 through 4. The exception is an opt-in raw HTML body on posts, added for the weekly accessibility posts, which bypasses those guardrails.
- The site depends on one developer's knowledge of the codebase. Mitigation: Lorien Web stays on as site administrator, editors have written guides for their weekly tasks, and the repo has a plain-language README for whoever maintains it next.
- Hosting runs on Lorien Web's Vercel Pro team, and Sanity's free tier covers the church's content.
