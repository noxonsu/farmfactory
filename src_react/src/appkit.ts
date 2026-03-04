import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, bsc, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { reconnect } from 'wagmi/actions'

const projectId = 'a23677c4af3139b4eccb52981f76ad94'
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, bsc, polygon]

export const wagmiAdapter = new WagmiAdapter({ networks, projectId })
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
  themeMode: 'light',
  features: { analytics: false },
})

reconnect(wagmiConfig)
export default modal
