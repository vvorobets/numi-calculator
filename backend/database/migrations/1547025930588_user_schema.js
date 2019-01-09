'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.dropColumn('notes')
      table.string('hexacode', 6).unique()
    })
  }

  down () {
    this.table('users', (table) => {
      table.json('notes')
      table.dropColumn('hexacode')
    })
  }
}

module.exports = UserSchema
