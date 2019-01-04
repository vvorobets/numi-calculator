'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Note = use('App/Models/Note')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const Logger = use('Logger')

const fs = use('fs')
const readFile = Helpers.promisify(fs.readFile)

const userPicPath = 'tmp/uploads/'
  
class UserController {

  async login ({ request, auth }) {
    const { username, password } = request.all()
    const jwt = await auth.attempt(username, password)

    const userData = await Database.table('users').where('username', username)
    const userNotes = await Database.table('notes').where('user_id', userData[0].id)

    return {
      user: {
        user_id: userData[0].id,
        username: userData[0].username,
        email: userData[0].email,
        userpic: userData[0].userpic,
        token: jwt.token,
        savedNotes: userNotes
      }
    }
  }

  async registration ({ request, auth, response }) {
    const { email, password, username } = request.all();
    // Logger.info('auth', email);
    // Logger.info('auth', password);
    // Logger.info('auth', username);
    const rules = {
      email: 'required|email|unique:users,email',
      username: 'required|unique:users,username',
      password: 'required'
    }

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      // validation fails informs about only one problem at a time
      return response.status(400).json({ type: 'error', message: validation.messages().map(item => item.message).join(', ') });
    }

    const user = new User()
    user.password = password
    user.email = email
    user.username = username

    await user.save()

    const logged = await this.login({ request, auth })
    return logged
  }

  async logout({ response, auth }) { 

    await auth
      .authenticator('jwt')
      .revokeTokens(true)

    return response.status(200).json({ message : 'Logout success'})
  }

  async edit ({ request, response, auth }) {
    try {
      const user = await auth.getUser()

      const profilePic = request.file('profile_pic', {
        types: ['image'],
        size: '100kb',
        extnames: ['jpg', 'jpeg', 'png']
      })
  
      const profilePicName = `profilePic_${user.username}${new Date().getTime()}.${profilePic.subtype}`;
  
      await profilePic.move(Helpers.tmpPath('uploads'), {
        name: profilePicName,
        overwrite: true
      })
  
      if (!profilePic.moved()) {
        return profilePic.error()
      }

      user.userpic = profilePicName
      await user.save()
      return { userpic: profilePicName }
  
    } catch (error) {
      response.json({ type: 'error', message: 'You are not logged in' }) // status(401).
    }
  }

  async saveNote ({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const noteName = Object.keys(request.post())[0]
      const noteBody = Object.values(request.post())[0]
      if (!noteName || !noteBody) response.status(400).json({ type: 'error', message: 'Empty name and (or) body field'})

      const affectedRows = await Database.table('notes')
        .where('user_id', user.id).where('noteName', noteName)
        .update({ noteBody: noteBody })

      if (!affectedRows) {
        const note = new Note()
        note.user_id = user.id
        note.noteName = noteName
        note.noteBody = noteBody
    
        await note.save()
      }

      const userNotes = await Database.table('notes').where('user_id', user.id)
      return { savedNotes: userNotes }

    } catch (error) {
      response.send('You are not logged in')
    }
  }

  async getUserPic ({ request }) {
    return await readFile(`${userPicPath}${request.params.userpicName}`)
  }
}

module.exports = UserController
