import { client } from "@/lib/sanity";
import { postBySlugQuery } from "@/lib/queries";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/blog.css";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) return { title: "Post Not Found" };

  const seoTitle = post.seo?.seoTitle || post.title;
  const metaDesc =
    post.seo?.metaDescription || post.excerpt || undefined;
  const ogImage =
    post.seo?.ogImage?.asset?.url || post.heroImage?.asset?.url;

  // Determine the correct published date
  const publishedAt =
    post.isRepublished && post.originalPublishedAt
      ? post.originalPublishedAt
      : post.publishedAt;

  return {
    title: seoTitle,
    description: metaDesc,
    alternates: post.seo?.canonicalUrl
      ? { canonical: post.seo.canonicalUrl }
      : undefined,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: post.updatedAt || publishedAt,
      authors: post.author?.name ? [post.author.name] : [],
      ...(ogImage
        ? {
            images: [{ url: ogImage, width: 1200, height: 630 }],
          }
        : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) notFound();

  const heroUrl = post.heroImage?.asset?.url;

  // Use originalPublishedAt for republished posts (backdating)
  const canonicalPublishedAt =
    post.isRepublished && post.originalPublishedAt
      ? post.originalPublishedAt
      : post.publishedAt;
  const canonicalModifiedAt = post.updatedAt || canonicalPublishedAt;

  // Build JSON-LD
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: heroUrl,
    datePublished: canonicalPublishedAt,
    dateModified: canonicalModifiedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          url: post.author.slug?.current
            ? `/authors/${post.author.slug.current}`
            : undefined,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Plan Your Park",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${slug}`,
    },
    description: post.excerpt || post.seo?.metaDescription,
  };

  // If post has affiliate product ratings, also emit Product/Review schema
  const productReviews = post.body
    ?.filter((block: { _type: string }) => block._type === "affiliateBlock")
    .map((block: { productName?: string; price?: string; highlight?: string; partnerLink?: { url?: string; cta?: string }; description?: string; image?: { asset?: { url?: string; alt?: string } } }) => ({
      "@context": "https://schema.org",
      "@type": "Review",
      name: block.productName,
      reviewBody: block.description,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.5",
        bestRating: "5",
      },
      author: { "@type": "Organization", name: "Plan Your Park" },
      itemReviewed: {
        "@type": "Product",
        name: block.productName,
        ...(block.price ? { offers: { "@type": "Offer", price: block.price, priceCurrency: "USD" } } : {}),
        ...(block.image?.asset?.url ? { image: block.image.asset.url } : {}),
      },
    }));

  return (
    <>
      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />

      {/* Product/Review JSON-LD for affiliate blocks */}
      {productReviews?.map((ld: Record<string, unknown>, i: number) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <main className="min-h-screen bg-[#F8F9FA]">
        {/* Hero Image */}
        {heroUrl && (
          <div className="hero-image">
            <div className="max-w-3xl mx-auto px-4">
              <img
                src={heroUrl}
                alt={post.heroImage?.alt || post.title}
                className="w-full max-w-[400px] h-auto rounded-lg mx-auto mb-6 block"
              />
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Article Header */}
          <header className="article-header mb-8">
            {post.categories?.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {post.categories.map(
                  (cat: { title: string; slug: { current: string } }) => (
                    <Link
                      key={cat.slug.current}
                      href={`/category/${cat.slug.current}`}
                      className="inline-block px-3 py-1 text-sm bg-[#F7FAFC] border border-[#E2E8F0] rounded-full font-medium text-[#2D3748] hover:bg-[#EDF2F7] transition-colors"
                    >
                      {cat.title}
                    </Link>
                  )
                )}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-[#2D3748] leading-tight mb-4 font-[family-name:var(--font-nunito)]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-[#718096] mb-4">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-[#A0AEC0] flex-wrap">
              {post.author?.avatar?.asset?.url && (
                <Image
                  src={post.author.avatar.asset.url}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              {post.author && <span>By {post.author.name}</span>}
              <time dateTime={canonicalPublishedAt}>
                {new Date(canonicalPublishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.updatedAt && canonicalModifiedAt !== canonicalPublishedAt && (
                <span className="text-xs text-[#A0AEC0]">
                  (Updated{" "}
                  {new Date(canonicalModifiedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  )
                </span>
              )}
              {post.readTime && <span>{post.readTime} min read</span>}
            </div>
          </header>

          {/* Body */}
          <article className="article-content">
            <PortableText
              value={post.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-[#2D3748] mt-10 mb-4 pb-2 border-b-2 border-[#E2E8F0] font-[family-name:var(--font-nunito)]">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-[#2D3748] mt-8 mb-3 font-[family-name:var(--font-nunito)]">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-bold text-[#2D3748] mt-6 mb-2 font-[family-name:var(--font-nunito)]">
                      {children}
                    </h4>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#F37021] pl-4 italic text-[#4A5568] my-6 bg-[#FFF7ED] py-3 pr-4 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                },
                types: {
                  image: ({ value }) =>
                    value?.asset?.url ? (
                      <figure className="my-8">
                        <img
                          src={value.asset.url}
                          alt={value.alt || ""}
                          className="w-full max-w-[400px] h-auto rounded-lg mx-auto block"
                        />
                        {value.caption && (
                          <figcaption className="text-sm text-[#718096] mt-2 text-center">
                            {value.caption}
                          </figcaption>
                        )}
                      </figure>
                    ) : null,
                  affiliateBlock: ({ value }) => (
                    <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-6 my-8">
                      <div className="flex gap-4">
                        {value.image?.asset?.url && (
                          <img
                            src={value.image.asset.url}
                            alt={value.image?.alt || value.productName}
                            className="w-28 h-28 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          {value.highlight && (
                            <span className="inline-block bg-[#F37021] text-white text-xs px-2 py-0.5 rounded mb-2">
                              {value.highlight}
                            </span>
                          )}
                          <h3 className="font-bold text-lg text-[#2D3748]">
                            {value.productName}
                          </h3>
                          {value.description && (
                            <p className="text-[#4A5568] text-sm mt-1">
                              {value.description}
                            </p>
                          )}
                          {value.price && (
                            <p className="font-semibold text-[#F37021] mt-2">
                              {value.price}
                            </p>
                          )}
                          {value.partnerLink?.url && (
                            <a
                              href={value.partnerLink.url}
                              target="_blank"
                              rel="noopener sponsored"
                              className="inline-block mt-3 bg-[#F37021] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#e85a1a] transition-colors"
                            >
                              {value.partnerLink.cta || "Check Price"}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                  tearAway: ({ value }) => (
                    <div className="bg-[#E6FFFA] border border-[#81E6D9] rounded-xl p-6 my-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-[#234E52]">
                          {value.title}
                        </h3>
                        {value.mobileCollapsed && (
                          <span className="text-xs bg-[#B2F5EA] text-[#234E52] px-2 py-1 rounded">
                            Collapsed on mobile
                          </span>
                        )}
                      </div>
                      {value.subtitle && (
                        <p className="text-[#234E52] text-sm mb-4">
                          {value.subtitle}
                        </p>
                      )}
                      <ul className="space-y-2">
                        {value.items?.map(
                          (
                            item: { text: string; checked?: boolean },
                            i: number
                          ) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-[#234E52]"
                            >
                              {value.blockType === "checklist" ? (
                                <span
                                  className={
                                    item.checked
                                      ? "text-[#38B2AC]"
                                      : "text-[#81E6D9]"
                                  }
                                >
                                  {item.checked ? "✓" : "○"}
                                </span>
                              ) : (
                                <span className="text-[#38B2AC]">•</span>
                              )}
                              {item.text}
                            </li>
                          )
                        )}
                      </ul>
                      {value.note && (
                        <p className="text-xs text-[#234E52] mt-4 opacity-75 italic">
                          {value.note}
                        </p>
                      )}
                    </div>
                  ),
                  videoEmbed: ({ value }) =>
                    value?.url ? (
                      <div className="my-8">
                        <iframe
                          src={value.url.replace("watch?v=", "embed/")}
                          title={value.caption || "Video"}
                          className="w-full aspect-video rounded-lg"
                          allowFullScreen
                        />
                        {value.caption && (
                          <p className="text-sm text-[#718096] mt-2 text-center">
                            {value.caption}
                          </p>
                        )}
                      </div>
                    ) : null,
                },
                marks: {
                  link: ({ children, value }) => (
                    <a
                      href={value.href}
                      target={value.blank ? "_blank" : undefined}
                      rel={value.blank ? "noopener noreferrer" : undefined}
                      className="text-[#F37021] underline hover:text-[#e85a1a]"
                    >
                      {children}
                    </a>
                  ),
                  affiliateLink: ({ children, value }) => (
                    <a
                      href={value.href}
                      target="_blank"
                      rel="noopener sponsored"
                      className="text-[#F37021] underline hover:text-[#e85a1a]"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </article>

          {/* Bottom CTA */}
          <div className="bottom-cta">
            <p>Ready to book your Disney World adventure?</p>
            <a
              href="https://www.dpbolvw.net/click-101693488-5527150"
              target="_blank"
              rel="noopener"
            >
              Get Discounted Tickets →
            </a>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#E2E8F0]">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-sm bg-[#F7FAFC] text-[#718096] px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Posts */}
          {post.engagement?.relatedPosts?.length > 0 && (
            <section className="related-posts">
              <h3 className="font-bold text-xl text-[#2D3748] mb-4 font-[family-name:var(--font-nunito)]">
                Related Posts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.engagement.relatedPosts.map(
                  (related: {
                    _id: string;
                    title: string;
                    slug: { current: string };
                    excerpt?: string;
                    heroImage?: {
                      asset?: { url: string };
                      alt?: string;
                    };
                  }) => (
                    <Link
                      key={related._id}
                      href={`/blog/${related.slug.current}`}
                      className="border border-[#E2E8F0] rounded-lg p-4 hover:shadow-md transition-shadow block"
                    >
                      {related.heroImage?.asset?.url && (
                        <img
                          src={related.heroImage.asset.url}
                          alt={
                            related.heroImage.alt || related.title
                          }
                          className="w-full rounded-lg object-cover h-32 mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-[#2D3748]">
                        {related.title}
                      </h4>
                      {related.excerpt && (
                        <p className="text-sm text-[#718096] mt-1 line-clamp-2">
                          {related.excerpt}
                        </p>
                      )}
                    </Link>
                  )
                )}
              </div>
            </section>
          )}

          {/* Q&A Section with Formspree */}
          {post.engagement?.enableQA && (
            <section className="mt-12 bg-[#F7FAFC] rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-4 font-[family-name:var(--font-nunito)]">
                Have a Question?
              </h2>
              <p className="text-[#718096] mb-6">
                Ask us about this post and we'll answer below!
              </p>
              
              {/* Display existing Q&A */}
              {post.engagement.qaSection?.length > 0 && (
                <div className="qa-list mb-8 space-y-4">
                  {post.engagement.qaSection.map((qa: { question: string; answer?: string; author?: { name: string } }, idx: number) => (
                    <div key={idx} className="qa-item border border-[#E2E8F0] rounded-lg p-4">
                      <p className="font-medium text-[#2D3748]">Q: {qa.question}</p>
                      {qa.answer && (
                        <p className="text-[#4A5568] mt-2">A: {qa.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Formspree Question Form */}
              <form
                action="https://formspree.io/f/xwvnjpgd"
                method="POST"
                className="flex flex-col gap-3"
              >
                <input type="hidden" name="post_slug" value={slug} />
                <input
                  type="text"
                  name="question"
                  placeholder="Your question..."
                  required
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com (for answer notification)"
                  required
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
                <button
                  type="submit"
                  className="bg-[#F37021] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e85a1a] transition-colors"
                >
                  Ask Question
                </button>
              </form>
            </section>
          )}

          {/* Newsletter with Formspree */}
          {post.engagement?.enableNewsletter && (
            <section className="mt-12 bg-[#FFF7ED] rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-2 font-[family-name:var(--font-nunito)]">
                {post.engagement.newsletterConfig?.heading ||
                  "Get Park Planning Tips"}
              </h2>
              <p className="text-[#718096] mb-6">
                {post.engagement.newsletterConfig?.subheading ||
                  "Weekly tips, deals, and itineraries for your Orlando trip."}
              </p>
              <form
                action="https://formspree.io/f/xpqjewvb"
                method="POST"
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
                <button
                  type="submit"
                  className="bg-[#F37021] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#e85a1a] transition-colors"
                >
                  {post.engagement.newsletterConfig?.ctaLabel ||
                    "Subscribe — It's Free"}
                </button>
              </form>
              <p className="text-xs text-[#718096] mt-3">
                {post.engagement.newsletterConfig?.privacyText ||
                  "No spam, ever. Unsubscribe anytime."}
              </p>
            </section>
          )}
        </div>
      </main>
    </>
  );
}