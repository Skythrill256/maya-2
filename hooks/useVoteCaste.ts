import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
const client = new GraphQLClient("http://localhost:42069");

export type VoteCast = {
  proposalId: bigint;
  voterId: string;
  weight: bigint;
};

export const useVoteCast = () => {
  return useQuery<VoteCast[]>({
    queryKey: ["votesCast"],
    queryFn: async () => {
      const r = (await client.request(gql`
        {
          votes(
            orderDirection: "desc"
            orderBy: "proposalId"
            first: 10
          ) {
            proposalId
            voterId
            weight
          }
        }
      `)) as {
        votes: {
          proposalId: string;
          voterId: string;
          weight: string;
        }[];
      };

      return r.votes.map((v) => ({
        proposalId: BigInt(v.proposalId),
        voterId: v.voterId,
        weight: BigInt(v.weight),
      }));
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: 1_000, // Poll every second for updates
  });
};
