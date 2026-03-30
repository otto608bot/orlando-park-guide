import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoSuite',
  title: 'SEO Suite',
  type: 'object',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: "Override the default <title> tag (leave blank to use document title)",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'slugOverride',
      title: 'URL Slug Override',
      type: 'slug',
      description: 'Override the default URL path (use with caution)',
      options: { maxLength: 200 },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Override the auto-generated canonical URL (leave blank for default)',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Custom social share image (1200×630 recommended)',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent this page from appearing in search engines',
      initialValue: false,
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'text',
      rows: 8,
      description: 'Paste raw JSON-LD schema markup if needed. Must be valid JSON.',
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
})