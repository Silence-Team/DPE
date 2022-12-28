const {
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../../Schemas/Members')
const { colors } = require('../../../../Util/Config')

module.exports = {
  data: {
    name: 'Паспорт',
    type: ApplicationCommandType.User,
  },
  run: async (interaction) => {
    const member = interaction.targetMember

    const MemberData = await Members.findOne({ id: member.id })

    const embed = new EmbedBuilder()
      .setColor(colors.blurple)
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .addFields({
        name: 'О себе',
        value: MemberData?.passport?.about || '*Не указано*',
      })

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('EditPassport')
        .setEmoji('✏️')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Изменить')
        .setDisabled(true)
    )

    if (interaction.member === member) {
      row.components[0].setDisabled(false)
    }

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
  },
}
