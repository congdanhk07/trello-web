import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
function PageLoadingSpinner({ caption = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant='h6'>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner
