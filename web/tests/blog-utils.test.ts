import assert from "node:assert/strict";
import test from "node:test";

import {
  dedupePostsBySlug,
  getContextualTicketCta,
  getRelatedPosts,
  normalizePortableTextBlocks,
} from "../src/lib/blog.ts";

test("normalizePortableTextBlocks repairs malformed list blocks and orphan marks", () => {
  const blocks = normalizePortableTextBlocks([
    {
      _type: "block",
      style: "bullet",
      children: [
        {
          _type: "span",
          text: "See the Disney guide",
          marks: ["missing-link", "description"],
        },
      ],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "External link",
          marks: [{ _type: "link", href: "https://example.com" }],
        },
      ],
    },
  ]);

  assert.equal(blocks[0].style, "normal");
  assert.equal(blocks[0].listItem, "bullet");
  assert.deepEqual(blocks[0].children[0].marks, ["description"]);

  const secondBlock = blocks[1];
  assert.equal(secondBlock.markDefs?.length, 1);
  assert.equal(secondBlock.markDefs?.[0]?._type, "link");
  assert.equal(secondBlock.markDefs?.[0]?.href, "https://example.com");
  assert.equal(typeof secondBlock.children[0].marks?.[0], "string");
});

test("getRelatedPosts prefers posts with shared destination and tags while deduping slugs", () => {
  const currentPost = {
    slug: { current: "disney-world-packing-list-kids" },
    title: "What to Pack for Disney World With Kids",
    categories: [{ title: "Disney World" }],
    tags: ["packing", "kids"],
  };

  const related = getRelatedPosts(currentPost, [
    currentPost,
    {
      slug: { current: "disney-world-guide" },
      title: "Complete Disney World Planning Guide for Families",
      categories: [{ title: "Disney World" }],
      tags: ["kids", "planning"],
    },
    {
      slug: { current: "best-time-visit-disney-world-2026" },
      title: "Best Time to Visit Disney World in 2026",
      categories: [{ title: "Disney World" }],
      tags: ["planning"],
    },
    {
      slug: { current: "universal-orlando-summer-2026" },
      title: "Universal Orlando Summer 2026",
      categories: [{ title: "Universal Orlando" }],
      tags: ["summer"],
    },
    {
      slug: { current: "disney-world-guide" },
      title: "Duplicate slug should be removed",
      categories: [{ title: "Disney World" }],
      tags: ["kids"],
    },
  ], 3);

  assert.equal(related.length, 3);
  assert.equal(related[0].slug?.current, "disney-world-guide");
  assert.equal(related[1].slug?.current, "best-time-visit-disney-world-2026");
  assert.equal(new Set(related.map((post) => post.slug?.current)).size, related.length);
});

test("dedupePostsBySlug keeps the first instance of each slug and drops empty slugs", () => {
  const deduped = dedupePostsBySlug([
    { slug: { current: "one" }, title: "One" },
    { slug: { current: "one" }, title: "One duplicate" },
    { slug: { current: "two" }, title: "Two" },
    { slug: null, title: "No slug" },
  ]);

  assert.deepEqual(
    deduped.map((post) => post.title),
    ["One", "Two"],
  );
});

test("getContextualTicketCta selects a destination-relevant primary offer", () => {
  assert.equal(
    getContextualTicketCta({
      title: "Epic Universe Tickets Guide",
      slug: { current: "epic-universe-tickets-guide" },
      categories: [{ title: "Universal Orlando" }],
    }).href,
    "https://www.tkqlhce.com/click-101693488-12834895",
  );

  assert.equal(
    getContextualTicketCta({
      title: "Disney World Planning Guide",
      slug: { current: "disney-world-guide" },
      categories: [{ title: "Disney World" }],
    }).label,
    "Compare Disney World ticket deals",
  );
});
