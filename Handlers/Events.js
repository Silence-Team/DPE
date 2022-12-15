const { readdirSync } = require('fs')

module.exports = {
  run: async (client) => {
    readdirSync('./Events')
      .filter((file) => file.endsWith('.js'))
      .forEach((file) => {
        file = file.slice(0, -3)
        const pull = require(`../Events/${file}`)
        if (!pull.run) return
        pull.once
          ? client.once(file, (...args) => pull.run(...args))
          : client.on(file, (...args) => pull.run(...args))
      })
  },
}
