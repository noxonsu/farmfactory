import React from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { isBridgeMode } from '../appkit'

export const ConnectWallet: React.FC = () => {
  const { open } = useAppKit()
  const { isConnecting, isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()

  const handleConnect = () => {
    if (isBridgeMode) {
      connect({ connector: injected() })
    } else {
      open()
    }
  }

  if (isConnected && address) {
    return (
      <div className="ff-wallet-connected">
        <button
          className="ff-button ff-widget-unlock-button"
          onClick={() => isBridgeMode ? undefined : open({ view: 'Account' })}
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
      onClick={handleConnect}
    >
      Connect
    </button>
  )
}

export default ConnectWallet
