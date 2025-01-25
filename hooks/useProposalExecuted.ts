import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:42069");
export type ProposalExecuted = {
  id: bigint;
  executed: boolean;
};

export const useProposalExecuted = () => {
  return useQuery<ProposalExecuted[]>({
    queryKey: ["proposalsExecuted"],
    queryFn: async () => {
      const r = (await client.request(gql`
        {
          proposals(
            where: { executed: true }
            orderDirection: "desc"
            orderBy: "startTime"
            first: 10
          ) {
            id
            executed
          }
        }
      `)) as {
        proposals: {
          id: string;
          executed: boolean;
        }[];
      };

      // Map and convert fields to their appropriate types
      return r.proposals.map((p) => ({
        id: BigInt(p.id),
        executed: p.executed,
      }));
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: 1_000, // Poll every second for updates
  });
};
