/// <reference path="../pb_data/types.d.ts" />
migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId('_pb_users_auth_')

		// update collection data
		unmarshal(
			{
				oauth2: {
					mappedFields: {
						avatarURL: '',
						name: ''
					}
				}
			},
			collection
		)

		// remove field
		collection.fields.removeById('text1579384326')

		// remove field
		collection.fields.removeById('file376926767')

		// add field
		collection.fields.addAt(
			1,
			new Field({
				autogeneratePattern: '',
				hidden: false,
				id: 'text4166911607',
				max: 20,
				min: 5,
				name: 'username',
				pattern: '^[A-Za-z0-9_]$',
				presentable: true,
				primaryKey: false,
				required: true,
				system: false,
				type: 'text'
			})
		)

		return app.save(collection)
	},
	(app) => {
		const collection = app.findCollectionByNameOrId('_pb_users_auth_')

		// update collection data
		unmarshal(
			{
				oauth2: {
					mappedFields: {
						avatarURL: 'avatar',
						name: 'name'
					}
				}
			},
			collection
		)

		// add field
		collection.fields.addAt(
			6,
			new Field({
				autogeneratePattern: '',
				hidden: false,
				id: 'text1579384326',
				max: 255,
				min: 0,
				name: 'name',
				pattern: '',
				presentable: false,
				primaryKey: false,
				required: false,
				system: false,
				type: 'text'
			})
		)

		// add field
		collection.fields.addAt(
			7,
			new Field({
				hidden: false,
				id: 'file376926767',
				maxSelect: 1,
				maxSize: 0,
				mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'],
				name: 'avatar',
				presentable: false,
				protected: false,
				required: false,
				system: false,
				thumbs: null,
				type: 'file'
			})
		)

		// remove field
		collection.fields.removeById('text4166911607')

		return app.save(collection)
	}
)
