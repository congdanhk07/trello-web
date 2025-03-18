import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'
import { mapOrder } from '~/utils/sorts'
import isEmpty from 'lodash/isEmpty'
import { generatePlaceholderCard } from '~/utils/formatter'

// Khởi tạo giá trụ state của một Slice trong Redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi API (async) và cập nhật dữ liệu vào Redux -> Dùng middleware createAsynThunk + extraReducer
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailAPI',
  async (boardId) => {
    const res = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    )
    return res.data
  }
)

// Khởi tạo một slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẫn đặt tên nhận dữ liệu vào reducer trong Redux
      // Khi dispatch action, dữ liệu đưa vào trong action.payload và chúng ta gán nó vào state cần thiết
      state.currentActiveBoard = action.payload
    }
  },
  // ExtraReducer: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload chính là res.data trả về ở trên
      let board = action.payload

      // Sắp xếp vị trí columns trước khi trả về render để đồng bộ dữ liệu trong state ngay từ đầu
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        // Khi refresh web thì cần kiểm tra: Xử lý vấn đề kéo thả vào một column rỗng
        // Tạo một card rỗng cho column khi getBoard mà cards ko có item
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Nếu column không rỗng thì sắp xếp luôn thứ tự các cards trước khi trả data xuống component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// Action là nơi dành cho các components bên dưới gọi bằng disptach() và cấp nhật lại dữ liệu
// thông qa reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector: là nơi dành cho các component gọi bằng hook useSelector() để lấy dữ liệu từ store
export const selectCurrentActiveBoard = (state) =>
  state.activeBoard.currentActiveBoard

// Phải export ra 1 cái Reducer (instance tạo từ createSlice)
export const activeBoardReducer = activeBoardSlice.reducer
