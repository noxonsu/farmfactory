// @ts-nocheck
// chains.ts — network definitions for FarmFactory
// wagmi v2 / viem: configureChains removed; chain info used via NETWORKS directly

const FARM_CHAIN = window.SO_FARM_FACTORY_NETWORK

const NETWORKS = {
  mainnet: {
    chainId: 1,
    name: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://ethereum-rpc.publicnode.com",
    explorer: "https://etherscan.io",
  },
  bsc: {
    chainId: 56,
    name: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpc: "https://bsc-rpc.publicnode.com",
    explorer: "https://bscscan.com",
  },
  bsc_test: {
    chainId: 97,
    name: "BNB Smart Chain Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpc: "https://bsc-testnet-rpc.publicnode.com",
    explorer: "https://testnet.bscscan.com",
  },
  matic: {
    chainId: 137,
    name: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpc: "https://polygon-bor-rpc.publicnode.com",
    explorer: "https://polygonscan.com/",
  },
  cronos: {
    chainId: 25,
    name: "Cronos",
    nativeCurrency: {
      name: "CRO",
      symbol: "CRO",
      decimals: 18
    },
    rpc: "https://evm.cronos.org",
    explorer: "https://cronoscan.com/",
  },
  ame: {
    chainId: 180,
    name: "AME Chain",
    nativeCurrency: {
      name: "AME",
      symbol: "AME",
      decimals: 18
    },
    rpc: "https://node1.amechain.io/",
    explorer: "https://amescan.io/",
  },
  avax: {
    chainId: 43114,
    name: "Avalanche",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18
    },
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://snowtrace.io",
  },
  fantom: {
    chainId: 250,
    name: "Fantom Opera",
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18
    },
    rpc: "https://rpc.ftm.tools/",
    explorer: "https://ftmscan.com",
  },
  moonriver: {
    chainId: 1285,
    name: "Moonriver",
    nativeCurrency: {
      name: "MOVR",
      symbol: "MOVR",
      decimals: 18
    },
    rpc: "https://rpc.moonriver.moonbeam.network",
    explorer: "https://moonriver.moonscan.io/",
  },
  harmony: {
    chainId: 1666600000,
    name: "Harmony",
    nativeCurrency: {
      name: "ONE",
      symbol: "ONE",
      decimals: 18
    },
    rpc: "https://api.harmony.one",
    explorer: "https://explorer.harmony.one/",
  },
  aurora: {
    chainId: 1313161554,
    name: "Aurora",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://mainnet.aurora.dev",
    explorer: "https://aurorascan.dev/",
  },
  btcix: {
    chainId: 19845,
    name: "BTCIX Network",
    nativeCurrency: {
      name: "BITCOLOJIX",
      symbol: "BTCIX",
      decimals: 18
    },
    rpc: "https://seed.btcix.org/rpc",
    explorer: "https://btcixscan.com",
  },
  arbeth_mainnet: {
    chainId: 42161,
    name: "Arbitrum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io/",
  },
  xdai: {
    chainId: 100,
    name: "Gnosis Mainnet (xDai)",
    nativeCurrency: {
      name: "XDAI",
      symbol: "XDAI",
      decimals: 18
    },
    rpc: "https://rpc.gnosischain.com",
    explorer: "https://blockscout.com/xdai/mainnet",
  },
  sepolia: {
    chainId: 11155111,
    name: "Ether Sepolia Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io/",
  },
}

export const GET_RPC = (chainName) => {
  const network = NETWORKS[chainName]
  if (!network) {
    throw new Error(`FarmFactory: unknown network "${chainName}". Valid values: ${Object.keys(NETWORKS).join(', ')}`)
  }
  return network.rpc
}

export const GET_TX_LINK = (hash) => {
  return NETWORKS[FARM_CHAIN].explorer + '/tx/' + hash
}
