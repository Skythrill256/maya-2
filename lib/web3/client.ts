import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: polygonAmoy, // Replace with your chain configuration
  transport: http(process.env.NEXT_PUBLIC_RPC_URL), // Use environment variable for RPC URL
})
