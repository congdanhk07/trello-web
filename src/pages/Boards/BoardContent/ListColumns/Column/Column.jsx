import AddCardIcon from '@mui/icons-material/AddCard'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteIcon from '@mui/icons-material/Delete'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import ListCard from './ListCard/ListCard'

function Column() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#333646' : '#ebecf0',
        ml: 2,
        borderRadius: 2,
        height: 'fit-content',
        maxHeight: (theme) =>
          `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
      }}
    >
      {/* HEADER COLUMN */}
      <Box
        sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'cemter',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Title Column
        </Typography>
        <Box>
          <Tooltip title='More options'>
            <ExpandMoreIcon
              id='basic-column-dropdown'
              aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{ color: 'text.primary', cursor: 'pointer' }}
            />
          </Tooltip>

          <Menu
            id='basic-menu-column-dropdown'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-column-dropdown'
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <AddCardIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize='small' />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize='small' />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize='small' />
              </ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize='small' />
              </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {/* BODY COLUMN*/}
      <ListCard />
      {/* FOOTER COLUMN */}
      <Box
        sx={{
          height: (theme) => theme.trello.columnFooterHeight,

          p: 2,
          display: 'flex',
          alignItems: 'cemter',
          justifyContent: 'space-between'
        }}
      >
        <Button startIcon={<AddCardIcon />}>Add new card</Button>
        <Tooltip sx={{ cursor: 'pointer' }} title='Drag to move'>
          <DragHandleIcon />
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Column
