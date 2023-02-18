const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { colors, emojis } = require('../../../Util/Config')

module.exports = async (interaction) => {
  const MemberData = await Members.findOne({
    id: interaction.member.id,
  })

  const embed = new EmbedBuilder()
    .setColor(colors.blurple)
    .setAuthor({
      name: interaction.member.displayName,
      iconURL: interaction.member.displayAvatarURL(),
    })
    .setTitle('💴 Экономика')
    .setDescription(
      `**Баланс:** ${MemberData?.balance || 0}  ${emojis.coins.default}`
    )

  const components = []

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Перевести')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('Transfer')
      .setEmoji('➡️'),
    new ButtonBuilder()
      .setLabel('Магазин')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('Shop')
      .setEmoji('🛒'),
    new ButtonBuilder()
      .setLabel('Топ')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('Top')
      .setEmoji('⬆️')
  )

  components.push(row)

  if (
    interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('Add')
        .setEmoji(emojis.plus)
        .setLabel('Выдать')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('Remove')
        .setEmoji(emojis.minus)
        .setLabel('Забрать')
        .setStyle(ButtonStyle.Primary)
    )

    components.push(SecondRow)
  }

  return { embeds: [embed], components, ephemeral: true }
}
