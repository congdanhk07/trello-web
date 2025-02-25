import axios from 'axios'
import { API_ROOT } from '~/utils/constant'

export const fetchBoardDetailsAPI = async (id) => {
  const res = await axios.get(`${API_ROOT}/v1/boards/${id}`)
  return res.data
}

export const updateBoardDetailsAPI = async (id, updateData) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/${id}`, updateData)
  return res.data
}

export const createNewColumnAPI = async (newColumnData) => {
  const res = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return res.data
}

export const updateColumnDetailsAPI = async (id, updateData) => {
  const res = await axios.put(`${API_ROOT}/v1/columns/${id}`, updateData)
  return res.data
}

export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return res.data
}
