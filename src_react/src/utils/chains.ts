// @ts-nocheck
import { configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const FARM_CHAIN = window.SO_FARM_FACTORY_NETWORK

const NETWORKS = {
  goerli: {
    chainId: 5,
    name: "Goerli",
    nativeCurrency: {
      name: "Goerli Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://eth-goerli.g.alchemy.com/v2/wNvkA78LYEG7fb5S5z4nJIfB22dAcvuH",
    explorer: "https://goerli.etherscan.io",
  },
  mainnet: {
    chainId: 1,
    name: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://mainnet.infura.io/v3/7213b5d53a4943b7af08a9cfce1cf2e2",
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
    rpc: "https://bscrpc.com/",
    explorer: "https://bscscan.com",
  },
  bsc_test: {
    chainId: 97,
    name: "BSC testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpc: "https://data-seed-prebsc-1-s2.binance.org:8545",
    explorer: "https://testnet.bscscan.com",
  },
  matic: {
    chainId: 97,
    name: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpc: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com/",
  },
  mumbai: {
    chainId: 80001,
    name: "Polygon testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpc: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    explorer: "https://mumbai.polygonscan.com/",
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
    chainId: 180,
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
    rpc: "https://sepolia.infura.io/v3/7213b5d53a4943b7af08a9cfce1cf2e2",
    explorer: "https://sepolia.etherscan.io/",
  },
}

const GET_CHAIN = (chainName) => {
  return {
    id: NETWORKS[chainName].chainId,
    network: chainName,
    name: NETWORKS[chainName].name,
    nativeCurrency: NETWORKS[chainName].nativeCurrency,
    rpcUrls: {
      default: {
        http: [
          NETWORKS[chainName].rpc
        ]
      },
      public: {
        http: [
          NETWORKS[chainName].rpc
        ]
      }
    },
  }
}

export const GET_RPC = (chainName) => {
  return NETWORKS[chainName].rpc
}

export const GET_TX_LINK = (hash) => {
  return NETWORKS[FARM_CHAIN].explorer + '/tx/' + hash
}

const netInfo = GET_CHAIN(FARM_CHAIN)

const getChainRPC = (chainId) => {
  const chainData = Object.keys(NETWORKS).filter((chainName) => {
    return `${NETWORKS[chainName].chainId}` == `${chainId}`
  })
  if (chainData.length) return NETWORKS[chainData[0]].rpc
}

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ netInfo ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: getChainRPC(chain.id),
      }),
    }),
  ],
);
