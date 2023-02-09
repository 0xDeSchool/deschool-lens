interface Provider {
  getSigner: Function
}

interface ProviderMessage {
  type: string
  data: unknown
}
