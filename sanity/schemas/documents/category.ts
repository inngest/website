import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'category',
    type: 'document',
    title: 'Category',
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
            name: 'description',
            title: 'Description',
            type: 'markdown'
        })
    ]
})