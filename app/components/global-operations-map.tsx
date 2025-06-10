"use client"

// This file is kept for compatibility but now just imports the new component
import GlobalOperations from "./global-operations"

interface GlobalOperationsMapProps {
  t: (key: string) => string
}

export default function GlobalOperationsMap({ t }: GlobalOperationsMapProps) {
  return <GlobalOperations t={t} />
}
