const mongoose = require('mongoose')
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  ActivityType,
} = require('discord.js')
const { readdirSync } = require('fs')
const tenor = require('tenorjs')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.Channel,
    Partials.User,
  ],
  presence: {
    status: 'online',
    activities: [{ name: 'Silence', type: ActivityType.Watching }],
  },
})

mongoose
  .set('strictQuery', false)
  .connect(process.env.mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))

const handlers = readdirSync('./Handlers')

handlers.forEach((name) => {
  name = name.slice(0, -3)
  client[name.toLowerCase()] = new Collection()
  const handler = require(`./Handlers/${name}`)
  handler.run(client)
  console.log(`Handler ${name} executed`)
})

client.tenor = tenor.client({
  Key: process.env.tenorKey,
  Filter: 'low',
  Locale: 'en_US',
  MediaFilter: 'minimal',
  DateFormat: 'D/MM/YYYY - H:mm:ss A',
})

client.login(process.env.token)
