import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import PostAddIcon from '@mui/icons-material/PostAdd'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'

function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) return toast.error('Please enter column title!')
    // Truyền props ra component cha (_id.jsx) xử lý để update toàn bộ board
    // sau này gắn Redux vào sẽ có thể call API tại đây luôn vì đã có store quản lí
    const newColumnData = {
      title: newColumnTitle
    }
    await createNewColumn(newColumnData)

    toggleNewColumnForm()
    setNewColumnTitle('')
  }
  const toggleNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }
  // SortableContext đang yêu cầu 1 mạng dạng ['id-1','id-2'] chứ không phải 1 mảng object -> Phải setup lấy danh sách ID các cột
  // Nếu ko đúng setup thì vẫn kéo đc nhưng không có animation
  const selectorArrayId = columns?.map((c) => c?._id)
  return (
    <SortableContext
      items={selectorArrayId}
      strategy={horizontalListSortingStrategy}
    >
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
        {columns?.map((column) => (
          <Column
            key={column._id}
            column={column}
            createNewCard={createNewCard}
          />
        ))}
        {/* Add new column CTA */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
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
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              p: 1,
              mx: 2,
              borderRadius: '6px',
              bgcolor: '#ffffff3d',
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
              autoFocus
              variant='outlined'
              label='Enter column title...'
              type='text'
              size='small'
            />
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}
            >
              <Button
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main
                }}
              >
                Add column
              </Button>
              <CloseIcon
                fontSize='small'
                onClick={toggleNewColumnForm}
                sx={{
                  cursor: 'pointer',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': { color: 'red' }
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
