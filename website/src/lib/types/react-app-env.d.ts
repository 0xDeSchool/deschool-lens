/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    ethereum: any
    screenWidth: number
    screenHeight: number
    gtag: any
  }

  interface JSURL {
    stringify: (value: any) => string
    tryParse: (value: string) => any
    parse: (value: string) => any
  }
}
