const {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const Members = require('../../Schemas/Members')
const { channels } = require('../../Util/Config')
const CheckMarriage = require('./Functions/CheckMarriage')

module.exports = {
  data: {
    name: 'брак',
    type: ApplicationCommandType.ChatInput,
    description: 'Предложить участнику вступить брак',
    options: [
      {
        name: 'участник',
        type: ApplicationCommandOptionType.User,
        description: 'Кому ты хочешь предложить вступить в брак?',
        required: true,
      },
    ],
  },
  run: async (interaction) => {
    const member = interaction.options.getMember('участник')
    const MemberData = await Members.findOne({ id: member.id })
    const InvokerData = await Members.findOne({ id: interaction.member.id })

    if (CheckMarriage(InvokerData)) {
      return interaction.reply({
        content: `**Ты уже в браке с <@${InvokerData.passport.marriage.id}>**`,
        ephemeral: true,
      })
    }

    if (CheckMarriage(MemberData)) {
      return interaction.reply({
        content: `**${member} уже в браке с <@${MemberData.passport.marriage.id}>**`,
        ephemeral: true,
      })
    }

    if (member.user.bot) {
      return interaction.reply({
        content: '**Нельзя совершить действие с ботом**',
        ephemeral: true,
      })
    }

    if (member === interaction.member) {
      return interaction.reply({
        content: '**Нельзя совершить действие с собой**',
        ephemeral: true,
      })
    }

    await interaction.reply({
      content: '**Предложение отправлено**',
      ephemeral: true,
    })

    const MarriagesChannel = await interaction.guild.channels.fetch(
      channels.marriages
    )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('AcceptProposal')
        .setEmoji('✅')
        .setLabel('Согласиться')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('DenyProposal')
        .setEmoji('❌')
        .setLabel('Отказать')
        .setStyle(ButtonStyle.Danger)
    )
    const gifs = await interaction.client.tenor.Search.Query(
      `anime marriage proposal`,
      '50'
    )

    const gif =
      gifs[Math.floor(Math.random() * gifs.length)].media_formats.gif.url

    await MarriagesChannel.send({
      content: `💍 ${member}, с тобой хочет вступить в брак ${interaction.member}`,
      components: [row],
      files: [gif],
    })
  },
}
