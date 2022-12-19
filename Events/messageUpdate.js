const {
  EmbedBuilder,
  codeBlock,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const config = require('../Util/Config')

module.exports = {
  run: (OldMessage, NewMessage) => {
    if (
      OldMessage.author?.bot ||
      OldMessage.content === NewMessage.content ||
      !NewMessage.member
    )
      return

    const embed = new EmbedBuilder()
      .setTitle('✏️ Изменено')
      .setColor(config.colors.yellow)
      .setAuthor({
        name: NewMessage.member.displayName,
        iconURL: NewMessage.member.displayAvatarURL(),
      })
      .setDescription(
        `**Было:**\n${codeBlock(OldMessage.content)}\n**Стало:**\n${codeBlock(
          NewMessage.content
        )}`
      )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(NewMessage.url)
        .setEmoji('➡️')
        .setLabel('Перейти')
    )

    const channel = NewMessage.guild.channels.cache.get(
      config.channels.logs.messages
    )

    channel.send({ embeds: [embed], components: [row] })
  },
}
