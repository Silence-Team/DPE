const { Schema, model } = require('mongoose')

const schema = Schema({
  id: String,
  balance: Number,
  requests: Array,
  guild: String,
  passport: {
    about: String,
    marriage: {
      id: String,
      timestamp: Number,
    },
  },
  warns: [
    {
      date: Date,
      id: Number,
      moderatorID: String,
      reason: String,
      attachment: String,
    },
  ],
  simpUntil: Date,
})

module.exports = model('Members', schema)
