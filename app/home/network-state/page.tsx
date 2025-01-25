'use client'

import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { networkStates } from "./_data/mock_data"
import { NetworkStateCard } from "./_components/network-state-card"
import { Button } from "@/components/main/button"
import { Input } from "@/components/main/input"

export default function NetworkStatesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStates = useMemo(() => {
    return networkStates.filter(state =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Network States</h1>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search network states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {filteredStates.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No network states found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStates.map((state) => (
            <NetworkStateCard key={state.id} state={state} />
          ))}
        </div>
      )}
    </div>
  )
}
