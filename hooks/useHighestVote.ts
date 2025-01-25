"use client";
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

type ProposalResponse = {
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

export const useProposals = () => {
  return useQuery<Proposal[], Error>({
    queryKey: ["proposals"],
    queryFn: async () => {
      try {
        const response = await client.request<ProposalResponse>(
          gql`
            query GetProposals($id: BigInt!) {
              proposals(id: $id) {
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
          `,
          { id: "1" }
        );

        if (!response || !Array.isArray(response.proposals)) {
          console.log("No proposals found or invalid response:", response);
          return [];
        }

        return response.proposals.map((proposal) => ({
          id: BigInt(proposal.id),
          proposerId: proposal.proposerId,
          uri: proposal.uri,
          startTime: BigInt(proposal.startTime),
          endTime: BigInt(proposal.endTime),
          forScore: BigInt(proposal.forScore),
          againstScore: BigInt(proposal.againstScore),
          executed: proposal.executed,
        }));
      } catch (error) {
        console.error("GraphQL query error:", error);
        throw error;
      }
    },
    staleTime: 30000,
    refetchInterval: 30000,
    initialData: [],
  });
};

export const useHighestVotes = () => {
  return useQuery<Proposal[], Error>({
    queryKey: ["highest-votes"],
    queryFn: async () => {
      try {
        const query = gql`
          query GetProposals($id: BigInt!) {
            proposals(id: $id) {
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
        `;

        const proposalIds = Array.from({ length: 10 }, (_, i) => i.toString());
        const results = await Promise.all(
          proposalIds.map(async (id) => {
            try {
              const response = await client.request<ProposalResponse>(query, { id });
              return response.proposals.map((proposal) => ({
                id: BigInt(proposal.id),
                proposerId: proposal.proposerId,
                uri: proposal.uri,
                startTime: BigInt(proposal.startTime),
                endTime: BigInt(proposal.endTime),
                forScore: BigInt(proposal.forScore),
                againstScore: BigInt(proposal.againstScore),
                executed: proposal.executed,
              }));
            } catch (error) {
              console.warn(`Error fetching proposal for ID ${id}:`, error);
              return null;
            }
          })
        );

        const proposals = results
          .filter((result): result is Proposal[] => result !== null) // Type guard for filtering non-null
          .flat();

        console.log("Processed proposals:", proposals);
        return proposals;
      } catch (error) {
        console.error("Error fetching proposals:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
