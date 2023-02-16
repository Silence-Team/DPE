const { emojis } = require('../../../Util/Config')

module.exports = (emoji, member, MembersIDs, amount, comment) => {
  return `${member} ${emoji}\n\n${MembersIDs.join(', ')}\n${
    MembersIDs.length > 1
      ? `${amount} ${emojis.coins.default} 𐄂 ${MembersIDs.length} = ${
          amount * MembersIDs.length
        } ${emojis.coins.default}`
      : `${amount * MembersIDs.length} ${emojis.coins.default}`
  }${comment ? `\n\n${comment}` : ''}`
}
