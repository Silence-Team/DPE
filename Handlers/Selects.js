const { readdirSync, lstatSync, existsSync } = require('fs')

module.exports = {
  run: async (client) => {
    readdirSync('./Interactions')
      .filter((file) => lstatSync(`./Interactions/${file}`).isDirectory())
      .forEach((dir) => {
        if (!existsSync(`./Interactions/${dir}/Selects`)) return
        readdirSync(`./Interactions/${dir}/Selects`)
          .filter((file) => file.endsWith('js'))
          .forEach((FileInDir) => {
            const pull = require(`../Interactions/${dir}/Selects/${FileInDir}`)
            if (!pull.run) return
            client.selects.set(FileInDir.slice(0, -3), pull.run)
          })
      })
  },
}
