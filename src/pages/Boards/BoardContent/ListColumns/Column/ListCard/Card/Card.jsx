import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
function Card({ tempHiddenMedia }) {
  if (tempHiddenMedia) {
    return (
      <MuiCard
        sx={{
          overflow: 'unset',
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': {
              p: 1.5
            }
          }}
        >
          <Typography>Card Content</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard
      sx={{
        overflow: 'unset',
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image='https://picsum.photos/536/354'
        title='green iguana'
      />
      <CardContent
        sx={{
          p: 1.5,
          '&:last-child': {
            p: 1.5
          }
        }}
      >
        <Typography>Drag and Drop Stack</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size='small' startIcon={<GroupIcon />}>
          20
        </Button>
        <Button size='small' startIcon={<CommentIcon />}>
          15
        </Button>
        <Button size='small' startIcon={<AttachmentIcon />}>
          10
        </Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card
