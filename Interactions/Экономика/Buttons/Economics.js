const DefaultReply = require('../Functions/DefaultReply')

module.exports = {
  run: async (interaction) => {
    const reply = await DefaultReply(interaction)
    await interaction.update(reply)
  },
}
