'use strict'

const { test, trait } = use('Test/Suite')('Upload Avatar')

const Helpers = use('Helpers')
const fs = use('fs')
const readFile = Helpers.promisify(fs.readFile)

const User = use('App/Models/User')
const Note = use('App/Models/Note')
const Database = use('Database')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')
trait('DatabaseTransactions')

const USER_REGISTRATION_DATA = {
  username: 'test1',
  email: 'test1@test.edu',
  password: '12345678',
}

test('validate extension of the uploaded userpic', async ({ client, assert }) => {
  assert.plan(1)

  const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
  const { token } = registrationResponse.body.user;

  const response = await client.post('edit')
    .header('Authorization', `Bearer ${token}`)
    .header('Content-Type', 'application/x-www-form-urlencoded')
    .attach('profile_pic', Helpers.tmpPath('test/example.txt'))
    .end()

  console.log('Response: ', response)
  response.assertJSONSubset({ message: 'Invalid file type plain or text. Only image is allowed' })
})



test('validate size of the uploaded userpic', async ({ client, assert }) => {
  assert.plan(1)

  const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
  const { token } = registrationResponse.body.user;

  const response = await client.post('edit')
    .header('Authorization', `Bearer ${token}`)
    .header('Content-Type', 'application/x-www-form-urlencoded')
    .attach('profile_pic', Helpers.tmpPath('test/pyramid.png'))
    .end()

  response.assertJSONSubset({ message: 'File size should be less than 100KB' })
})



test('test if filename stored within \"users\" table', async ({ client, assert }) => {
  assert.plan(1)

  const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
  const { user_id, token } = registrationResponse.body.user;

  const response = await client.post('edit')
    .header('Authorization', `Bearer ${token}`)
    .header('Content-Type', 'application/x-www-form-urlencoded')
    .attach('profile_pic', Helpers.tmpPath('test/noavatar.png'))
    .end()

  const user = await User.find(user_id)

  assert.equal(response.body.userpic, user.userpic)
})

