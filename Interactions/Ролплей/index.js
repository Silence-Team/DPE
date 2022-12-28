const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require('discord.js')
const { channels } = require('../../Util/Config')
const RoleplayData = require('../../Util/RoleplayData')
const ValidateString = require('../../Util/ValidateString')

module.exports = {
  data: {
    name: 'рп',
    type: ApplicationCommandType.ChatInput,
    description: 'Отправить ролплей команду',
    options: [
      {
        name: 'действие',
        type: ApplicationCommandOptionType.String,
        description: 'Какое дейсствие ты хочешь совершить?',
        autocomplete: true,
        required: true,
      },
      {
        name: 'участник',
        type: ApplicationCommandOptionType.User,
        description: 'С кем ты хочешь совершить это действие?',
        required: false,
      },
      {
        name: 'слова',
        type: ApplicationCommandOptionType.String,
        description: 'Комментарий к действию',
        required: false,
      },
    ],
  },
  run: async (interaction) => {
    const { options } = interaction
    const action = options.getString('действие'),
      member = options.getMember('участник'),
      words = options.getString('слова')

    const RPChannel = interaction.guild.channels.cache.get(channels.roleplay)

    const data = RoleplayData.find((obj) => obj.value === action)

    const rule = (await interaction.guild.autoModerationRules.fetch()).find(
      (rule) => rule.name === 'Запрещённые слова'
    )

    if (ValidateString(words, rule)) {
      return await interaction.reply({
        content: '**В тексте содержаться запрещённые слова**',
        ephemeral: true,
      })
    }

    if (!member && !data.solo) {
      return await interaction.reply({
        content: '**Для этого действия необходимо указать участника**',
        ephemeral: true,
      })
    }

    let content = `**${interaction.member} ${data.action}`

    if (member) {
      if (member.user.bot) {
        return interaction.reply({
          content: '**Нельзя совершить действие с ботом**',
          ephemeral: true,
        })
      }

      if (member === interaction.member) {
        return interaction.reply({
          content: '**Нельзя совершить действие с собой**',
          ephemeral: true,
        })
      }

      if (data.solo) {
        content += ` вместе с ${member}`
      } else {
        content += ` ${member}`
      }
    }

    content += '**'

    if (words) {
      content += `\n\n${words}`
    }

    await interaction.reply({
      content: '**Действие отправлено**',
      ephemeral: true,
    })

    const gifs = await interaction.client.tenor.Search.Query(
      `anime ${action}`,
      '100'
    )

    const gif =
      gifs[Math.floor(Math.random() * gifs.length)].media_formats.gif.url

    await RPChannel.send({ content, files: [gif] })
  },
}
