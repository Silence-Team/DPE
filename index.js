const { connect } = require('mongoose')
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require('discord.js')
const { readdirSync } = require('fs')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
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
  partials: [Partials.Message, Partials.Reaction],
  presence: {
    status: 'online',
    activities: [{ name: 'Silence', type: 'LISTENING' }],
  },
})

connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))

const handlers = readdirSync('./Handlers')

handlers.forEach((name) => {
  name = name.slice(0, -3)
  client[name.toLowerCase()] = new Collection()
  const handler = require(`./Handlers/${name}`)
  handler.run(client)
  console.log(`Handler ${name} executed`)
})

client.login(process.env.token)