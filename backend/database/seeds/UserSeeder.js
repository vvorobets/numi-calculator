'use strict'

const Database = use('Database')

const HEXACODE_LENGTH = 6
const ALLOWED_SYMBOLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run () {
    // get current users' ids
    const userIds = await Database.table('users').map(item => item.id)

    for (let user_id of userIds) {
      // check if hexacode is unique
      let affectedRows = 0

      do {
        let hexacode = ''
        // generate random hexacode
        for (let i = 0; i < HEXACODE_LENGTH; i++) {
          hexacode += ALLOWED_SYMBOLS.charAt(Math.floor(Math.random() * ALLOWED_SYMBOLS.length));
        }
  
        affectedRows = await Database.table('users')
          .where('id', user_id)
          .update({ hexacode })

      } while (affectedRows === 0)
    }

    Database.close()
  }
}

module.exports = UserSeeder
