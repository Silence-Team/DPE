const { EmbedBuilder } = require('discord.js')

module.exports = {
  run: async (interaction) => {
    const embed = EmbedBuilder.from(interaction.message.embeds[0])

    const MemberID = embed.data.description.split(/ /g)[1].slice(2, -1)
    const member = interaction.guild.members.cache.get(MemberID)
    const user = interaction.client.users.cache.get(MemberID)

    const RoleID = interaction.customId.split('-')[1]
    const name = embed.data.title.split(/ /g)[2]

    if (!member) {
      embed.setDescription(`**🛑 Нет на сервере**\n\n${embed.data.description}`)
      return await interaction.update({ embeds: [embed], components: [row] })
    }

    embed.setDescription(`**✅ Принята**\n\n${embed.data.description}`)
    await interaction.update({ embeds: [embed], components: [] })

    await member.roles.add(RoleID)

    if (user) {
      await user
        .send({ content: `✅ Твоя заявка на ${name} **принята**` })
        .catch(() => {})
    }
  },
}
