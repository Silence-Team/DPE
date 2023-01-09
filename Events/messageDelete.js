const {
  EmbedBuilder,
  codeBlock,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const config = require('../Util/Config')

module.exports = {
  run: (message) => {
    if (message.author?.bot || !message.member) return

    const embed = new EmbedBuilder()
      .setTitle('🚫 Удалено')
      .setColor(config.colors.red)
      .setAuthor({
        name: message.member.displayName,
        iconURL: message.member.displayAvatarURL(),
      })
      .setDescription(codeBlock(message.content))

    const channel = message.guild.channels.cache.get(
      config.channels.logs.messages
    )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔗')
        .setLabel(`Канал: ${message.channel.name}`)
        .setDisabled(true)
        .setCustomId('empty')
    )

    channel.send({ embeds: [embed], components: [row] })
  },
}
