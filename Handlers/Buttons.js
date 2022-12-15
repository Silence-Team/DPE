const { readdirSync, lstatSync, existsSync } = require('fs')

module.exports = {
  run: async (client) => {
    readdirSync('./Interactions')
      .filter((file) => lstatSync(`./Interactions/${file}`).isDirectory())
      .forEach((dir) => {
        if (!existsSync(`./Interactions/${dir}/Buttons`)) return
        readdirSync(`./Interactions/${dir}/Buttons`)
          .filter((file) => file.endsWith('js'))
          .forEach((FileInDir) => {
            const pull = require(`../Interactions/${dir}/Buttons/${FileInDir}`)
            if (!pull.run) return
            client.buttons.set(FileInDir.slice(0, -3), pull.run)
          })
      })
  },
}
