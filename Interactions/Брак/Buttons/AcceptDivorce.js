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

    await interaction.update({
      content: `🛑 ${interaction.member} и ${users[1]} больше не в браке`,
      components: [],
    })

    const InvokerData = await Members.findOne({ id: users[1].id })
    const MemberData = await Members.findOne({ id: interaction.member.id })

    const InvokerPassport = InvokerData?.passport || {}
    const MemberPassport = MemberData?.passport || {}

    if (Object.keys(InvokerPassport)?.length) {
      await Members.findOneAndUpdate(
        { id: users[1].id },
        { $unset: { 'passport.marriage': '' } }
      )
    }

    if (Object.keys(MemberPassport)?.length) {
      await Members.findOneAndUpdate(
        { id: interaction.member.id },
        { $unset: { 'passport.marriage': '' } }
      )
    }
  },
}
