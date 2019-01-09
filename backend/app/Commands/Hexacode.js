'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')

const ALLOWED_SYMBOLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'


class Hexacode extends Command {
  static get signature () {
    return `hexacode
    { --log : Log hexacodes to the console }
    `
  }

  static get description () {
    return 'Generate unique n-length alpha-numerical codes for users'
  }

  async handle (args, options) {

  // with default answer
  const length = await this
    .ask('Please enter the length of a unique alpha-numerical code', 6)

    if (isNaN(parseInt(length))) {
      this.error(`${this.icon('error')} Length must be an integer. Exit`)
      return
    }

    if (length > 40) {
      this.error(`${this.icon('error')} Length is too long. Exit`)
      return
    }

    if (length < 3) {
      this.error(`${this.icon('error')} Length is too small. Exit`)
      return
    }

    const userIds = await Database.table('users').map(item => item.id)

    let outputTable = []

    for (let user_id of userIds) {
      // check if hexacode is unique
      let affectedRows = 0

      do {
        let hexacode = ''
        // generate random hexacode
        for (let i = 0; i < length; i++) {
          hexacode += ALLOWED_SYMBOLS.charAt(Math.floor(Math.random() * ALLOWED_SYMBOLS.length));
        }
  
        affectedRows = await Database.table('users')
          .where('id', user_id)
          .update({ hexacode })

          outputTable.push([ user_id, hexacode ])

      } while (affectedRows === 0)
    }

    this.success(`${this.icon('success')} Alpha-numerical codes generated`)

    if (options.log) {
      const head = ['User ID', 'Hexacode']
      const body = outputTable
      this.table(head, body)
    }

    Database.close()
  }
}

module.exports = Hexacode
