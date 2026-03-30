import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'bio', title: 'Bio', type: 'text' }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'sameAs',
      title: 'Social Profiles (Same As)',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'JSON-LD sameAs links (Twitter, LinkedIn, etc.) for author entity.',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
})