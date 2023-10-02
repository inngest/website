import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'article',
    type: 'document',
    title: 'Article',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            title: 'Slug',
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            }
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'markdown'
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{type: 'reference', to: [{type: 'tag'}]}]
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{type: 'category'}]

        })
    ]
})