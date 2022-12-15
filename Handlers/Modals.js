const { readdirSync, lstatSync, existsSync } = require('fs')

module.exports = {
  run: async (client) => {
    readdirSync('./Interactions')
      .filter((file) => lstatSync(`./Interactions/${file}`).isDirectory())
      .forEach((dir) => {
        if (!existsSync(`./Interactions/${dir}/Modals`)) return
        readdirSync(`./Interactions/${dir}/Modals`)
          .filter((file) => file.endsWith('js'))
          .forEach((FileInDir) => {
            const pull = require(`../Interactions/${dir}/Modals/${FileInDir}`)
            if (!pull.run) return
            client.modals.set(FileInDir.slice(0, -3), pull.run)
          })
      })
  },
}
