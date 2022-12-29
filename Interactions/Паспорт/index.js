const GetPassport = require('./Functions/GetPassport')

const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require('discord.js')

module.exports = {
  data: {
    name: 'паспорт',
    type: ApplicationCommandType.ChatInput,
    description: 'Информация об участнике',
    options: [
      {
        name: 'участник',
        type: ApplicationCommandOptionType.User,
        description: 'Чей паспорт ты хочешь посмотреть?',
        required: false,
      },
    ],
  },
  run: async (interaction) => {
    const member =
      interaction.options.getMember('участник') || interaction.member

    const data = await GetPassport(member, interaction.member)
    interaction.reply({ ...data, ephemeral: true })
  },
}
