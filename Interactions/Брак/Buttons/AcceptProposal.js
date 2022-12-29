const Members = require('../../../Schemas/Members')

module.exports = {
  run: async (interaction) => {
    const users = interaction.message.mentions.parsedUsers.toJSON()

    if (interaction.user !== users[0]) {
      return await interaction.reply({
        content: '**Ты не можешь использовать это**',
        ephemeral: true,
      })
    }

    const gifs = await interaction.client.tenor.Search.Query(
      `anime marriaged`,
      '25'
    )

    const gif =
      gifs[Math.floor(Math.random() * gifs.length)].media_formats.gif.url

    await interaction.update({
      content: `💍 ${interaction.member} и ${users[1]} теперь в браке`,
      components: [],
      files: [gif],
    })

    const InvokerData = await Members.findOne({ id: users[1].id })
    const MemberData = await Members.findOne({ id: interaction.member.id })

    let InvokerPassport = InvokerData?.passport || {}
    InvokerPassport.marriage = {
      id: interaction.member.id,
      timestamp: Math.floor(Date.now() / 1000),
    }

    let MemberPassport = MemberData?.passport || {}
    MemberPassport.marriage = {
      id: users[1].id,
      timestamp: Math.floor(Date.now() / 1000),
    }

    await Members.findOneAndUpdate(
      { id: users[1].id },
      { passport: InvokerPassport },
      { upsert: true }
    )

    await Members.findOneAndUpdate(
      { id: interaction.member.id },
      { passport: MemberPassport },
      { upsert: true }
    )
  },
}
