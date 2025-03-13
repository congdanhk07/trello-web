import { Box, CircularProgress } from '@mui/material'
import Container from '@mui/material/Container'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import AppBar from '~/components/Appbar/Appbar'
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  useEffect(() => {
    // TODO: Tạm thời hard để tập trung vào function, theo chuẩn là sẽ dủng react-router-dom để lấy boardId từ URL
    const boardId = '67b973d1c0173810677f470c'

    dispatch(fetchBoardDetailsAPI(boardId))
    return () => {}
  }, [dispatch])

  // Gọi API và xử lí sau khi kéo thả Column hoàn thành
  const moveColumns = (dndOderredColumns) => {
    const dndOderredColumnsIds = dndOderredColumns.map((c) => c._id)

    // Trường hợp này ko bị lỗi vì chúng ta đang không dùng PUSH -> Không vi phạm rules
    // Chúng ta đang gán lại giá trị mới cho mảng (giống cách dùng concat() )
    const newBoard = { ...board }
    newBoard.columns = dndOderredColumns
    newBoard.columnOrderIds = dndOderredColumnsIds
    // Sử dụng Reducer để cập nhật các data đồng bộ
    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOderredColumnsIds
    })
  }

  // Khi di chuyển card trong cùng 1 column:
  // Chỉ cần gọi API cập nhật cardOrderIds của Column chứa nó (buisiness giống như thay đổi vị trí column trong board)
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // update cards trong column
    // Lí do phải dùng cloneDeep ở đây vì chúng ta đang phạm rule là can thiệp vào các dữ liệu read-only
    // Cannot assign to read only property "cards" of object
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((x) => x._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // Sử dụng Reducer để cập nhật các data đồng bộ
    dispatch(updateCurrentActiveBoard(newBoard))

    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }

  // Khi di chuyển card khác column thì:
  // B1: Cập nhật lại cardOrderIds ở column ban đầu (Xóa ra khỏi column ban đầu)
  // B2: Cập nhật cardOrderIds ở column mới (Thêm vào column mới)
  // B3: Cập nhật lại columnId của card đã kéo sau khi kéo qua column mới
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOderredColumns
  ) => {
    const dndOderredColumnsIds = dndOderredColumns.map((c) => c._id)
    // Tương tư hàm moveColumns -> Không vi phạm rules của redux Toolkit
    const newBoard = { ...board }
    newBoard.columns = dndOderredColumns
    newBoard.columnOrderIds = dndOderredColumnsIds

    // Sử dụng Reducer để cập nhật các data đồng bộ
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOderredColumns.find(
      (x) => x._id === prevColumnId
    )?.cardOrderIds
    // Khi column rỗng thì chúng ta đang create một temp card để có thể drag card khác vào column
    // Nên khi di chuyển card cuối cùng ra ngoài, prevCard khi này đang chứa một placeholder card
    // Nhưng chúng ta ko cần gửi giá trị đó đến BE nên chúng ta phải clear nó trước khi gửi
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOderredColumns.find((x) => x._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  if (!board)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          gap: 2
        }}
      >
        <CircularProgress />
      </Box>
    )
  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
