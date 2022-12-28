const { Schema, model } = require('mongoose')

const schema = Schema({
  id: String,
  balance: Number,
  requests: Array,
  guild: String,
  passport: {
    about: String,
  },
})

module.exports = model('Members', schema)
