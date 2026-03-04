import './appkit'
import { wagmiConfig } from './appkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Widget from './Widget'

const queryClient = new QueryClient()

function App(props: any) {
  const { widgetOptions } = props
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Widget widgetOptions={widgetOptions} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
