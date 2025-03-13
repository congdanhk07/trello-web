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
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { CloudUpload } from '@mui/icons-material'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch, useSelector } from 'react-redux'
import { createNewCardAPI, deleteColumnDetailsAPI } from '~/apis'
import cloneDeep from 'lodash/cloneDeep'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

function Column({ column }) {
  const confirmDeleteColumn = useConfirm()
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [anchorEl, setAnchorEl] = useState(null)
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column._id, data: { ...column } })
  const open = Boolean(anchorEl)
  const orderedCards = column?.cards

  const addNewCard = async () => {
    if (!newCardTitle)
      return toast.error('Please enter card title!', {
        position: 'bottom-right'
      })
    // handle API to add new card...
    const newCardData = {
      columnId: column._id,
      title: newCardTitle
    }
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    // Tìm ra column mà card tạo ra thuộc về
    const columnToUpdate = newBoard.columns.find(
      (x) => x._id === createdCard.columnId
    )
    if (columnToUpdate) {
      // nếu column rỗng: bàn chất là đang chứa một place-holder-card trong column
      // Nên khi create card mà column rỗng thì chúng ta xóa placeholder-card trước khi đầy card mới vào
      // Nếu column không rỗng thì chúng ta sẽ mặc định đẩy card mới vào
      if (columnToUpdate.cards.some((x) => x.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    // Sử dụng Reducer để cập nhật các data đồng bộ
    dispatch(updateCurrentActiveBoard(newBoard))
    setOpenNewCardForm(false)
    setNewCardTitle('')
  }
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column',
      description: 'Are you sure you want to delete this column ?'
    })
      .then(() => {
        // Cập nhật state board khi delete column
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter((x) => x._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (x) => x !== column._id
        )
        // Sử dụng Reducer để cập nhật các data đồng bộ
        dispatch(updateCurrentActiveBoard(newBoard))

        deleteColumnDetailsAPI(column._id).then((res) => {
          toast.success(res.deleteResult)
        })
      })
      .catch(() => {})
  }

  const toggleNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform), // Khúc này doc đang dùng CSS.Tranform nhưng sẽ lỗi stretch UI
    transition,
    // Chiều cao phải luôn max 100% nếu ko vùng kéo column sẽ ngắn
    // Kết hợp {...listeners} nằm ở Box để fix vùng kéo ko thuộc vùng column item  vẫn kéo đc
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
    // touchAction: 'none'
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
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
            {column?.title}
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
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    '& .add-icon': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className='add-icon' fontSize='small' />
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
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'error.main',
                    '& .delete-forever-icon': {
                      color: 'error.main'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteIcon
                    className='delete-forever-icon'
                    fontSize='small'
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <CloudUpload fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* BODY COLUMN*/}
        <ListCard cards={orderedCards} />
        {/* FOOTER COLUMN */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleNewCardForm}
                sx={{ cursor: 'pointer' }}
              >
                Add new card
              </Button>
              <Tooltip sx={{ cursor: 'pointer' }} title='Drag to move'>
                <DragHandleIcon />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white'
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main
                    }
                  }
                }}
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                autoFocus
                variant='outlined'
                label='Enter card title...'
                type='text'
                size='small'
                data-no-dnd={true}
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center'
                }}
              >
                <Button
                  onClick={addNewCard}
                  variant='contained'
                  color='success'
                  size='small'
                  data-no-dnd={true}
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  data-no-dnd={true}
                  onClick={toggleNewCardForm}
                  sx={{
                    cursor: 'pointer',
                    color: (theme) => theme.palette.warning.light
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
