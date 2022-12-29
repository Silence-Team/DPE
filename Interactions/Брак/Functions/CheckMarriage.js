module.exports = (MemberData, value = true) => {
  let marriage = MemberData?.passport?.marriage || {}

  if (!Object.values(marriage).filter((value) => value).length) return !value
  else return value
}
