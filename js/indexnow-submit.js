/**
 * IndexNow Submission Script for Rudra Sarker Portfolio
 *
 * IndexNow enables instant notification to Bing (and other participating
 * search engines) when pages are added, updated, or deleted.
 *
 * HOW TO USE:
 * 1. Ensure rudra496siteindexnow2026key.txt is accessible at:
 *    https://rudra496.github.io/site/rudra496siteindexnow2026key.txt
 * 2. Run this script manually (Node.js) or use it as a reference for
 *    a fetch-based submission via your CI/CD pipeline.
 *
 * API Docs: https://www.indexnow.org/documentation
 */

const KEY = "rudra496siteindexnow2026key";
const HOST = "rudra496.github.io";
const KEY_LOCATION = `https://${HOST}/site/${KEY}.txt`;

const URLS_TO_SUBMIT = [
  "https://rudra496.github.io/site/",
  "https://rudra496.github.io/site/projects.html",
  "https://rudra496.github.io/site/about.html",
  "https://rudra496.github.io/site/blog.html",
  "https://rudra496.github.io/site/gallery.html",
  "https://rudra496.github.io/site/achievements.html",
  "https://rudra496.github.io/site/contact.html",
  "https://rudra496.github.io/site/projects/team-signtalk.html",
  "https://rudra496.github.io/site/projects/assistive-smart-eyeglass.html",
  "https://rudra496.github.io/site/projects/dual-axis-solar-tracker.html",
  "https://rudra496.github.io/site/projects/smart-door-security.html",
  "https://rudra496.github.io/site/projects/wifi-control-car.html",
  "https://rudra496.github.io/site/projects/led-matrix-notice-board.html",
  "https://rudra496.github.io/site/projects/team-esb4-bacteria-detection.html",
  "https://rudra496.github.io/site/projects/line-following-robot.html",
  "https://rudra496.github.io/site/projects/the-magic-of-90s-bling.html",
  "https://rudra496.github.io/site/blog/glm-coding-plan-evaluation.html",
  "https://rudra496.github.io/site/blog/pid-controllers-robotics-magic.html",
  "https://rudra496.github.io/site/blog/the-magic-of-90s-bling-phone-sticker.html",
];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS_TO_SUBMIT,
};

/**
 * Submit URLs to IndexNow (Bing endpoint).
 * Run with: node js/indexnow-submit.js
 * Requires Node.js 18+ (built-in fetch) or install node-fetch.
 */
async function submitToIndexNow() {
  const endpoint = "https://api.indexnow.org/indexnow";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      console.log(`IndexNow submission successful (HTTP ${response.status})`);
    } else {
      const text = await response.text();
      console.error(`IndexNow submission failed (HTTP ${response.status}): ${text}`);
    }
  } catch (err) {
    console.error("IndexNow submission error:", err);
  }
}

submitToIndexNow();
