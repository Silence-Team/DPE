const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require('discord.js')
const { colors, channels, roles } = require('../../Util/Config')
const Settings = require('../../Schemas/Settings')
const Members = require('../../Schemas/Members')

module.exports = {
  data: {
    name: 'варн',
    type: ApplicationCommandType.ChatInput,
    description: 'Выдать предупреждение',
    options: [
      {
        name: 'участник',
        type: ApplicationCommandOptionType.User,
        description: 'Кому выдать?',
        required: true,
      },
      {
        name: 'причина',
        type: ApplicationCommandOptionType.String,
        description: 'За что?',
        required: true,
      },
      {
        name: 'скриншот',
        type: ApplicationCommandOptionType.Attachment,
        description: 'Скриншот нарушения',
      },
    ],
  },
  run: async (interaction) => {
    const member = interaction.options.getMember('участник'),
      reason = interaction.options.getString('причина'),
      attachment = interaction.options.getAttachment('скриншот')

    const TargetHighestRole = member.roles.highest
    const MembersHighestRole = interaction.member.roles.highest

    if (interaction.member === member) {
      return interaction.reply({
        content: '**Нельзя выдать предупреждение себе**',
        ephemeral: true,
      })
    }

    if (member.user.bot) {
      return interaction.reply({
        content: '**Нельзя выдать предупреждение боту (они все хорошие)**',
        ephemeral: true,
      })
    }

    if (TargetHighestRole.position > MembersHighestRole.position) {
      return interaction.reply({
        content: '**Ты не можешь выдать варн пользователю выше тебя**',
        ephemeral: true,
      })
    }

    const config = await Settings.findOne({ id: 0 })
    const MemberData = await Members.findOne({ id: member.id })

    const MemberWarnID = (MemberData?.warns?.length || 0) + 1

    const id = (config.warns || 0) + 1

    let description = `⚠️ ${member}: ${MemberWarnID}\n🆔: ${id}\n\n📃 ${reason}`

    let warn = {
      date: new Date(),
      id,
      moderatorID: interaction.member.id,
      reason,
    }

    const embed = new EmbedBuilder()
      .setColor(colors.blurple)
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setDescription(description)

    if (attachment) {
      embed.setImage(attachment.url)
    }

    const WarnsChannel = interaction.guild.channels.cache.get(channels.warns)
    const LogsChannel = interaction.guild.channels.cache.get(
      channels.logs.moderation
    )

    await Settings.findOneAndUpdate(
      { id: 0 },
      { $inc: { warns: 1 } },
      { upsert: true }
    )

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`RemoveWarn-${member.id}-${id}`)
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

    const message = await WarnsChannel.send({ embeds: [embed] })
    await interaction.reply({
      content: `**Предупреждение выдано ${member}**`,
      ephemeral: true,
    })
    await member.send({ embeds: [embed] }).catch(() => {})

    if (MemberWarnID === 5) {
      await member.roles.add(roles.simp)
      const date = new Date()
      date.setDate(date.getDate() + 7)
      await Members.findOneAndUpdate(
        { id: member.id },
        { simpUntil: date },
        { upsert: true }
      )
    }

    description = `⚠️ ${member}: ${MemberWarnID}\n🆔: ${id}\n🛡️ ${interaction.member}\n\n📃 ${reason}`
    embed.setDescription(description)

    await LogsChannel.send({ embeds: [embed], components: [row] })

    if (message.embeds[0].image?.url) {
      warn.attachment = message.embeds[0].image.url
    }

    await Members.findOneAndUpdate(
      { id: member.id },
      {
        $push: {
          warns: warn,
        },
      },
      { upsert: true }
    )
  },
}
