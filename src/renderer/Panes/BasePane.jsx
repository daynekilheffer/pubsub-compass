import React from 'react'
import { Box } from '@mui/material'

export default function BasePane({ children }) {
  return (
    <Box p={2} pt={2}>
      {children}
    </Box>
  )
}
