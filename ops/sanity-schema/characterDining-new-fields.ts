// Fields to add to the hosted Studio's `characterDining` document type (PR #73).
// The Studio source is NOT in this repo; paste these into its schema `fields` array,
// then run `npx sanity deploy` (Studio UI) and `npx sanity schema deploy` from the Studio folder.
// Requires Bennett's approval: deploying Studio changes the editing UI for everyone.
import {defineField} from 'sanity'

export const characterDiningNewFields = [
  defineField({
    name: 'priceByMeal',
    title: 'Price tier by meal (from Disney official page)',
    type: 'object',
    fields: [
      defineField({name: 'breakfast', type: 'string'}),
      defineField({name: 'lunch', type: 'string'}),
      defineField({name: 'dinner', type: 'string'}),
    ],
    description: 'e.g. "$$$ ($35–$59.99/adult)". Leave blank if Disney shows no tier for that meal.',
  }),
  defineField({name: 'sourceUrl', title: 'Official source URL', type: 'url'}),
  defineField({name: 'verifiedAt', title: 'Verified on', type: 'date'}),
  defineField({
    name: 'hideFromList',
    title: 'Hide from character dining lists',
    type: 'boolean',
    initialValue: false,
  }),
  defineField({
    name: 'hideReason',
    title: 'Why hidden',
    type: 'text',
    rows: 2,
    hidden: ({parent}) => !parent?.hideFromList,
  }),
]
