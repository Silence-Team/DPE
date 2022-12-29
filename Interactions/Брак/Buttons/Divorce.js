const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Members = require('../../../Schemas/Members')
const { channels } = require('../../../Util/Config')
const CheckMarriage = require('../Functions/CheckMarriage')

module.exports = {
  run: async (interaction) => {
    const InvokerData = await Members.findOne({ id: interaction.member.id })
    const InvokerMarriage = InvokerData?.passport?.marriage || null
    const MemberData = await Members.findOne({ id: InvokerMarriage?.id || '' })

    if (!InvokerMarriage) {
      return interaction.reply({
        content: `**Ты не состоишь в браке**`,
        ephemeral: true,
      })
    }

    if (
      CheckMarriage(MemberData, false) ||
      MemberData.passport.marriage.id !== interaction.member.id
    ) {
      return interaction.reply({
        content: `**Участник не в браке с тобой**`,
        ephemeral: true,
      })
    }

    const MarriagesChannel = interaction.guild.channels.cache.get(
      channels.marriages
    )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('AcceptDivorce')
        .setEmoji('✅')
        .setLabel('Согласиться')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('DenyDivorce')
        .setEmoji('❌')
        .setLabel('Отказать')
        .setStyle(ButtonStyle.Danger)
    )

    await MarriagesChannel.send({
      content: `🛑 <@${InvokerMarriage.id}>, с тобой хочет развестись ${interaction.member}`,
      components: [row],
    })

    await interaction.reply({
      content: '**Предложение отправлено**',
      ephemeral: true,
    })
  },
}
