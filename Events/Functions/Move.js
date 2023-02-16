const { EmbedBuilder } = require('discord.js')
const { channels, colors } = require('../../Util/Config')

module.exports = async (OldState, NewState) => {
  if (OldState.channelId === NewState.channelId) return

  const channel = await OldState.guild.channels.cache.get(channels.logs.voices)
  const member = OldState.member

  const embed = new EmbedBuilder()
    .setColor(colors.blurple)
    .setDescription(`**${member} ${OldState.channel} ➡️ ${NewState.channel}**`)

  await channel.send({ embeds: [embed] })
}
