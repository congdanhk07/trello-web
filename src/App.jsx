import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          // ở đây cần replace giá trị true để nó thay thế route "/" -> route "/" sẽ không còn nằm trong history stack
          // '/other-routes' -> '/' -> '/board/:boardId'. Nếu ko có replace thì nó sẽ back về '/' trước nhưng nó vẫn sẽ đang render component /board/:boardId
          <Navigate to='/boards/67b973d1c0173810677f470c' replace />
        }
      />
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
