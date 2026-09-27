# Phil Linley: portfolio

I'm a frontend engineer in Columbus, Ohio. I build accessible, component-based web products, and I run [Lorien Web](https://lorienweb.com), a small studio that builds sites and web apps for small businesses, churches, and nonprofits.

This repo is the evidence behind that sentence: case studies of shipped client work, the decision records written while building it, and a tool I use on real sites that you can run yourself.

## Featured work

### [Hope Presbyterian Church](case-studies/hope-church/README.md)

Moved a church website off a hosted platform onto Next.js and Sanity, starting from a 22-point audit. Kept key URLs working, gave staff structured editing in Sanity with accessibility guardrails built into the fields, and added an automated WCAG 2.2 scan.

[Case study](case-studies/hope-church/README.md) · [Decision records](case-studies/hope-church/decisions/README.md) · [Accessibility results](case-studies/hope-church/accessibility.md) · [Live site](https://www.hopechurchcolumbus.org)

### [Dragonfly](case-studies/dragonfly/README.md)

[One line: what it replaced and what it does.]

[Case study](case-studies/dragonfly/README.md) · [Live site, if public]

## Tools

### [a11y-scan](tools/a11y-scan/README.md)

Runs axe-core (WCAG 2.2 A and AA) against every page in a site's sitemap and exits non-zero on serious issues, so it can gate CI. Works on any site with a sitemap.

```bash
cd tools/a11y-scan && npm install && npx playwright install chromium
node a11y-scan.mjs https://www.hopechurchcolumbus.org --first-party-only
```

## How I work

- **Accessibility is a requirement, not a polish step.** I target WCAG 2.2 AA. Automated scans catch part of it; keyboard, screen reader, and zoom testing cover the rest, and I publish what's still broken alongside what passes.
- **Decisions get written down.** Each project keeps short decision records: what I chose, what I rejected, and what it costs.
- **Clients can run their own sites.** Content lives in structured CMS fields with guardrails, like required image descriptions and a fixed set of heading levels, so editors can publish without a developer.
- **AI-assisted, human-owned.** I use Claude Code daily. I own the architecture and review everything it writes.

## How to read this repo

```
case-studies/
  hope-church/
    README.md          The case study
    accessibility.md   Current scan results and known issues
    decisions/         Decision records
  dragonfly/
    README.md          The case study
tools/
  a11y-scan/           Accessibility scanner (runnable)
.github/workflows/     CI for the scanner
```

Start with a case study, then follow its links into the decision records and scan results.

## About the source code

Client source code lives in private repositories, out of respect for my clients. I'm happy to walk through it on a call or grant read access for review on request: [LinkedIn](https://www.linkedin.com/in/phil-linley)

## License

The [MIT license](LICENSE) covers the code in [`tools/`](tools/) only. Case study and decision record text is © Phil Linley, all rights reserved.
