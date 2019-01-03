'use strict'

const { test, trait } = use('Test/Suite')('Note')
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

test('save one note', async ({ client, assert }) => {
    assert.plan(2)
  
    const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
    const user_id = registrationResponse.body.user.user_id;

    const note = {
        noteName: 'Adonis 101',
        noteBody: 'Testing note content',
        user_id
    }
    
    await Note.create(note)
  
    let userNotes = await Database.table('notes').where('user_id', user_id)

    // clean out id, createdAt, updatedAt fields
    if (userNotes) userNotes = userNotes.map(item => {
            const { noteName, noteBody, user_id } = item;
            return { noteName, noteBody, user_id };
        })

    assert.deepInclude( userNotes, note);
    assert.lengthOf(userNotes, 1)
})

test('save two notes', async ({ client, assert }) => {
    assert.plan(3)
  
    const registrationResponse = await client.post('registration').send(USER_REGISTRATION_DATA).end()
    const user_id = registrationResponse.body.user.user_id;

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
  
    let userNotes = await Database.table('notes').where('user_id', user_id)

    // clean out id, createdAt, updatedAt fields
    if (userNotes) userNotes = userNotes.map(item => {
        const { noteName, noteBody, user_id } = item;
        return { noteName, noteBody, user_id };
    })

    assert.deepInclude( userNotes, note);
    assert.deepInclude( userNotes, anotherNote);
    assert.lengthOf(userNotes, 2)
})
  
