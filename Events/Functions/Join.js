const { EmbedBuilder } = require('discord.js')
const { channels, colors, emojis } = require('../../Util/Config')

module.exports = async (OldState, NewState) => {
  const channel = await NewState.guild.channels.cache.get(channels.logs.voices)
  const member = NewState.member

  const embed = new EmbedBuilder()
    .setColor(colors.green)
    .setDescription(`**${member} ${emojis.plus} ${NewState.channel}**`)

  await channel.send({ embeds: [embed] })
}
