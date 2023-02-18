const {
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../Schemas/Members')
const { colors } = require('../../Util/Config')

module.exports = {
  data: {
    name: 'модерация',
    type: ApplicationCommandType.ChatInput,
    description: 'Панель управления модерацией',
  },
  run: async (interaction) => {
    const warns = await Members.find({
      warns: { $gt: [] },
    })

    const description = `**⚠️ Предупреждений:** ${
      warns.length || 0
    }\n**🔇 В муте:** ${
      interaction.guild.members.cache.filter((member) =>
        member.isCommunicationDisabled()
      ).length || 0
    }`

    const embed = new EmbedBuilder()
      .setColor(colors.blurple)
      .setTitle('🛡️ Модерация')
      .setDescription(description)

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('GetWarn')
        .setEmoji('📜')
        .setLabel('Получить предупреждения')
        .setStyle(ButtonStyle.Primary)
    )

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    })
  },
}
