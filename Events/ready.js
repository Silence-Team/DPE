module.exports = {
  run: async (client) => {
    const guild = client.guilds.cache.get('721426713372000306')
    guild.commands.set(client.CommandsData || [])

    console.log("I'm Ready")
  },
}
