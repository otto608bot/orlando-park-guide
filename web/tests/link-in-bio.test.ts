import assert from "node:assert/strict";
import test from "node:test";

import { blogPostPath, sanityThumb, withLinkInBioUtm } from "../src/lib/link-in-bio.ts";

test("withLinkInBioUtm adds link-in-bio UTMs with exactly one '?'", () => {
  const href = withLinkInBioUtm(blogPostPath("legoland-florida-rides-by-height"), "legoland-florida-rides-by-height");
  assert.equal(
    href,
    "/blog/legoland-florida-rides-by-height/?utm_source=instagram&utm_medium=social&utm_campaign=link-in-bio&utm_content=legoland-florida-rides-by-height",
  );
  assert.equal(href.split("?").length, 2);
});

test("withLinkInBioUtm merges an existing query and keeps a hash", () => {
  const href = withLinkInBioUtm("/rides/?height=40#list", "ride-finder", "tiktok");
  assert.equal(href.split("?").length, 2);
  assert.ok(href.startsWith("/rides/?height=40&utm_source=tiktok&"));
  assert.ok(href.endsWith("&utm_content=ride-finder#list"));
});

test("sanityThumb only resizes Sanity CDN URLs", () => {
  assert.equal(sanityThumb(null, 10, 10), null);
  assert.equal(sanityThumb("/epcot.jpeg", 10, 10), "/epcot.jpeg");
  assert.equal(
    sanityThumb("https://cdn.sanity.io/images/x/y/a.jpg", 240, 135),
    "https://cdn.sanity.io/images/x/y/a.jpg?w=240&h=135&fit=crop&auto=format",
  );
});
