import { Box, useTheme } from '@mui/material'
import React from 'react'

export default function Frame({ children }) {
  return (
    <Box display="grid" gridTemplateColumns="400px 1fr">
      {children}
    </Box>
  )
}

export function Rail({ children }) {
  const { palette } = useTheme()
  return (
    <Box
      maxWidth={400}
      backgroundColor="background.default"
      borderRight="1px solid"
      borderColor={palette.secondary.light}
    >
      {children}
    </Box>
  )
}

export function Main({ children }) {
  return (
    <Box paddingLeft={1} paddingRight={1}>
      {children}
    </Box>
  )
}
