"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/main/card"
import { Button } from "@/components/main/button"
import { Input } from "@/components/main/input"
import { Textarea } from "@/components/main/textarea"
import { Label } from "@/components/main/label"

interface CreateProposalFormProps {
  onSubmit: (proposal: {
    question: string
    description: string
    startTime: string
    endTime: string
  }) => void
}

export function CreateProposalForm({ onSubmit }: CreateProposalFormProps) {
  const [question, setQuestion] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ question, description, startTime, endTime })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Enter your proposal question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your proposal in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px] w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="startTime"
                  type="date"
                  value={startTime.split('T')[0]}
                  onChange={(e) => setStartTime(`${e.target.value}T${startTime.split('T')[1] || '00:00'}`)}
                  required
                  className="w-full"
                />
                <Input
                  type="time"
                  value={startTime.split('T')[1] || ''}
                  onChange={(e) => setStartTime(`${startTime.split('T')[0] || new Date().toISOString().split('T')[0]}T${e.target.value}`)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="endTime"
                  type="date"
                  value={endTime.split('T')[0]}
                  onChange={(e) => setEndTime(`${e.target.value}T${endTime.split('T')[1] || '00:00'}`)}
                  required
                  className="w-full"
                />
                <Input
                  type="time"
                  value={endTime.split('T')[1] || ''}
                  onChange={(e) => setEndTime(`${endTime.split('T')[0] || new Date().toISOString().split('T')[0]}T${e.target.value}`)}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Proposal
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 