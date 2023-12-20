import { Box } from '@mui/material'
import { ComponentPropsWithoutRef } from 'react'

export default function BasePane(props: Omit<ComponentPropsWithoutRef<typeof Box>, 'p' | 'pt'>) {
  return (
    <Box {...props} p={2} pt={2} />
  )
}
