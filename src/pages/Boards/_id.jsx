import Container from '@mui/material/Container'
import AppBar from '~/components/Appbar/Appbar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

const Board = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar />
      <BoardContent />
    </Container>
  )
}

export default Board
