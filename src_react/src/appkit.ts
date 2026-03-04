import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, bsc, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { reconnect } from 'wagmi/actions'
import { http, fallback } from 'wagmi'

const projectId = 'a23677c4af3139b4eccb52981f76ad94'
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, bsc, polygon]

// Read theme from URL param (MCW sends ?theme=light or ?theme=dark)
const searchParams = new URLSearchParams(window.location.search)
const urlTheme = searchParams.get('theme')
const themeMode: 'light' | 'dark' = urlTheme === 'dark' ? 'dark' : 'light'

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  transports: {
    [bsc.id]: fallback([
      http('https://bsc-rpc.publicnode.com'),
      http('https://1rpc.io/bnb'),
      http('https://bsc.drpc.org'),
      http('https://bsc-dataseed1.binance.org/'),
    ]),
  },
})
export const wagmiConfig = wagmiAdapter.wagmiConfig

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'FarmFactory',
    description: 'Yield Farming and Liquidity Pools',
    url: 'https://farm.wpmix.net',
    icons: ['https://farm.wpmix.net/favicon.ico'],
  },
  themeMode,
  features: { analytics: false },
})

reconnect(wagmiConfig)
export default modal
