const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const { colors, channels } = require('../Util/Config')

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

      if (reaction.count === 3) {
        const embed = new EmbedBuilder()
          .setColor(colors.blurple)
          .setDescription(`${reaction.message.content}`)
          .setFooter({ text: `${reaction.count} ⭐` })
          .setAuthor({
            name: member.displayName,
            iconURL: member.displayAvatarURL(),
          })

        const row = new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setEmoji('➡️')
            .setURL(reaction.message.url)
            .setLabel('Перейти'),
        ])

        await channel.send({ embeds: [embed], components: [row] })
      } else if (reaction.count > 3) {
        const message = channel.messages.cache.find(
          (message) =>
            message.components[0].components[0].url === reaction.message.url
        )

        if (!message) return

        const embed = EmbedBuilder.from(message.embeds[0])
        embed.setFooter({ text: `${reaction.count} ⭐` })

        await message.edit({ embeds: [embed] })
      }
    }
  },
}
