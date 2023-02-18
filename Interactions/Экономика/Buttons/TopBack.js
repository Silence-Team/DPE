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
    const max = await Members.count({ balance: { $gte: 0 } })

    const row = ActionRowBuilder.from(interaction.message.components[0])

    row.components[2].setDisabled(false)

    const page = parseInt(row.components[1].data.label.split('/')[0]) - 1
    row.components[1].setLabel(`${page}/${Math.floor(max / 10) + 1 || 1}`)

    const users = await Members.find({
      balance: { $gte: 0 },
    })
      .sort({ balance: -1 })
      .skip(page * 10 - 10)
      .limit(10)

    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
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

      description += `**${page * 10 - 10 + index + 1}.** ${member} (${
        member.displayName || member.username
      }) ─ ${user.balance} ${emojis.coins.default}\n`
    })

    if (10 * page - 10 <= 0) {
      row.components[0].setDisabled(true)
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
