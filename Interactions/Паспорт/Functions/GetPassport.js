const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { colors, emojis } = require('../../../Util/Config')

module.exports = async (member, invoker) => {
  const MemberData = await Members.findOne({ id: member.id })

  const marriage = MemberData?.passport?.marriage || {}
  const IsMarriaged = Object.values(marriage).filter((value) => value).length

  const embed = new EmbedBuilder()
    .setColor(colors.blurple)
    .setAuthor({
      name: member.displayName,
      iconURL: member.displayAvatarURL(),
    })
    .addFields(
      {
        name: '✏️ О себе',
        value: MemberData?.passport?.about || '*Не указано*',
        inline: true,
      },
      {
        name: '💍 Брак',
        value: IsMarriaged
          ? `<@${marriage.id}> (<t:${marriage.timestamp}:R>)`
          : '*Не указано*',
        inline: true,
      },
      { name: '\u200B', value: '\u200B' },
      {
        name: '💴 Баланс',
        value: `${MemberData?.balance || 0} ${emojis.coins.default}`,
        inline: true,
      }
    )

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('EditPassport')
      .setEmoji('✏️')
      .setStyle(ButtonStyle.Primary)
      .setLabel('Изменить')
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId('Divorce')
      .setEmoji('🛑')
      .setStyle(ButtonStyle.Primary)
      .setLabel('Развестись')
      .setDisabled(true)
  )

  const SecondRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('Economics')
      .setEmoji('💴')
      .setStyle(ButtonStyle.Primary)
      .setLabel('Экономика')
      .setDisabled(true)
  )

  if (invoker === member) {
    row.components[0].setDisabled(false)
    SecondRow.components[0].setDisabled(false)

    if (IsMarriaged) {
      row.components[1].setDisabled(false)
    }
  }

  return { embeds: [embed], components: [row, SecondRow] }
}
