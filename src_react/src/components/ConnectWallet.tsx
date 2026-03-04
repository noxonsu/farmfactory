import React from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'


export const ConnectWallet: React.FC = () => {
  const { open } = useAppKit()
  const { isConnecting, isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="ff-wallet-connected">
        <button
          className="ff-button ff-widget-unlock-button"
          onClick={() => open({ view: 'Account' })}
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        <button
          className="ff-button ff-widget-disconnect-button"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      className="ff-button ff-widget-unlock-button"
      disabled={isConnecting}
      onClick={() => open()}
    >
      Connect
    </button>
  )
}

export default ConnectWallet
