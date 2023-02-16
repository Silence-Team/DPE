const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { emojis } = require('../../../Util/Config')

module.exports = {
  run: async (interaction) => {
    const users = await Members.find({
      balance: { $gte: 0 },
    })
      .sort({ balance: -1 })
      .limit(10)

    const max = await Members.count({ balance: { $gte: 0 } })

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('TopBack')
        .setEmoji('⬅️')
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('TopEmpty')
        .setLabel(`1/${Math.floor(max / 10) + 1 || 1}`)
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('TopNext')
        .setEmoji('➡️')
    )

    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId('Economics')
        .setLabel('Назад')
        .setEmoji('⬅️')
    )

    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    let description = ''

    users.forEach(async (user, index) => {
      const member =
        interaction.guild.members.cache.get(user.id) ||
        interaction.client.users.cache.get(user.id)

      if (!member) {
        await Members.findOneAndRemove({ id: user.id })

        return
      }

      description += `**${index + 1}.** ${member} (${
        member.displayName || member.username
      }) ─ ${user.balance} ${emojis.coins.default}\n`
    })

    if (max === 10) {
      row.components[2].setDisabled(true)
    }

    if (!description) {
      description = '*Пусто*'
    }

    embed.setDescription(description)

    await interaction.update({
      embeds: [embed],
      components: [row, SecondRow],
    })
  },
}
