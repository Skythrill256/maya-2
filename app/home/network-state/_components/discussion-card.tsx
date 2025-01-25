"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/main/card"

interface DiscussionCardProps {
  discussion: {
    id: number
    author: string
    username: string
    timeAgo: string
    avatar: string
    content: string
    reactions: string[]
  }
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Image
            src={discussion.avatar || "/placeholder.svg"}
            alt={discussion.author}
            width={40}
            height={40}
            className="rounded-full bg-gray-200 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2 items-baseline">
              <h3 className="font-semibold text-black truncate">{discussion.author}</h3>
              <p className="text-sm text-gray-600 truncate">
                {discussion.username} · {discussion.timeAgo}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-2 break-words">{discussion.content}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {discussion.reactions.map((reaction, index) => (
                <span key={index} className="text-lg">{reaction}</span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

