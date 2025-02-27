import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import AppBar from '~/components/Appbar/Appbar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { generatePlaceholderCard } from '~/utils/formatter'
import isEmpty from 'lodash/isEmpty'
import { mapOrder } from '~/utils/sorts'
import { Box, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'

const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // TODO: Tạm thời hard để tập trung vào function, theo chuẩn là sẽ dủng react-router-dom để lấy boardId từ URL
    const boardId = '67b973d1c0173810677f470c'
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Sắp xếp vị trí columns trước khi trả về render để đồng bộ dữ liệu trong state ngay từ đầu
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        // Khi refresh web thì cần kiểm tra: Xử lý vấn đề kéo thả vào một column rỗng
        // Tạo một card rỗng cho column khi getBoard mà cards ko có item
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Nếu column không rỗng thì sắp xếp luôn cards trước khi trả data về đồng bộ
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
    return () => {}
  }, [])

  // TODO: Tập trung xử lý flow function, update data board sau khi call API create new column
  const createNewColumn = async (dataNewColumn) => {
    const createdColumn = await createNewColumnAPI({
      ...dataNewColumn,
      boardId: board._id
    })

    //Khi tạo column mới thì nó chưa có card nên cũng phải add một placeholder card vào để có thể kéo thả
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại state board
    // Chúng ta đang tự cập nhật lại dữ liệu render phía FE thay vì gọi lại fetchDetails
    // Điều này phụ thuộc vào spec của dự án có BE hỗ trợ trả về toàn bộ Board dù đây là đang call API create column hay card

    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (dataNewCard) => {
    const createdCard = await createNewCardAPI({
      ...dataNewCard,
      boardId: board._id
    })

    const newBoard = { ...board }
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
    setBoard(newBoard)
  }

  // Gọi API và xử lí sau khi kéo thả Column hoàn thành
  const moveColumns = (dndOderredColumns) => {
    const dndOderredColumnsIds = dndOderredColumns.map((c) => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOderredColumns
    newBoard.columnOrderIds = dndOderredColumnsIds

    setBoard(newBoard)
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
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find((x) => x._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
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
    const newBoard = { ...board }
    newBoard.columns = dndOderredColumns
    newBoard.columnOrderIds = dndOderredColumnsIds

    setBoard(newBoard)

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

  const deleteColumnDetails = (columnId) => {
    // Cập nhật state board khi delete column
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((x) => x._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (x) => x !== columnId
    )
    setBoard(newBoard)

    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res.deleteResult)
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
        deleteColumnDetails={deleteColumnDetails}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
