import { writeContract } from "@wagmi/core";
import { DefaultNetworkState } from "../config/abi/DefaultNetworkState_ABI";
import { CONTRACT_ADDRESSES } from "../config/contract";
import { createProposal } from "./types/createProposal";
import { executeProposal } from "./types/executeProposal";
import { casteVote } from "./types/casteVote";
import { transactionConfig } from "../config/wagmi.config";
const { networkState } = CONTRACT_ADDRESSES

export const createProposalfunc = async (params: createProposal) => {
  const { startTime, votingPeriod, uri, executionData, target, hookData } = params
  try {
    const result = await writeContract(transactionConfig, {

      abi: DefaultNetworkState,
      address: networkState as `0x${string}`,
      functionName: "createProposal",
      args: [{
        startTime: BigInt(startTime),
        votingPeriod: BigInt(votingPeriod),
        uri,
        executionData,
        target,
        hookData
      }]
    })
    return result
  } catch (error) {
    console.error("Error in createProposalfunc:", error)
    throw error
  }
}

export const executeProposalfunc = async (params: executeProposal) => {
  const { proposalId } = params
  try {
    const result = await writeContract(transactionConfig, {
      abi: DefaultNetworkState,
      address: networkState as `0x${string}`,
      functionName: "executeProposal",
      args: [proposalId]
    })
    return result
  } catch (error) {
    console.error("Error in executeProposalfunc:", error)
    throw error
  }
}
export const casteVotefunc = async (params: casteVote) => {
  const { proposalId, weight, hookData } = params;
  try {

    const result = await writeContract(transactionConfig, {
      abi: DefaultNetworkState,
      address: networkState as `0x${string}`,
      functionName: "castVote",
      args: [
        {
          proposalId: proposalId, 
          weight: weight, 
          hookData: hookData,
        }
      ],
    });
    return result;
  } catch (error) {
    console.error("Error in casteVotefunc:", error);
    throw error;
  }
};
