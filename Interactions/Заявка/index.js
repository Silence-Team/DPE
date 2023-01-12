const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js')
const { roles } = require('../../Util/Config')

module.exports = {
  data: {
    name: 'заявка',
    type: ApplicationCommandType.ChatInput,
    description: 'Заявка на должность на сервере',
    options: [
      {
        name: 'должность',
        type: ApplicationCommandOptionType.String,
        description: 'На какую должность Вы хотите подать заявку ?',
        choices: [
          {
            name: 'ивентор',
            value: 'ивентор',
          },
          {
            name: 'модератор',
            value: 'модератор',
          },
        ],
        required: true,
      },
    ],
  },
  run: async (interaction) => {
    const application = interaction.options.getString('должность')

    if (interaction.member.roles.cache.has(roles[application])) {
      return await interaction.reply({
        content: `**Ты уже на этой должности**`,
        ephemeral: true,
      })
    }

    const modal = new ModalBuilder()
      .setTitle(`Заявка на ${application}а`)
      .setCustomId(`form-${application}`)

    switch (application) {
      case 'ивентор':
        modal.addComponents([
          new ActionRowBuilder().addComponents([
            new TextInputBuilder()
              .setCustomId('возраст')
              .setLabel('Ваш возраст')
              .setPlaceholder('16')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
              .setMinLength(2)
              .setMaxLength(2),
          ]),
          new ActionRowBuilder().addComponents([
            new TextInputBuilder()
              .setCustomId('ивенты')
              .setLabel('Какие мероприятия ты хочешь проводить?')
              .setPlaceholder('Мафия, бункер...')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(5),
          ]),
          new ActionRowBuilder().addComponents([
            new TextInputBuilder()
              .setCustomId('переодичность')
              .setLabel('Как часто?')
              .setPlaceholder('Каждую среду')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(10),
          ]),
        ])
        break

      case 'модератор':
        modal.addComponents([
          new ActionRowBuilder().addComponents([
            new TextInputBuilder()
              .setCustomId('возраст')
              .setLabel('Ваш возраст')
              .setPlaceholder('16')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
              .setMinLength(2)
              .setMaxLength(2),
          ]),
          new ActionRowBuilder().addComponents([
            new TextInputBuilder()
              .setCustomId('время')
              .setLabel('Сколько времени ты готов уделять серверу?')
              .setPlaceholder('От 3 до 4 часов')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(5),
          ]),
          new ActionRowBuilder().addComponents([
            new TextInputBuilder()
              .setCustomId('о_себе')
              .setLabel('Расскажи немного о себе')
              .setPlaceholder('Давно работаю в этой сфере, многое знаю..')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(10),
          ]),
        ])
        break

      default:
        return interaction.reply({
          content: '**Что-то пошло не так**',
          ephemeral: true,
        })
    }

    await interaction.showModal(modal)
  },
}
