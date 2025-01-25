'use client'

import React from 'react'
import { Card, CardContent } from "@/components/main/card"

export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Policies</h1>
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Community Guidelines</h2>
            <p className="text-gray-600">
              Our policies are designed to create a fair and transparent environment for all participants.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Governance Rules</h2>
            <p className="text-gray-600">
              Learn about our governance structure and decision-making processes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
