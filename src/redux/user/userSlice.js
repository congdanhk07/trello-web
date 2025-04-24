import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

// Khởi tạo giá trụ state của một Slice trong Redux
const initialState = {
  currentUser: null
}

// Các hành động gọi API (async) và cập nhật dữ liệu vào Redux -> Dùng middleware createAsynThunk + extraReducer
export const loginUserAPI = createAsyncThunk('activeBoard/loginUserAPI', async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
  return res.data
})

// Khởi tạo một slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action là nơi dành cho các components bên dưới gọi bằng disptach() và cấp nhật lại dữ liệu
// thông qa reducer (chạy đồng bộ)
// export const {} = userSlice.actions

// Selector: là nơi dành cho các component gọi bằng hook useSelector() để lấy dữ liệu từ store
export const selectCurrentUser = (state) => state.activeBoard.currentUser

// Phải export ra 1 cái Reducer (instance tạo từ createSlice)
export const userReducer = userSlice.reducer
