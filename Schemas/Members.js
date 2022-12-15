const { Schema, model } = require('mongoose')

const schema = Schema({
  id: String,
  balance: Number,
  requests: Array,
  guild: String,
})

module.exports = model('Members', schema)
