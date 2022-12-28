const { Collection } = require('discord.js')
const { readdirSync, lstatSync, existsSync } = require('fs')

module.exports = {
  run: async (client) => {
    const components = [
      'Autocompletes',
      'Buttons',
      'Modals',
      'Selects',
      'Contexts',
    ]

    components.forEach((ComponentName) => {
      client[ComponentName.toLowerCase()] = new Collection()
    })

    readdirSync('./Interactions')
      .filter((file) => lstatSync(`./Interactions/${file}`).isDirectory())
      .forEach((dir) => {
        components.forEach((ComponentName) => {
          if (!existsSync(`./Interactions/${dir}/${ComponentName}`)) return

          readdirSync(`./Interactions/${dir}/${ComponentName}`)
            .filter((file) => file.endsWith('.js'))
            .forEach((FileInDir) => {
              const pull = require(`../Interactions/${dir}/${ComponentName}/${FileInDir}`)
              if (!pull.run) return
              client[ComponentName.toLowerCase()].set(
                FileInDir.slice(0, -3),
                pull.run
              )
            })
        })
      })
  },
}
