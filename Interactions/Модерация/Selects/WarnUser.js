const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js')
const Members = require('../../../Schemas/Members')

module.exports = {
  run: async (interaction) => {
    const member = interaction.members.first()
    const MembersData = await Members.findOne({ id: member?.id })

    const BackRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Назад')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('GetWarn')
        .setEmoji('⬅️')
    )

    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    if (!(MembersData && MembersData.warns?.length)) {
      embed.setDescription(`У ${member} нет варнов`)

      return await interaction.update({
        embeds: [embed],
        components: [BackRow],
      })
    }

    const description = `Предупреждения ${member}\n\n${MembersData.warns.map(
      (warn, index) => {
        return `**${index + 1}.** 🆔: ${warn.id}\n📃 ${warn.reason}\n\n`
      }
    )}`

    embed.setDescription(description)

    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('WarnByID')
        .setLabel('Найти по ID')
        .setEmoji('🆔')
        .setStyle(ButtonStyle.Primary)
    )

    await interaction.update({
      embeds: [embed],
      components: [SecondRow, BackRow],
    })
  },
}
