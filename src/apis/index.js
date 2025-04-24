import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

// Move to Redux
// export const fetchBoardDetailsAPI = async (id) => {
//   const res = await axios.get(`${API_ROOT}/v1/boards/${id}`)
//   return res.data
// }

export const updateBoardDetailsAPI = async (id, updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${id}`, updateData)
  return res.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return res.data
}

export const createNewColumnAPI = async (newColumnData) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return res.data
}

export const updateColumnDetailsAPI = async (id, updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${id}`, updateData)
  return res.data
}

export const deleteColumnDetailsAPI = async (id) => {
  const res = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${id}`)
  return res.data
}

export const createNewCardAPI = async (newCardData) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return res.data
}

export const registerUserAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Register successfully! Please check your email to verify account before login.', { theme: 'colored' })
  return res.data
}

export const verifyUserAPI = async (data) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Verify account successfully! Now you can login to enjoy our app.', { theme: 'colored' })
  return res.data
}
