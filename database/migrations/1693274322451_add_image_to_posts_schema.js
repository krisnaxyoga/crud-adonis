'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddImageToPostsSchema extends Schema {
  up () {
    this.table('posts', (table) => {
      // Menambahkan kolom 'image' setelah kolom 'title'
      table.string('image').after('title').nullable()
    })
  }

  down () {
    this.table('posts', (table) => {
      // Rollback: Menghapus kolom 'image'
      table.dropColumn('image')
    })
  }
}

module.exports = AddImageToPostsSchema
