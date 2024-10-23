import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import ListColumns from './ListColumns/ListColumns'
function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([])
  // Handle action click bị gọi handleDragEnd
  // -> distance là số px cần di chuyển để gọi event khi drag
  // -> tolerance: tay (bút) phải di chuyển đc tolerance pixel trong thời gian delay để kích hoạt sự kiện

  // Pointer có thể fix đc tình trạng onclick gọi event nhưng chưa tối ưu cho mobile, và phải kết hợp touch-action: none
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10
  //   }
  // })

  //Ưu tiên dùng Mouse và Touch để có dùng tốt đc trên mobile
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  // const mySensors = useSensors(pointerSensor)
  const mySensors = useSensors(mouseSensor, touchSensor)

  const selectorArrayId = orderedColumns?.map((c) => c?._id)

  const handleDragEnd = (event) => {
    const { active, over } = event
    // Check nếu kéo sai vị trí thì sẽ ko hoạt động
    if (!over) return
    // Xác định ví trí kéo thả khác ban đầu
    if (active.id !== over.id) {
      // Xác định vị trí cũ và mới trong danh sách
      const oldIndex = selectorArrayId.indexOf(active.id)
      const newIndex = selectorArrayId.indexOf(over.id)

      //dnd-kit/packages/sortable/src/ultilities/arrayMove
      const dndOderredColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // handle update dndOderredColumnsIds trong db
      // const dndOderredColumnsIds = dndOderredColumns.map((c) => c._id)
      // console.log('dndOderredColumns', dndOderredColumns)
      // console.log('dndOderredColumnsIds', dndOderredColumnsIds)

      //Cập nhật danh sách render các cột
      setOrderedColumns(dndOderredColumns)
    }
  }
  useEffect(() => {
    const sortColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(sortColumns)
    return () => {}
  }, [board])

  return (
    <DndContext sensors={mySensors} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          display: 'flex',
          p: '10px 0'
        }}
      >
        {/* COLUMN */}
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
