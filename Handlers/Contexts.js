const { Collection } = require('discord.js')
const { readdirSync, lstatSync, existsSync } = require('fs')

module.exports = {
  run: async (client) => {
    const ContextsData = { Users: [], Messages: [] }

    readdirSync('./Interactions')
      .filter((file) => lstatSync(`./Interactions/${file}`).isDirectory())
      .forEach((dir) => {
        if (!existsSync(`./Interactions/${dir}/Contexts`)) return

        readdirSync(`./Interactions/${dir}/Contexts`)
          .filter((file) =>
            lstatSync(`./Interactions/${dir}/Contexts/${file}`).isDirectory()
          )
          .forEach((SubDir) => {
            client[`Contexts${SubDir}`.toLowerCase()] = new Collection()

            readdirSync(`./Interactions/${dir}/Contexts/${SubDir}`)
              .filter((file) => file.endsWith('.js'))
              .forEach((FileInDir) => {
                const pull = require(`../Interactions/${dir}/Contexts/${SubDir}/${FileInDir}`)

                if (!(pull?.run && pull?.data)) return
                if (pull.hidden) return

                if (ContextsData[SubDir].length > 5) {
                  return console.error(
                    `🛑 ${FileInDir} не загружен, констекстных меню больше 5`
                  )
                }

                client[`Contexts${SubDir}`.toLowerCase()].set(
                  FileInDir.slice(0, -3),
                  pull.run
                )

                ContextsData[SubDir].push(pull.data)
              })
          })

        client.CommandsData = client.CommandsData.concat(ContextsData.Users)
        client.CommandsData = client.CommandsData.concat(ContextsData.Messages)
      })
  },
}
