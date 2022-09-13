import { Box } from '@mui/material'
import React from 'react'

export default function Frame({ children }) {
  return (
    <Box display="grid" gridTemplateColumns="400px 1fr">
      {children}
    </Box>
  )
}

export function Rail({ children }) {
  return <Box maxWidth={400}>{children}</Box>
}

export function Main({ children }) {
  return <Box>{children}</Box>
}
