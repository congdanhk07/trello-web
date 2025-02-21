import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  px: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box
      sx={{
        overflowX: 'auto',
        '&::-webkit-scrollbar-track': { m: 2 },
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        paddingX: 2,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            clickable
            label={board?.title}
          />
        </Tooltip>
        <Tooltip title={board?.type}>
          <Chip
            sx={MENU_STYLES}
            icon={<VpnLockIcon />}
            clickable
            label={capitalizeFirstLetter(board?.type)}
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          clickable
          label='Add To Google Drive'
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          clickable
          label='Automation'
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          clickable
          label='Filter'
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Button
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
          variant='outlined'
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>

        <AvatarGroup
          sx={{
            gap: 2,
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
          max={4}
        >
          <Tooltip title='user_board'>
            <Avatar alt='user_board' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='user_board'>
            <Avatar alt='user_board' src='/static/images/avatar/1.jpg' />
          </Tooltip>
          <Tooltip title='user_board'>
            <Avatar alt='user_board' src='/static/images/avatar/1.jpg' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
