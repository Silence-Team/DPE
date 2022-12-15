const { EmbedBuilder, codeBlock } = require('discord.js')
const config = require('../Util/config')

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

    channel.send({ embeds: [embed] })
  },
}
