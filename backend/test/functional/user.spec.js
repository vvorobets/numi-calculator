'use strict'

const { test, trait } = use('Test/Suite')('User Functional')
trait('Test/ApiClient')
trait('DatabaseTransactions')

const REGISTRATION_DATA = {
    username: 'test1',
    email: 'test1@test.edu',
    password: '12345678',
}

test('logout', async ({ client, assert }) => {
  assert.plan(3)

  await client.post('registration').send(REGISTRATION_DATA).end()

  const data = { username: 'test1', password: '12345678' }

  const loginResponse = await client.post('login').send(data).end()
  const token = loginResponse.body.user.token;

  const logoutResponse = await client.get('logout').end()

  const response = await client.post('edit')
    .header('Authorization', `Bearer ${token}`)
    .header('Content-Type', 'application/x-www-form-urlencoded')
    .send('some data').end()

  loginResponse.assertStatus(200)
  logoutResponse.assertStatus(200)
  response.assertJSONSubset({ type: 'error', message: "You are not logged in" })
})