const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js')

module.exports = {
  run: async (interaction) => {
    const modal = new ModalBuilder()
      .setTitle('🛡️ Модерация')
      .setCustomId('GetWarn')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('id')
            .setLabel('ID предупреждения')
            .setMinLength(1)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('15')
        )
      )

    await interaction.showModal(modal)
  },
}
