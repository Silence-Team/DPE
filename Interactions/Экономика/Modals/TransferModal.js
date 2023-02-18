const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const CheckBalance = require('../Functions/CheckBalance')
const { emojis } = require('../../../Util/Config')
const ValidateString = require('../../../Util/ValidateString')

module.exports = {
  run: async (interaction) => {
    const amount = parseInt(interaction.fields.getTextInputValue('Amount')),
      Comment = interaction.fields.getTextInputValue('Comment') || '',
      MembersIDs = interaction.message.embeds[0].data.description
        .split('Участники:** ')[1]
        .split(', ')

    const MemberData = await Members.findOne({ id: interaction.member.id })

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const { description } = embed.data

    const rule = (await interaction.guild.autoModerationRules.fetch()).find(
      (rule) => rule.name === 'Запрещённые слова'
    )

    if (ValidateString(Comment, rule)) {
      embed.setDescription(
        description + '\n\n**В комментарии содержаться запрещённые слова**'
      )

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('Economics')
          .setLabel('Назад')
          .setEmoji('⬅️')
      )

      return await interaction.update({
        embeds: [embed],
        components: [row],
      })
    }

    embed.setDescription(
      `**Баланс:** ${MemberData?.balance || 0} ${
        emojis.coins.default
      }\n\n**Участники:** ${MembersIDs.join(', ')}\n**Сумма:** ${
        MembersIDs.length > 1
          ? `${amount} ${emojis.coins.default} 𐄂 ${MembersIDs.length} = ${
              amount * MembersIDs.length
            } ${emojis.coins.default}`
          : `${amount * MembersIDs.length} ${emojis.coins.default}`
      }${Comment ? `\n\n**Комментарий:** \n${Comment}` : ''}`
    )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`TransferAccept-${amount}-${Comment}`)
        .setLabel('Подтвердить')
        .setEmoji('✅')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('Economics')
        .setLabel('Отменить')
        .setEmoji('❌')
        .setStyle(ButtonStyle.Danger)
    )

    const IsAvailable = await CheckBalance({
      amount: amount * MembersIDs.length,
      MemberData,
    })

    if (!IsAvailable) {
      embed.setDescription(
        description +
          `\nТебе не хватает ${
            amount * MembersIDs.length - (MemberData?.balance || 0)
          }  ${emojis.coins.default}`
      )

      row.components[0].setDisabled(true)
    }

    await interaction.update({ embeds: [embed], components: [row] })
  },
}
