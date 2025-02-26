import {
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import { isEmpty } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensor'
import { generatePlaceholderCard } from '~/utils/formatter'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCard/Card/Card'
import ListColumns from './ListColumns/ListColumns'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn
}) {
  const [orderedColumns, setOrderedColumns] = useState([])
  // Cúng 1 thời điểm chỉ cho kéo một item (card or column)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  // Điểm va chạm cuối cùng trước đó
  const lastOverId = useRef(null)

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

  // Trả về object của column đang chứa card đó
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.some((card) => card._id === cardId)
    )
  }
  // Function xử lý cập nhật state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumn) => {
      // Handle logic xác định card vừa kéo qua sẽ nằm trên hay dưới overCard -> Copy từ thư viện trên github

      // Xác định index của card bên column sắp drop
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      )
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      // Clone orderredColumn cũ ra 1 cái mới để xử lý data rồi return - cập nhật state mới
      const nextColumns = cloneDeep(prevColumn)
      // Tìm ra 2 column của draggingCard và overCard trong danh sách nextColumn
      // nextActiveColumn: Column cũ (Column Drag)
      const nextActiveColumn = nextColumns.find(
        (c) => c._id === activeColumn._id
      )
      // nextOverColumn: Column mới (Column Drop)
      const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id)
      if (nextActiveColumn) {
        // Xóa card ra khỏi column ban đầu
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (x) => x._id !== activeDraggingCardId
        )

        //Thêm Place Holder Card khi Column rỗng (fix bug)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật lại danh sách thứ tự ở column cũ
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id)
      }
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (x) => x._id !== activeDraggingCardData
        )
        // Chuẩn hóa dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Thêm vào column mới theo index bắt được
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        //Xoá Placeholder Card nếu nó đang tồn tại (Vì khi này column đã có item)
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (c) => !c.FE_PlaceholderCard
        )

        // Cập nhật danh sách column mới
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id)
      }
      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
    // Nếu là kéo card thì mới thực hiện hành động set oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  // Trigger khi kết thúc hành động drag item (bắt đầu hành động thả - drop)
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Đảm bảo nếu không tồn tại active/over thì ko làm gì cả (khi kéo ra khỏi container kéo thả)
    if (!over || !active) return

    // Xử lý kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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
      if (!activeColumn || !overColumn) return
      // Phải dùng oldColumnWhenDraggingCard (set ở bước DragStart) mà ko dùng đc activeColumn vì khi drag card ở bước
      // DragOver thì state đả bị cập nhật để xử lý danh sách mới
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Handle Drag card trong cùng 1 column (Giống drag column trong 1 board)

        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        const newCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === overCardId
        )

        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )
        const dndOrderedCardIds = dndOrderedCards.map((x) => x._id)

        // Giữ nguyên logic update card để tránh delay/flickering khi APi đang gọi
        setOrderedColumns((prev) => {
          // Sử dụng clone deep vì đây là 1 mảng đa cấp -> Tránh shallow copy -> Tránh bug
          const nextColumns = cloneDeep(prev)
          //Tìm tới column chúng ta đang thả -> Find sẽ trả về obj tham chiếu đến nextColumns, thay đổi giá trị của targetColumn sẽ tác động lện nextColumn
          // Keyword: Update data trong Array
          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)
          // Cập nhật lại card và cardOrderIds trong column đó
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds
          // Trả về nextColumn sau khi cập nhật targetColumn
          return nextColumns
        })
        //TODO: Sau khi setup redux sẽ di chuyển vào store để đúng flow hơn
        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        )
      }
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Xác định ví trí kéo thả khác ban đầu
      if (active.id !== over.id) {
        // Xác định vị trí cũ và mới trong danh sách
        const oldColumnIndex = selectorArrayId.indexOf(active.id)
        const newColumnIndex = selectorArrayId.indexOf(over.id)

        //dnd-kit/packages/sortable/src/ultilities/arrayMove
        const dndOderredColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )
        //Cập nhật danh sách render các cột
        //Update state này để tránh tình trạng flickering khi drag column (Khi đang chờ API cập nhật)
        setOrderedColumns(dndOderredColumns)

        // Tạm chuyển lên page cha để xử lí để đồng bộ data (vì chưa setup Redux)
        // Đúng flow sẽ dispatch xử lý trong redux để clean code và dễ quản lý hơn
        moveColumns(dndOderredColumns)
      }
    }

    // Những dử liệu sau khi kéo thả phải đưa về giá trị ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }
      // Xác định các điểm va chạm với con trỏ
      const pointerIntersactions = pointerWithin(args)
      if (!pointerIntersactions?.length) return
      // Thuật toán phát hiện cha chạm sẽ return 1 mảng các điểm va chạm
      // const intersacions =
      //   pointerIntersactions?.length > 0
      //     ? pointerIntersactions
      //     : rectIntersection(args)

      // Tìm ra điểm va chạm đầu tiên
      let overId = getFirstCollision(pointerIntersactions, 'id')
      if (overId) {
        // Nếu overId là một Column thì sẽ return ra cardId gần nhất trong column đó dựa vào thuật toán phát hiện va chạm
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        )
        if (checkColumn) {
          //Log đang cho thấy sự thay đỗi id
          // console.log('overId before', overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (c) =>
                c.id !== overId && checkColumn?.cardOrderIds?.includes(c.id)
            )
          })[0]?.id
          // console.log('overId after', overId)
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  useEffect(() => {
    // Column đã được sắp sap xếp trên trang _id nên chỉ cần setState
    setOrderedColumns(board?.columns)
    return () => {}
  }, [board])

  return (
    <DndContext
      // Thuật toán phát hiện va chạm (nếu ko có nó thì card có hình ảnh sẽ ko kéo qua các column đc vì nó đang bị conflict giữa card và column)
      // collisionDetection={closestCorners} -> Thuật toán bị Flickering-> Chưa tối ưu nên cần optimize custom lại
      collisionDetection={collisionDetectionStrategy}
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
        <ListColumns
          createNewCard={createNewCard}
          columns={orderedColumns}
          createNewColumn={createNewColumn}
        />
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
