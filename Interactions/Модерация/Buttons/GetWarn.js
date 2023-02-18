const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')

module.exports = {
  run: async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    embed.setDescription(`Как получить предупреждения?`).setImage(null)

    const FirstRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('WarnByUser')
        .setLabel('По пользователю')
        .setEmoji('👤')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('WarnByID')
        .setLabel('По ID')
        .setEmoji('🆔')
        .setStyle(ButtonStyle.Primary)
    )

    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('Moderation')
        .setLabel('Назад')
        .setEmoji('⬅️')
    )

    await interaction.update({
      embeds: [embed],
      components: [FirstRow, SecondRow],
    })
  },
}
