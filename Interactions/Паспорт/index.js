const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../Schemas/Members')
const { colors } = require('../../Util/Config')

module.exports = {
  data: {
    name: 'паспорт',
    type: ApplicationCommandType.ChatInput,
    description: 'Информация об участнике',
    options: [
      {
        name: 'участник',
        type: ApplicationCommandOptionType.User,
        description: 'Чей паспорт ты хочешь посмотреть?',
        required: false,
      },
    ],
  },
  run: async (interaction) => {
    const member =
      interaction.options.getMember('участник') || interaction.member

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
