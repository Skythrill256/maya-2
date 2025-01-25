import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/main/button"
import { Card, CardContent } from "@/components/main/card"

interface NetworkStateCardProps {
  state: {
    id: number
    name: string
    memberCount: string
    description: string
    logo: string
    createdAt: string
  }
}

export function NetworkStateCard({ state }: NetworkStateCardProps) {
  return (
    <Card className="bg-white border-gray-200 h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-3">
          <Image
            src={state.logo || "/placeholder.svg"}
            alt={state.name}
            width={40}
            height={40}
            className="rounded-full bg-gray-200 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-black truncate">{state.name}</h3>
            <p className="text-sm text-gray-600">{state.memberCount}</p>
          </div>
          <span className="text-sm text-gray-600 flex-shrink-0">{state.createdAt}</span>
        </div>
        <p className="text-sm text-gray-700 mb-4 flex-1">{state.description}</p>
        <Button
          className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 mt-auto"
          variant="outline"
          asChild
        >
          <Link href={`/home/network-state/${state.id}`}>Join State</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
