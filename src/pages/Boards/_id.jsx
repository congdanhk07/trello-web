import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import AppBar from '~/components/Appbar/Appbar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { generatePlaceholderCard } from '~/utils/formatter'
import isEmpty from 'lodash/isEmpty'
const Board = () => {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // TODO: Tạm thời hard để tập trung vào function, theo chuẩn là sẽ dủng react-router-dom để lấy boardId từ URL
    const boardId = '67b973d1c0173810677f470c'
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Khi refresh web thì cần kiểm tra:
      // Xử lý vấn đề kéo thả vào một column rỗng
      // Tạo một card rỗng cho column khi getBoard mà cards ko có item
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      console.log('full board', board)

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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
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
    // updateColumnDetailsAPI(columnId, {
    //   cardOrderIds: dndOrderedCardIds
    // })
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
      />
    </Container>
  )
}

export default Board
