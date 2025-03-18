import axios from 'axios'
import { toast } from 'react-toastify'
// Khởi tạo 1 đối tượng Axios Intance để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Config thời gian cho 1 request : 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: cho phép axios tự động gửi cookie trong mỗi req lên BE (lưu JWT tokens) vào trong httpOnly Cookie cũa browser
authorizedAxiosInstance.defaults.withCredentials = true

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    // Mọi mã lỗi từ 200 -299 sẽ là error và rơi vào đây
    // Xử lý tập trung 1 lần tại đây để hiển thị lỗi chung cho các API trả về (clean code)

    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    // Hiển message bằng toast -> Trừ mã 410 - GONE là dùng cho handle refresh token
    if (error.response.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)
export default authorizedAxiosInstance
