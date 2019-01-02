// 'use strict'

// const Event = use('Event')

// const { test, trait } = use('Test/Suite')('User Registration')
// const User = use('App/Models/User')
// trait('Test/ApiClient')



// test('register user', async ({ client, assert }) => {
//   // Event.fake()

//   assert.plan(2)

//   const data = {
//     username: 'test1',
//     email: 'test1@test.edu',
//     password: '12345678',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(200)
//   response.assertJSONSubset({ user: { 
//     username: 'test1',
//     email: 'test1@test.edu',
//   }})

//   // const recentEvent = Event.pullRecent()
//   // assert.equal(recentEvent.event, 'register:user')

//   // Event.restore()
// })



// test('register user if email missed', async ({ client, assert }) => {

//   assert.plan(2)

//   const data = {
//     username: 'test1.1',
//     password: '12345678',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(400)
//   response.assertJSONSubset({ type: 'error', message: 'required validation failed on email' })
// })



// test('register user if email not unique', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1.2',
//     email: 'test1@test.edu',
//     password: '12345678',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(400)
//   response.assertJSONSubset({ type: 'error', message: 'unique validation failed on email' })
// })



// test('register user if email format not correct', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1.3',
//     email: 'test2.1@test',
//     password: '12345678',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(400)
//   response.assertJSONSubset({ type: 'error', message: 'email validation failed on email' })
// })



// test('register user if username missed', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     email: 'test1.4@test.edu',
//     password: '12345678',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(400)
//   response.assertJSONSubset({ type: 'error', message: 'required validation failed on username' })
// })



// test('register user if username not unique', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1',
//     email: 'test1.5@test.edu',
//     password: '12345678',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(400)
//   response.assertJSONSubset({ type: 'error', message: 'unique validation failed on username' })
// })



// test('register user if password missed', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1.6',
//     email: 'test1.6@test.edu',
//   }

//   const response = await client.post('registration').send(data).end()

//   response.assertStatus(400)
//   response.assertJSONSubset({ type: 'error', message: 'required validation failed on password' })
// })



// test('login user', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1',
//     password: '12345678',
//   }

//   const response = await client.post('login').send(data).end()

//   response.assertStatus(200)
//   response.assertJSONSubset({ user: {
//     username: 'test1',
//     email: 'test1@test.edu',
//   }})
// })



// test('login user if password missed', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1',
//   }

//   const response = await client.post('login').send(data).end()

//   response.assertStatus(401)
//   response.assertJSONSubset([{ field: "password", message: "Invalid user password" }])
// })



// test('login user if password missed', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1',
//     password: '1234567_',
//   }

//   const response = await client.post('login').send(data).end()

//   response.assertStatus(401)
//   response.assertJSONSubset([{ field: "password", message: "Invalid user password" }])
// })



// test('login user if username incorrect', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     username: 'test1.else',
//     password: '12345678',
//   }

//   const response = await client.post('login').send(data).end()

//   response.assertStatus(401)
//   response.assertJSONSubset([{ field: "username", message: "Cannot find user with provided username" }])
// })


// test('login user if username missed', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = {
//     password: '12345678',
//   }

//   const response = await client.post('login').send(data).end()

//   response.assertStatus(401)
//   response.assertJSONSubset([{ field: "username", message: "Cannot find user with provided username" }])
// })



// test('logout', async ({ client, assert }) => {
//   assert.plan(2)

//   const data = { username: 'test1', password: '12345678' }

//   const loginResponse = await client.post('login').send(data).end()
//   const token = loginResponse.body.user.token;

//   const logoutResponse = await client.get('logout').end()

//   const response = await client.post('edit')
//     .header('Authorization', `Bearer ${token}`)
//     .header('Content-Type', 'application/x-www-form-urlencoded')
//     .send('some data').end()

//   logoutResponse.assertStatus(200)
//   response.assertJSONSubset({ type: 'error', message: "You are not logged in" })
// })