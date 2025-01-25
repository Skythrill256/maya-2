"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/main/card"
import { Button } from "@/components/main/button"
import { Input } from "@/components/main/input"
import { Label } from "@/components/main/label"
import { useToast } from "@/components/ui/use-toast"
import { createProposalfunc } from "@/lib/web3/functions"
import { useAccount } from 'wagmi'

export default function CreateProposalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected } = useAccount()

  const [formData, setFormData] = useState({
    uri: "",
    startTime: "",
    votingPeriod: "7",
    executionData: "0x",
    target: "0x0000000000000000000000000000000000000000"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a proposal",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)

      const startTimeDate = new Date(formData.startTime)
      const startTimeUnix = BigInt(Math.floor(startTimeDate.getTime() / 1000))
      const votingPeriodSeconds = BigInt(parseInt(formData.votingPeriod) * 24 * 60 * 60)

      const tx = await createProposalfunc({
        startTime: startTimeUnix,
        votingPeriod: votingPeriodSeconds,
        uri: formData.uri,
        executionData: formData.executionData as `0x${string}`,
        target: formData.target as `0x${string}`,
        hookData: "0x"
      })
      console.log(tx)
      toast({
        title: "Proposal created successfully",
        description: "Your proposal has been created and will start at the specified time.",
      })

      router.push("/home/network-state")
      router.refresh()

    } catch (err) {
      console.error("Error creating proposal:", err)
      let errorMessage = "An unexpected error occurred while creating the proposal"

      if (err instanceof Error) {
        if (err.message.includes("StartTimeInPast")) {
          errorMessage = "Start time must be in the future"
        } else if (err.message.includes("InvalidVotingPeriod")) {
          errorMessage = "Invalid voting period duration"
        } else {
          errorMessage = err.message
        }
      }

      toast({
        title: "Error creating proposal",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Create New Network State Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uri">Proposal URI</Label>
              <Input
                id="uri"
                placeholder="Enter proposal URI (e.g., ipfs://... or https://...)"
                value={formData.uri}
                onChange={(e) => setFormData(prev => ({ ...prev, uri: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="votingPeriod">Voting Period (days)</Label>
              <Input
                id="votingPeriod"
                type="number"
                min="1"
                max="30"
                value={formData.votingPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, votingPeriod: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Address (Optional)</Label>
              <Input
                id="target"
                placeholder="0x..."
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                pattern="^0x[a-fA-F0-9]{40}$"
                title="Enter a valid Ethereum address starting with 0x"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="executionData">Execution Data (Optional)</Label>
              <Input
                id="executionData"
                placeholder="0x..."
                value={formData.executionData}
                onChange={(e) => setFormData(prev => ({ ...prev, executionData: e.target.value }))}
                pattern="^0x[a-fA-F0-9]*$"
                title="Enter valid hex data starting with 0x"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isConnected}
              >
                {isSubmitting ? "Creating..." : "Create Proposal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
