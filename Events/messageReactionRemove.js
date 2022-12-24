const { EmbedBuilder } = require('discord.js')
const { channels } = require('../Util/Config')

module.exports = {
  run: async (reaction, user) => {
    await reaction.fetch()

    const member = reaction.message.member

    if (!member) return

    if (reaction.emoji.name === '⭐') {
      if (
        reaction.message.channel.id === channels.starboard ||
        user.bot ||
        reaction.message.author.bot
      )
        return

      const channel = reaction.message.guild.channels.cache.get(
        channels.starboard
      )

      await channel.messages.fetch() //TODO оптимизировать

      const message = channel.messages.cache.find(
        (message) =>
          message.components[0].components[0].url === reaction.message.url
      )

      if (!message) return

      const embed = EmbedBuilder.from(message.embeds[0])

      if (reaction.count < 3) {
        await message.delete()
      } else {
        embed.setFooter({ text: `${reaction.count} ⭐` })

        await message.edit({ embeds: [embed] })
      }
    }
  },
}
