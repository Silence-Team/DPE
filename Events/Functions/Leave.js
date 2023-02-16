const { EmbedBuilder } = require('discord.js')
const { channels, colors, emojis } = require('../../Util/Config')

module.exports = async (OldState, NewState) => {
  const channel = await OldState.guild.channels.cache.get(channels.logs.voices)
  const member = OldState.member

  const embed = new EmbedBuilder()
    .setColor(colors.red)
    .setDescription(`**${member} ${emojis.minus} ${OldState.channel}**`)

  await channel.send({ embeds: [embed] })
}
