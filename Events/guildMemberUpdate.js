module.exports = {
  run: async (OldMember, NewMember) => {
    if (
      NewMember.roles.cache.has('721461675798298665') &&
      !NewMember.user.bot
    ) {
      await NewMember.edit({
        roles: NewMember.roles.cache.filter(
          (role) => role.id !== '721461675798298665'
        ),
      })
    }
  },
}
