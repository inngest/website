import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'tag',
    type: 'document',
    title: 'Tag',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            title: 'Slug',
            name: 'slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            }
        })
    ]
})