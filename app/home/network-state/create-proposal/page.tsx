
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/main/card"
import { Button } from "@/components/main/button"
import { Input } from "@/components/main/input"
import { Label } from "@/components/main/label"
import { useToast } from "@/components/ui/use-toast"
import { createProposalfunc } from "@/lib/web3/functions"
import { useAccount } from "wagmi"

export default function CreateProposalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected } = useAccount()

  const [formData, setFormData] = useState({
    uri: "",
    startTime: "",
    votingPeriod: "7",
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
        executionData: "0x4d53646d" as `0x${string}`,
        target: "0x40d5250D1ce81fdD1F0E0FB4F471E57AA0c1FaD3" as `0x${string}`,
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
