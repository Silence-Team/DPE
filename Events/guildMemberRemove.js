const { EmbedBuilder } = require('discord.js')
const ParseUnix = require('../Util/ParseUnix')
const config = require('../Util/config')

module.exports = {
  run: async (member) => {
    if (member.joinedTimestamp - member.user.createdTimestamp <= 86_400_000)
      return

    const channel = member.guild.channels.cache.get(
      config.channels.logs.members
    )

    const embed = new EmbedBuilder()
      .setColor(config.colors.red)
      .setDescription(`**⬅️ ${member} вышел**`)
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .addFields(
        {
          name: 'Создан',
          value: `<t:${ParseUnix(member.user.createdTimestamp)}:R>`,
          inline: true,
        },
        {
          name: 'Зашёл',
          value: `<t:${ParseUnix(member.joinedTimestamp)}:R>`,
          inline: true,
        }
      )

    if (member.user.bot) {
      embed.setDescription(`**🔩 Удалён бот ${member}**`).setFields({
        name: 'Зашёл',
        value: `<t:${ParseUnix(member.joinedTimestamp)}:R>`,
        inline: true,
      })
    }

    await channel.send({ embeds: [embed] })
  },
}
