const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { emojis } = require('../../../Util/Config')
const DefaultReply = require('../Functions/DefaultReply')
const CheckBalance = require('../Functions/CheckBalance')

module.exports = {
  run: async (interaction) => {
    let amount = 0

    const roles = interaction.values.map((item) => {
      amount += parseInt(item.split('-')[1])
      return item.split('-')[0]
    })

    const MemberData = await Members.findOne({ id: interaction.member.id })

    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    if (!roles.length) {
      const reply = DefaultReply(interaction)

      return await interaction.update(reply)
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`ShopAccept-${amount}`)
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
      amount: amount,
      MemberData,
    })

    if (!IsAvailable) {
      embed.setDescription(
        `**Баланс:** ${MemberData?.balance || 0} ${
          emojis.coins.default
        }\n\n**Роли:** ${roles
          .map((id) => `<@&${id}>`)
          .join(', ')}\n\nТебе не хватает ${
          amount - (MemberData?.balance || 0)
        }  ${emojis.coins.default}`
      )

      row.components[0].setDisabled(true)
    }

    embed.setDescription(
      `**Баланс:** ${MemberData?.balance || 0} ${
        emojis.coins.default
      }\n\n**Роли:** ${roles.map((id) => `<@&${id}>`).join(', ')}`
    )

    await interaction.update({ embeds: [embed], components: [row] })
  },
}
