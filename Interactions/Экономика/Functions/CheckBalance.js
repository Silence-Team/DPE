const Members = require('../../../Schemas/Members')

module.exports = async ({ amount, MemberID, MemberData }) => {
  if (!MemberData) {
    MemberData = await Members.findOne({ id: MemberID })
  }

  if ((MemberData?.balance || 0) < amount) return false
  else return true
}
