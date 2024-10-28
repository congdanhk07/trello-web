import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import PostAddIcon from '@mui/icons-material/PostAdd'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
function ListColumns({ columns }) {
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
          <Column key={column._id} column={column} />
        ))}
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
    </SortableContext>
  )
}

export default ListColumns
