const { Schema, model } = require('mongoose')

const schema = Schema({
  ownerID: String,
  name: String,
  description: String,
  emoji: String,
  balance: Number,
  messageID: String,
  iconURI: String,
  members: [{ id: String, exp: Number, donated: Number }],
  limit: Number,
  channels: {
    text: String,
    voice: String,
  },
  roles: { main: String, guest: String },
})

module.exports = model('Guilds', schema)
