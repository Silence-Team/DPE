const RoleplayData = require('../../../Util/RoleplayData')

module.exports = {
  run: async (interaction) => {
    await interaction.respond(RoleplayData)
  },
}
