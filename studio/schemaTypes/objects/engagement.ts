import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'engagement',
  title: 'Engagement Features',
  type: 'object',
  fields: [
    defineField({
      name: 'enableNewsletter',
      title: 'Enable Newsletter Signup',
      type: 'boolean',
      description: 'Show newsletter signup block at the end of this post',
      initialValue: false,
    }),
    defineField({
      name: 'newsletterConfig',
      title: 'Newsletter Configuration',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Get Park Planning Tips' }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'string', initialValue: 'Weekly tips, deals, and itineraries for your Orlando trip.' }),
        defineField({ name: 'listId', title: 'Email List ID', type: 'string', description: 'Provider-specific list ID (e.g., Mailchimp)' }),
        defineField({ name: 'ctaLabel', title: 'Button Label', type: 'string', initialValue: 'Subscribe — It\'s Free' }),
        defineField({ name: 'privacyText', title: 'Privacy Notice', type: 'string', initialValue: 'No spam, ever. Unsubscribe anytime.' }),
        defineField({
          name: 'variant',
          title: 'Display Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Inline Banner', value: 'inline' },
              { title: 'Modal Popup', value: 'modal' },
              { title: 'Exit Intent', value: 'exit-intent' },
              { title: 'Scroll Triggered', value: 'scroll' },
            ],
          },
          initialValue: 'inline',
        }),
      ],
      hidden: ({ parent }) => !parent?.enableNewsletter,
    }),
    defineField({
      name: 'enableQA',
      title: 'Enable Reader Q&A Section',
      type: 'boolean',
      description: 'Show a reader Q&A section at the end of this post',
      initialValue: false,
    }),
    defineField({
      name: 'qaSection',
      title: 'Q&A Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'qaItem',
          title: 'Q&A Pair',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
            defineField({ name: 'author', title: 'Answer Author', type: 'reference', to: [{ type: 'author' }] }),
            defineField({ name: 'answerDate', title: 'Answer Date', type: 'datetime' }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        },
      ],
      hidden: ({ parent }) => !parent?.enableQA,
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (Rule) => Rule.max(4),
      description: 'Manually curated related posts (max 4)',
    }),
    defineField({
      name: 'featuredPost',
      title: 'Feature This Post',
      type: 'boolean',
      initialValue: false,
      description: 'Pin this post to the top of listing pages (homepage, category pages).',
    }),
  ],
  options: {
    collapsible: true,
    collapsed: false,
  },
})