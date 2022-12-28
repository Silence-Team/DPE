const ValidateString = require('../../../Util/ValidateString')
const Members = require('../../../Schemas/Members')
module.exports = {
  run: async (interaction) => {
    let about = interaction.fields.getTextInputValue('About')

    if (about === 'None') about = ''

    const rule = (await interaction.guild.autoModerationRules.fetch()).find(
      (rule) => rule.name === 'Запрещённые слова'
    )

    if (ValidateString(about, rule)) {
      return await interaction.reply({
        content: '**В тексте содержаться запрещённые слова**',
        ephemeral: true,
      })
    }

    const MemberData = await Members.findOne({ id: interaction.member.id })

    let passport = MemberData?.passport || {}

    passport.about = about

    await Members.findOneAndUpdate(
      { id: interaction.member.id },
      { passport },
      { upsert: true }
    )

    await interaction.reply({
      content: '**Информация изменена**',
      ephemeral: true,
    })
  },
}
