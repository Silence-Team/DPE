const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const { channels, roles, colors } = require('../../../Util/Config')

module.exports = {
  run: async (interaction) => {
    const { fields } = interaction

    const name = interaction.customId.split('-')[1]

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setColor(colors.blurple)
      .setTitle(`Заявка на ${name}а`)
      .setDescription(`**Автор:** ${interaction.member}`)

    fields.fields.forEach((field) => {
      embed.addFields([
        {
          name: (
            field.customId.charAt(0).toUpperCase() + field.customId.slice(1)
          ).replaceAll('_', ' '),
          value: field.value,
          inline: true,
        },
      ])
    })

    let role = ''

    switch (name) {
      case 'ивентор':
        role = 'eventor'
        break
      case 'модератор':
        role = 'helper'
        break
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`AcceptForm-${roles[role]}`)
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅')
        .setLabel('Принять'),
      new ButtonBuilder()
        .setCustomId('DeclineForm')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('❌')
        .setLabel('Отклонить')
    )
    await interaction.reply({
      content: `**✅ Заявка на ${name}а отправлена**`,
      ephemeral: true,
    })

    const channel = interaction.guild.channels.cache.get(channels.applications)
    channel.send({ embeds: [embed], components: [row] })
  },
}
