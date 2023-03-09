export const byteLength = (input: any) => {
  if (input === null || input === undefined) return 0
  if (typeof input === 'string') input = Buffer.from(input)
  if (typeof input.byteLength === 'number') {
    return input.byteLength
  }
  if (typeof input.length === 'number') {
    return input.length
  }
  if (typeof input.size === 'number') {
    return input.size
  }
  if (typeof input.path === 'string') {
    // no fs in browser
  }
  return undefined
}
