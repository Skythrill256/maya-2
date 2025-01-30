"use client"

import Link from "next/link"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Search, Loader2, Plus } from 'lucide-react'
import { Card, CardContent } from "@/components/main/card"
import { Input } from "@/components/main/input"
import { Avatar, AvatarFallback } from "@/components/main/avatar"
import { Button } from "@/components/main/button"
import { discussions, networkStates } from "../_data/mock_data"
import { useHighestVotes } from '@/hooks/useHighestVote'
import type { Proposal } from '@/hooks/useHighestVote'
import { casteVotefunc } from '@/lib/web3/functions'
import { useToast } from "@/components/ui/use-toast"
import { useAccount } from 'wagmi'
import { publicClient } from '@/lib/web3/client'

function ProposalCountdown({ endTime }: { endTime: bigint }) {
  const calculateTimeLeft = useCallback(() => {
    const targetDate = new Date(Number(endTime) * 1000)
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) return 'Voting Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`
  }, [endTime])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return <span>{timeLeft}</span>
}

interface Discussion {
  id: number
  author: string
  username: string
  timeAgo: string
  avatar: string
  content: string
  reactions: string[]
  replies?: number
  shares?: number
  likes?: number
}

function DiscussionItem({ discussion }: { discussion: Discussion }) {
  return (
    <div className="border-b border-gray-100 py-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>{discussion.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{discussion.author}</span>
            <span className="text-sm text-gray-500">@{discussion.username}</span>
            <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
          </div>
          <p className="mt-2 text-gray-700">{discussion.content}</p>
          <div className="mt-3 flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <span>💭</span>
              <span>{discussion.replies || 0}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <span>🔄</span>
              <span>{discussion.shares || 0}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <span>❤️</span>
              <span>{discussion.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NetworkStatePage() {
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: proposals = [], isLoading, error, refetch } = useHighestVotes()
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const state = networkStates.find((s) => s.id === parseInt(params.id as string))
  const [votingStatus, setVotingStatus] = useState<Record<string, 'for' | 'against' | null>>({})
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({})

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal: Proposal) =>
      proposal.uri.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [proposals, searchQuery])

  const filteredDiscussions = useMemo(() => {
    return discussions.filter(discussion =>
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleVote = async (proposalId: bigint, voteType: 'for' | 'against') => {
    const proposalKey = proposalId.toString()

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote",
        variant: "destructive"
      })
      return
    }

    if (votingStatus[proposalKey]) {
      toast({
        title: "Already Voted",
        description: `You already voted ${votingStatus[proposalKey]} for this proposal`,
        variant: "destructive"
      })
      return
    }

    if (isVoting[proposalKey]) return

    try {
      setIsVoting(prev => ({ ...prev, [proposalKey]: true }))

      const weight = voteType === 'for' ? 1n : -1n
      const hash = await casteVotefunc({
        proposalId: proposalId,
        weight: weight,
        hookData: "0x12"
      })

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1
      })

      if (receipt.status === 'success') {
        await refetch()
        setVotingStatus(prev => ({ ...prev, [proposalKey]: voteType }))
        toast({
          title: "Vote Submitted",
          description: `Your ${voteType} vote has been recorded`,
        })
      } else {
        throw new Error("Transaction failed")
      }
    } catch (err) {
      console.error("Voting error:", err)

      const errorMessage = err instanceof Error
        ? err.message
        : "Failed to submit vote"

      toast({
        title: "Voting Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsVoting(prev => ({ ...prev, [proposalKey]: false }))
    }
  }

  if (!state) return <div>Network State not found</div>

  return (
    <div className="min-h-screen flex flex-col">
      {/* Updated Header Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Image
                src={state.logo ?? "/placeholder.svg"}
                alt={state.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h1 className="text-lg font-semibold">{state.name}</h1>
                <p className="text-sm text-gray-400">{state.memberCount}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Create Proposal Button */}
              <Link href="/home/network-state/create-proposal">
                <Button
                  className="bg-white text-black hover:bg-gray-100 flex items-center gap-2"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4" />
                  Create Proposal
                </Button>
              </Link>

              {/* Search Input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10 w-full bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                  placeholder="Search proposals and discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Proposals Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold">Active Proposals</h2>

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Loading proposals...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error: {error.message}</p>
              </div>
            ) : filteredProposals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No proposals found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProposals.map((proposal: Proposal) => (
                  <Card key={proposal.id.toString()}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {proposal.proposerId.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                              Proposal #{proposal.id.toString()}
                            </span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Search className="h-4 w-4" />
                              <span className="sr-only">Details</span>
                            </Button>
                          </div>
                          <p className="text-sm font-medium leading-tight break-words">
                            {proposal.uri}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Status:</span>
                              <ProposalCountdown endTime={proposal.endTime} />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant={votingStatus[proposal.id.toString()] === 'for' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleVote(proposal.id, 'for')}
                                disabled={isVoting[proposal.id.toString()] || !!votingStatus[proposal.id.toString()]}
                                className="gap-1"
                              >
                                {isVoting[proposal.id.toString()] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  '+ For'
                                )}
                                <span>{proposal.forScore.toString()}</span>
                              </Button>
                              <Button
                                variant={votingStatus[proposal.id.toString()] === 'against' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => handleVote(proposal.id, 'against')}
                                disabled={isVoting[proposal.id.toString()] || !!votingStatus[proposal.id.toString()]}
                                className="gap-1"
                              >
                                {isVoting[proposal.id.toString()] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  '- Against'
                                )}
                                <span>{proposal.againstScore.toString()}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Discussions Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Recent Discussions</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-4 divide-y divide-gray-100">
                {filteredDiscussions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No discussions found</p>
                  </div>
                ) : (
                  filteredDiscussions.map((discussion) => (
                    <DiscussionItem key={discussion.id} discussion={discussion} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
