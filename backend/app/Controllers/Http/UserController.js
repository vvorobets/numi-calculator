'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const { validate } = use('Validator')
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

    const randomNumber = new Date().getTime()+Math.floor(Math.random() * 1000)
    const profilePic = request.file('profile_pic', {
      types: ['image'],
      size: ['2mb'],
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    let name = `${profilePic._clientName}`

    await profilePic.move('uploads', {
      name: (randomNumber)+'custom-name.jpg'
    })

    if (!profilePic.moved()) {
      return profilePic.error()
    }

    const data = request.only(['email', 'userpic'])
    const user = await auth.getUser()
    const fileName =  `../../uploads/${name}`
    const validation = await validate(data, {
      email: 'required|email|users'
    })

    user.merge({ userpic: fileName })
    user.merge(data)

    // await user.save()

    const logged = await this.login({ request, auth })
    return logged
  }

  async logout({ request, response, auth }) { 

    await auth
      .authenticator('jwt')
      .revokeTokens(true)

    return response.status(200).json({ message : 'Logout success'})
  }
}

module.exports = UserController
