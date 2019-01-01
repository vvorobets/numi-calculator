'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NoteSchema extends Schema {
  up () {
    this.alter('notes', (table) => {
      table.string('noteName', 80)
    })
  }

  down () {
    this.alter('notes', (table) => {
      table.dropColumn('noteName')
    })
  }
}

module.exports = NoteSchema
