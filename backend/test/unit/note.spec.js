// 'use strict'

// const { test, trait } = use('Test/Suite')('Note')
// const User = use('App/Models/User')
// const Note = use('App/Models/Note')

// trait('Test/ApiClient')
// trait('Auth/Client')
// trait('Session/Client')

// test('get list of notes', async ({ client, assert }) => {
//   assert.plan(2)

//   await Note.create({
//     noteName: 'Adonis 101',
//     noteBody: 'Testing note content',
//     user_id: 2
//   })

//   const user = await User.find(2)

//   const response = await client.get('notes').loginVia(user).end()

//   response.assertStatus(200)
//   response.assertJSONSubset({ savedNotes: [{ 
//     noteName: "Adonis 101", 
//     noteBody: "Testing note content", 
//     user_id: 2 
//   }]})
// })