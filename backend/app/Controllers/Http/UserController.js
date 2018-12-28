'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const { validate } = use('Validator')
const Helpers = use('Helpers')
const Logger = use('Logger')

class UserController {

  async login ({ request, auth }) {
    const { username, password } = request.all()
    const jwt = await auth.attempt(username, password)

    const userData = await Database.table('users').where('username', username)

    return {
      user: {
        username: userData[0].username,
        email: userData[0].email,
        token: jwt.token
      }
    }
  }

  async registration ({ request, auth, response }) {
    const { email, password, username } = request.all();
    Logger.info('auth', email);
    Logger.info('auth', password);
    Logger.info('auth', username);
    const rules = {
      email: 'required|email|unique:users,email',
      username: 'required|string|unique:users,username',
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

    Logger.info(request.file);

    await user.save()

    const logged = await this.login({ request, auth })
    return logged
  }

  async logout({ request, response, auth }) { 

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
        size: ['1mb'],
        allowedExtensions: ['jpg', 'jpeg', 'png']
      })
  
      const profilePicName = `profilePic_${request.all().username}${new Date().getTime()}.${profilePic.subtype}`;
  
      await profilePic.move(Helpers.tmpPath('uploads'), {
        name: profilePicName,
        overwrite: true
      })
  
      if (!profilePic.moved()) {
        return profilePic.error()
      }

      const picFolderPath = 'tmp/uploads'
  
      // user.merge({ profile_pic: `${picFolderPath}/${profilePicName}` })
      return user
  
    } catch (error) {
      response.send('You are not logged in')
    }
  }

  async saveNote ({ request, response, auth }) {
    // try {
      const user = await auth.getUser()

      console.log("Notes: ", user.notes)

      if (user.notes) {
        user.notes = { 'a': 4 }
        console.log("Are notes: ", user.notes, 'b: ')
        // let b = Object.assign({}, JSON.parse(user.notes), request.post())
      } else user.notes = JSON.stringify(Object.assign({}, request.post())) // user.notes = JSON.parse(request.post())
      console.log("Now notes: ", user.notes)
      
      await user.save()
      return user
  
    // } catch (error) {
    //   response.send('You are not logged in')
    // }
  }

  async getNotes ({ request, response, auth }) {
    try {
      const user = await auth.getUser()

      console.log('Getting notes...')
      return user
  
    } catch (error) {
      response.send('You are not logged in')
    }
  }


}

module.exports = UserController
