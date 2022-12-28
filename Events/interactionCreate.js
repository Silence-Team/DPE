const { InteractionType } = require('discord.js')

module.exports = {
  run: async (interaction) => {
    let category

    if (interaction.isChatInputCommand()) {
      category = 'commands'
    } else if (interaction.isButton()) {
      category = 'buttons'
    } else if (interaction.isAutocomplete()) {
      category = 'autocompletes'
    } else if (interaction.isMessageContextMenuCommand()) {
      category = 'contextsmessages'
    } else if (interaction.isUserContextMenuCommand()) {
      category = 'contextsusers'
    } else if (interaction.isModalSubmit()) {
      category = 'modals'
    } else if (
      interaction.isStringSelectMenu() ||
      interaction.isUserSelectMenu() ||
      interaction.isChannelSelectMenu()
    ) {
      category = 'selects'
    }

    const action = interaction.client[category]?.get(
      interaction.commandName?.split('-')[0] ||
        interaction.customId?.split('-')[0]
    )

    if (!action) return

    await action(interaction)
  },
}
