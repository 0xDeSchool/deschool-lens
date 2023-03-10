
export function ipfsUrl(uri?: string | null): string {
  if (!uri) {
    return ''
  }
  if (uri.startsWith('ipfs://')) {
    return `https://deschool.mypinata.cloud/ipfs/${uri.slice(7)}`
  }
  return uri
}