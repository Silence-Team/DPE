const Join = require('./Functions/Join')
const Leave = require('./Functions/Leave')
const Move = require('./Functions/Move')

module.exports = {
  run: async (OldState, NewState) => {
    if (!OldState.channelId && NewState.channelId) {
      await Join(OldState, NewState)
    } else if (OldState.channelId && NewState.channelId) {
      await Move(OldState, NewState)
    } else if (OldState.channelId && !NewState.channelId) {
      await Leave(OldState, NewState)
    }
  },
}
