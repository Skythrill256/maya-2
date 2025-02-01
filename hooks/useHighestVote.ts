"use client";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://new-ponder-production.up.railway.app");



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
          { id: "1" } // Passing the required id parameter
        );

        console.log('GraphQL Response:', response);

        // Return empty array if no proposals
        if (!response || !Array.isArray(response.proposals)) {
          console.log('No proposals found or invalid response:', response);
          return [];
        }

        // Transform the response to match the Proposal type
        return response.proposals
          .filter(proposal => proposal && typeof proposal === 'object' && 'id' in proposal)
          .map((proposal) => ({
            id: BigInt(proposal.id || '0'),
            proposerId: proposal.proposerId || '',
            uri: proposal.uri || '',
            startTime: BigInt(proposal.startTime || '0'),
            endTime: BigInt(proposal.endTime || '0'),
            forScore: BigInt(proposal.forScore || '0'),
            againstScore: BigInt(proposal.againstScore || '0'),
            executed: Boolean(proposal.executed),
          }));
      } catch (error) {
        console.error('GraphQL query error:', error);
        throw error;
      }
    },
    staleTime: 30000,
    refetchInterval: 30000,
    initialData: [], // Provide empty array as initial data
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

        // Fetch each proposal individually and combine results
        const proposalIds = Array.from({ length: 15 }, (_, i) => i.toString());
        const results = await Promise.all(
          proposalIds.map(async (id) => {
            try {
              const response: ProposalResponse = await client.request(query, { id });
              return response.proposals;
            } catch {
              return null;
            }
          })
        );

        // Filter out null responses and flatten the array
        const proposals = results
          .filter((result): result is NonNullable<typeof result> => result !== null)
          .flat()
          .map((proposal: any) => ({
            ...proposal,
            id: BigInt(proposal.id),
            startTime: BigInt(proposal.startTime),
            endTime: BigInt(proposal.endTime),
            forScore: BigInt(proposal.forScore),
            againstScore: BigInt(proposal.againstScore),
          }));

        console.log('Processed proposals:', proposals);
        return proposals;
      } catch (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
