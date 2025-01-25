import { http, createConfig } from '@wagmi/core'
import { mainnet, polygonAmoy } from '@wagmi/core/chains'

export const transactionConfig = createConfig({

  chains: [mainnet, polygonAmoy],
  transports: {
    [mainnet.id]: http(),
    [polygonAmoy.id]: http(),
  },
})
