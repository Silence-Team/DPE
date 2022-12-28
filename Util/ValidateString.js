module.exports = (string, rule) => {
  const words = string?.split(/ /g)

  if (!words?.length) return false

  const keywords = rule.triggerMetadata.keywordFilter

  return keywords.some((key) => {
    const match = key.replaceAll('*', '.*')
    const regex = new RegExp(`^${match}$`)

    return words.some((word) => regex.test(word))
  })
}
