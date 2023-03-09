
export const Polygon = {
  "name": "Polygon Mainnet",
  "chain": "Polygon",
  "icon": "polygon",
  "rpc": [
    { "url": "https://polygon-rpc.com" },
    { "url": "https://rpc-mainnet.matic.network" },
    { "url": "https://rpc-mainnet.maticvigil.com" },
    { "url": "https://rpc-mainnet.matic.quiknode.pro" },
    { "url": "https://matic-mainnet.chainstacklabs.com" },
    { "url": "https://matic-mainnet-full-rpc.bwarelabs.com" },
    { "url": "https://matic-mainnet-archive-rpc.bwarelabs.com" },
    { "url": "https://poly-rpc.gateway.pokt.network" },
    {
      "url": "https://rpc.ankr.com/polygon",
      "tracking": "limited",
      "trackingDetails": "For service delivery purposes, we temporarily record IP addresses to set usage limits and monitor for denial of service attacks against our infrastructure. Though we do look at high-level data around the success rate of transactions made over the blockchain RPC, we do not correlate wallet transactions made over the infrastructure to the IP address making the RPC request. Thus, we do not store, exploit, or share any information regarding Personal Identifiable Information (PII), including wallet addresses. https://www.ankr.com/blog/ankrs-ip-address-policy-and-your-privacy/"
    },
    { "url": "https://rpc-mainnet.maticvigil.com" },
    {
      "url": "https://polygon-mainnet.public.blastapi.io",
      "tracking": "limited",
      "trackingDetails": "All the information in our logs (log data) can only be accessed for the last 7 days at any certain time, and it is completely purged after 14 days. We do not store any user information for longer periods of time or with any other purposes than investigating potential errors and service failures. https://blastapi.io/privacy-policy"
    },
    { "url": "https://polygonapi.terminet.io/rpc" },
    {
      "url": "https://1rpc.io/matic",
      "tracking": "none",
      "trackingDetails": "With the exception of data that will be public on chain, all the other metadata / data should remain private to users and other parties should not be able to access or collect it. 1RPC uses many different techniques to prevent the unnecessary collection of user privacy, which prevents tracking from RPC providers. https://docs.ata.network/1rpc/design/#tracking-prevention"
    },
    { "url": "https://polygon-mainnet.rpcfast.com" },
    { "url": "https://polygon-mainnet.rpcfast.com?api_key=eQhI7SkwYXeQJyOLWrKNvpRnW9fTNoqkX0CErPfEsZjBBtYmn2e2uLKZtQkHkZdT" },
    {
      "url": "https://polygon-bor.publicnode.com",
      "tracking": "yes",
      "trackingDetails": "We may also collect information on how the Service is accessed and used (\\'Usage Data\\'). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data. https://www.allnodes.com/privacy"
    },
    { "url": "https://polygon-mainnet-public.unifra.io" }
  ],
  "faucets": [],
  "nativeCurrency": { "name": "MATIC", "symbol": "MATIC", "decimals": 18 },
  "infoURL": "https://polygon.technology/",
  "shortName": "matic",
  "chainId": 137,
  "networkId": 137,
  "slip44": 966,
  "explorers": [{ "name": "polygonscan", "url": "https://polygonscan.com", "standard": "EIP3091" }],
  "tvl": 1242987972.0764065,
  "chainSlug": "polygon"
}

export const BNBTestnet = {
  "name": "Binance Smart Chain testnet",
  "chain": "Binance",
  "icon": "binance",
  "rpc": [
    {
      "url": "https://bsc-testnet.public.blastapi.io",
      "tracking": "limited",
      "trackingDetails": "privacyStatement.blastapi"
    },
    { "url": "https://rpc-mainnet.maticvigil.com" },
    { "url": "https://rpc-mainnet.matic.quiknode.pro" },
    { "url": "https://matic-mainnet.chainstacklabs.com" },
    { "url": "https://matic-mainnet-full-rpc.bwarelabs.com" },
    { "url": "https://matic-mainnet-archive-rpc.bwarelabs.com" }
  ],
  "faucets": [],
  "nativeCurrency": { "name": "Binance Coin", "symbol": "BNB", "decimals": 18 },
  "infoURL": "https://bscscan.com",
  "shortName": "matic",
  "chainId": 97,
  "networkId": 97,
  "slip44": 966,
  "explorers": [{ "name": "Binance", "url": "https://bscscan.com", "standard": "EIP3091" }],
  "tvl": 1242987972.0764065,
  "chainSlug": "binance"
}