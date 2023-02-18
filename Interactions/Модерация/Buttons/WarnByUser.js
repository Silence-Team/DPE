const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  UserSelectMenuBuilder,
} = require('discord.js')

module.exports = {
  run: async (interaction) => {
    const BackRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Назад')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('GetWarn')
        .setEmoji('⬅️')
    )

    const row = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId('WarnUser')
        .setMinValues(1)
        .setMaxValues(1)
    )

    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    embed.setDescription(`Выбери участника`)

    await interaction.update({ embeds: [embed], components: [BackRow, row] })
  },
}
