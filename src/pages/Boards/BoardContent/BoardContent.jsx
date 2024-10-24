import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { mapOrder } from '~/utils/sorts'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCard/Card/Card'
import cloneDeep from 'lodash/cloneDeep'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([])
  // Cúng 1 thời điểm chỉ cho kéo một item (card or column)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

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

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
  }
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.some((card) => card._id === cardId)
    )
  }

  //Trigger trong quá trình kéo 1 phần tử
  const handleDragOver = (event) => {
    // Không làm gì cả khi kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    // Đảm bảo nếu không tồn tại active/over thì ko làm gì cả (Khi kéo ra khỏi phạm vị container)
    if (!active || !over) return
    // activeDraggingCard: Card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với activeDraggingCard
    const { id: overCardId } = over

    // Tìm ra 2 column của draggingCard và overCard
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Check nếu ko có thông tin thì ko làm gi cả -> Né bug
    if (!activeColumn || !overColumn) return

    // Nếu như đang kéo item qua cột khác thì mới bắt đầu xử lý
    // Đây là xử lý quá trình kéo, còn cập nhật thì phài handle ở DragEnd
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumn) => {
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        )
        // Handle logic xác định card vừa kéo qua sẽ nằm trên hay dưới overCard -> Copy từ thư viện trên github
        let newCardIndex
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overColumn
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

        // Clone orderredColumn cũ ra 1 cái mới để xử lý data rồi return - cập nhật state mới
        const nextColumns = cloneDeep(prevColumn)
        // Tìm ra 2 column của draggingCard và overCard trong danh sách nextColumn
        const nextActiveColumn = nextColumns.find(
          (c) => c._id === activeColumn._id
        )
        const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id)
        if (nextActiveColumn) {
          // Xóa card ra khỏi column ban đầu
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (x) => x._id !== activeDraggingCardId
          )
          // Cập nhật lại danh sách thứ tự ở column cũ
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (c) => c._id
          )
        }
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa trước
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (x) => x._id !== activeDraggingCardData
          )
          // Thêm vào column mới theo index bắt được
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          )
          // CẬp nhật danh sách column mới
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id)
        }
        return nextColumns
      })
    }
  }
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log('Drag and drop Card')
      return
    }
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  useEffect(() => {
    const sortColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(sortColumns)
    return () => {}
  }, [board])
  return (
    <DndContext
      sensors={mySensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
