
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

export const BNB = {
  "name": "Binance Smart Chain Mainnet",
  "chain": "BSC",
  "rpc": [
    {
      "url": "https://endpoints.omniatech.io/v1/bsc/mainnet/public",
      "tracking": "none",
      "trackingDetails": "All the data and metadata remain private to the users. No third party is able to access, analyze or track it. OMNIA leverages different technologies and approaches to guarantee the privacy of their users, from front-running protection and private mempools, to obfuscation and random dispatching. https://blog.omniatech.io/how-omnia-handles-your-personal-data"
    },
    {
      "url": "https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d",
      "tracking": "none",
      "trackingDetails": "What We Do Not Collect: User's IP address, request origin, request data. https://www.blog.pokt.network/rpc-logging-practices/"
    },
    {
      "url": "https://bsc-dataseed.binance.org"
    },
    {
      "url": "https://bsc-dataseed1.defibit.io"
    },
    {
      "url": "https://bsc-dataseed1.ninicoin.io"
    },
    {
      "url": "https://bsc-dataseed2.defibit.io"
    },
    {
      "url": "https://bsc-dataseed3.defibit.io"
    },
    {
      "url": "https://bsc-dataseed4.defibit.io"
    },
    {
      "url": "https://bsc-dataseed2.ninicoin.io"
    },
    {
      "url": "https://bsc-dataseed3.ninicoin.io"
    },
    {
      "url": "https://bsc-dataseed4.ninicoin.io"
    },
    {
      "url": "https://bsc-dataseed1.binance.org"
    },
    {
      "url": "https://bsc-dataseed2.binance.org"
    },
    {
      "url": "https://bsc-dataseed3.binance.org"
    },
    {
      "url": "https://bsc-dataseed4.binance.org"
    },
    {
      "url": "https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
      "tracking": "yes",
      "trackingDetails": "We may automatically record certain information about how you use our Sites (we refer to this information as \"Log Data\"). Log Data may include information such as a user's Internet Protocol (IP) address, device and browser type, operating system, the pages or features of our Sites to which a user browsed and the time spent on those pages or features, the frequency with which the Sites are used by a user, search terms, the links on our Sites that a user clicked on or used, and other statistics. We use this information to administer the Service and we analyze (and may engage third parties to analyze) this information to improve and enhance the Service by expanding its features and functionality and tailoring it to our users' needs and preferences. https://nodereal.io/terms"
    },
    {
      "url": "https://rpc.ankr.com/bsc",
      "tracking": "limited",
      "trackingDetails": "For service delivery purposes, we temporarily record IP addresses to set usage limits and monitor for denial of service attacks against our infrastructure. Though we do look at high-level data around the success rate of transactions made over the blockchain RPC, we do not correlate wallet transactions made over the infrastructure to the IP address making the RPC request. Thus, we do not store, exploit, or share any information regarding Personal Identifiable Information (PII), including wallet addresses. https://www.ankr.com/blog/ankrs-ip-address-policy-and-your-privacy/"
    },
    {
      "url": "https://bscrpc.com"
    },
    {
      "url": "https://bsc.rpcgator.com"
    },
    {
      "url": "https://binance.nodereal.io",
      "tracking": "yes",
      "trackingDetails": "We may automatically record certain information about how you use our Sites (we refer to this information as \"Log Data\"). Log Data may include information such as a user's Internet Protocol (IP) address, device and browser type, operating system, the pages or features of our Sites to which a user browsed and the time spent on those pages or features, the frequency with which the Sites are used by a user, search terms, the links on our Sites that a user clicked on or used, and other statistics. We use this information to administer the Service and we analyze (and may engage third parties to analyze) this information to improve and enhance the Service by expanding its features and functionality and tailoring it to our users' needs and preferences. https://nodereal.io/terms"
    },
    {
      "url": "https://rpc-bsc.bnb48.club"
    },
    {
      "url": "https://bsc-mainnet.rpcfast.com"
    },
    {
      "url": "https://bsc-mainnet.rpcfast.com?api_key=S3X5aFCCW9MobqVatVZX93fMtWCzff0MfRj9pvjGKSiX5Nas7hz33HwwlrT5tXRM"
    },
    {
      "url": "https://nodes.vefinetwork.org/smartchain"
    },
    {
      "url": "https://1rpc.io/bnb",
      "tracking": "none",
      "trackingDetails": "With the exception of data that will be public on chain, all the other metadata / data should remain private to users and other parties should not be able to access or collect it. 1RPC uses many different techniques to prevent the unnecessary collection of user privacy, which prevents tracking from RPC providers. https://docs.ata.network/1rpc/design/#tracking-prevention"
    },
    {
      "url": "https://bsc.rpc.blxrbdn.com",
      "tracking": "yes",
      "trackingDetails": "We may collect information that is publicly available in a blockchain when providing our services, such as: Public wallet identifier of the sender and recipient of a transaction, Unique identifier for a transaction, Date and time of a transaction, Transaction value, along with associated costs, Status of a transaction (such as whether the transaction is complete, in-progress, or resulted in an error) https://bloxroute.com/wp-content/uploads/2021/12/bloXroute-Privacy-Policy-04-01-2019-Final.pdf"
    },
    {
      "url": "https://bsc.blockpi.network/v1/rpc/public",
      "tracking": "limited",
      "trackingDetails": "We do not collect request data or request origin. We only temporarily record the request method names and IP addresses for 7 days to ensure our service functionality such as load balancing and DDoS protection. All the data is automatically deleted after 7 days and we do not store any user information for longer periods of time. https://blockpi.io/privacy-policy"
    },
    {
      "url": "https://bnb.api.onfinality.io/public",
      "tracking": "limited",
      "trackingDetails": "When you access and use our website or related services we may automatically collect information about your device and usage of our website, products and services, including your operating system, browser type, time spent on certain pages of the website/pages visited/links clicked/language preferences. https://onfinality.io/privacy"
    },
    {
      "url": "wss://bsc-ws-node.nariox.org"
    }
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "nativeCurrency": {
    "name": "Binance Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://www.binance.org",
  "shortName": "bnb",
  "chainId": 56,
  "networkId": 56,
  "slip44": 714,
  "explorers": [
    {
      "name": "bscscan",
      "url": "https://bscscan.com",
      "standard": "EIP3091"
    }
  ],
  "tvl": 5669715333.729866,
  "chainSlug": "binance"
}