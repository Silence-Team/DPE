const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')

module.exports = {
  run: async (interaction) => {
    const MemberData = await Members.findOne({ id: interaction.member.id })

    const modal = new ModalBuilder()
      .setCustomId('EditPassport')
      .setTitle('Паспорт')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('About')
            .setLabel('О себе')
            .setMaxLength(1024)
            .setPlaceholder('None, чтобы удалить')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
        )
      )

    if (MemberData?.passport?.about) {
      modal.components[0].components[0].setValue(MemberData.passport.about)
    }

    await interaction.showModal(modal)
  },
}
