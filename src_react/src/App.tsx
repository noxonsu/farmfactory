import { wagmiConfig } from './utils/wagmiConfig'
import { WagmiConfig } from 'wagmi'
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  midnightTheme,
} from '@rainbow-me/rainbowkit'

import { chains } from './utils/chains'
import '@rainbow-me/rainbowkit/styles.css';
import Widget from './Widget'

function App(props: any) {
  const { widgetOptions } = props
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={(widgetOptions.theme=='dark') ? darkTheme() : lightTheme()}>
          <Widget widgetOptions={widgetOptions} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
