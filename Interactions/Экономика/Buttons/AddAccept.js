const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { channels, emojis } = require('../../../Util/Config')
const GetMessage = require('../Functions/GetMessage')

module.exports = {
  run: async (interaction) => {
    const amount = parseInt(interaction.customId.split('-')[1]),
      MembersIDs = interaction.message.embeds[0].data.description
        .split('Участники:** ')[1]
        .split('\n')[0]
        .split(', '),
      comment = interaction.customId.split('-')[2]

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId('Economics')
        .setLabel('Назад')
        .setEmoji('⬅️')
    )

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const { description } = embed.data

    embed.setDescription(description + `\n\n**✅ Успешно!**`)

    await interaction.update({ embeds: [embed], components: [row] })

    MembersIDs.forEach(async (member) => {
      await Members.findOneAndUpdate(
        { id: member.slice(2, -1) },
        { $inc: { balance: amount } },
        { upsert: true }
      )
    })

    const CommandsChannel = interaction.guild.channels.cache.get(
      channels.commands
    )

    const LogsChannel = interaction.guild.channels.cache.get(
      channels.logs.economics
    )

    const content = GetMessage(
      emojis.plus,
      interaction.member,
      MembersIDs,
      amount,
      comment
    )

    await CommandsChannel.send({ content })
    await LogsChannel.send({ content })
  },
}
