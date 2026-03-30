import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'Used for JSON-LD datePublished and canonical publish date.',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'Used for JSON-LD dateModified. Auto-updated on each save, or manually set on revisions.',
    }),
    defineField({
      name: 'isRepublished',
      title: 'Is Republished',
      type: 'boolean',
      initialValue: false,
      description: 'Set to true when recreating a post from scratch (e.g., major rewrite, new URL). The frontend treats this as a new version.',
    }),
    defineField({
      name: 'originalPublishedAt',
      title: 'Original Published At',
      type: 'datetime',
      description: 'Preserve the historical publish date when backdating a recreated post. Used for JSON-LD datePublished.',
    }),
    defineField({
      name: 'revisionNote',
      title: 'Revision Note',
      type: 'string',
      description: 'Editorial note: why was this post revised? (e.g., "Updated for 2025 park reopening schedule")',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
          description: 'Used for JSON-LD image and accessibility.',
        }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        defineField({
          name: 'mobileAlt',
          title: 'Mobile Alt Text',
          type: 'string',
          description: 'Override alt text specifically for mobile cropped view.',
        }),
      ],
    }),
    defineField({
      name: 'mobileHeroImage',
      title: 'Mobile Hero Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional: separate hero image optimized for mobile portrait layout. Falls back to heroImage if not set.',
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300).warning('Keep under 160 chars for optimal Google display; 300 max for social.'),
      description: 'Short summary used for JSON-LD description, meta description fallback, and social cards.',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      description: 'Estimated read time in minutes. Displayed in SERP snippets and on post headers.',
      validation: (Rule) => Rule.integer().min(1).max(60),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Freeform tags for cross-cutting topic grouping (e.g., "epic-universe", "refurbished-rides").',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Suite',
      type: 'seoSuite',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  defineField({ name: 'href', type: 'url', title: 'URL', validation: (Rule) => Rule.required() }),
                  defineField({ name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true }),
                ],
              },
              {
                name: 'affiliateLink',
                type: 'object',
                title: 'Affiliate Link',
                fields: [
                  defineField({ name: 'href', type: 'url', title: 'Affiliate URL', validation: (Rule) => Rule.required() }),
                  defineField({ name: 'partner', type: 'string', title: 'Partner Name' }),
                  defineField({ name: 'cta', type: 'string', title: 'CTA Label' }),
                  defineField({
                    name: 'variant',
                    type: 'string',
                    title: 'Link Style',
                    options: {
                      list: [
                        { title: 'Inline Text', value: 'inline' },
                        { title: 'CTA Button', value: 'button' },
                        { title: 'Card', value: 'card' },
                      ],
                    },
                  }),
                ],
              },
            ],
          },
        },
        { type: 'affiliateBlock', title: 'Affiliate Block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({ name: 'mobileAlt', title: 'Mobile Alt Text', type: 'string' }),
          ],
        },
        { type: 'tearAway', title: 'Tear-Away Block' },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          fields: [
            defineField({ name: 'url', title: 'Video URL (YouTube/Vimeo)', type: 'url', validation: (Rule) => Rule.required() }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({ name: 'thumbnail', title: 'Custom Thumbnail', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),
    defineField({
      name: 'engagement',
      title: 'Engagement Features',
      type: 'engagement',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'heroImage',
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Updated Date, Newest',
      name: 'updatedAtDesc',
      by: [{ field: 'updatedAt', direction: 'desc' }],
    },
  ],
})