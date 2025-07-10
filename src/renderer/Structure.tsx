import { Box, Drawer, alpha, useTheme } from '@mui/material'

export default function Frame({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme()
  return (
    <Box
      display="grid"
      gridTemplateColumns="320px calc(100% - 320px)"
      bgcolor={alpha(palette.background.default, 0.2)}
      height="100vh"
    >
      {children}
    </Box>
  )
}

export function Rail({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme()
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: alpha(palette.background.default, 0.4),
            width: 320,
          },
        },
      }}
    >
      {children}
    </Drawer>
  )
}

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <Box paddingLeft={1} paddingRight={1}>
      {children}
    </Box>
  )
}
