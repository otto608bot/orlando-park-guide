import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tearAway',
  title: 'Tear-Away Block',
  type: 'object',
  fields: [
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      options: {
        list: [
          { title: 'Packing List', value: 'packingList' },
          { title: 'Calendar / Timeline', value: 'calendar' },
          { title: 'Checklist', value: 'checklist' },
          { title: 'Comparison Table', value: 'comparison' },
          { title: 'Quick Stats', value: 'quickStats' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: "Optional subtitle (e.g., \"Everything you need for 3 days at Disney World\").",
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'listItem',
          fields: [
            defineField({ name: 'text', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'checked', title: 'Pre-checked', type: 'boolean', initialValue: false }),
            defineField({ name: 'icon', title: 'Icon (optional)', type: 'string' }),
            defineField({ name: 'link', title: 'Item Link (optional)', type: 'url' }),
          ],
          preview: { select: { title: 'text' } },
        },
      ],
    }),
    defineField({ name: 'note', title: 'Footer Note', type: 'text', rows: 2 }),
    defineField({
      name: 'mobileCollapsed',
      title: 'Start Collapsed on Mobile',
      type: 'boolean',
      initialValue: false,
      description: 'On mobile, this block will start collapsed with a "Show more" toggle. Useful for long lists.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'blockType' },
  },
})