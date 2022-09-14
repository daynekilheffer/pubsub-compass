import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'

export default function BasePane({ children }) {
  return (
    <Box p={2} pt={2}>
      {children}
    </Box>
  )
}
BasePane.propTypes = {
  children: PropTypes.element,
}
