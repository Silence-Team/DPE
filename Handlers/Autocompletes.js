const { readdirSync, lstatSync, existsSync } = require('fs')

module.exports = {
  run: async (client) => {
    readdirSync('./Interactions')
      .filter((file) => lstatSync(`./Interactions/${file}`).isDirectory())
      .forEach((dir) => {
        if (!existsSync(`./Interactions/${dir}/Autocompletes`)) return
        readdirSync(`./Interactions/${dir}/Autocompletes`)
          .filter((file) => file.endsWith('js'))
          .forEach((FileInDir) => {
            const pull = require(`../Interactions/${dir}/Autocompletes/${FileInDir}`)
            if (!pull.run) return
            client.autocompletes.set(FileInDir.slice(0, -3), pull.run)
          })
      })
  },
}
