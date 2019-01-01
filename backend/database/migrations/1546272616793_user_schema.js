'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      // add new columns or remove existing
      table.string('userpic', 80)
      table.json('notes')
    })
  }

  down () {
    this.alter('users', (table) => {
      // reverse alternations
      table.dropColumn('userpic')
      table.dropColumn('notes')

    })
  }
}

module.exports = UserSchema
