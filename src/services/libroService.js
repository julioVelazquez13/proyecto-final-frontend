import axios from 'axios'

const API_URL = 'http://localhost:3000/libros'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export default {
  async getAll() {
    const response = await api.get('/')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/${id}`)
    return response.data
  },

  async create(libro) {
    const response = await api.post('/', libro)
    return response.data
  },

  async update(id, libro) {
    const response = await api.put(`/${id}`, libro)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/${id}`)
    return response.data
  }
}