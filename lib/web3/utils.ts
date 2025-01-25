import { createClient, createWalletClient, http } from "viem";
import { polygonAmoy } from "viem/chains";

export const client = createClient({
  transport: http(),
  chain: polygonAmoy
})

export const walletClient = createWalletClient({
  transport: http(),
  chain: polygonAmoy
})
