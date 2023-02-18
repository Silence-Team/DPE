const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require('discord.js')

const Shop = require('../Functions/Shop')

module.exports = {
  run: async (interaction) => {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder().setCustomId('ShopSelect').setMinValues(0)
    )

    Shop.forEach((item) => {
      if (!interaction.member.roles.cache.has(item.id)) {
        row.components[0].addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(item.name)
            .setEmoji(item.emoji)
            .setDescription(`Цена: ${item.price} `)
            .setValue(`${item.id}-${item.price}`)
        )
      }
    })

    row.components[0].setMaxValues(row.components[0].options.length || 0)

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const { description } = embed.data

    embed.setDescription(
      description + '\n\n**Выбери роли, которые хочешь купить**'
    )

    if (!row.components[0].options.length) {
      embed.setDescription(description + '\n\n**Ты уже купил всё, что можно**')

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

    const SecondRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('Economics')
        .setLabel('Назад')
        .setEmoji('⬅️')
    )

    await interaction.update({
      embeds: [embed],
      components: [row, SecondRow],
    })
  },
}
