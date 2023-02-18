const { Schema, model } = require('mongoose')

const schema = Schema({
  id: Number,
  warns: Number,
})

module.exports = model('Settings', schema)
