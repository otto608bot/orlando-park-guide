import { groq } from 'next-sanity'

// Single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    updatedAt,
    isRepublished,
    originalPublishedAt,
    revisionNote,
    excerpt,
    readTime,
    tags,
    heroImage {
      asset->,
      alt,
      caption,
      mobileAlt
    },
    mobileHeroImage {
      asset->,
      alt,
      caption
    },
    author-> {
      _id,
      name,
      slug,
      bio,
      avatar {
        asset->,
        alt
      },
      sameAs
    },
    categories[]-> {
      _id,
      title,
      slug,
      description
    },
    seo {
      seoTitle,
      slugOverride,
      metaDescription,
      canonicalUrl,
      ogImage {
        asset->,
        alt
      },
      noIndex,
      structuredData
    },
    body[] {
      ...,
      _type == "reference" => @->,
      _type == "image" => {
        ...,
        asset-> {
          _id,
          url,
          metadata {
            dimensions
          }
        }
      }
    },
    engagement {
      enableNewsletter,
      newsletterConfig,
      enableQA,
      qaSection[] {
        question,
        answer,
        author-> { name, avatar { asset-> { url } } },
        answerDate
      },
      relatedPosts[]-> {
        _id,
        title,
        slug,
        excerpt,
        heroImage { asset-> { url }, alt }
      },
      featuredPost
    }
  }
`

// All post slugs (for static generation)
export const allPostSlugsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))][].slug.current
`

// All posts for listing (with pagination support)
export const allPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    updatedAt,
    excerpt,
    readTime,
    heroImage { asset-> { url }, alt },
    author-> { name },
    categories[]-> { title, slug }
  }
`