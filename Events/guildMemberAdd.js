const { EmbedBuilder } = require('discord.js')
const ParseUnix = require('../Util/ParseUnix')
const { channels, colors, roles } = require('../Util/Config')

module.exports = {
  run: async (member) => {
    // if (member.joinedTimestamp - member.user.createdTimestamp <= 86_400_000) {
    //   await member.kick('Автокик: молодой аккаунт')
    //   await member.user
    //     .send(
    //       `**Вы были кикнуты из-за подозрения в мультиаккаунте**
    //          Если Вы считаете, что произошла ошибка, напишите <@352389928543584256>`
    //     )
    //     .catch(() => {})
    //   return
    // }

    const channel = member.guild.channels.cache.get(channels.logs.members)

    const embed = new EmbedBuilder()
      .setColor(colors.green)
      .setDescription(`**➡️ ${member}**`)
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

    const chat = member.guild.channels.cache.get(channels.chat)

    if (member.user.bot) {
      embed.setDescription(`**🔩 ${member}**`).setFields({
        name: 'Зашёл',
        value: `<t:${ParseUnix(member.joinedTimestamp)}:R>`,
        inline: true,
      })

      await member.roles.add('721461675798298665')
    }

    await channel.send({ embeds: [embed] })

    if (!member.user.bot) {
      await chat.send({ content: `**👋 ${member}**` })
      await member.roles.add(roles.start)
    }
  },
}
