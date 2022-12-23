const { readdirSync, lstatSync } = require('fs')
const { Collection } = require('discord.js')

module.exports = {
  run: async (client) => {
    let CommandsData = []
    client.CommandsData = new Collection()

    readdirSync('./Interactions').forEach((file) => {
      if (file.endsWith('.js')) {
        const pull = require(`../Interactions/${file}`)

        if (!(pull?.run && pull?.data)) return
        if (pull.hidden) return

        CommandsData.push(pull.data)
        client.commands.set(pull.data.name.toLowerCase(), pull.run)
      } else if (lstatSync(`./Interactions/${file}`).isDirectory()) {
        readdirSync(`./Interactions/${file}`)
          .filter((file) => file.endsWith('js'))
          .forEach((FileInDir) => {
            const pull = require(`../Interactions/${file}/${FileInDir}`)

            if (!(pull?.run && pull?.data)) return
            if (pull.hidden) return

            CommandsData.push(pull.data)
            client.commands.set(pull.data.name.toLowerCase(), pull.run)
          })
      }
    })

    if (!Object.keys(CommandsData).length) return
    client.CommandsData = CommandsData
  },
}
