'use strict'

const { test, trait } = use('Test/Suite')('Note Functional')
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

test('save & get a list of user\'s saved notes', async ({ client, assert }) => {
    assert.plan(2)
  
    const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
    const { user_id, token } = registrationResponse.body.user;

    await client.post('notes')
        .header('Authorization', `Bearer ${token}`)
        .header('Content-Type', 'application/x-www-form-urlencoded')
        .send({ 'Adonis 101': 'Testing note content' })
        .end()

    const response = await client.post('notes')
        .header('Authorization', `Bearer ${token}`)
        .header('Content-Type', 'application/x-www-form-urlencoded')
        .send({ 'Adonis 102': 'Testing again' })
        .end()
        
    response.assertStatus(200)
    response.assertJSONSubset({ savedNotes: [{ 
        noteName: "Adonis 101", 
        noteBody: "Testing note content", 
        user_id 
    }, { 
        noteName: "Adonis 102", 
        noteBody: "Testing again", 
        user_id 
    }]})
})

test('rewrite note with same name', async ({ client, assert }) => {
    assert.plan(2)
  
    const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
    const { user_id, token } = registrationResponse.body.user;

    const note = {
        noteName: 'Adonis 101',
        noteBody: 'Testing note content',
        user_id
    }
    await Note.create(note)
    
    const anotherNote = {
        noteName: 'Adonis 102',
        noteBody: 'Testing again',
        user_id
    }
    await Note.create(anotherNote)

    await client.post('notes')
        .header('Authorization', `Bearer ${token}`)
        .header('Content-Type', 'application/x-www-form-urlencoded')
        .send({ 'Adonis 102': 'Rewrite content' })
        .end()

    let userNotes = await Database.table('notes').where('user_id', user_id)

    // clean out id, createdAt, updatedAt fields
    if (userNotes) userNotes = userNotes.map(item => {
        const { noteName, noteBody, user_id } = item;
        return { noteName, noteBody, user_id };
    })

    assert.deepInclude( userNotes, { noteName: 'Adonis 102', noteBody: 'Rewrite content', user_id });
    assert.lengthOf(userNotes, 2)
})
    