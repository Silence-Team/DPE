const { InteractionType } = require('discord.js')

module.exports = {
  run: async (interaction) => {
    let category

    if (interaction.type == InteractionType.ApplicationCommand) {
      category = 'commands'
    } else if (interaction.isButton()) {
      category = 'buttons'
    } else if (
      interaction.type == InteractionType.ApplicationCommandAutocomplete
    ) {
      category = 'autocompletes'
    } else if (interaction.isMessageContextMenuCommand()) {
      category = 'contexts'
    } else if (interaction.type == InteractionType.ModalSubmit) {
      category = 'modals'
    } else if (
      interaction.isStringSelectMenu() ||
      interaction.isUserSelectMenu() ||
      interaction.isChannelSelectMenu()
    ) {
      category = 'selects'
    }

    const action = interaction.client[category]?.get(
      interaction.commandName || interaction.customId
    )

    if (!action) return

    await action(interaction)
  },
}
