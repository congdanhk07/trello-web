import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button } from '@mui/material'
import PostAddIcon from '@mui/icons-material/PostAdd'
function ListColumns() {
  return (
    <Box
      sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Column />
      <Column />
      <Column />

      {/* Add new column CTA */}
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: 2,
          bgcolor: '#ffffff3d',
          height: 'fit-content'
        }}
      >
        <Button
          sx={{
            color: 'white',
            width: '100%',
            py: 1
          }}
          startIcon={<PostAddIcon />}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns
