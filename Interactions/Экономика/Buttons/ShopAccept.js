const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { channels, emojis } = require('../../../Util/Config')
const CheckBalance = require('../Functions/CheckBalance')

module.exports = {
  run: async (interaction) => {
    const amount = parseInt(interaction.customId.split('-')[1]),
      roles = interaction.message.embeds[0].data.description
        .split('Роли:** ')[1]
        .split('\n')[0]
        .split(', ')

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const { description } = embed.data

    const MemberData = await Members.findOne({ id: interaction.member.id })

    const IsAvailable = await CheckBalance({
      amount: amount,
      MemberData,
    })

    if (!IsAvailable) {
      embed.setDescription(
        description +
          `\n\nТебе не хватает ${amount - (MemberData?.balance || 0)}  ${
            emojis.coins.default
          }`
      )

      const row =
        interaction.message.components[0].components[0].setDisabled(true)

      return await interaction.update({ embeds: [embed], components: [row] })
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('Economics')
        .setLabel('Назад')
        .setEmoji('⬅️')
    )

    embed.setDescription(
      `**Баланс:** ${
        MemberData?.balance - amount || 0
      }\n\n**Роли:** ${roles.join(', ')}\n\n**✅ Успешно!**`
    )

    await interaction.update({ embeds: [embed], components: [row] })

    await Members.findOneAndUpdate(
      { id: interaction.member.id },
      { $inc: { balance: -amount } }
    )

    roles.forEach(async (role) => {
      await interaction.member.roles.add(role.slice(3, -1))
    })

    const CommandsChannel = interaction.guild.channels.cache.get(
      channels.commands
    )

    const LogsChannel = interaction.guild.channels.cache.get(
      channels.logs.economics
    )

    const content = `${interaction.member} 🛍️\n${roles.join(', ')}\n${amount} ${
      emojis.coins.default
    }`

    await CommandsChannel.send({
      content,
      allowedMentions: { users: [interaction.member.id] },
    })
    await LogsChannel.send({
      content,
      allowedMentions: { users: [interaction.member.id] },
    })
  },
}
