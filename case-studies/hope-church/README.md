# Hope Presbyterian Church

*From a locked-in church platform to a site volunteers can run*

I audited my church's website, used the findings as a spec, and rebuilt it from a hosted church platform onto Next.js and Sanity, as the sole developer from discovery through launch and ongoing maintenance.

| 22 | 21 | 12 |
| :-: | :-: | :-: |
| audit recommendations used as the spec | main pages rebuilt | recommendations fully shipped, 4 more partly |

| | |
| :-- | :-- |
| **Role** | Sole developer and designer, through Lorien Web, at a reduced rate for my own church |
| **Stack** | Next.js, React, TypeScript, Sanity CMS, Vercel |
| **Timeline** | Audit February 2026, launched August 2026 |
| **Scope** | 21 main pages, 185 sermons in 10 series, events pulled from Planning Center |
| **Live site** | [hopechurchcolumbus.org](https://www.hopechurchcolumbus.org) |
| **Code** | Private; available to review on request |

Also in this folder: [decision records](decisions/README.md) and [current accessibility results](accessibility.md).

## The situation: a front door that was holding the church back

Hope Presbyterian is a congregation near Ohio State, and its website was its front door for first-time visitors, families, and students. Since 2018 it had run on Church Plant Media, a hosted church-website platform, which limited what we could build and had accessibility gaps the platform didn't let us fix.

- **Cost:** about $30 a month plus hosting, for a template site with no custom features.
- **Flexibility:** the template structure couldn't support what the audit called for: a flatter navigation, a dedicated path for first-time visitors, and landing pages for families and Ohio State students.
- **Accessibility:** a three-level nested navigation duplicated in the markup for mobile and desktop, vague link text, and contrast issues, none of which the templates let us correct.

## Discovery: starting with an audit

Before writing code, I audited the old site in February 2026 and produced 22 prioritized recommendations. That list became the spec for the rebuild.

The audit covered navigation, content, SEO, conversion, trust signals, audience needs, and accessibility. The biggest findings:

- **Insider navigation.** Menu labels like "Surprise" and "M3" meant nothing to a first-time visitor, and an internal "Teachers" page sat in the public menu.
- **Missing basics.** The address wasn't above the fold, and five competing calls to action left visitors without a clear next step.
- **Buried audiences.** Families, Ohio State students, and newcomers had no dedicated path; the OSU page sat three levels deep.
- **Accessibility risks.** Nested menus hurt keyboard navigation, link text like "Learn More" lacked context, and images and contrast needed review.

The audit was a heuristic review, not an automated scan, so it identified risks rather than counting violations. It did score the old site across ten categories: 4.9 out of 10 overall, and 5 out of 10 for accessibility.

## Decisions: choosing a stack for the people who run it

The core constraint was that non-technical staff and volunteers had to update the site without waiting on me: a staff member posts sermons and the weekly Prepare for Sunday post, volunteers update the weekly accessibility page, and staff manage events in Planning Center. Every choice below follows from that. The main ones are written up as [decision records](decisions/README.md).

### Why Next.js and Sanity

The audit's biggest fixes were structural, and the platform's template couldn't make them. A custom Next.js build let each page be designed for one audience and one job. Sanity keeps the content model in code, so I control its structure, and gives editors a Studio built around their weekly tasks instead of a blank page. Its free tier covers the church's content. See [decision 0001](decisions/0001-nextjs-and-sanity.md).

### Content model

Sanity holds sermons and sermon series, posts (news, Prepare for Sunday, and accessibility updates), home groups, staff, work mentors, supported organizations, testimonials, page heroes and photos, site settings, alert and popup banners, the weekly livestream, and podcast settings.

Each sermon is its own document with a reference to its series, plus date, speaker, Scripture reference, description, audio, video, and thumbnail. The same records feed the sermon archive, the series pages, and a podcast RSS feed. The audit called the sermon archive an underused SEO asset; giving every sermon structured Scripture and description fields turns weekly preaching into indexable content.

### Rendering and publishing

Pages are statically generated, including a page per sermon series and per post. Sanity content is fetched with a 60-second revalidation window, so when a volunteer hits Publish the change reaches the live site within about a minute, with no rebuild. Upcoming events from Planning Center refresh every five minutes.

### Integrations kept, not rebuilt

The church already ran events, forms, and giving through Planning Center, so those stayed there: staff enter an event once and it shows up on the site, and Church Center still handles forms, online giving, and the full calendar. BoxCast still carries the weekly livestream.

### Hosting

Vercel, on Lorien Web's Pro team. All image resizing happens on Sanity's image CDN through a custom loader, so Vercel's billed image optimization is never used.

## Migration: moving everything without breaking links

### Content

The sermon archive came out through the old site's podcast feed: I downloaded the audio while the feed was still live, then imported it into Sanity with a seed script that reads the audio files and a JSON manifest, 185 sermons across 10 series. Page copy was rewritten rather than copied over, drafted in a shared document and reviewed by church staff before launch.

The messiest part was the podcast. The Casting Hope feed and its audio files lived on the old platform's servers, so they had to move to a new podcast host before the old platform could be cancelled. The new site also serves a podcast feed at the old `/feeds/sermons` address.

### URLs and redirects

Existing links from search results, bulletins, and emails had to keep working. I kept stable paths where they made sense (for example, `/mission-vision-values` and `/visit` survived the move) and added permanent redirects at cutover for `/about` and `/where-to-find-us`.

That map was incomplete. A check against the old site's URLs in September 2026 found five that now return 404, including the weekly `/prepare` page, plus `/m3`, `/news-updates`, `/giving`, and `/hope-kids-teachers`. Redirects for them are the next fix. See [decision 0002](decisions/0002-preserve-urls.md).

### Cutover

The domain moved to Vercel on August 17, 2026, with the redirects committed the same day.

### Handoff

Editors got a written Studio guide, "Getting Around in Sanity," plus two companion guides for the weekly jobs: updating the accessibility page, and updating sermons and Prepare for Sunday. The Studio itself is organized to match the site's navigation, and each editing form is split into short tabs with plain-language labels and help text.

## Accessibility: built to welcome everyone

On September 27, 2026, I scanned all 51 pages in the sitemap (the 21 main pages plus sermon series, news, and weekly posts) with axe-core against WCAG 2.2 A and AA rules, using the [a11y-scan tool](../../tools/a11y-scan/README.md) in this repo. 44 pages pass. 7 have issues in the site's own code, all serious-impact color contrast plus one link that relies on color alone, and most trace back to a few shared styles. There are no critical issues. The full list, with measured ratios and fixes, is in [accessibility.md](accessibility.md).

### What changed structurally

- Navigation flattened to five top-level items with one level of dropdowns, plus a single "Plan a Visit" call to action. The menu is rendered once in the markup; the mobile menu is only added to the page when it's opened, instead of a second copy sitting hidden.
- Insider labels replaced with plain ones, and link text that describes its destination.
- A dedicated accessibility page, updated weekly by volunteers.
- Guardrails in the CMS: editors can't publish a body image without a description, and rich text is limited to heading levels 2 through 4 so page structure stays intact. The one exception is an opt-in HTML field added for the weekly accessibility posts, which bypasses those guardrails.
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

*The mission reason mattered more than compliance: a church that talks about welcoming everyone shouldn't have a website that shuts some people out.*

## Results: from audit to shipped

12 of the audit's 22 recommendations are fully shipped and 4 are partly done, checked against the live site and code on September 27, 2026. 4 aren't done, and 2 depend on settings outside the site.

| Recommendation | Status | Evidence |
| :-- | :-- | :-- |
| Rename "Surprise" in navigation | **Done** | Label no longer on the site |
| Address and service time above the fold | **Done** | In the homepage hero, inside the first screen at 1280x800 |
| Remove "Teachers" from public navigation | **Partial** | Moved from the menu to the footer, behind a password |
| Rename "M3" to Work Mentors | **Done** | Label no longer on the site |
| New visitor page | **Done** | /visit, /what-to-expect, /prepare-for-sunday |
| One primary homepage call to action | **Done** | One "Plan a Visit" button in the hero, repeated in the header |
| Email signup | Not done | No email field on the homepage |
| Pastor photo and bio on homepage | Not done | Only on /leadership |
| Three testimonials on homepage | Not done | None found |
| "By the Numbers" section | Not done | None found |
| Google Business Profile | *[Confirm]* | Off-site |
| Title tags and meta descriptions | **Partial** | Homepage meta now has time and location; title unchanged |
| Expand HopeKids page | **Partial** | Age groups, Sunday walkthrough, and check-in process; no parent testimonial yet |
| Home group descriptions | **Done** | Meeting times, locations, hosts, and format for each group |
| Audience selector on homepage | **Done** | "Find your starting point" cards: New to Hope, kids, Ohio State |
| Flatten navigation to two levels | **Done** | Five top-level items, each with at most one level of dropdown |
| Alt text on all images | **Done** | No missing alt text flagged across 51 pages; the CMS requires a description on body images |
| Expand Hope for the City | **Done** | /mercy covers partner ministries, what the church does with each, and how to volunteer |
| Young Adults / OSU landing page | **Done** | /ohio-state plus a homepage card |
| Sermon summaries and Scripture references | **Partial** | Scripture and series descriptions shown; check per-sermon summaries |
| Captions on sermon video | *[Confirm]* | BoxCast setting |
| Schema markup | **Done** | Church JSON-LD on every page, plus page-level structured data |

The four not-done items are mostly content only the church can supply, like testimonials, attendance figures, and a pastor introduction.

## Process: how I used AI

I used Claude Code and Cursor throughout (the repo carries project instructions for both), and I made the architecture, content model, and accessibility decisions myself.

- **Where it helped:** *[e.g. scaffolding Sanity schemas, drafting migration scripts, first-pass code review]*.
- **Where I overrode it:** *[one specific example where its suggestion was wrong or inaccessible and what you did instead. This is the most persuasive line in the section.]*
- **What I verified by hand:** *[keyboard and screen reader testing, redirect map, cutover]*.

## Reflection: what I'd do differently

- **Measure before, not just after.** The audit identified accessibility risks but didn't count them, so I can't show a clean before-and-after number.
- **Plan content work alongside the build.** The unfinished items (testimonials, stats, pastor intro) needed content from church leadership; starting those requests at kickoff would have let them ship at launch.
- **Build the redirect map from the old site's real URLs.** The redirects at cutover covered two moved pages. Five other old URLs, including a page linked every week, returned 404 until a check a month after launch. Next time I'd crawl the old sitemap before cutover and test every URL on it against the new site.

---

Phil Linley · [Lorien Web](https://lorienweb.com) · [LinkedIn](https://www.linkedin.com/in/phil-linley)
