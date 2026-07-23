const AFFILIATE_LINKS = {
  disney4DayParkHopper: "https://www.tkqlhce.com/click-101693488-12783539",
  universal3Park3Day: "https://www.dpbolvw.net/click-101693488-12983229",
  universal1Park1DayEpic: "https://www.tkqlhce.com/click-101693488-12834895",
  seaworld: "https://www.tkqlhce.com/click-101693488-12540778",
  legoland: "https://www.anrdoezrs.net/click-101693488-12540781",
} as const;

type SlugValue = { current?: string | null } | string | null | undefined;
type Category = { title?: string | null; slug?: SlugValue };
type MarkDef = { _key?: string; _type?: string; href?: string; [key: string]: unknown };
type PortableTextChild = {
  _type?: string;
  text?: string;
  marks?: Array<string | { _type?: string; href?: string; [key: string]: unknown }>;
  [key: string]: unknown;
};

type PortableTextBlock = {
  _type?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PortableTextChild[];
  markDefs?: MarkDef[];
  [key: string]: unknown;
};

export interface BlogPostLike {
  _id?: string;
  title?: string;
  slug?: SlugValue;
  excerpt?: string;
  publishedAt?: string;
  readTime?: number;
  categories?: Category[];
  tags?: string[];
}

export interface ContextualLink {
  href: string;
  label: string;
  description: string;
}

export interface ContextualTicketCta {
  href: string;
  label: string;
  description: string;
  supportingLabel: string;
}

const BUILT_IN_MARKS = new Set(["strong", "em", "code", "underline", "description"]);
const DESTINATION_KEYWORDS = {
  disney: ["disney", "magic kingdom", "epcot", "hollywood studios", "animal kingdom"],
  universal: ["universal", "islands of adventure", "hogwarts"],
  epic: ["epic universe", "dark universe", "super nintendo", "how to train your dragon"],
  seaworld: ["seaworld"],
  legoland: ["legoland"],
} as const;

function slugFrom(post: BlogPostLike): string {
  const slug = post.slug;
  if (typeof slug === "string") return slug.trim();
  return slug?.current?.trim() || "";
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCategoryTitles(post: BlogPostLike): string[] {
  return (post.categories || [])
    .map((category) => category.title?.trim())
    .filter((value): value is string => Boolean(value));
}

function getSignals(post: BlogPostLike): Set<string> {
  const haystack = normalizeText(
    [post.title, slugFrom(post), ...(post.tags || []), ...getCategoryTitles(post)].filter(Boolean).join(" "),
  );
  const signals = new Set<string>();

  for (const [signal, keywords] of Object.entries(DESTINATION_KEYWORDS)) {
    if (keywords.some((keyword) => haystack.includes(normalizeText(keyword)))) {
      signals.add(signal);
    }
  }

  return signals;
}

function getTitleTokens(post: BlogPostLike): Set<string> {
  return new Set(
    normalizeText(`${post.title || ""} ${slugFrom(post)}`)
      .split(" ")
      .filter((token) => token.length >= 4),
  );
}

function sharedCount(left: Iterable<string>, right: Iterable<string>): number {
  const rightSet = new Set(right);
  let count = 0;
  for (const value of left) {
    if (rightSet.has(value)) count += 1;
  }
  return count;
}

export function dedupePostsBySlug<T extends BlogPostLike>(posts: T[]): T[] {
  const seen = new Set<string>();
  const deduped: T[] = [];

  for (const post of posts) {
    const slug = slugFrom(post);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    deduped.push(post);
  }

  return deduped;
}

export function normalizePortableTextBlocks(blocks: PortableTextBlock[] | null | undefined): PortableTextBlock[] {
  if (!Array.isArray(blocks)) return [];

  const normalized = blocks.map((block, blockIndex) => {
    if (block?._type !== "block") return block;

    const markDefs: MarkDef[] = Array.isArray(block.markDefs) ? [...block.markDefs] : [];
    const markKeys = new Set(markDefs.map((def) => def._key).filter((value): value is string => Boolean(value)));

    const children = Array.isArray(block.children)
      ? block.children.map((child, childIndex) => {
          const nextMarks: string[] = [];

          for (const [markIndex, mark] of (child.marks || []).entries()) {
            if (typeof mark === "string") {
              if (BUILT_IN_MARKS.has(mark) || markKeys.has(mark)) {
                nextMarks.push(mark);
              }
              continue;
            }

            if (mark?._type === "link" && typeof mark.href === "string" && mark.href.trim()) {
              const syntheticKey = `generated-link-${blockIndex}-${childIndex}-${markIndex}`;
              markDefs.push({ _key: syntheticKey, _type: "link", href: mark.href });
              markKeys.add(syntheticKey);
              nextMarks.push(syntheticKey);
            }
          }

          return {
            ...child,
            marks: nextMarks,
          };
        })
      : [];

    const style = block.style === "bullet" || block.style === "number" ? "normal" : block.style;
    const listItem = block.listItem || (block.style === "bullet" || block.style === "number" ? block.style : undefined);

    return {
      ...block,
      style,
      ...(listItem ? { listItem, level: block.level || 1 } : {}),
      children,
      markDefs,
    };
  });

  // Expand collapsed list blocks where many title + description pairs were
  // jammed into a single listItem (renders as one "1." with no structure).
  return expandCollapsedListBlocks(normalized);
}

function childHasDescriptionMark(child: PortableTextChild | undefined): boolean {
  return Boolean(child?.marks?.some((mark) => mark === "description"));
}

function expandCollapsedListBlocks(blocks: PortableTextBlock[]): PortableTextBlock[] {
  const out: PortableTextBlock[] = [];

  for (const [blockIndex, block] of blocks.entries()) {
    if (block?._type !== "block" || !block.listItem || !Array.isArray(block.children)) {
      out.push(block);
      continue;
    }

    const children = block.children;
    // Heuristic: 3+ children with at least one description mark ⇒ likely collapsed multi-item list
    const descCount = children.filter((child) => childHasDescriptionMark(child)).length;
    if (children.length < 3 || descCount < 2) {
      out.push(block);
      continue;
    }

    const pairs: Array<{ title?: PortableTextChild; description?: PortableTextChild }> = [];
    let i = 0;
    while (i < children.length) {
      const cur = children[i];
      if (childHasDescriptionMark(cur)) {
        pairs.push({ description: cur });
        i += 1;
        continue;
      }
      const nxt = children[i + 1];
      if (nxt && childHasDescriptionMark(nxt)) {
        pairs.push({ title: cur, description: nxt });
        i += 2;
      } else {
        pairs.push({ title: cur });
        i += 1;
      }
    }

    if (pairs.length <= 1) {
      out.push(block);
      continue;
    }

    for (const [pairIndex, pair] of pairs.entries()) {
      const nextChildren: PortableTextChild[] = [];
      if (pair.title) {
        nextChildren.push({
          ...pair.title,
          _type: pair.title._type || "span",
          _key: pair.title._key || `exp-t-${blockIndex}-${pairIndex}`,
          text: String(pair.title.text || "").replace(/^\n+/, ""),
        });
      }
      if (pair.description) {
        const descText = String(pair.description.text || "").replace(/^\n+/, "");
        nextChildren.push({
          ...pair.description,
          _type: pair.description._type || "span",
          _key: pair.description._key || `exp-d-${blockIndex}-${pairIndex}`,
          text: descText ? `\n${descText}` : "",
          marks: Array.from(new Set([...(pair.description.marks || []).map(String), "description"])),
        });
      }
      if (!nextChildren.length) continue;
      out.push({
        ...block,
        _key: `${block._key || "list"}-exp-${pairIndex}`,
        style: "normal",
        listItem: block.listItem,
        level: block.level || 1,
        children: nextChildren,
        markDefs: block.markDefs || [],
      });
    }
  }

  return out;
}

function scoreRelatedPost(currentPost: BlogPostLike, candidate: BlogPostLike): number {
  const currentCategoryTitles = getCategoryTitles(currentPost).map(normalizeText);
  const candidateCategoryTitles = getCategoryTitles(candidate).map(normalizeText);
  const currentTags = (currentPost.tags || []).map(normalizeText);
  const candidateTags = (candidate.tags || []).map(normalizeText);
  const currentSignals = getSignals(currentPost);
  const candidateSignals = getSignals(candidate);
  const currentTokens = getTitleTokens(currentPost);
  const candidateTokens = getTitleTokens(candidate);

  return (
    sharedCount(currentCategoryTitles, candidateCategoryTitles) * 4 +
    sharedCount(currentTags, candidateTags) * 3 +
    sharedCount(currentSignals, candidateSignals) * 3 +
    sharedCount(currentTokens, candidateTokens) * 1
  );
}

export function getRelatedPosts<T extends BlogPostLike>(currentPost: T, posts: T[], limit = 3): T[] {
  const currentSlug = slugFrom(currentPost);

  return dedupePostsBySlug(posts)
    .filter((post) => slugFrom(post) && slugFrom(post) !== currentSlug)
    .map((post) => ({ post, score: scoreRelatedPost(currentPost, post) }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return (right.post.publishedAt || "").localeCompare(left.post.publishedAt || "");
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getContextualTicketCta(post: BlogPostLike): ContextualTicketCta {
  const signals = getSignals(post);

  if (signals.has("epic")) {
    return {
      href: AFFILIATE_LINKS.universal1Park1DayEpic,
      label: "See Epic Universe ticket options",
      description: "Best for single-park Epic Universe coverage and fast price checking.",
      supportingLabel: "Universal Orlando partner pricing",
    };
  }

  if (signals.has("universal")) {
    return {
      href: AFFILIATE_LINKS.universal3Park3Day,
      label: "Compare Universal Orlando ticket deals",
      description: "Useful when the article is helping readers choose multi-day Universal plans.",
      supportingLabel: "Includes Epic Universe eligible bundles",
    };
  }

  if (signals.has("seaworld")) {
    return {
      href: AFFILIATE_LINKS.seaworld,
      label: "Check SeaWorld Orlando ticket deals",
      description: "Quick path to current partner pricing for SeaWorld Orlando visitors.",
      supportingLabel: "SeaWorld Orlando tickets",
    };
  }

  if (signals.has("legoland")) {
    return {
      href: AFFILIATE_LINKS.legoland,
      label: "Check LEGOLAND Florida ticket deals",
      description: "Helpful for younger-family trip planning and side-trip comparisons.",
      supportingLabel: "LEGOLAND Florida tickets",
    };
  }

  return {
    href: AFFILIATE_LINKS.disney4DayParkHopper,
    label: "Compare Disney World ticket deals",
    description: "Best fit for Disney planning guides, packing lists, and itinerary posts.",
    supportingLabel: "Disney World tickets via Undercover Tourist",
  };
}

function postHaystack(post: BlogPostLike): string {
  return normalizeText(
    [post.title, slugFrom(post), post.excerpt, ...(post.tags || []), ...getCategoryTitles(post)]
      .filter(Boolean)
      .join(" "),
  );
}

/** Prefer high-CTR / conversion guides when the article is about short riders or young kids. */
function getPriorityGuideLinks(post: BlogPostLike): ContextualLink[] {
  const haystack = postHaystack(post);
  const slug = slugFrom(post);
  const links: ContextualLink[] = [];

  const isHeightOrYoungKids =
    haystack.includes("height") ||
    haystack.includes("under 40") ||
    haystack.includes("toddler") ||
    haystack.includes("baby") ||
    haystack.includes("preschool") ||
    haystack.includes("kids");

  if (isHeightOrYoungKids && slug !== "best-magic-kingdom-rides-kids-under-40-inches") {
    links.push({
      href: "/blog/best-magic-kingdom-rides-kids-under-40-inches",
      label: "Magic Kingdom rides under 40 inches",
      description: "Our best-CTR short-rider list — what kids can actually ride before the big coasters.",
    });
  }

  if (
    (haystack.includes("height") || haystack.includes("universal") || haystack.includes("epic")) &&
    slug !== "universal-orlando-height-requirements"
  ) {
    links.push({
      href: "/blog/universal-orlando-height-requirements",
      label: "Universal Orlando height requirements",
      description: "Full height chart across Islands of Adventure, Universal Studios, and Epic Universe.",
    });
  }

  if (
    (haystack.includes("disney") || haystack.includes("magic kingdom") || haystack.includes("packing")) &&
    slug !== "disney-world-packing-list-kids" &&
    slug !== "disney-world-packing-list"
  ) {
    links.push({
      href: "/blog/disney-world-packing-list-kids",
      label: "Disney World kids packing list",
      description: "25 essentials families with ages 2–8 actually use on park days.",
    });
  }

  if (haystack.includes("epic") && slug !== "epic-universe-1-day-plan") {
    links.push({
      href: "/blog/epic-universe-1-day-plan",
      label: "Epic Universe 1-day plan",
      description: "Best-CTR touring plan — amplify after height checks.",
    });
  }

  return links;
}

export function getHelpfulInternalLinks(post: BlogPostLike, allPosts: BlogPostLike[]): ContextualLink[] {
  const signals = getSignals(post);
  const links: ContextualLink[] = [];
  const seen = new Set<string>();
  const haystack = postHaystack(post);
  const relatedPosts = getRelatedPosts(post, allPosts, 2);

  const push = (link: ContextualLink) => {
    if (!link.href || seen.has(link.href)) return;
    seen.add(link.href);
    links.push(link);
  };

  // Product tool first for height/family intent
  if (haystack.includes("height") || haystack.includes("under 40") || haystack.includes("ride")) {
    push({
      href: "/rides/?height=40",
      label: "Open the ride finder (~40″ filter)",
      description: "Shareable height filter across Disney, Universal, Epic Universe, and more.",
    });
  } else if (signals.has("disney")) {
    push({
      href: "/rides",
      label: "Browse Disney-friendly rides by height and thrill level",
      description: "Use the ride filters to avoid walking into lines your kids cannot ride.",
    });
  }

  if (signals.has("disney")) {
    push({
      href: "/deals",
      label: "Compare Disney and Orlando ticket deals",
      description: "Helpful when the article moves readers from planning to booking.",
    });
  } else if (signals.has("universal") || signals.has("epic")) {
    push({
      href: "/parks",
      label: "Compare Universal, Epic Universe, and the rest of Orlando",
      description: "Useful for readers still deciding which park deserves a day.",
    });
    push({
      href: "/deals",
      label: "See current Universal and Orlando ticket deal options",
      description: "A booking-oriented next step without cluttering the article body.",
    });
  } else {
    push({
      href: "/parks",
      label: "Compare Orlando parks side by side",
      description: "A strong next step for top-of-funnel planning content.",
    });
    push({
      href: "/rides",
      label: "Browse rides by thrill level and height requirement",
      description: "Good for turning broad inspiration into an actual park plan.",
    });
  }

  for (const guide of getPriorityGuideLinks(post)) {
    push(guide);
  }

  for (const relatedPost of relatedPosts) {
    const slug = slugFrom(relatedPost);
    if (!slug) continue;
    push({
      href: `/blog/${slug}`,
      label: relatedPost.title || "Related guide",
      description: relatedPost.excerpt || "Another closely related planning guide.",
    });
  }

  return links.slice(0, 4);
}
