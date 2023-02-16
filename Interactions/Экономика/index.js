const { ApplicationCommandType } = require('discord.js')

const DefaultReply = require('./Functions/DefaultReply')

module.exports = {
  data: {
    name: 'экономика',
    type: ApplicationCommandType.ChatInput,
    description: 'Управление финансами',
  },
  run: async (interaction) => {
    const reply = await DefaultReply(interaction)

    await interaction.reply(reply)
  },
}
