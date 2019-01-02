'use strict'

// TEST CASES

// I. user registration
// validation exceptions

// II. user login

// III. user logout

// IV. saving profile_pic
// validation exceptions

// NOTES TEST CASES

// V. getting saved notes

// VI. saving notes



const { test, trait } = use('Test/Suite')('User')
const User = use('App/Models/User')
const Event = use('Event')

// trait('Test/ApiClient')
// trait('Auth/Client')
// trait('Session/Client')

// test('register a user', async ({ client }) => {
//   await User.create({
//     username: 'Adonis 101',
//     email: 'Adonis 101.edu',
//     body: 'Blog post content'
//   })

//   const response = await client.get('/posts').end()

//   response.assertStatus(200)
//   response.assertJSONSubset([{
//     title: 'Adonis 101',
//     body: 'Blog post content'
//   }])
// })

// test('get list of user\'s saved notes', async ({ client }) => {
//   const user = await User.find(2)

//   const response = await client
//     .get('posts')
//     .loginVia(username, password, 'basic')
//     .end()
// })

// test('register user', async ({ assert }) => {
//   Event.fake()

//   // write test
  

//   const recentEvent = Event.pullRecent()
//   assert.equal(recentEvent.event, 'register:user')

//   Event.restore()
// })