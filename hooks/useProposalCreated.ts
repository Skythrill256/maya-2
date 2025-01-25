"use client"
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:42069");

export type Proposal = {
  id: bigint;
  proposerId: string;
  uri: string;
  startTime: bigint;
  endTime: bigint;
  forScore: bigint;
  againstScore: bigint;
  executed: boolean;
};

export const useProposalCreated = () => {
  return useQuery<Proposal[]>({
    queryKey: ["proposals"],
    queryFn: async () => {
      const r = (await client.request(gql`
        {
          proposals(
            orderDirection: "desc"
            orderBy: "startTime"
            first: 10
          ) {
            id
            proposerId
            uri
            startTime
            endTime
            forScore
            againstScore
            executed
          }
        }
      `)) as {
        proposals: {
          id: string;
          proposerId: string;
          uri: string;
          startTime: string;
          endTime: string;
          forScore: string;
          againstScore: string;
          executed: boolean;
        }[];
      };

      // Map and convert fields to their appropriate types
      return r.proposals.map((p) => ({
        id: BigInt(p.id),
        proposerId: p.proposerId,
        uri: p.uri,
        startTime: BigInt(p.startTime),
        endTime: BigInt(p.endTime),
        forScore: BigInt(p.forScore),
        againstScore: BigInt(p.againstScore),
        executed: p.executed,
      }));
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: 1_000, // Poll every second for real-time updates
  });
};
