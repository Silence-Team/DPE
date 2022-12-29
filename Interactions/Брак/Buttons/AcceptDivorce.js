const Members = require('../../../Schemas/Members')

module.exports = {
  run: async (interaction) => {
    const users = interaction.message.mentions.parsedUsers.toJSON()

    // if (interaction.user !== users[0]) {
    //   return await interaction.reply({
    //     content: '**Ты не можешь использовать это**',
    //     ephemeral: true,
    //   })
    // }

    await interaction.update({
      content: `🛑 ${interaction.member} и ${users[1]} больше не в браке`,
      components: [],
    })

    const InvokerData = await Members.findOne({ id: users[1].id })
    const MemberData = await Members.findOne({ id: interaction.member.id })

    let InvokerPassport = InvokerData?.passport || {}
    InvokerPassport.marriage = {}

    let MemberPassport = MemberData?.passport || {}
    MemberPassport.marriage = {}

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
