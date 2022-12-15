const { Schema, model } = require('mongoose')

const schema = Schema({
  guildID: String,
  channels: {
    guilds: String,
  },
  categories: {
    guilds: String,
  },
  webhooks: {
    starboard: String,
  },
  dividers: {
    guilds: String,
  },
})

module.exports = model('Settings', schema)
