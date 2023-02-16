const {
  ActionRowBuilder,
  UserSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')

module.exports = {
  run: async (interaction) => {
    const row = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId('RemoveUsers')
        .setMinValues(1)
        .setMaxValues(25)
        .setPlaceholder('Участники')
    )

    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId('Economics')
        .setLabel('Назад')
        .setEmoji('⬅️')
    )

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const { description } = embed.data

    embed.setDescription(
      description + '\n\n**Выбери участников для забирания**'
    )

    await interaction.update({
      embeds: [embed],
      components: [row, SecondRow],
    })
  },
}
