# Dragonfly Bookshop

*A first website for an independent bookstore, built around the systems the shop already runs on*

| 1,206 | 2,994 | 68% |
| :-: | :-: | :-: |
| visitors in the first month | page views in the first month | of visitors on a phone |

| | |
| :-- | :-- |
| **Client** | Dragonfly Bookshop, an independent bookstore in Hilliard, Ohio |
| **Role** | Sole designer and developer, through Lorien Web; ongoing updates since launch |
| **Stack** | Next.js, React, TypeScript, Tailwind CSS, Square API, Airtable, Resend, Vercel |
| **Timeline** | Prototype February 2026, proposal March 2026, launched April 2026, updates ongoing |
| **Live site** | [dragonflybookshop.com](https://www.dragonflybookshop.com) |
| **Code** | Private; available to review on request |

## The problem

The shop's GoDaddy domain wasn't properly connected to its Square site, and the shop wanted more than a storefront could give it: a branded site, a way for customers to request books it didn't have on the shelf, and a place to showcase the local authors it supports.

The shop already ran on other tools: Square at the register, and a Bookshop.org storefront for online sales. The new site had to work with those, not replace them.

## What I built

- **A catalog pulled from Square.** Staff picks, genre pages, and local authors' books come from the shop's Square catalog, read only. Staff keep using the register they already know, and the site doesn't need its own inventory.
- **Online special orders.** Customers request a book the shop doesn't have through `/ordering`. Requests land in an Airtable base for staff, and the page points anyone who wants to buy right away to the shop's Bookshop.org page.
- **Events.** A Luma calendar embedded on the homepage and events page, plus dedicated pages for bigger events like the shop's bookcrawl, a book fair, and a midnight release party.
- **Local authors.** A page showcasing Hilliard writers, with a Google Form for authors to submit themselves for review.
- **Contact form and store hours.** The contact form sends email through Resend, and store hours can sync from the shop's Google Business Profile.
- **A plain-English site guide** in the repo, written for whoever maintains the site after me.

## Key decisions

- **No shopping cart.** Online sales go through the shop's Bookshop.org page, which already pays the shop on those sales, so e-commerce was left out of the first phase.
- **Square as the source of truth.** Reading the catalog from Square means no double entry: a book added at the register can show up on the site.
- **Airtable for special orders.** Requests land in a table staff can work through, with no custom admin screen to build or maintain.
- **Not IndieCommerce, yet.** In August 2026 I evaluated IndieCommerce, the American Booksellers Association's e-commerce platform for independent bookstores. It would keep checkout on the shop's own domain and automate special orders, but it runs on Drupal and can't sit behind the current site, it doesn't sync with Square, and it requires ABA membership. I recommended revisiting it only if the special-order workflow becomes a bottleneck.

## Results

In the first month live (April 4 to May 3, 2026, from Vercel Web Analytics):

- **1,206 visitors and 2,994 page views,** about 2.5 pages per visitor, with a 36% bounce rate.
- **Google search was the top source** of visitors (596), followed by Instagram (99).
- **The two most-read pages after the homepage were the ones that matter to the business:** events (390 visitors) and ordering (272).
- **68% of visitors were on a phone,** so mobile layouts for the homepage, events, and ordering pages matter most.

The shop kept me on for ongoing updates: new event pages, catalog changes, and fixes, over 50 commits since launch.

## How I used AI

The first commit, in February 2026, was a prototype generated with v0. I built it out from there with Claude Code; the repo carries its project instructions.

## What I'd do differently

- **Track whether visitors finish.** 272 people opened the ordering page in the first month, but analytics only measured page visits, not submitted requests, so I can't say how well the form converts.
- **Close the loop on special orders.** The proposal included automatic notifications when a requested book arrives. That didn't ship; staff still follow up by text.
