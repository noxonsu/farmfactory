import React from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'


export const ConnectWallet: React.FC = () => {
  const { open } = useAppKit()
  const { isConnecting, isConnected, address } = useAccount()

  if (isConnected && address) {
    return (
      <button
        className="ff-button ff-widget-unlock-button"
        onClick={() => open({ view: 'Account' })}
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
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
