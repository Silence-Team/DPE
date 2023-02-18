const {
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  ButtonBuilder,
  PermissionsBitField,
} = require('discord.js')
const Members = require('../../../Schemas/Members')

module.exports = {
  run: async (interaction) => {
    const id = parseInt(interaction.fields.getTextInputValue('id'))

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const BackRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Назад')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('GetWarn')
        .setEmoji('⬅️')
    )

    if (!id) {
      embed.setDescription('**ID неверный**')

      return await interaction.update({
        embeds: [embed],
        components: [BackRow],
      })
    }

    const MembersData = await Members.findOne({ 'warns.id': id })

    if (!MembersData) {
      embed.setDescription('**Предупреждение не найдено**')
    }

    const warn = MembersData.warns.find((obj) => obj.id === id)

    const description = `⚠️ <@${MembersData.id}>: ${
      MembersData.warns.indexOf(warn) + 1
    }\n🆔: ${warn.id}${
      interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
        ? `\n🛡️ ${interaction.member}`
        : ''
    }\n\n📃 ${warn.reason}`

    embed.setDescription(description)

    if (warn.attachment) {
      embed.setImage(warn.attachment)
    }

    const FirstRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`RemoveWarn-${MembersData.id}-${warn.id}`)
        .setLabel('Снять')
        .setEmoji('✋')
    )

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      row.components[0].setDisabled(true)
    }

    await interaction.update({
      embeds: [embed],
      components: [FirstRow, BackRow],
    })
  },
}
