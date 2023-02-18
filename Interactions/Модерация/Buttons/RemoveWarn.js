const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
} = require('discord.js')
const Members = require('../../../Schemas/Members')
const { channels, roles } = require('../../../Util/Config')

module.exports = {
  run: async (interaction) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: '**Ты не можешь использовать это**',
        ephemeral: true,
      })
    }

    const MemberID = interaction.customId.split('-')[1]
    const WarnID = parseInt(interaction.customId.split('-')[2])

    const member = interaction.guild.members.cache.get(MemberID)

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    let { description } = embed.data

    description += `\n\n✋ ${interaction.member}`

    const row = ActionRowBuilder.from(interaction.message.components[0])

    row.components[0].setDisabled(true)

    embed.setDescription(description).setTitle(null)

    if (member) {
      embed.setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
    }

    const MembersData = await Members.findOne({ id: MemberID })
    if (MembersData?.warns?.length) {
      const warn = MembersData.warns.find((obj) => obj.id == WarnID)

      await Members.findOneAndUpdate(
        { id: MemberID },
        { $pull: { warns: warn } }
      )

      if (MembersData.warns.length === 5 && MembersData.simpUntil) {
        await member.roles.remove(roles.simp)
        await Members.findOneAndUpdate(
          { id: MemberID },
          { $unset: { simpUntil: '' } }
        )
      }
    }

    if (
      interaction.channel.id !== channels.logs.moderation ||
      interaction.ephemeral
    ) {
      const LogsChannel = interaction.guild.channels.cache.get(
        channels.logs.moderation
      )

      await LogsChannel.send({ embeds: [embed] })
    }

    embed.setDescription(description.replace(/(🛡️ .*\n)/g, ''))

    const WarnsChannel = interaction.guild.channels.cache.get(channels.warns)
    await WarnsChannel.send({ embeds: [embed] })

    await interaction.reply({
      content: `**Предупреждение снято**`,
      ephemeral: true,
    })
  },
}
