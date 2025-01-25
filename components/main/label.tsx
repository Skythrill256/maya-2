"use client"

import * as React from "react"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, ...props }) => {
  return (
    <label htmlFor={htmlFor} {...props} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

export { Label } 