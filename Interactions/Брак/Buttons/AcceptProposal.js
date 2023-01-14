const Members = require('../../../Schemas/Members')
const CheckMarriage = require('../Functions/CheckMarriage')

module.exports = {
  run: async (interaction) => {
    await interaction.deferUpdate()
    const users = interaction.message.mentions.parsedUsers.toJSON()

    if (interaction.user !== users[0]) {
      return await interaction.reply({
        content: '**Ты не можешь использовать это**',
        ephemeral: true,
      })
    }

    const InvokerData = await Members.findOne({ id: users[1].id })
    const MemberData = await Members.findOne({ id: interaction.member.id })

    if (CheckMarriage(InvokerData)) {
      return await interaction.update({
        content:
          interaction.message.content +
          `\n\n${users[1]} уже в браке с <@${InvokerData.marriage.id}>`,
        components: [],
      })
    }

    if (CheckMarriage(MemberData)) {
      return await interaction.update({
        content:
          interaction.message.content +
          `\n\n${interaction.member} уже в браке с <@${MemberData.marriage.id}>`,
        components: [],
      })
    }

    const gifs = await interaction.client.tenor.Search.Query(
      `anime marriaged`,
      '25'
    )

    const gif =
      gifs[Math.floor(Math.random() * gifs.length)].media_formats.gif.url

    await interaction.editReply({
      content: `💍 ${interaction.member} и ${users[1]} теперь в браке`,
      components: [],
      files: [gif],
    })

    const timestamp = Math.floor(Date.now() / 1000)

    await Members.findOneAndUpdate(
      { id: users[1].id },
      {
        $set: {
          'passport.marriage': {
            id: users[1].id,
            timestamp,
          },
        },
      },
      { upsert: true }
    )

    await Members.findOneAndUpdate(
      { id: interaction.member.id },
      {
        $set: {
          'passport.marriage': {
            id: interaction.member.id,
            timestamp,
          },
        },
      },
      { upsert: true }
    )
  },
}
