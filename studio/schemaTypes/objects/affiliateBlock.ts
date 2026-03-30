import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'affiliateBlock',
  title: 'Affiliate Block',
  type: 'object',
  fields: [
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'mobileAlt', title: 'Mobile Alt Text', type: 'string' }),
      ],
    }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 2 }),
    defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. "$24.99" or "From $19"' }),
    defineField({ name: 'priceCurrency', title: 'Currency', type: 'string', initialValue: 'USD' }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          { title: 'In Stock', value: 'https://schema.org/InStock' },
          { title: 'Out of Stock', value: 'https://schema.org/OutOfStock' },
          { title: 'Preorder', value: 'https://schema.org/PreOrder' },
          { title: 'Limited Availability', value: 'https://schema.org/LimitedAvailability' },
        ],
      },
    }),
    defineField({
      name: 'aggregateRating',
      title: 'Aggregate Rating',
      type: 'object',
      fields: [
        defineField({ name: 'ratingValue', title: 'Rating Value (0–5)', type: 'number', validation: (Rule) => Rule.required().min(0).max(5) }),
        defineField({ name: 'reviewCount', title: 'Number of Reviews', type: 'number', validation: (Rule) => Rule.integer().min(0) }),
      ],
      hidden: ({ parent }) => !parent?.rating,
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating Display (0–5)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'partnerLink',
      title: 'Partner / Affiliate Link',
      type: 'object',
      fields: [
        defineField({ name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required() }),
        defineField({ name: 'partner', title: 'Partner Name', type: 'string' }),
        defineField({ name: 'cta', title: 'Button Label', type: 'string', initialValue: 'Check Price' }),
      ],
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight Badge',
      type: 'string',
      description: "e.g. \"Best Value\", \"Editor's Pick\", \"On Sale\"",
    }),
    defineField({
      name: 'placement',
      title: 'Placement Style',
      type: 'string',
      options: {
        list: [
          { title: 'In-line Card', value: 'inline' },
          { title: 'Sidebar Float', value: 'sidebar' },
          { title: 'Full-width Banner', value: 'banner' },
          { title: 'Inline CTA Button', value: 'cta-button' },
        ],
      },
      initialValue: 'inline',
    }),
    defineField({ name: 'sku', title: 'SKU', type: 'string', description: 'Product SKU for JSON-LD Product schema.' }),
    defineField({
      name: 'gtin13',
      title: 'GTIN-13 (EAN)',
      type: 'string',
      description: '13-digit EAN/UPC for structured data.',
      validation: (Rule) => Rule.regex(/^\d{13}$/, { name: 'gtin13', invert: false }),
    }),
  ],
  preview: {
    select: { title: 'productName', subtitle: 'price', media: 'image' },
  },
})