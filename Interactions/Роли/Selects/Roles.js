module.exports = {
  run: async (interaction) => {
    const { options } = interaction.component.data
    const { values } = interaction

    options.forEach(async ({ value }) => {
      if (values.includes(value)) {
        await interaction.member.roles.add(value)
      } else {
        await interaction.member.roles.remove(value)
      }

      await interaction.deferUpdate().catch(() => {})
    })
  },
}
