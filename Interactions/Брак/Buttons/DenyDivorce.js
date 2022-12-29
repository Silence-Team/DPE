module.exports = {
  run: async (interaction) => {
    const { content } = interaction.message
    const users = interaction.message.mentions.parsedUsers.toJSON()

    if (interaction.user !== users[0]) {
      return await interaction.reply({
        content: '**Ты не можешь использовать это**',
        ephemeral: true,
      })
    }

    await interaction.update({
      content: `${content}\n\n❌ Отказ`,
      components: [],
    })
  },
}
