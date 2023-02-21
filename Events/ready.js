const chalk = require('chalk')
const Members = require('../Schemas/Members')
const { roles } = require('../Util/Config')

module.exports = {
  run: async (client) => {
    const guild = client.guilds.cache.get('721426713372000306')
    guild.commands.set(client.CommandsData || [])

    console.log(chalk.greenBright("I'm Ready"))

    setInterval(async () => {
      const simps = await Members.find({ simpUntil: { $lte: new Date() } })

      simps.forEach(async (obj) => {
        const member = guild.members.cache.get(obj.id)
        if (!member) return

        await member.roles.remove(roles.simp)
      })
    }, 600000)
  },
}
