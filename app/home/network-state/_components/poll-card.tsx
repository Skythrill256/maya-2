import Image from "next/image"
import { X } from 'lucide-react'
import { Card, CardContent } from "@/components/main/card"

// Define the Poll interface
interface Poll {
  id: number;
  networkState: string;
  logo: string;
  question: string;
  votingEnds: string;
  votes: number;
}

interface PollCardProps {
  poll: Poll; // Use the Poll type here
}

export function PollCard({ poll }: PollCardProps) {
  return (
    <Card className="bg-white border-gray-200 h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src={poll.logo || "/placeholder.svg"}
              alt={poll.networkState}
              width={24}
              height={24}
              className="rounded-full bg-gray-200 flex-shrink-0"
            />
            <span className="font-semibold text-black truncate">{poll.networkState}</span>
          </div>
          <button className="text-gray-600 hover:text-black flex-shrink-0">
            <X size={16} />
          </button>
        </div>
        <h3 className="text-sm text-gray-700 mb-3 flex-1">{poll.question}</h3>
        <div className="flex justify-between text-xs text-gray-600">
          <span className="truncate mr-2">Voting ends in {poll.votingEnds}</span>
          <span className="flex-shrink-0">{poll.votes} Votes ▲</span>
        </div>
      </CardContent>
    </Card>
  )
}

