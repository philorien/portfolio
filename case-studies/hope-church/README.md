# Hope Presbyterian Church

*From a locked-in church platform to a site volunteers can run*

I audited my church's website, used the findings as a spec, and rebuilt it from a hosted church platform onto Next.js and Sanity, as the sole developer from discovery through launch and ongoing maintenance.

| 22 | 21 | *[N]* |
| :-: | :-: | :-: |
| audit recommendations used as the spec | main pages rebuilt | of 22 recommendations shipped |

| | |
| :-- | :-- |
| **Role** | Sole developer and designer (volunteer) |
| **Stack** | Next.js, React, TypeScript, Sanity CMS, Vercel |
| **Timeline** | Audit February 2026, launched *[month year]* |
| **Scope** | 21 main pages, *[N]* sermons, *[N]* events |
| **Live site** | [hopechurchcolumbus.org](https://www.hopechurchcolumbus.org) |
| **Code** | Private; available to review on request |

Also in this folder: [decision records](decisions/README.md) and [current accessibility results](accessibility.md).

## The situation: a front door that was holding the church back

Hope Presbyterian is a congregation near Ohio State, and its website was its front door for first-time visitors, families, and students. It ran on a hosted church-website platform that cost *[$X per year]*, limited what we could build, and had accessibility gaps the platform didn't let us fix.

I had maintained content on that platform since *[year]*. The limits were concrete:

- **Cost:** *[$X/year]* for a site with *[N]* pages and no custom features.
- **Flexibility:** *[one or two specific things you couldn't do, e.g. structure sermons by series and Scripture, or build a visitor landing page]*.
- **Accessibility:** a three-level nested navigation duplicated in the markup for mobile and desktop, vague link text, and contrast issues, none of which the templates let us correct.

## Discovery: starting with an audit

Before writing code, I audited the old site in February 2026 and produced 22 prioritized recommendations. That list became the spec for the rebuild.

The audit covered navigation, content, SEO, conversion, trust signals, audience needs, and accessibility. The biggest findings:

- **Insider navigation.** Menu labels like "Surprise" and "M3" meant nothing to a first-time visitor, and an internal "Teachers" page sat in the public menu.
- **Missing basics.** The address wasn't above the fold, and five competing calls to action left visitors without a clear next step.
- **Buried audiences.** Families, Ohio State students, and newcomers had no dedicated path; the OSU page sat three levels deep.
- **Accessibility risks.** Nested menus hurt keyboard navigation, link text like "Learn More" lacked context, and images and contrast needed review.

The audit was a heuristic review, not an automated scan, so it identified risks rather than counting violations. *[If you run WAVE or axe on Wayback Machine snapshots of the old site, add the measured counts here.]*

## Decisions: choosing a stack for the people who run it

The core constraint was that non-technical staff and volunteers had to update the site without waiting on me. *[Confirm who edits it day to day.]* Every choice below follows from that. The main ones are written up as [decision records](decisions/README.md).

### Why Next.js and Sanity

*[Your real reasons. Candidates to confirm or cut: a builder would repeat the lock-in and accessibility limits; WordPress means plugin and security upkeep for volunteers; Sanity gives editors structured fields instead of a blank page.]* See [decision 0001](decisions/0001-nextjs-and-sanity.md).

### Content model

Sanity holds sermons and sermon series, posts (news, Prepare for Sunday, and accessibility updates), home groups, staff, work mentors, supported organizations, testimonials, page heroes and photos, site settings, alert and popup banners, the weekly livestream, and podcast settings.

Each sermon is its own document with a reference to its series, plus date, speaker, Scripture reference, description, audio, video, and thumbnail. The same records feed the sermon archive, the series pages, and a podcast RSS feed. *[Why you modeled it this way; this is where the audit's sermon SEO recommendation is solved in the schema.]*

### Rendering and publishing

Pages are statically generated, including a page per sermon series and per post. Sanity content is fetched with a 60-second revalidation window, so when a volunteer hits Publish the change reaches the live site within about a minute, with no rebuild. Upcoming events from Planning Center refresh every five minutes. *[Why time-based revalidation rather than a Sanity webhook or server rendering.]*

### Integrations kept, not rebuilt

Church Center (Planning Center) still handles forms, online giving, and the full event calendar, and the site pulls upcoming events from the Planning Center Calendar API. BoxCast carries the weekly livestream. *[Why you integrated rather than replaced them.]*

### Hosting

Vercel. All image resizing happens on Sanity's image CDN through a custom loader, so Vercel's billed image optimization is never used. *[Plan and why. Confirm the plan's terms allow an organization's site.]*

## Migration: moving everything without breaking links

The old platform had *[no export / a limited export]*, so moving *[N]* pages and *[N]* sermons meant *[scripting the extraction / moving content by hand / a mix]*.

### Content

*[How you got content out, what you cleaned up on the way, and the messiest part.]*

### URLs and redirects

Existing links from search results, bulletins, and emails had to keep working. I kept stable paths where they made sense (for example, `/mission-vision-values` survived the move) and added permanent redirects for pages that moved: `/about` to `/mission-vision-values` and `/where-to-find-us` to `/directions`. *[How you built the URL map, and whether any other old URLs needed handling.]* See [decision 0002](decisions/0002-preserve-urls.md).

### Cutover

*[DNS switch, how long it took, any downtime, and your rollback plan if launch went wrong.]*

### Handoff

*[How editors learned the new CMS: a walkthrough, a short guide, custom Studio labels or help text.]*

## Accessibility: built to welcome everyone

On September 27, 2026, I scanned all 51 pages in the sitemap (the 21 main pages plus sermon series, news, and weekly posts) with axe-core against WCAG 2.2 A and AA rules, using the [a11y-scan tool](../../tools/a11y-scan/README.md) in this repo. 44 pages pass. 7 have issues in the site's own code, all serious-impact color contrast plus one link that relies on color alone, and most trace back to a few shared styles. There are no critical issues. The full list, with measured ratios and fixes, is in [accessibility.md](accessibility.md). Automated tools catch only a portion of issues, so I also tested by hand.

### What changed structurally

- Navigation flattened to five top-level items with one level of dropdowns, plus a single "Plan a Visit" call to action. The menu is rendered once in the markup; the mobile menu is only added to the page when it's opened, instead of a second copy sitting hidden.
- Insider labels replaced with plain ones, and link text that describes its destination.
- A dedicated accessibility page.
- Guardrails in the CMS: editors can't publish a body image without a description, and rich text is limited to heading levels 2 through 4 so page structure stays intact.
- Visible focus styles defined in the global stylesheet. *[Caption status for BoxCast.]*

### Manual testing

*[Keyboard-only pass on every page, screen reader tested (NVDA or VoiceOver), zoom to 200%, what you found and fixed.]*

### Automated results

| Check | Result |
| :-- | :-- |
| Pages scanned | 51 (every URL in the sitemap) |
| Pages passing | 44 |
| Pages with issues in the site's code | 7: color contrast on /events, /give, /kids, /mercy, /mission-vision-values, /what-we-believe, and /work-mentors; link distinguishable only by color on /kids |
| Critical issues | 0 |
| Third-party embeds | Issues inside the Church Center calendar, Spotify, and YouTube iframes on 9 pages; outside this codebase, so excluded from the pass/fail gate |
| Flagged for manual review | Color contrast of text over images and backgrounds on most pages, *[reviewed]* |

*The mission reason mattered more than compliance: a church that talks about welcoming everyone shouldn't have a website that shuts some people out.*

## Results: from audit to shipped

*[N]* of the audit's 22 recommendations shipped with the rebuild. Checked against the live site on September 27, 2026: 7 done, 4 partial, 4 not done, and 7 *[to confirm]*.

| Recommendation | Status | Evidence |
| :-- | :-- | :-- |
| Rename "Surprise" in navigation | **Done** | Label no longer on the site |
| Address and service time above the fold | **Partial** | On the page and in the meta description, but not in the first screen at 1280x800 |
| Remove "Teachers" from public navigation | **Partial** | Moved from the menu to the footer |
| Rename "M3" to Work Mentors | **Done** | Label no longer on the site |
| New visitor page | **Done** | /visit, /what-to-expect, /prepare-for-sunday |
| One primary homepage call to action | *[Confirm]* | "Plan a Visit" in the header; check the hero |
| Email signup | Not done | No email field on the homepage |
| Pastor photo and bio on homepage | Not done | Only on /leadership |
| Three testimonials on homepage | Not done | None found |
| "By the Numbers" section | Not done | None found |
| Google Business Profile | *[Confirm]* | Off-site |
| Title tags and meta descriptions | **Partial** | Homepage meta now has time and location; title unchanged |
| Expand HopeKids page | *[Confirm]* | /kids exists |
| Home group descriptions | *[Confirm]* | /groups exists |
| Audience selector on homepage | **Done** | "Find your starting point" cards: New to Hope, kids, Ohio State |
| Flatten navigation to two levels | **Done** | Five top-level items, each with at most one level of dropdown |
| Alt text on all images | **Done** | No missing alt text flagged across 51 pages; the CMS requires a description on body images |
| Expand Hope for the City | *[Confirm]* | /mercy exists |
| Young Adults / OSU landing page | *[Confirm]* | /ohio-state plus homepage card |
| Sermon summaries and Scripture references | **Partial** | Scripture and series descriptions shown; check per-sermon summaries |
| Captions on sermon video | *[Confirm]* | BoxCast setting |
| Schema markup | **Done** | Church JSON-LD on every page, plus page-level structured data |

The four not-done items are mostly content only the church can supply, like testimonials and attendance figures. *[Say why they're pending: a reviewer will respect a clear reason more than a perfect score.]*

*[Add other outcomes if you have them: hosting cost before and after, Lighthouse scores, visitor or form-submission changes, editor feedback.]*

## Process: how I used AI

I used *[Claude Code / other tools]* throughout, and I made the architecture, content model, and accessibility decisions myself.

- **Where it helped:** *[e.g. scaffolding Sanity schemas, drafting migration scripts, first-pass code review]*.
- **Where I overrode it:** *[one specific example where its suggestion was wrong or inaccessible and what you did instead. This is the most persuasive line in the section.]*
- **What I verified by hand:** *[keyboard and screen reader testing, redirect map, cutover]*.

## Reflection: what I'd do differently

- **Measure before, not just after.** The audit identified accessibility risks but didn't count them, so I can't show a clean before-and-after number.
- **Plan content work alongside the build.** The unfinished items (testimonials, stats, pastor intro) needed content from church leadership; starting those requests at kickoff would have let them ship at launch.
- *[Something technical: a schema you'd model differently, a redirect you missed, a rendering choice you'd revisit.]*

---

Phil Linley · [Lorien Web](https://lorienweb.com) · [LinkedIn](https://www.linkedin.com/in/phil-linley)
