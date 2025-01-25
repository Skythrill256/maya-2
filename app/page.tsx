"use client"
import React from 'react'
import { redirect } from 'next/navigation'
const page = () => {
  redirect("/home/consensus")
  return (
    <div>page</div>
  )
}

export default page
