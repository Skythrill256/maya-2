export interface createProposal {
  startTime: bigint,
  votingPeriod: bigint,
  uri: string,
  executionData: `0x${string}`
  target: `0x${string}`,
  hookData: `0x${string}`,
}
