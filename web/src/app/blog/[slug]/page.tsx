import { client, urlFor } from '@/lib/sanity'
import { postBySlugQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    `*[_type == "post" && !(_id in path("drafts.**"))][].slug.current`
  )
  return slugs.map((slug) => ({ slug }))
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })

  if (!post) return { title: 'Post Not Found' }

  const ogImage = post.seo?.ogImage?.asset?.url || post.heroImage?.asset?.url

  return {
    title: post.seo?.seoTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    alternates: post.seo?.canonicalUrl ? { canonical: post.seo.canonicalUrl } : undefined,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: ogImage
      ? {
          title: post.seo?.seoTitle || post.title,
          description: post.seo?.metaDescription || post.excerpt,
          images: [{ url: ogImage, width: 1200, height: 630 }],
          type: 'article',
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt || post.publishedAt,
          authors: post.author?.name ? [post.author.name] : [],
        }
      : undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })

  if (!post) notFound()

  const heroUrl = post.heroImage?.asset?.url

  return (
    <main className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            image: heroUrl,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: post.author
              ? {
                  '@type': 'Person',
                  name: post.author.name,
                  url: `/authors/${post.author.slug?.current}`,
                }
              : undefined,
            publisher: {
              '@type': 'Organization',
              name: 'Plan Your Park',
              logo: { '@type': 'ImageObject', url: '/logo.png' },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `/blog/${slug}` },
            description: post.excerpt || post.seo?.metaDescription,
          }),
        }}
      />

      {/* Hero Image */}
      {heroUrl && (
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={heroUrl}
            alt={post.heroImage?.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          {post.categories?.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.categories.map((cat: { title: string; slug: { current: string } }) => (
                <Link key={cat.slug.current} href={`/category/${cat.slug.current}`}
                  className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium hover:bg-orange-200 transition-colors">
                  {cat.title}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-gray-600 mb-4">{post.excerpt}</p>}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.author?.avatar?.asset?.url && (
              <Image src={post.author.avatar.asset.url} alt={post.author.name} width={40} height={40}
                className="rounded-full" />
            )}
            {post.author && <span>By {post.author.name}</span>}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            {post.readTime && <span>{post.readTime} min read</span>}
          </div>
        </header>

        {/* Body */}
        <article className="prose prose-lg prose-slate max-w-none">
          <PortableText
            value={post.body}
            components={{
              block: {
                h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
                h4: ({ children }) => <h4 className="text-lg font-bold text-gray-900 mt-5 mb-2">{children}</h4>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-700 my-6">
                    {children}
                  </blockquote>
                ),
              },
              types: {
                image: ({ value }) =>
                  value?.asset?.url ? (
                    <figure className="my-8">
                      <Image src={value.asset.url} alt={value.alt || ''} width={800} height={450}
                        className="rounded-lg w-full" />
                      {value.caption && <figcaption className="text-sm text-gray-500 mt-2 text-center">{value.caption}</figcaption>}
                    </figure>
                  ) : null,
                affiliateBlock: ({ value }) => (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-8">
                    <div className="flex gap-4">
                      {value.image?.asset?.url && (
                        <Image src={value.image.asset.url} alt={value.image?.alt || value.productName}
                          width={120} height={120} className="rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1">
                        {value.highlight && (
                          <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded mb-2">
                            {value.highlight}
                          </span>
                        )}
                        <h3 className="font-bold text-lg">{value.productName}</h3>
                        {value.description && <p className="text-gray-600 text-sm mt-1">{value.description}</p>}
                        {value.price && <p className="font-semibold text-orange-600 mt-2">{value.price}</p>}
                        {value.partnerLink?.url && (
                          <a href={value.partnerLink.url} target="_blank" rel="noopener sponsored"
                            className="inline-block mt-3 bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            {value.partnerLink.cta || 'Check Price'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ),
                tearAway: ({ value }) => (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-blue-900">{value.title}</h3>
                      {value.mobileCollapsed && (
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Collapsed on mobile</span>
                      )}
                    </div>
                    {value.subtitle && <p className="text-blue-700 text-sm mb-4">{value.subtitle}</p>}
                    <ul className="space-y-2">
                      {value.items?.map((item: { text: string; checked?: boolean }, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          {value.blockType === 'checklist' ? (
                            <span className={item.checked ? 'text-green-600' : 'text-blue-400'}>{item.checked ? '✓' : '○'}</span>
                          ) : (
                            <span className="text-blue-400">•</span>
                          )}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                    {value.note && <p className="text-xs text-blue-600 mt-4 italic">{value.note}</p>}
                  </div>
                ),
                videoEmbed: ({ value }) =>
                  value?.url ? (
                    <div className="my-8">
                      <iframe
                        src={value.url.replace('watch?v=', 'embed/')}
                        title={value.caption || 'Video'}
                        className="w-full aspect-video rounded-lg"
                        allowFullScreen
                      />
                      {value.caption && <p className="text-sm text-gray-500 mt-2 text-center">{value.caption}</p>}
                    </div>
                  ) : null,
              },
              marks: {
                link: ({ children, value }) => (
                  <a href={value.href} target={value.blank ? '_blank' : undefined}
                    rel={value.blank ? 'noopener noreferrer' : undefined}
                    className="text-orange-600 underline hover:text-orange-800">
                    {children}
                  </a>
                ),
                affiliateLink: ({ children, value }) => (
                  <a href={value.href} target="_blank" rel="noopener sponsored"
                    className="text-orange-600 underline hover:text-orange-800">
                    {children}
                  </a>
                ),
              },
            }}
          />
        </article>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {post.engagement?.relatedPosts?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.engagement.relatedPosts.map((related: { _id: string; title: string; slug: { current: string }; excerpt?: string; heroImage?: { asset?: { url: string }; alt?: string } }) => (
                <Link key={related._id} href={`/blog/${related.slug.current}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  {related.heroImage?.asset?.url && (
                    <Image src={related.heroImage.asset.url} alt={related.heroImage.alt || related.title}
                      width={400} height={200} className="rounded-lg w-full object-cover h-32 mb-3" />
                  )}
                  <h3 className="font-semibold text-gray-900">{related.title}</h3>
                  {related.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{related.excerpt}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        {post.engagement?.enableNewsletter && (
          <section className="mt-12 bg-orange-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {post.engagement.newsletterConfig?.heading || 'Get Park Planning Tips'}
            </h2>
            <p className="text-gray-600 mb-6">
              {post.engagement.newsletterConfig?.subheading || 'Weekly tips, deals, and itineraries for your Orlando trip.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button type="submit"
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                {post.engagement.newsletterConfig?.ctaLabel || 'Subscribe — It\'s Free'}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              {post.engagement.newsletterConfig?.privacyText || 'No spam, ever. Unsubscribe anytime.'}
            </p>
          </section>
        )}
      </div>
    </main>
  )
}