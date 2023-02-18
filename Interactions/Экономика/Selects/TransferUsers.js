const {
  ModalBuilder,
  EmbedBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { emojis } = require('../../../Util/Config')

module.exports = {
  run: async (interaction) => {
    const UsersIDs = interaction.users
      .toJSON()
      .filter(
        (user) =>
          user.id !== interaction.member.id &&
          !interaction.client.users.cache.get(user.id)?.bot
      )

    const MemberData = await Members.findOne({ id: interaction.member.id })

    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    if (!UsersIDs.length) {
      embed.setDescription(
        `**Баланс:** ${MemberData?.balance || 0} ${
          emojis.coins.default
        }\n\n**Необходимо указать участников**`
      )

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('Economics')
          .setLabel('Назад')
          .setEmoji('⬅️')
      )
      return await interaction.update({ embeds: [embed], components: [row] })
    }

    const modal = new ModalBuilder()
      .setTitle(`Перевод`)
      .setCustomId(`TransferModal`)
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('Amount')
            .setLabel('Сумма')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setPlaceholder('10253')
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('Comment')
            .setLabel('Комментарий')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(128)
            .setPlaceholder('На клан')
        )
      )

    embed.setDescription(
      `**Баланс:** ${MemberData?.balance || 0} ${
        emojis.coins.default
      }\n\n**Участники:** ${UsersIDs.map((user) => `${user}`).join(', ')}`
    )

    await interaction.showModal(modal)
    await interaction.editReply({ embeds: [embed], components: [] })
  },
}
