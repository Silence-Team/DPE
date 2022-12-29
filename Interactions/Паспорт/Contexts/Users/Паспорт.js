const { ApplicationCommandType } = require('discord.js')

const GetPassport = require('../../Functions/GetPassport')

module.exports = {
  data: {
    name: 'Паспорт',
    type: ApplicationCommandType.User,
  },
  run: async (interaction) => {
    const member = interaction.targetMember

    const data = await GetPassport(member, interaction.member)

    interaction.reply({ ...data, ephemeral: true })
  },
}
