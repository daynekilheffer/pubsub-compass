import { Box, Drawer, useTheme } from '@mui/material'
import React from 'react'

export default function Frame({ children }) {
  return (
    <Box display="grid" gridTemplateColumns="320px 1fr">
      {children}
    </Box>
  )
}

export function Rail({ children }) {
  const { palette } = useTheme()
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 320,
      }}
      PaperProps={{
        sx: {
          backgroundColor: palette.background.default,
          maxWidth: 320,
        },
      }}
    >
      {children}
    </Drawer>
  )
}

export function Main({ children }) {
  return (
    <Box paddingLeft={1} paddingRight={1}>
      {children}
    </Box>
  )
}
