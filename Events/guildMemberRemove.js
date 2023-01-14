const { EmbedBuilder } = require('discord.js')
const ParseUnix = require('../Util/ParseUnix')
const config = require('../Util/Config')
const Members = require('../Schemas/Members')
const { channels } = require('../Util/Config')

module.exports = {
  run: async (member) => {
    const channel = member.guild.channels.cache.get(
      config.channels.logs.members
    )

    const embed = new EmbedBuilder()
      .setColor(config.colors.red)
      .setDescription(`**⬅️ ${member}**`)
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

    const InvokerData = await Members.findOne({ id: member.id })
    const InvokerPassport = InvokerData?.passport || {}

    if (Object.keys(InvokerPassport)?.length) {
      await Members.findOneAndUpdate(
        { id: member.id },
        { $unset: { 'passport.marriage': '' } }
      )

      const MemberID = InvokerPassport.marriage.id

      const MemberData = await Members.findOne({
        id: MemberID,
      })

      const MemberPassport = MemberData?.passport || {}

      if (Object.keys(InvokerPassport)?.length) {
        await Members.findOneAndUpdate(
          { id: MemberID },
          { $unset: { 'passport.marriage': '' } }
        )
      }

      if (Object.keys(MemberPassport?.marriage || {})?.length) {
        const MarriagesChannel = member.guild.channels.cache.get(
          channels.marriages
        )

        await MarriagesChannel.send({
          content: `🛑 ${member} и <@${MemberData.id}> больше не в браке`,
        })
      }
    }

    await channel.send({ embeds: [embed] })
  },
}
