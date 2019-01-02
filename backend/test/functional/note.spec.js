'use strict'

const { test, trait } = use('Test/Suite')('Note')
const Note = use('App/Models/Note')

trait('Test/ApiClient')

// test('get list of notes', async ({ client }) => {
//   await Note.create({
//     noteName: 'Adonis 101',
//     noteBody: 'Note content'
//   })

//   const response = await client.get('/notes').end()

//   response.assertStatus(200)
//   response.assertJSONSubset([{
//     noteName: 'Adonis 101',
//     noteBody: 'Note content'
//   }])
// })