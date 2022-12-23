const RoleplayData = require('../../../Util/RoleplayData')

module.exports = {
  run: async (interaction) => {
    const focused = interaction.options.getFocused()

    let filtered = RoleplayData.filter(
      (obj) => obj.name.startsWith(focused) || obj.name.includes(focused)
    )

    if (!filtered.length) {
      filtered = RoleplayData
    }

    const responses = []

    for (let i = 0; i < 25; i++) {
      if (!filtered[i]) continue
      responses.push(filtered[i])
    }

    await interaction.respond(responses)
  },
}
