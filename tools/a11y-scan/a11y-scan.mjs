#!/usr/bin/env node
/**
 * Automated accessibility scan (axe-core, WCAG 2.2 A + AA) for every page in a
 * site's sitemap.
 *
 * Reads the sitemap (following sitemap indexes), runs axe on each page in
 * headless Chromium, prints a summary, and writes a JSON report.
 *
 * Usage:
 *   node a11y-scan.mjs https://example.com
 *   node a11y-scan.mjs http://localhost:3000 --fail-on=critical
 *   BASE_URL=https://example.com node a11y-scan.mjs --first-party-only
 *
 * Exit codes: 0 no issues at or above --fail-on, 1 issues found (or pages
 * failed to load), 2 bad arguments or the sitemap could not be read.
 *
 * Automated checks catch only part of WCAG. Keyboard, screen reader, and zoom
 * testing still have to happen by hand.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";

const HELP = `Usage: node a11y-scan.mjs [url] [options]

  url                     Site to scan. Falls back to the BASE_URL env var.

Options:
  --first-party-only      Exclude iframes (third-party embeds) from the scan.
  --fail-on=<level>       minor | moderate | serious | critical | none (default: serious)
  --sitemap=<path|url>    Sitemap location (default: /sitemap.xml)
  --limit=<n>             Scan at most n pages.
  --out=<file>            Report path (default: a11y-report.json)
  --help                  Show this message.

Environment:
  BASE_URL                Site to scan, if no url argument is given.
  CONCURRENCY             Pages scanned in parallel (default: 4).
  VERCEL_BYPASS_TOKEN     Sent as x-vercel-protection-bypass to the target origin only.`;

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SEVERITY = ["minor", "moderate", "serious", "critical"];

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(HELP);
  process.exit(0);
}
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

function usageError(message) {
  console.error(`${message}\n\n${HELP}`);
  process.exit(2);
}

const target = args.find((a) => !a.startsWith("--")) || process.env.BASE_URL;
if (!target) usageError("No site given. Pass a URL or set BASE_URL.");
let ORIGIN;
try {
  ORIGIN = new URL(target).origin;
} catch {
  usageError(`Not a valid URL: ${target}`);
}

const failOn = flag("fail-on") || "serious";
if (failOn !== "none" && !SEVERITY.includes(failOn)) {
  usageError(`Unknown --fail-on value "${failOn}". Use one of: ${[...SEVERITY, "none"].join(", ")}`);
}
const failIndex = failOn === "none" ? Infinity : SEVERITY.indexOf(failOn);

// Iframes usually hold third-party embeds (calendars, video players, forms)
// whose markup the site owner can't fix. --first-party-only excludes them so a
// CI gate reflects the site's own code; run without it to see everything.
const firstPartyOnly = args.includes("--first-party-only");
const sitemapUrl = new URL(flag("sitemap") || "/sitemap.xml", ORIGIN).href;
const limit = flag("limit") ? Number(flag("limit")) : Infinity;
const outFile = flag("out") || "a11y-report.json";
const CONCURRENCY = Math.max(1, Number(process.env.CONCURRENCY || 4));
const bypassToken = process.env.VERCEL_BYPASS_TOKEN;
const bypassHeaders = bypassToken ? { "x-vercel-protection-bypass": bypassToken } : {};

const decodeXml = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

// Returns page URLs from a sitemap, following <sitemapindex> entries.
async function readSitemap(url, depth = 0) {
  const res = await fetch(url, { headers: bypassHeaders });
  if (!res.ok) throw new Error(`Could not load sitemap ${url}: HTTP ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gs)].map((m) => decodeXml(m[1]));
  if (/<sitemapindex[\s>]/.test(xml)) {
    if (depth > 2) throw new Error(`Sitemap indexes nested too deeply at ${url}`);
    const nested = [];
    for (const loc of locs) nested.push(...(await readSitemap(loc, depth + 1)));
    return nested;
  }
  return locs;
}

async function getUrls() {
  const locs = await readSitemap(sitemapUrl);
  // Sitemaps usually list production URLs. Rewrite them onto the target origin
  // so the same sitemap works for local and preview scans.
  const urls = locs.map((loc) => {
    const u = new URL(loc);
    return new URL(u.pathname + u.search, ORIGIN).href;
  });
  return [...new Set(urls)].slice(0, limit);
}

// Scroll-triggered entrance animations leave text semi-transparent until they
// finish, which axe reads as low contrast. Scroll the whole page to trigger
// them, then give them time to settle before scanning.
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
}

async function scanOne(page, url) {
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    if (response && response.status() >= 400) {
      return { url, error: `HTTP ${response.status()}` };
    }
    await settle(page);
    let builder = new AxeBuilder({ page }).withTags(TAGS);
    if (firstPartyOnly) builder = builder.exclude("iframe");
    const axe = await builder.analyze();
    return {
      url,
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
      needsReview: axe.incomplete.map((v) => v.id),
    };
  } catch (err) {
    return { url, error: err.message.split("\n")[0] };
  }
}

async function main() {
  let urls;
  try {
    urls = await getUrls();
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
  if (urls.length === 0) {
    console.error(`No URLs found in ${sitemapUrl}`);
    process.exit(2);
  }
  console.log(`Scanning ${urls.length} pages on ${ORIGIN}${firstPartyOnly ? " (first-party only, iframes excluded)" : ""}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: "reduce" });
  // Send the bypass token only to the site being scanned, never to the
  // third-party origins its pages load.
  if (bypassToken) {
    await context.route("**/*", (route) => {
      const req = route.request();
      if (new URL(req.url()).origin !== ORIGIN) return route.continue();
      return route.continue({ headers: { ...req.headers(), ...bypassHeaders } });
    });
  }

  const results = new Array(urls.length);
  let next = 0;
  async function worker() {
    const page = await context.newPage();
    while (next < urls.length) {
      const i = next++;
      results[i] = await scanOne(page, urls[i]);
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  await browser.close();

  let failing = 0;
  let passed = 0;
  for (const r of results) {
    const path = new URL(r.url).pathname;
    if (r.error) {
      console.log(`  ERROR ${path}: ${r.error}`);
      if (failOn !== "none") failing += 1;
      continue;
    }
    failing += r.violations.filter((v) => SEVERITY.indexOf(v.impact) >= failIndex).length;
    if (r.violations.length === 0) {
      passed += 1;
      console.log(`  pass  ${path}${r.needsReview.length ? `  (manual review: ${r.needsReview.join(", ")})` : ""}`);
    } else {
      console.log(`  FAIL  ${path}`);
      for (const v of r.violations) {
        console.log(`        [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} element${v.nodes.length === 1 ? "" : "s"})`);
      }
    }
  }

  await writeFile(
    outFile,
    JSON.stringify(
      { baseUrl: ORIGIN, sitemap: sitemapUrl, firstPartyOnly, failOn, scannedAt: new Date().toISOString(), tags: TAGS, pages: results },
      null,
      2,
    ),
  );

  const errored = results.filter((r) => r.error).length;
  console.log(`\n${urls.length} pages: ${passed} pass, ${urls.length - passed - errored} with violations, ${errored} errored. Report: ${outFile}`);
  if (failing > 0) {
    console.log(`${failing} issue(s) at "${failOn}" or above, or pages that failed to load. Failing.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
